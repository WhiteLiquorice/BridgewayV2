import { dataconnect } from './firebase'
import { logActivity as logActivityDC } from '@bridgeway/database'

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
    await logActivityDC(dataconnect, {
      orgId: org_id,
      userId: user_id || null,
      action,
      entityType: entity_type || null,
      entityId: entity_id || null,
      metadata,
    })
  } catch (err) {
    console.error('Failed to log activity:', err)
  }
}

