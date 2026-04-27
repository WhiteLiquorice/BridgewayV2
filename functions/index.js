const { onRequest, onCall, HttpsError, defineSecret } = require('firebase-functions/v2/https')
const { onDocumentUpdated }                            = require('firebase-functions/v2/firestore')
const admin                                            = require('firebase-admin')
const stripe                                           = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { google }                                       = require('googleapis')

// ── Secret Manager bindings (production) ─────────────────────────────────────
// Locally these fall back to the .env file in this directory.
// In production, set them once with:
//   npx firebase-tools secrets:set GOOGLE_CLIENT_ID
//   npx firebase-tools secrets:set GOOGLE_CLIENT_SECRET
const googleClientId     = defineSecret('GOOGLE_CLIENT_ID')
const googleClientSecret = defineSecret('GOOGLE_CLIENT_SECRET')

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
  const { email, orgName, priceId } = req.body
  if (!email || !orgName || !priceId) return res.status(400).send({ error: 'email, orgName, and priceId are required' })
  try {
    const customer = await stripe.customers.create({ email, name: orgName, metadata: { org_name: orgName } })
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: 'https://bridgeway-db29e-admin.web.app/onboarding?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://bridgeway-db29e.web.app/#pricing',
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

exports.stripeWebhook = onRequest({ cors: true }, async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) { return res.status(400).send(`Webhook Error: ${err.message}`) }
  if (event.type === 'checkout.session.completed') {
    console.log('Checkout session completed:', event.data.object.id)
    // TODO: provision Org + Profile in Data Connect SQL
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
