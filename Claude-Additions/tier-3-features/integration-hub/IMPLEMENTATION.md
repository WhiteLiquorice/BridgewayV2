# Integration Hub (Zapier, Webhooks, APIs)

**Effort:** 4 days | **Impact:** Medium | **Priority:** Tier 3

## Overview

Connect Bridgeway with external tools via webhooks and APIs (Zapier, Make, custom integrations).

## Integrations to Support

- **Calendar sync** – Google Calendar, Outlook, iCal
- **Payment providers** – Stripe, Square webhooks
- **CRM** – Hubspot, Salesforce
- **Email** – Mailchimp, Klaviyo
- **Accounting** – QuickBooks, Xero
- **Analytics** – Segment, Mixpanel
- **Communication** – Slack, Teams, Discord

## Features

- **Webhook configuration** – Add custom webhooks
- **Zapier integration** – Connect via Zapier
- **OAuth flows** – Secure 3rd-party auth
- **Event triggers** – What events to send
- **Test webhooks** – Verify integration works

## Database Schema Changes

**New Collection: `integrations`**
```
{
  id: string (UUID)
  orgId: string
  provider: string (zapier/webhook/oauth)
  type: string (calendar/payments/crm/email/etc)
  isActive: boolean
  config: object (provider-specific config)
  webhookUrl: string (for Zapier/custom)
  authToken: string (encrypted, if needed)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Implementation

### Day 1: Webhook Infrastructure
- Create webhook event publisher
- Webhook event types (appointment_created, payment_received, etc)
- Event payload schema

### Day 2: OAuth & Config UI
- OAuth flows for providers
- Admin integration settings page
- Test webhook button

### Day 3-4: Specific Integrations
- Calendar sync
- Payment webhooks
- Slack notifications

## Complexity Note

This is framework + specific integrations. Start with:
1. Webhook infrastructure (reusable)
2. Zapier support (they handle most integrations)
3. Then specific OAuth integrations

## Testing Checklist

- [ ] Webhooks fire at correct times
- [ ] Payloads valid
- [ ] OAuth flows secure
- [ ] Integrations don't slow app

## Files to Create

```
/functions/
  webhooks/
    webhookPublisher.js (new)
    eventTypes.js (new)
  integrations/
    oauthHandler.js (new)
    
/apps/Admin/src/
  pages/Integrations.tsx (new)
  components/
    IntegrationList.tsx (new)
    OAuthFlow.tsx (new)
```

## Zapier Quick Path

Zapier can connect Bridgeway to 5000+ apps via webhooks. This is the highest-leverage integration.

1. Set up webhook infrastructure
2. Document webhook events
3. Publish to Zapier app catalog
4. Users can build Zaps

This gives you 5000 integrations with minimal work.
