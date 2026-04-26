// Called when a new pending booking is created in the bookings table
// Request body: { booking_id: string }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { booking_id } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: booking } = await supabase
      .from('bookings')
      .select('id, name, email, phone, preferred_date, preferred_time, notes, org_id, services(name)')
      .eq('id', booking_id)
      .single()

    if (!booking) throw new Error('Booking not found')

    const { data: notifSettings } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('org_id', booking.org_id)
      .maybeSingle()

    // Get org managers/admins to notify
    const { data: admins } = await supabase
      .from('profiles')
      .select('email, phone, full_name')
      .eq('org_id', booking.org_id)
      .in('role', ['admin', 'manager'])
      .eq('is_active', true)

    const { data: org } = await supabase
      .from('orgs')
      .select('name')
      .eq('id', booking.org_id)
      .single()

    const dateStr = booking.preferred_date
      ? new Date(booking.preferred_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      : 'TBD'
    const timeStr = booking.preferred_time
      ? new Date('1970-01-01T' + booking.preferred_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      : 'TBD'

    const logEntries: Record<string, unknown>[] = []

    if (notifSettings?.notify_new_booking ?? true) {
      for (const admin of admins || []) {
        const twilioSid   = Deno.env.get('TWILIO_ACCOUNT_SID')
        const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN')
        const twilioFrom  = Deno.env.get('TWILIO_FROM_NUMBER')
        const sgKey       = Deno.env.get('SENDGRID_API_KEY')
        const fromEmail   = Deno.env.get('SENDGRID_FROM_EMAIL') || 'noreply@example.com'

        const smsBody = `New booking request at ${org?.name || 'your practice'}: ${booking.name} for ${booking.services?.name || 'an appointment'} on ${dateStr} at ${timeStr}. Log in to confirm.`
        const emailSubject = `New Booking Request — ${booking.services?.name || 'Appointment'} from ${booking.name}`
        const emailHtml = `<h2>New Booking Request</h2><p>A new booking has been submitted and is awaiting confirmation.</p><table><tr><td><strong>Patient</strong></td><td>${booking.name}</td></tr><tr><td><strong>Service</strong></td><td>${booking.services?.name || '—'}</td></tr><tr><td><strong>Preferred Date</strong></td><td>${dateStr}</td></tr><tr><td><strong>Preferred Time</strong></td><td>${timeStr}</td></tr><tr><td><strong>Email</strong></td><td>${booking.email || '—'}</td></tr><tr><td><strong>Phone</strong></td><td>${booking.phone || '—'}</td></tr>${booking.notes ? `<tr><td><strong>Notes</strong></td><td>${booking.notes}</td></tr>` : ''}</table><p><a href="${Deno.env.get('DASHBOARD_URL') || '#'}/admin/bookings">Confirm or decline this booking</a></p>`

        if ((notifSettings?.sms_enabled ?? true) && admin.phone && twilioSid && twilioToken && twilioFrom) {
          try {
            const res = await fetch(
              `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
              {
                method: 'POST',
                headers: { 'Authorization': `Basic ${btoa(`${twilioSid}:${twilioToken}`)}`, 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ To: admin.phone, From: twilioFrom, Body: smsBody }),
              }
            )
            logEntries.push({ org_id: booking.org_id, type: 'sms', recipient: admin.phone, status: res.ok ? 'sent' : 'failed', template: 'new_booking' })
          } catch { logEntries.push({ org_id: booking.org_id, type: 'sms', recipient: admin.phone, status: 'error', template: 'new_booking' }) }
        }

        if ((notifSettings?.email_enabled ?? true) && admin.email && sgKey) {
          try {
            const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${sgKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                personalizations: [{ to: [{ email: admin.email, name: admin.full_name || 'Admin' }] }],
                from: { email: fromEmail, name: org?.name || 'Booking System' },
                subject: emailSubject,
                content: [{ type: 'text/html', value: emailHtml }],
              }),
            })
            logEntries.push({ org_id: booking.org_id, type: 'email', recipient: admin.email, status: res.ok ? 'sent' : 'failed', template: 'new_booking' })
          } catch { logEntries.push({ org_id: booking.org_id, type: 'email', recipient: admin.email, status: 'error', template: 'new_booking' }) }
        }
      }
    }

    if (logEntries.length > 0) {
      await supabase.from('notifications_log').insert(logEntries)
    }

    return new Response(JSON.stringify({ ok: true, sent: logEntries.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
