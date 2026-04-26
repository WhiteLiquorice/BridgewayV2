// Supabase Edge Function: stripe-webhook
// Handles Stripe webhook events for subscription lifecycle.
//
// Prerequisites:
//   1. supabase secrets set STRIPE_SECRET_KEY=sk_live_...
//   2. supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
//
// Subscribed events:
//   - checkout.session.completed
//   - customer.subscription.deleted
//   - customer.subscription.updated
//   - invoice.payment_failed

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Stripe webhook signature verification using Web Crypto API
async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string
): Promise<boolean> {
  const parts = sigHeader.split(',')
  const timestamp = parts.find((p) => p.startsWith('t='))?.split('=')[1]
  const signature = parts.find((p) => p.startsWith('v1='))?.split('=')[1]
  if (!timestamp || !signature) return false

  // Check timestamp is within 5 minutes
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - parseInt(timestamp)) > 300) return false

  const signedPayload = `${timestamp}.${payload}`
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload))
  const expectedSig = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return expectedSig === signature
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  // TODO: replace with real secrets via `supabase secrets set`
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || 'sk_test_placeholder'
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || 'whsec_placeholder'
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const body = await req.text()
  const sigHeader = req.headers.get('stripe-signature')

  if (!sigHeader) {
    return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Verify webhook signature
  const valid = await verifyStripeSignature(body, sigHeader, webhookSecret)
  if (!valid) {
    return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const event = JSON.parse(body)
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const customerId = session.customer
        const subscriptionId = session.subscription

        // Retrieve customer to get metadata
        const customerRes = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
          headers: { 'Authorization': `Bearer ${stripeKey}` },
        })
        const customer = await customerRes.json()
        const orgName = customer.metadata?.org_name || customer.name || 'New Organization'
        const email = customer.email

        // Create org
        const { data: org, error: orgError } = await supabase
          .from('orgs')
          .insert({ name: orgName, status: 'active' })
          .select('id')
          .single()

        if (orgError) throw orgError

        // Create org_settings with Stripe IDs
        const { error: settingsError } = await supabase
          .from('org_settings')
          .insert({
            org_id: org.id,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          })

        if (settingsError) throw settingsError

        // Create admin profile for the invited user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            org_id: org.id,
            email: email,
            role: 'admin',
            full_name: orgName + ' Admin',
          })

        if (profileError) throw profileError

        // Send invite email so user can set their password
        const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email)
        if (inviteError) {
          console.error('Failed to send invite email:', inviteError.message)
          // Don't throw — org is already created, invite can be resent manually
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customerId = subscription.customer

        // Find org by stripe_customer_id
        const { data: settings } = await supabase
          .from('org_settings')
          .select('org_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (settings?.org_id) {
          await supabase
            .from('orgs')
            .update({ status: 'inactive' })
            .eq('id', settings.org_id)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const customerId = subscription.customer
        const isPastDue = subscription.status === 'past_due'
        const isActive  = subscription.status === 'active'

        const { data: settings } = await supabase
          .from('org_settings')
          .select('org_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (settings?.org_id) {
          // Update past_due flag on org_settings
          await supabase
            .from('org_settings')
            .update({ payment_past_due: isPastDue })
            .eq('org_id', settings.org_id)

          // Re-activate org when subscription returns to active
          if (isActive) {
            await supabase
              .from('orgs')
              .update({ status: 'active' })
              .eq('id', settings.org_id)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customerId = invoice.customer

        const { data: settings } = await supabase
          .from('org_settings')
          .select('org_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (settings?.org_id) {
          // Mark payment past due
          await supabase
            .from('org_settings')
            .update({ payment_past_due: true })
            .eq('org_id', settings.org_id)

          // Lock out the org immediately on payment failure
          await supabase
            .from('orgs')
            .update({ status: 'inactive' })
            .eq('id', settings.org_id)
        }
        break
      }

      default:
        // Unhandled event type — acknowledge receipt
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
