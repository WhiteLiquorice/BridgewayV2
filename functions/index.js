const { onRequest, onCall, HttpsError } = require('firebase-functions/v2/https')
const { onSchedule }                    = require('firebase-functions/v2/scheduler')
const { defineSecret }                  = require('firebase-functions/params')
const { onDocumentUpdated }             = require('firebase-functions/v2/firestore')
const admin                             = require('firebase-admin')
const stripe                            = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { google }                        = require('googleapis')
const sgMail                            = require('@sendgrid/mail')
const twilio                            = require('twilio')

// ── Secret Manager bindings (production) ─────────────────────────────────────
// Locally these fall back to the .env file in this directory.
// In production, set them once with:
//   npx firebase-tools secrets:set GOOGLE_CLIENT_ID
//   npx firebase-tools secrets:set GOOGLE_CLIENT_SECRET
const googleClientId     = defineSecret('GOOGLE_CLIENT_ID')
const googleClientSecret = defineSecret('GOOGLE_CLIENT_SECRET')
const sendgridApiKey     = defineSecret('SENDGRID_API_KEY')
const twilioAccountSid   = defineSecret('TWILIO_ACCOUNT_SID')
const twilioAuthToken    = defineSecret('TWILIO_AUTH_TOKEN')
const twilioFromNumber   = defineSecret('TWILIO_FROM_NUMBER')
const sendgridFromEmail  = defineSecret('SENDGRID_FROM_EMAIL')
const supabaseUrl        = defineSecret('SUPABASE_URL')
const supabaseServiceKey = defineSecret('SUPABASE_SERVICE_KEY')

admin.initializeApp()
const db = admin.firestore()

function makeOAuth2Client(redirectUri) {
  // defineSecret values are accessible via .value() inside a function handler
  const clientId     = googleClientId.value()     || process.env.GOOGLE_CLIENT_ID
  const clientSecret = googleClientSecret.value() || process.env.GOOGLE_CLIENT_SECRET
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

// ─── Stripe ───────────────────────────────────────────────────────────────────

exports.createCheckoutSession = onRequest({ cors: true }, async (req, res) => {
  const { email, orgName, priceId, subscriptionTier } = req.body
  if (!email || !orgName || !priceId) return res.status(400).send({ error: 'email, orgName, and priceId are required' })
  try {
    const customer = await stripe.customers.create({ 
      email, 
      name: orgName, 
      metadata: { org_name: orgName } 
    })
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      metadata: { 
        org_name: orgName,
        subscriptionTier: subscriptionTier || 'full-stack'
      },
      success_url: 'https://admin.bridgewayapps.com/onboarding?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://bridgewayapps.com/#pricing',
    })
    res.status(200).send({ url: session.url })
  } catch (err) { res.status(500).send({ error: err.message }) }
})

exports.createPortalSession = onRequest({ cors: true }, async (req, res) => {
  const { stripe_customer_id } = req.body
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripe_customer_id,
      return_url: 'https://admin.bridgewayapps.com/billing',
    })
    res.status(200).send({ url: session.url })
  } catch (err) { res.status(500).send({ error: err.message }) }
})

exports.connectStripeAccount = onCall({ cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'User must be logged in')

  const { orgId, returnUrl, refreshUrl } = request.data
  if (!orgId) throw new HttpsError('invalid-argument', 'orgId is required')

  const location = 'us-central1'
  const serviceId = 'bridgeway-db'
  const projectId = process.env.GCLOUD_PROJECT || 'bridgeway-apps'
  const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true'
  const baseUrl = isEmulator 
    ? `http://127.0.0.1:9399/v1alpha/projects/${projectId}/locations/${location}/services/${serviceId}:executeGraphql`
    : `https://firebasedataconnect.googleapis.com/v1alpha/projects/${projectId}/locations/${location}/services/${serviceId}:executeGraphql`

  let headers = { 'Content-Type': 'application/json' }
  if (!isEmulator) {
    const authClient = await admin.credential.applicationDefault().getAccessToken()
    headers['Authorization'] = `Bearer ${authClient.access_token}`
  }

  const queryGet = `
    query GetStripeAccountId($orgId: UUID!) {
      orgSettings(where: { orgId: { eq: $orgId } }) {
        stripeAccountId
      }
    }
  `
  let accountId = null
  try {
    const responseGet = await fetch(baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: queryGet, variables: { orgId } })
    })
    const resultGet = await responseGet.json()
    if (resultGet.data?.orgSettings?.[0]?.stripeAccountId) {
      accountId = resultGet.data.orgSettings[0].stripeAccountId
    }
  } catch (e) {
    console.error('Error fetching orgSetting:', e)
  }

  if (!accountId) {
    const account = await stripe.accounts.create({ type: 'standard' })
    accountId = account.id

    const queryUpsert = `
      mutation UpdateStripeAccountId($orgId: UUID!, $stripeAccountId: String!) {
        orgSetting_upsert(data: { orgId: $orgId, stripeAccountId: $stripeAccountId })
      }
    `
    try {
      await fetch(baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: queryUpsert, variables: { orgId, stripeAccountId: accountId } })
      })
    } catch (e) {
      console.error('Error upserting orgSetting:', e)
    }
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl || 'https://admin.bridgewayapps.com/settings',
    return_url: returnUrl || 'https://admin.bridgewayapps.com/settings',
    type: 'account_onboarding',
  })

  return { url: accountLink.url }
})

exports.createPaymentIntent = onCall({ cors: true }, async (request) => {
  const { orgId, amount } = request.data
  if (!orgId || !amount) throw new HttpsError('invalid-argument', 'orgId and amount are required')

  const location = 'us-central1'
  const serviceId = 'bridgeway-db'
  const projectId = process.env.GCLOUD_PROJECT || 'bridgeway-apps'
  const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true'
  const baseUrl = isEmulator 
    ? `http://127.0.0.1:9399/v1alpha/projects/${projectId}/locations/${location}/services/${serviceId}:executeGraphql`
    : `https://firebasedataconnect.googleapis.com/v1alpha/projects/${projectId}/locations/${location}/services/${serviceId}:executeGraphql`

  let headers = { 'Content-Type': 'application/json' }
  if (!isEmulator) {
    const authClient = await admin.credential.applicationDefault().getAccessToken()
    headers['Authorization'] = `Bearer ${authClient.access_token}`
  }

  const queryGet = `
    query GetStripeAccountId($orgId: UUID!) {
      orgSettings(where: { orgId: { eq: $orgId } }) {
        stripeAccountId
      }
    }
  `
  let accountId = null
  try {
    const responseGet = await fetch(baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: queryGet, variables: { orgId } })
    })
    const resultGet = await responseGet.json()
    if (resultGet.data?.orgSettings?.[0]?.stripeAccountId) {
      accountId = resultGet.data.orgSettings[0].stripeAccountId
    }
  } catch (e) {
    console.error('Error fetching orgSetting:', e)
  }

  if (!accountId) {
    throw new HttpsError('failed-precondition', 'Organization has not connected a Stripe account')
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    }, {
      stripeAccount: accountId,
    })

    return { clientSecret: paymentIntent.client_secret }
  } catch (e) {
    console.error('Error creating payment intent:', e)
    throw new HttpsError('internal', e.message)
  }
})

exports.stripeWebhook = onRequest({ cors: true }, async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event
  try {
    if (process.env.FUNCTIONS_EMULATOR === 'true') {
      event = req.body;
    } else {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
    }
  } catch (err) { return res.status(400).send(`Webhook Error: ${err.message}`) }
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const metadata = session.metadata || {}

    // Handle Booking Payment
    if (metadata.bookingId) {
      console.log(`Booking payment completed for booking ${metadata.bookingId}`)
      
      const location = 'us-central1'
      const serviceId = 'bridgeway-db'
      const projectId = process.env.GCLOUD_PROJECT || 'bridgeway-apps'
      
      const query = `
        mutation UpdateBookingPaymentStatus($bookingId: UUID!) {
          booking_update(id: $bookingId, data: { paymentStatus: "paid" })
        }
      `
      
      const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true'
      const baseUrl = isEmulator 
        ? `http://127.0.0.1:9399/v1alpha/projects/${projectId}/locations/${location}/services/${serviceId}:executeGraphql`
        : `https://firebasedataconnect.googleapis.com/v1alpha/projects/${projectId}/locations/${location}/services/${serviceId}:executeGraphql`

      try {
        let headers = { 'Content-Type': 'application/json' }
        if (!isEmulator) {
          const authClient = await admin.credential.applicationDefault().getAccessToken()
          headers['Authorization'] = `Bearer ${authClient.access_token}`
        }

        const response = await fetch(baseUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query,
            variables: { bookingId: metadata.bookingId }
          })
        })
        const result = await response.json()
        if (result.errors) {
          console.error('Data Connect errors updating booking:', result.errors)
        } else {
          console.log(`Updated booking ${metadata.bookingId} paymentStatus to paid`)
        }
      } catch (err) {
        console.error('Failed to update booking in Data Connect:', err)
      }
      
      res.send()
      return
    }

    // Handle SaaS Subscription
    const customerId = session.customer
    if (!customerId) {
      console.log('No customer attached to checkout session, and not a booking')
      return res.send()
    }
    
    const subscriptionId = session.subscription
    const customer = await stripe.customers.retrieve(customerId)
    
    const email = customer.email
    const orgName = metadata.org_name || customer.name || 'New Organization'
    
    // Determine subscription tier from session metadata
    const subscriptionTier = metadata.subscriptionTier || 'full-stack'

    let userId = ''
    try {
      const userRecord = await admin.auth().getUserByEmail(email)
      userId = userRecord.uid
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        const newUser = await admin.auth().createUser({
          email: email,
          displayName: orgName,
        })
        userId = newUser.uid
      } else {
        console.error('Error fetching/creating user:', e)
      }
    }

    if (userId) {
      // Execute Data Connect mutations via direct fetch to local emulator or production REST API
      const location = 'us-central1'
      const serviceId = 'bridgeway-db'
      const projectId = process.env.GCLOUD_PROJECT || 'bridgeway-apps'
      
      const { randomUUID } = require('crypto')
      const orgId = randomUUID()

      const query = `
        mutation ProvisionApp($orgId: UUID!, $name: String!, $subscriptionTier: String!, $email: String!, $userId: String!, $stripeCustomerId: String!, $stripeSubscriptionId: String!) {
          org_insert(data: { id: $orgId, name: $name, subscriptionTier: $subscriptionTier, status: "active", onboardingComplete: false })
          orgSetting_upsert(data: { orgId: $orgId, paymentRequired: true, stripeCustomerId: $stripeCustomerId, stripeSubscriptionId: $stripeSubscriptionId })
          profile_insert(data: { userId: $userId, orgId: $orgId, fullName: $name, email: $email, role: "admin", isActive: true, commissionRatePercentage: 0 })
        }
      `
      
      const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true'
      const baseUrl = isEmulator 
        ? `http://127.0.0.1:9399/v1alpha/projects/${projectId}/locations/${location}/services/${serviceId}:executeGraphql`
        : `https://firebasedataconnect.googleapis.com/v1alpha/projects/${projectId}/locations/${location}/services/${serviceId}:executeGraphql`

      try {
        let headers = { 'Content-Type': 'application/json' }
        if (!isEmulator) {
          const authClient = await admin.credential.applicationDefault().getAccessToken()
          headers['Authorization'] = `Bearer ${authClient.access_token}`
        }

        const response = await fetch(baseUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query,
            variables: {
              orgId,
              name: orgName,
              subscriptionTier,
              email,
              userId,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId
            }
          })
        })
        const result = await response.json()
        if (result.errors) {
          console.error('Data Connect errors:', result.errors)
        } else {
          console.log(`Provisioned org ${orgName} for user ${userId} with tier ${subscriptionTier}`)
        }
      } catch (err) {
        console.error('Failed to provision in Data Connect:', err)
      }
    }
  }
  res.send()
})

exports.syncStripeToSql = onDocumentUpdated('customers/{uid}/subscriptions/{subId}', async (event) => {
  const subData = event.data.after.data()
  if (!subData) return
  console.log(`Syncing subscription ${event.params.subId} for user ${event.params.uid}`)
  // TODO: Update OrgSetting table in Data Connect
})

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/** Fetch notification_settings for an org from Supabase via REST */
async function getNotificationSettings(orgId) {
  const location = 'us-central1'
  const serviceId = 'bridgeway-db'
  const projectId = process.env.GCLOUD_PROJECT || 'bridgeway-apps'
  
  const query = `
    query GetNotificationSetting($orgId: UUID!) {
      notificationSettings(where: { orgId: { eq: $orgId } }, limit: 1) {
        smsEnabled
        emailEnabled
        reminder24h
        reminder2h
      }
    }
  `
  
  const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true'
  const baseUrl = isEmulator 
    ? `http://127.0.0.1:9399/v1alpha/projects/${projectId}/locations/${location}/services/${serviceId}:executeGraphql`
    : `https://firebasedataconnect.googleapis.com/v1alpha/projects/${projectId}/locations/${location}/services/${serviceId}:executeGraphql`

  try {
    let headers = { 'Content-Type': 'application/json' }
    if (!isEmulator) {
      const authClient = await admin.credential.applicationDefault().getAccessToken()
      headers['Authorization'] = `Bearer ${authClient.access_token}`
    }

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables: { orgId } })
    })
    const result = await response.json()
    if (result.errors) {
      console.error('Data Connect errors fetching notification settings:', result.errors)
      return null
    }
    const settings = result.data?.notificationSettings
    return Array.isArray(settings) && settings.length ? settings[0] : null
  } catch (err) {
    console.error('Failed to fetch notification settings from Data Connect:', err)
    return null
  }
}

function formatApptTime(isoString) {
  const d = new Date(isoString)
  return d.toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

async function sendEmail({ toEmail, toName, subject, text }) {
  const apiKey   = sendgridApiKey.value()    || process.env.SENDGRID_API_KEY
  const fromAddr = sendgridFromEmail.value() || process.env.SENDGRID_FROM_EMAIL
  if (!apiKey || !fromAddr) { console.warn('SendGrid not configured'); return }
  sgMail.setApiKey(apiKey)
  await sgMail.send({
    to:      { email: toEmail, name: toName },
    from:    { email: fromAddr, name: 'Bridgeway Appointments' },
    subject,
    text,
    html: `<p style="font-family:sans-serif;color:#1a1a1a">${text.replace(/\n/g, '<br>')}</p>`,
  })
}

async function sendSms({ toPhone, body }) {
  const sid    = twilioAccountSid.value()  || process.env.TWILIO_ACCOUNT_SID
  const token  = twilioAuthToken.value()   || process.env.TWILIO_AUTH_TOKEN
  const from   = twilioFromNumber.value()  || process.env.TWILIO_FROM_NUMBER
  if (!sid || !token || !from) { console.warn('Twilio not configured'); return }
  const client = twilio(sid, token)
  await client.messages.create({ body, from, to: toPhone })
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOOKING CONFIRMATION NOTIFICATION
// Fires when a booking doc's status field changes to 'confirmed'
// ═══════════════════════════════════════════════════════════════════════════════

exports.onBookingConfirmed = onDocumentUpdated(
  { document: 'bookings/{bookingId}', secrets: [sendgridApiKey, twilioAccountSid, twilioAuthToken, twilioFromNumber, sendgridFromEmail, supabaseUrl, supabaseServiceKey] },
  async (event) => {
    const before = event.data.before.data()
    const after  = event.data.after.data()

    // Only fire when status transitions to 'confirmed'
    if (before.status === after.status || after.status !== 'confirmed') return

    const ns = await getNotificationSettings(after.orgId || after.org_id)
    if (!ns) return

    const apptTime = formatApptTime(after.scheduledAt || after.preferredDate || after.preferred_date)
    const clientName = after.clientName || after.name || 'there'
    const service    = after.serviceName || 'your appointment'

    const emailBody = [
      `Hi ${clientName},`,
      ``,
      `Your appointment for ${service} is confirmed!`,
      `📅 ${apptTime}`,
      ``,
      `If you need to reschedule or cancel, please contact us as soon as possible.`,
      ``,
      `See you soon!`,
    ].join('\n')

    const smsBody = `Hi ${clientName}! Your ${service} appointment is confirmed for ${apptTime}. Questions? Just reply to this message.`

    const tasks = []
    if (ns.emailEnabled && (after.clientEmail || after.email)) {
      tasks.push(
        sendEmail({
          toEmail:  after.clientEmail || after.email,
          toName:   clientName,
          subject:  `Your appointment is confirmed — ${service}`,
          text:     emailBody,
        }).catch(err => console.error('Confirmation email failed:', err.message))
      )
    }
    if (ns.smsEnabled && (after.clientPhone || after.phone)) {
      tasks.push(
        sendSms({ toPhone: after.clientPhone || after.phone, body: smsBody })
          .catch(err => console.error('Confirmation SMS failed:', err.message))
      )
    }
    await Promise.all(tasks)
  }
)

// ═══════════════════════════════════════════════════════════════════════════════
// 24-HOUR REMINDER  (runs every hour; only sends to appointments 23–25h away)
// ═══════════════════════════════════════════════════════════════════════════════

exports.send24hReminders = onSchedule(
  { schedule: 'every 60 minutes', secrets: [sendgridApiKey, twilioAccountSid, twilioAuthToken, twilioFromNumber, sendgridFromEmail, supabaseUrl, supabaseServiceKey] },
  async () => {
    const now      = new Date()
    const windowLo = new Date(now.getTime() + 23 * 60 * 60 * 1000)
    const windowHi = new Date(now.getTime() + 25 * 60 * 60 * 1000)

    const snap = await db.collection('bookings')
      .where('status', '==', 'confirmed')
      .where('reminder24hSent', '==', false)
      .where('scheduledAt', '>=', windowLo.toISOString())
      .where('scheduledAt', '<=', windowHi.toISOString())
      .get()

    console.log(`24h reminder job: ${snap.size} bookings in window`)

    for (const docSnap of snap.docs) {
      const booking = docSnap.data()
      const ns = await getNotificationSettings(booking.orgId || booking.org_id)
      if (!ns || (!ns.emailEnabled && !ns.smsEnabled) || !ns.reminder24h) {
        // Mark as sent so we don't re-check every hour
        await docSnap.ref.update({ reminder24hSent: true })
        continue
      }

      const apptTime   = formatApptTime(booking.scheduledAt)
      const clientName = booking.clientName || 'there'
      const service    = booking.serviceName || 'your appointment'

      const emailBody = [
        `Hi ${clientName},`,
        ``,
        `Just a reminder — your ${service} appointment is tomorrow.`,
        `📅 ${apptTime}`,
        ``,
        `We look forward to seeing you!`,
      ].join('\n')

      const smsBody = `Reminder: Your ${service} appointment is tomorrow at ${apptTime}. Reply STOP to opt out.`

      const tasks = []
      if (ns.emailEnabled && (booking.clientEmail || booking.email)) {
        tasks.push(sendEmail({ toEmail: booking.clientEmail || booking.email, toName: clientName, subject: `Appointment reminder — ${service} tomorrow`, text: emailBody }).catch(e => console.error(e.message)))
      }
      if (ns.smsEnabled && (booking.clientPhone || booking.phone)) {
        tasks.push(sendSms({ toPhone: booking.clientPhone || booking.phone, body: smsBody }).catch(e => console.error(e.message)))
      }
      await Promise.all(tasks)
      await docSnap.ref.update({ reminder24hSent: true })
    }
  }
)

// ═══════════════════════════════════════════════════════════════════════════════
// 2-HOUR REMINDER  (runs every 30 min; SMS only)
// ═══════════════════════════════════════════════════════════════════════════════

exports.send2hReminders = onSchedule(
  { schedule: 'every 30 minutes', secrets: [twilioAccountSid, twilioAuthToken, twilioFromNumber, supabaseUrl, supabaseServiceKey] },
  async () => {
    const now      = new Date()
    const windowLo = new Date(now.getTime() + 1.5 * 60 * 60 * 1000)
    const windowHi = new Date(now.getTime() + 2.5 * 60 * 60 * 1000)

    const snap = await db.collection('bookings')
      .where('status', '==', 'confirmed')
      .where('reminder2hSent', '==', false)
      .where('scheduledAt', '>=', windowLo.toISOString())
      .where('scheduledAt', '<=', windowHi.toISOString())
      .get()

    console.log(`2h reminder job: ${snap.size} bookings in window`)

    for (const docSnap of snap.docs) {
      const booking = docSnap.data()
      const ns = await getNotificationSettings(booking.orgId || booking.org_id)
      if (!ns || !ns.smsEnabled || !ns.reminder2h) {
        await docSnap.ref.update({ reminder2hSent: true })
        continue
      }

      const clientName = booking.clientName || 'there'
      const service    = booking.serviceName || 'your appointment'
      const apptTime   = formatApptTime(booking.scheduledAt)
      const smsBody    = `Heads up ${clientName} — your ${service} appointment is in about 2 hours (${apptTime}). See you soon! Reply STOP to opt out.`

      if (booking.clientPhone) {
        await sendSms({ toPhone: booking.clientPhone, body: smsBody })
          .catch(err => console.error('2h SMS failed:', err.message))
      }
      await docSnap.ref.update({ reminder2hSent: true })
    }
  }
)

// ═══════════════════════════════════════════════════════════════════════════════
// GOOGLE CALENDAR INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Step 1: Return the Google authorization URL to redirect the user to.
 */
exports.getGoogleOAuthUrl = onCall(async (request) => {
  const { orgId, redirectUri } = request.data
  if (!orgId || !redirectUri) throw new HttpsError('invalid-argument', 'orgId and redirectUri are required')

  const auth = makeOAuth2Client(redirectUri)
  const url = auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.readonly',
    ],
    state: orgId,
  })
  return { url }
})

/**
 * Step 2: Exchange authorization code for tokens. Store refresh_token on org doc.
 */
exports.handleGoogleOAuthCallback = onCall(async (request) => {
  const { orgId, code, redirectUri } = request.data
  if (!orgId || !code || !redirectUri) throw new HttpsError('invalid-argument', 'orgId, code, and redirectUri are required')

  const oauth2Client = makeOAuth2Client(redirectUri)
  let tokens
  try {
    const { tokens: t } = await oauth2Client.getToken(code)
    tokens = t
  } catch (err) {
    throw new HttpsError('internal', `Failed to exchange code: ${err.message}`)
  }

  if (!tokens.refresh_token) throw new HttpsError('failed-precondition', 'No refresh token. User must revoke and reconnect.')

  await db.collection('bookingOrgs').doc(orgId).set({
    googleCalendarConnected: true,
    googleRefreshToken: tokens.refresh_token,
    googleAccessToken: tokens.access_token,
    googleTokenExpiry: tokens.expiry_date,
    googleCalendarId: 'primary',
  }, { merge: true })

  return { success: true }
})

/**
 * Remove stored Google tokens and disconnect calendar.
 */
exports.disconnectGoogleCalendar = onCall(async (request) => {
  const { orgId } = request.data
  if (!orgId) throw new HttpsError('invalid-argument', 'orgId is required')

  await db.collection('bookingOrgs').doc(orgId).set({
    googleCalendarConnected: false,
    googleRefreshToken: admin.firestore.FieldValue.delete(),
    googleAccessToken: admin.firestore.FieldValue.delete(),
    googleTokenExpiry: admin.firestore.FieldValue.delete(),
  }, { merge: true })

  return { success: true }
})

/**
 * Return busy slots from Google Calendar for a given date.
 * Used by Book.tsx to block already-taken time slots.
 */
exports.getCalendarAvailability = onCall(async (request) => {
  const { orgId, date } = request.data
  if (!orgId || !date) throw new HttpsError('invalid-argument', 'orgId and date are required')

  const orgSnap = await db.collection('bookingOrgs').doc(orgId).get()
  if (!orgSnap.exists) throw new HttpsError('not-found', 'Org not found')

  const org = orgSnap.data()
  if (!org.googleCalendarConnected || !org.googleRefreshToken) return { busySlots: [] }

  const oauth2Client = makeOAuth2Client(null)
  oauth2Client.setCredentials({
    refresh_token: org.googleRefreshToken,
    access_token: org.googleAccessToken,
    expiry_date: org.googleTokenExpiry,
  })
  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      await db.collection('bookingOrgs').doc(orgId).set({
        googleAccessToken: tokens.access_token,
        googleTokenExpiry: tokens.expiry_date,
      }, { merge: true })
    }
  })

  const [year, month, day] = date.split('-').map(Number)
  const timeMin = new Date(year, month - 1, day, 0, 0, 0).toISOString()
  const timeMax = new Date(year, month - 1, day, 23, 59, 59).toISOString()

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    const res = await calendar.freebusy.query({
      requestBody: {
        timeMin, timeMax,
        items: [{ id: org.googleCalendarId || 'primary' }],
      },
    })
    const calId = org.googleCalendarId || 'primary'
    const busySlots = res.data.calendars[calId]?.busy || []
    return { busySlots }
  } catch (err) {
    console.error('Calendar freebusy failed:', err.message)
    return { busySlots: [] } // fail open — don't block all slots
  }
})

/**
 * Create a Google Calendar event when a booking is confirmed.
 * Called from BookingsList when practitioner clicks "Confirm".
 */
exports.createCalendarEvent = onCall(async (request) => {
  const { bookingId } = request.data
  if (!bookingId) throw new HttpsError('invalid-argument', 'bookingId is required')

  const bookingSnap = await db.collection('bookings').doc(bookingId).get()
  if (!bookingSnap.exists) throw new HttpsError('not-found', 'Booking not found')
  const booking = bookingSnap.data()

  const orgSnap = await db.collection('bookingOrgs').doc(booking.orgId).get()
  if (!orgSnap.exists) throw new HttpsError('not-found', 'Org not found')
  const org = orgSnap.data()

  if (!org.googleCalendarConnected || !org.googleRefreshToken) return { eventId: null, htmlLink: null }

  const oauth2Client = makeOAuth2Client(null)
  oauth2Client.setCredentials({
    refresh_token: org.googleRefreshToken,
    access_token: org.googleAccessToken,
    expiry_date: org.googleTokenExpiry,
  })
  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      await db.collection('bookingOrgs').doc(booking.orgId).set({
        googleAccessToken: tokens.access_token,
        googleTokenExpiry: tokens.expiry_date,
      }, { merge: true })
    }
  })

  const startTime = new Date(booking.scheduledAt)
  const endTime   = new Date(startTime.getTime() + (booking.durationMinutes || 60) * 60 * 1000)

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    const res = await calendar.events.insert({
      calendarId: org.googleCalendarId || 'primary',
      requestBody: {
        summary: `${booking.clientName} — ${booking.serviceName}`,
        description: [
          booking.clientEmail ? `Email: ${booking.clientEmail}` : '',
          booking.clientPhone ? `Phone: ${booking.clientPhone}` : '',
          booking.notes ? `Notes: ${booking.notes}` : '',
        ].filter(Boolean).join('\n'),
        start: { dateTime: startTime.toISOString() },
        end:   { dateTime: endTime.toISOString() },
        status: 'confirmed',
      },
    })

    await db.collection('bookings').doc(bookingId).set({
      googleEventId: res.data.id,
      googleEventLink: res.data.htmlLink,
    }, { merge: true })

    return { eventId: res.data.id, htmlLink: res.data.htmlLink }
  } catch (err) {
    console.error('Failed to create calendar event:', err.message)
    return { eventId: null, htmlLink: null } // non-fatal
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// STRIPE CONNECT INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

exports.createStripeConnectAccount = onCall(async (request) => {
  const { orgId, returnUrl, refreshUrl } = request.data
  if (!orgId) throw new HttpsError('invalid-argument', 'orgId is required')

  try {
    const account = await stripe.accounts.create({
      type: 'express',
      metadata: { orgId }
    })

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: refreshUrl || returnUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    })

    return { accountId: account.id, url: accountLink.url }
  } catch (error) {
    throw new HttpsError('internal', error.message)
  }
})

exports.createBookingHoldSession = onCall(async (request) => {
  const { stripeAccountId, amount, currency, successUrl, cancelUrl, bookingDetails } = request.data
  if (!stripeAccountId || !amount) throw new HttpsError('invalid-argument', 'Missing parameters')

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ 
        price_data: { 
          currency: currency || 'usd', 
          product_data: { name: 'No-show Fee / Deposit' }, 
          unit_amount: amount 
        }, 
        quantity: 1 
      }],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: bookingDetails,
    }, {
      stripeAccount: stripeAccountId,
    })

    return { url: session.url }
  } catch (error) {
    throw new HttpsError('internal', error.message)
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// PORTAL INVITES
// ═══════════════════════════════════════════════════════════════════════════════

exports.inviteToPortal = onCall(async (request) => {
  const { email, clientName, portalUrl } = request.data
  if (!email) throw new HttpsError('invalid-argument', 'email is required')

  try {
    const actionCodeSettings = {
      url: portalUrl || 'https://bridgewayapps.com/portal',
      handleCodeInApp: true,
    }
    const link = await admin.auth().generateSignInWithEmailLink(email, actionCodeSettings)
    
    const emailBody = [
      `Hi ${clientName || 'there'},`,
      ``,
      `You've been invited to access your client portal.`,
      `Click the link below to sign in instantly without a password:`,
      ``,
      link,
      ``,
      `If you didn't request this, you can safely ignore this email.`,
    ].join('\n')

    await sendEmail({
      toEmail: email,
      toName: clientName || email,
      subject: 'Your Client Portal Invite',
      text: emailBody
    })

    return { success: true, note: `Invite sent to ${email}.` }
  } catch (error) {
    console.error('Failed to send invite:', error)
    throw new HttpsError('internal', error.message)
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// GET BILLING INFO
// ═══════════════════════════════════════════════════════════════════════════════

exports.getBillingInfo = onCall(async (request) => {
  const { stripe_customer_id } = request.data
  if (!stripe_customer_id) throw new HttpsError('invalid-argument', 'stripe_customer_id is required')

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripe_customer_id,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method']
    })

    if (!subscriptions.data.length) {
      throw new HttpsError('not-found', 'No active subscription found')
    }

    const sub = subscriptions.data[0]
    
    // Get plan name
    let planName = 'Bridgeway Apps'
    if (sub.items.data.length > 0) {
      const price = sub.items.data[0].price
      if (price.nickname) planName = price.nickname
    }

    let paymentMethod = null
    const pm = sub.default_payment_method
    if (pm && pm.card) {
      paymentMethod = {
        brand: pm.card.brand,
        last4: pm.card.last4
      }
    }

    return {
      status: sub.status,
      currentPeriodEnd: sub.current_period_end,
      paymentMethod,
      planName
    }
  } catch (error) {
    throw new HttpsError('internal', error.message)
  }
})
