// Cron-triggered: runs hourly, sends 24h and 2h reminders for upcoming appointments
// No request body needed — finds due reminders automatically

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function sendSms(to: string, body: string, sid: string, token: string, from: string) {
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${sid}:${token}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }),
    }
  )
  return res.ok
}

async function sendEmail(to: string, name: string, subject: string, html: string, sgKey: string, fromEmail: string, fromName: string) {
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${sgKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to, name }] }],
      from: { email: fromEmail, name: fromName },
      subject,
      content: [{ type: 'text/html', value: html }],
    }),
  })
  return res.ok
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const now = new Date()
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000)
  const in2h  = new Date(now.getTime() +  2 * 60 * 60 * 1000)
  const in3h  = new Date(now.getTime() +  3 * 60 * 60 * 1000)

  // Find appointments in the 24h window (24h–25h from now)
  const { data: appts24h } = await supabase
    .from('appointments')
    .select('id, scheduled_at, org_id, clients(name, email, phone), services(name, duration_minutes), orgs:org_id(name)')
    .eq('status', 'confirmed')
    .gte('scheduled_at', in24h.toISOString())
    .lt('scheduled_at', in25h.toISOString())

  // Find appointments in the 2h window (2h–3h from now)
  const { data: appts2h } = await supabase
    .from('appointments')
    .select('id, scheduled_at, org_id, clients(name, email, phone), services(name, duration_minutes), orgs:org_id(name)')
    .eq('status', 'confirmed')
    .gte('scheduled_at', in2h.toISOString())
    .lt('scheduled_at', in3h.toISOString())

  const twilioSid   = Deno.env.get('TWILIO_ACCOUNT_SID')
  const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN')
  const twilioFrom  = Deno.env.get('TWILIO_FROM_NUMBER')
  const sgKey       = Deno.env.get('SENDGRID_API_KEY')
  const fromEmail   = Deno.env.get('SENDGRID_FROM_EMAIL') || 'noreply@example.com'

  const logEntries: Record<string, unknown>[] = []

  for (const [appts, template, windowLabel] of [
    [appts24h || [], 'reminder_24h', '24 hours'],
    [appts2h  || [], 'reminder_2h',  '2 hours'],
  ] as const) {
    for (const appt of appts) {
      const { data: notifSettings } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('org_id', appt.org_id)
        .maybeSingle()

      const dt = new Date(appt.scheduled_at)
      const dateStr = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      const timeStr = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      const clientName = appt.clients?.name || 'Patient'
      const serviceName = appt.services?.name || 'appointment'
      const orgName = appt.orgs?.name || ''

      const smsBody = `Reminder: Your ${serviceName} appointment at ${orgName} is in ${windowLabel} — ${dateStr} at ${timeStr}. Reply STOP to opt out.`
      const emailSubject = `Reminder: ${serviceName} in ${windowLabel}`
      const emailHtml = `<h2>Appointment Reminder</h2><p>Hi ${clientName},</p><p>Your <strong>${serviceName}</strong> appointment at <strong>${orgName}</strong> is coming up in <strong>${windowLabel}</strong>.</p><p><strong>${dateStr} at ${timeStr}</strong> (${appt.services?.duration_minutes || 60} min)</p>`

      const reminderEnabled = template === 'reminder_24h'
        ? (notifSettings?.reminder_24h ?? true)
        : (notifSettings?.reminder_2h ?? true)

      if (!reminderEnabled) continue

      if ((notifSettings?.sms_enabled ?? true) && appt.clients?.phone && twilioSid && twilioToken && twilioFrom) {
        const ok = await sendSms(appt.clients.phone, smsBody, twilioSid, twilioToken, twilioFrom).catch(() => false)
        logEntries.push({ org_id: appt.org_id, appointment_id: appt.id, type: 'sms', recipient: appt.clients.phone, status: ok ? 'sent' : 'failed', template })
      }
      if ((notifSettings?.email_enabled ?? true) && appt.clients?.email && sgKey) {
        const ok = await sendEmail(appt.clients.email, clientName, emailSubject, emailHtml, sgKey, fromEmail, orgName).catch(() => false)
        logEntries.push({ org_id: appt.org_id, appointment_id: appt.id, type: 'email', recipient: appt.clients.email, status: ok ? 'sent' : 'failed', template })
      }
    }
  }

  if (logEntries.length > 0) {
    await supabase.from('notifications_log').insert(logEntries)
  }

  return new Response(JSON.stringify({ ok: true, sent: logEntries.length }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
