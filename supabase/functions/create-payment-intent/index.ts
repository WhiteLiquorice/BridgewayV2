// Supabase Edge Function: create-payment-intent
// Creates a Stripe PaymentIntent for booking payments.
//
// Prerequisites:
//   1. Deploy Stripe secret key as a Supabase secret:
//      supabase secrets set STRIPE_SECRET_KEY=sk_live_...
//   2. Or read it from org_settings per-org (multi-tenant).
//
// Request body: { org_id: string, amount: number, currency?: string }
// Returns: { clientSecret: string }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { org_id, amount, currency = 'usd' } = await req.json()

    if (!org_id || !amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'org_id and positive amount are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client with service role to read org_settings
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch the org's Stripe secret key from org_settings
    const { data: settings, error: settingsErr } = await supabase
      .from('org_settings')
      .select('stripe_secret_key')
      .eq('org_id', org_id)
      .single()

    if (settingsErr || !settings?.stripe_secret_key) {
      return new Response(
        JSON.stringify({ error: 'Stripe is not configured for this organization' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create PaymentIntent via Stripe API
    const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.stripe_secret_key}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: String(Math.round(amount * 100)), // Stripe expects cents
        currency,
        'automatic_payment_methods[enabled]': 'true',
      }),
    })

    const paymentIntent = await stripeRes.json()

    if (paymentIntent.error) {
      return new Response(
        JSON.stringify({ error: paymentIntent.error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
