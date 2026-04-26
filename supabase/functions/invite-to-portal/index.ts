// Supabase Edge Function: invite-to-portal
// Sends a Supabase Auth invite email to a client so they can set their password
// and log in to the Client Portal.
//
// Why an Edge Function?
//   inviteUserByEmail() requires the service_role key, which has full database
//   access and must never be exposed in the browser. This function runs server-
//   side, verifies the caller is an authenticated staff member, then issues
//   the invite on their behalf.
//
// Prerequisites (run once in Supabase dashboard or via CLI):
//   No extra secrets needed — SUPABASE_URL, SUPABASE_ANON_KEY, and
//   SUPABASE_SERVICE_ROLE_KEY are injected automatically by Supabase Edge
//   runtime.
//
// Request:
//   POST /functions/v1/invite-to-portal
//   Authorization: Bearer <user's JWT from supabase.auth.getSession()>
//   Body: { email: string, clientName?: string, portalUrl?: string }
//
// Response:
//   200 { success: true }
//   400 { error: string }   — bad input or Supabase rejected the invite
//   401 { error: string }   — not authenticated
//   403 { error: string }   — authenticated but wrong role

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}

serve(async (req) => {
  // Preflight
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // ── 1. Verify the caller is authenticated ──────────────────────────────
    const authHeader = req.headers.get('Authorization') ?? ''
    if (!authHeader.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)

    // Use the caller's JWT to get their user record (validates the token)
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user }, error: userErr } = await supabaseUser.auth.getUser()
    if (userErr || !user) return json({ error: 'Unauthorized' }, 401)

    // ── 2. Check the caller's role — only staff/manager/admin may invite ───
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role, org_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!profile) return json({ error: 'Profile not found' }, 403)
    if (!['admin', 'manager', 'staff'].includes(profile.role)) {
      return json({ error: 'Only staff members can send portal invites' }, 403)
    }
    if (!profile.org_id) return json({ error: 'No org_id on your profile' }, 403)

    // ── 3. Parse and validate the request body ─────────────────────────────
    const { email, clientName, portalUrl } = await req.json()
    if (!email || typeof email !== 'string') return json({ error: 'email is required' }, 400)

    const redirectTo = portalUrl ?? 'https://your-portal-domain.com/portal/profile'

    // ── 4. Invite the user via the admin API ───────────────────────────────
    // This creates the auth.users record if it doesn't exist and sends
    // Supabase's built-in invite email with a one-time setup link.
    const { data: invited, error: inviteErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email.toLowerCase().trim(),
      {
        redirectTo,
        data: {
          // user_metadata is visible to the client after they log in
          full_name: clientName ?? '',
          role: 'patient',
          org_id: profile.org_id,
        },
      }
    )

    if (inviteErr) {
      // "User already registered" is not really an error — they can just log in
      if (inviteErr.message?.includes('already registered')) {
        return json({ success: true, note: 'User already exists — they can log in directly.' })
      }
      return json({ error: inviteErr.message }, 400)
    }

    // ── 5. Ensure a profiles row exists for the invited user ───────────────
    // The database trigger handles this automatically if you've run the SQL in
    // the README. This upsert is a safety net in case the trigger isn't set up.
    await supabaseAdmin.from('profiles').upsert(
      {
        user_id: invited.user.id,
        email: email.toLowerCase().trim(),
        full_name: clientName ?? null,
        role: 'patient',
        org_id: profile.org_id,
      },
      { onConflict: 'user_id' }
    )

    return json({ success: true })

  } catch (err) {
    console.error('invite-to-portal error:', err)
    return json({ error: String(err) }, 500)
  }
})
