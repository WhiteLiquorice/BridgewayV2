/**
 * Template Cloud Function
 *
 * TODO: Update function name and description
 *
 * Triggers: HTTP, Scheduled, Firestore, etc.
 * Environment variables: SENDGRID_API_KEY, etc.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();

/**
 * HTTP-triggered function
 *
 * Usage:
 * curl -X POST https://region-project.cloudfunctions.net/templateFunction \
 *   -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
 *   -H "Content-Type: application/json" \
 *   -d '{"orgId": "org-1", "data": "value"}'
 */
exports.templateFunction = functions.https.onCall(async (data, context) => {
  try {
    // Validate authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User not authenticated');
    }

    // Validate input
    const { orgId, param1, param2 } = data;

    if (!orgId || typeof orgId !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'orgId is required and must be a string'
      );
    }

    if (!param1) {
      throw new functions.https.HttpsError('invalid-argument', 'param1 is required');
    }

    // TODO: Add your business logic here
    console.log(`Processing template function for org: ${orgId}`);

    // Example: Read from Firestore
    const orgRef = await db.collection('organizations').doc(orgId).get();

    if (!orgRef.exists) {
      throw new functions.https.HttpsError('not-found', 'Organization not found');
    }

    const orgData = orgRef.data();

    // Example: Process data
    const result = {
      processed: true,
      itemsProcessed: 0,
      timestamp: new Date().toISOString(),
    };

    // Example: Write results
    await db.collection('functionLogs').add({
      functionName: 'templateFunction',
      orgId,
      status: 'success',
      result,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return result;
  } catch (error) {
    console.error('Error in templateFunction:', error);

    // Log error for debugging
    await db.collection('functionLogs').add({
      functionName: 'templateFunction',
      status: 'error',
      error: error.message,
      stack: error.stack,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Re-throw with appropriate error type
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError('internal', 'An unexpected error occurred');
  }
});

/**
 * Scheduled function (runs daily at 2 AM UTC)
 *
 * Usage:
 * Set up in firebase.json:
 * "scheduleTriggers": [{
 *   "function": "dailyTemplateTask",
 *   "schedule": "0 2 * * *"
 * }]
 */
exports.dailyTemplateTask = functions.pubsub
  .schedule('0 2 * * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      console.log('Starting daily template task at:', new Date().toISOString());

      // TODO: Add your scheduled task logic here

      // Example: Process all organizations
      const orgsSnapshot = await db.collection('organizations').get();

      const processedCount = orgsSnapshot.size;

      console.log(`Processed ${processedCount} organizations`);

      return {
        status: 'success',
        processedCount,
      };
    } catch (error) {
      console.error('Error in dailyTemplateTask:', error);

      // Still return successfully so Cloud Functions doesn't retry
      return {
        status: 'error',
        error: error.message,
      };
    }
  });

/**
 * Firestore trigger (runs when document changes)
 *
 * Usage: Automatically triggered when a document is created/updated
 */
exports.onTemplateDocumentWrite = functions.firestore
  .document('collectionName/{docId}')
  .onWrite(async (change, context) => {
    try {
      const { docId } = context.params;
      const previousData = change.before.data();
      const newData = change.after.data();

      console.log(`Document ${docId} changed`);

      // TODO: Add your logic here

      // Example: Check if specific field changed
      if (previousData?.status !== newData?.status) {
        console.log(`Status changed from ${previousData?.status} to ${newData?.status}`);

        // Trigger follow-up action
        await db.collection('tasks').add({
          type: 'status_changed',
          documentId: docId,
          newStatus: newData?.status,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      return null;
    } catch (error) {
      console.error('Error in onTemplateDocumentWrite:', error);
      // Log but don't throw - prevents Cloud Functions from retrying
      return null;
    }
  });

/**
 * Helper function for data processing
 * (Not exported, used internally)
 */
async function processOrganizationData(orgId) {
  try {
    const batch = db.batch();

    // Example: Get all items for org
    const itemsSnapshot = await db.collection('items').where('orgId', '==', orgId).get();

    // Example: Update each item
    itemsSnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        processed: true,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    return itemsSnapshot.size;
  } catch (error) {
    console.error(`Error processing organization ${orgId}:`, error);
    throw error;
  }
}

/**
 * Error handling patterns:
 *
 * HttpsError for expected errors (validation, not found, etc.):
 * throw new functions.https.HttpsError('invalid-argument', 'Message');
 *
 * Common error codes:
 * - 'invalid-argument': Invalid input
 * - 'not-found': Resource not found
 * - 'unauthenticated': User not authenticated
 * - 'permission-denied': User lacks permission
 * - 'internal': Unexpected server error
 *
 * For scheduled functions, catch errors and log, don't rethrow
 */
