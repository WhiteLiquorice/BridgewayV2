// test_local_webhook.js

async function runTest() {
  const bookingId = "e3e3e3e3-3e3e-3e3e-3e3e-3e3e3e3e3e3e"; // Mock booking ID
  const payload = {
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_booking_123",
        metadata: {
          bookingId: bookingId
        }
      }
    }
  };

  console.log('Sending mock webhook event for Booking Payment...');
  try {
    const response = await fetch('http://127.0.0.1:5001/bridgeway-db29e/us-central1/stripeWebhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    console.log(`Response Status: ${response.status}`);
    console.log(`Response Body: ${text}`);
  } catch (err) {
    console.error('Failed to send request:', err.message);
  }
}

runTest();
