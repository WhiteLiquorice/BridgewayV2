import { supabase } from './supabase'

/**
 * Log a user action to the activity_log table.
 * Fire-and-forget — never blocks the caller.
 *
 * @param {object} opts
 * @param {string} opts.org_id
 * @param {string} [opts.user_id]
 * @param {string} opts.action      – e.g. 'appointment.created', 'client.updated'
 * @param {string} [opts.entity_type] – 'appointment', 'client', 'class', 'queue', 'package'
 * @param {string} [opts.entity_id]
 * @param {object} [opts.metadata]  – arbitrary JSON payload
 */
export async function logActivity({ org_id, user_id, action, entity_type, entity_id, metadata = {} }) {
  try {
    await supabase.from('activity_log').insert({
      org_id,
      user_id: user_id || null,
      action,
      entity_type: entity_type || null,
      entity_id: entity_id || null,
      metadata,
    })
  } catch {
    // Activity logging is fire-and-forget; never block the caller
  }
}
