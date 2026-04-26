// Supabase Edge Function: get-billing-info
// Fetches subscription details from Stripe for the Admin billing page.
//
// Prerequisites:
//   supabase secrets set STRIPE_SECRET_KEY=sk_live_...
//
// Request body: { stripe_customer_id: string }
// Returns: { planName, status, currentPeriodEnd, paymentMethod }

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

    // Fetch subscriptions for this customer
    const subsRes = await fetch(
      `https://api.stripe.com/v1/subscriptions?customer=${stripe_customer_id}&limit=1&expand[]=data.default_payment_method`,
      {
        headers: { 'Authorization': `Bearer ${stripeKey}` },
      }
    )
    const subs = await subsRes.json()

    if (!subs.data?.length) {
      return new Response(
        JSON.stringify({ error: 'No active subscription found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const sub = subs.data[0]
    const planName = sub.items?.data?.[0]?.price?.nickname || 'Bridgeway Apps'
    const pm = sub.default_payment_method

    return new Response(
      JSON.stringify({
        planName,
        status: sub.status,
        currentPeriodEnd: sub.current_period_end,
        paymentMethod: pm?.card
          ? { brand: pm.card.brand, last4: pm.card.last4 }
          : null,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
