// Supabase Edge Function: create-portal-session
// Creates a Stripe Customer Portal session so businesses can manage billing.
//
// Prerequisites:
//   supabase secrets set STRIPE_SECRET_KEY=sk_live_...
//
// Request body: { stripe_customer_id: string }
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
    const { stripe_customer_id } = await req.json()

    if (!stripe_customer_id) {
      return new Response(
        JSON.stringify({ error: 'stripe_customer_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // TODO: replace with real Stripe secret key via `supabase secrets set`
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || 'sk_test_placeholder'

    // TODO: update return_url with real Admin App domain
    const returnUrl = 'https://admin.bridgewayapps.com/billing'

    const portalRes = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer: stripe_customer_id,
        return_url: returnUrl,
      }),
    })
    const portalSession = await portalRes.json()

    if (portalSession.error) {
      return new Response(
        JSON.stringify({ error: portalSession.error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ url: portalSession.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
