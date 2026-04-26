// Triggered when appointment status becomes 'confirmed'
// Expected request body: { appointment_id: string }
// Env vars needed: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, SENDGRID_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { appointment_id } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Load appointment with related data
    const { data: appt, error } = await supabase
      .from('appointments')
      .select(`
        id, scheduled_at, status, amount, notes, org_id,
        clients(id, name, email, phone),
        services(name, duration_minutes),
        orgs:org_id(name, phone)
      `)
      .eq('id', appointment_id)
      .single()

    if (error || !appt) throw new Error('Appointment not found')

    // Load notification settings for the org
    const { data: notifSettings } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('org_id', appt.org_id)
      .maybeSingle()

    const scheduledDate = new Date(appt.scheduled_at)
    const dateStr = scheduledDate.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
    const timeStr = scheduledDate.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true
    })

    const clientName = appt.clients?.name || 'Patient'
    const serviceName = appt.services?.name || 'appointment'
    const orgName = appt.orgs?.name || 'the practice'

    const smsBody = `Hi ${clientName}, your ${serviceName} appointment at ${orgName} has been confirmed for ${dateStr} at ${timeStr}. Reply STOP to opt out.`
    const emailSubject = `Appointment Confirmed — ${serviceName} on ${dateStr}`
    const emailHtml = `
      <h2>Your appointment is confirmed!</h2>
      <p>Hi ${clientName},</p>
      <p>Your <strong>${serviceName}</strong> appointment at <strong>${orgName}</strong> has been confirmed.</p>
      <table>
        <tr><td><strong>Date</strong></td><td>${dateStr}</td></tr>
        <tr><td><strong>Time</strong></td><td>${timeStr}</td></tr>
        <tr><td><strong>Duration</strong></td><td>${appt.services?.duration_minutes || 60} minutes</td></tr>
      </table>
      ${notifSettings?.cancellation_policy_text ? `<p><em>${notifSettings.cancellation_policy_text}</em></p>` : ''}
    `

    const results = []

    // Send SMS via Twilio (if enabled and client has phone)
    if ((notifSettings?.sms_enabled ?? true) && (notifSettings?.sms_confirmed ?? true) && appt.clients?.phone) {
      try {
        const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID')
        const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN')
        const twilioFrom = Deno.env.get('TWILIO_FROM_NUMBER')

        if (twilioSid && twilioToken && twilioFrom) {
          const smsRes = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Basic ${btoa(`${twilioSid}:${twilioToken}`)}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                To: appt.clients.phone,
                From: twilioFrom,
                Body: smsBody,
              }),
            }
          )
          const smsData = await smsRes.json()
          results.push({ type: 'sms', status: smsRes.ok ? 'sent' : 'failed', sid: smsData.sid })
        }
      } catch (e) {
        results.push({ type: 'sms', status: 'error', error: e.message })
      }
    }

    // Send email via SendGrid (if enabled and client has email)
    if ((notifSettings?.email_enabled ?? true) && (notifSettings?.email_confirmed ?? true) && appt.clients?.email) {
      try {
        const sgKey = Deno.env.get('SENDGRID_API_KEY')
        if (sgKey) {
          const emailRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sgKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              personalizations: [{ to: [{ email: appt.clients.email, name: clientName }] }],
              from: { email: Deno.env.get('SENDGRID_FROM_EMAIL') || 'noreply@example.com', name: orgName },
              subject: emailSubject,
              content: [{ type: 'text/html', value: emailHtml }],
            }),
          })
          results.push({ type: 'email', status: emailRes.ok ? 'sent' : 'failed', statusCode: emailRes.status })
        }
      } catch (e) {
        results.push({ type: 'email', status: 'error', error: e.message })
      }
    }

    // Log to notifications_log
    if (results.length > 0) {
      await supabase.from('notifications_log').insert(
        results.map(r => ({
          org_id: appt.org_id,
          appointment_id: appt.id,
          type: r.type,
          recipient: r.type === 'sms' ? appt.clients?.phone : appt.clients?.email,
          status: r.status,
          template: 'appointment_confirmed',
          error: r.error || null,
        }))
      )
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
