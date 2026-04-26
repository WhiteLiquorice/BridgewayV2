// Supabase Edge Function: create-checkout-session
// Creates a Stripe Checkout session for new business subscriptions.
//
// Prerequisites:
//   1. Set Stripe secret key as a Supabase secret:
//      supabase secrets set STRIPE_SECRET_KEY=sk_live_...
//
// Request body: { email: string, orgName: string, priceId: string }
// Returns: { url: string }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, orgName, priceId } = await req.json()

    if (!email || !orgName || !priceId) {
      return new Response(
        JSON.stringify({ error: 'email, orgName, and priceId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // TODO: replace with real Stripe secret key via `supabase secrets set STRIPE_SECRET_KEY=sk_live_...`
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || 'sk_test_placeholder'

    // Step 1: Create a Stripe customer
    const customerRes = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email,
        name: orgName,
        'metadata[org_name]': orgName,
      }),
    })
    const customer = await customerRes.json()
    if (customer.error) {
      return new Response(
        JSON.stringify({ error: customer.error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 2: Create a Stripe Checkout session
    // TODO: update success_url and cancel_url with real domains
    const successUrl = 'https://admin.bridgewayapps.com/onboarding?session_id={CHECKOUT_SESSION_ID}'
    const cancelUrl = 'https://bridgewayapps.com/#pricing'

    const sessionRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'customer': customer.id,
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'allow_promotion_codes': 'true',
        'success_url': successUrl,
        'cancel_url': cancelUrl,
      }),
    })
    const session = await sessionRes.json()
    if (session.error) {
      return new Response(
        JSON.stringify({ error: session.error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
