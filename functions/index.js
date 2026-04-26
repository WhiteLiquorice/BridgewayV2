const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

admin.initializeApp();
const db = admin.firestore();

exports.createCheckoutSession = onRequest({ cors: true }, async (req, res) => {
  const { email, orgName, priceId } = req.body;

  if (!email || !orgName || !priceId) {
    return res.status(400).send({ error: "email, orgName, and priceId are required" });
  }

  try {
    // 1. Create a Stripe customer
    const customer = await stripe.customers.create({
      email,
      name: orgName,
      metadata: { org_name: orgName },
    });

    // 2. Create a Stripe Checkout session
    // TODO: Update with real domains
    const successUrl = "https://bridgeway-db29e-admin.web.app/onboarding?session_id={CHECKOUT_SESSION_ID}";
    const cancelUrl = "https://bridgeway-db29e.web.app/#pricing";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.status(200).send({ url: session.url });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

exports.createPortalSession = onRequest({ cors: true }, async (req, res) => {
  const { stripe_customer_id } = req.body;
  
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripe_customer_id,
      return_url: "https://admin.bridgewayapps.com/billing",
    });
    res.status(200).send({ url: session.url });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

exports.stripeWebhook = onRequest({ cors: true }, async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  // TODO: Sync to Data Connect SQL DB
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("Checkout session completed:", session.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
});

/**
 * Sync Stripe subscription status from Firestore (Extension) to Data Connect (SQL)
 */
exports.syncStripeToSql = onDocumentUpdated("customers/{uid}/subscriptions/{subId}", async (event) => {
  const subData = event.data.after.data();
  const uid = event.params.uid;

  if (!subData) return;

  console.log(`Syncing subscription ${event.params.subId} for user ${uid}`);

  // In a real app, you would use the Data Connect Admin SDK or a direct SQL query to update the OrgSetting table.
  // For now, we'll log it. 
  // You would typically:
  // 1. Find the Org associated with this Firebase UID.
  // 2. Update the OrgSetting table with stripeCustomerId and status.
  
  // Example:
  // await updateOrgBillingStatus(uid, subData.status, subData.customer);
});

