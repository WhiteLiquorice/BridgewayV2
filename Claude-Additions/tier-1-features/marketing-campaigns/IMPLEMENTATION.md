# Automated Marketing Campaigns

**Effort:** 5 days | **Impact:** Medium-High | **Priority:** 3

## Overview

Automated email/SMS campaigns for no-show recovery, appointment reminders, upsells, and win-back sequences. Drives repeat bookings and revenue.

## Features

- **No-Show Recovery** – Auto email "we missed you" with rescheduling link
- **Appointment Reminders** – 24hr, 3hr before appointment (email + SMS)
- **Service Upsells** – "You loved X, try Y" after completed appointment
- **Win-Back Campaigns** – Win back inactive clients (60+ days)
- **Referral Programs** – "Refer a friend" incentives
- **Birthday/Anniversary** – Special offers on milestones
- **Campaign Analytics** – Open rates, click rates, conversion

## Database Schema Changes

**New Collection: `campaigns`**
```
{
  id: string (UUID)
  orgId: string
  name: string
  type: string (no-show/reminder/upsell/winback/referral/birthday)
  trigger: string (appointment_completed/no_show/days_inactive/date)
  triggerParams: object (e.g., { daysInactive: 60 })
  messageTemplate: object {
    subject: string
    body: string
    variables: string[] (e.g., [clientName, serviceName])
  }
  channels: string[] (email/sms)
  enabled: boolean
  createdAt: timestamp
  updatedAt: timestamp
}

{
  id: string (campaign + client + date)
  campaignId: string
  clientId: string
  orgId: string
  messagesSent: number
  emailsSent: number
  smsSent: number
  opened: number
  clicked: number
  converted: number (booked)
  sentAt: timestamp
}
```

**Enhance: `clients`**
- Add: `subscriptionStatus: string` (subscribed/unsubscribed)
- Add: `emailOptIn: boolean`
- Add: `smsOptIn: boolean`
- Add: `lastEmailSentAt: timestamp`

## Implementation Steps

### Step 1: Campaign Builder (Day 1)
Location: `/apps/Admin/src/pages/Campaigns.tsx` (create new)

**UI:**
- Template selector (pre-built + custom)
- Trigger configuration
- Channel selection (email/SMS)
- Preview message
- Schedule/activate button

### Step 2: Message Templates (Day 1-2)
Create: `/functions/campaigns/templates/`

**Pre-built templates:**
- `noShowRecovery.html`
- `appointmentReminder.html`
- `serviceUpsell.html`
- `winBackOffer.html`
- `referralInvite.html`
- `birthdaySpecial.html`

Support variable substitution:
```
Hi {{clientName}}, we missed you at your {{serviceName}} appointment!
```

### Step 3: Campaign Trigger Engine (Day 2-3)
Location: `/functions/campaigns/triggerEngine.js`

```javascript
// Scheduled to run hourly
async function processCampaignTriggers(orgId) {
  // 1. Find active campaigns
  // 2. For each trigger type:
  //    - Find matching clients
  //    - Generate messages with variables
  //    - Queue for sending
  // 3. Log execution
}

// Specific trigger handlers:
async function handleNoShowTrigger(appointments, campaign) {
  // Find appointments with no_show status in last 24h
}

async function handleReminderTrigger(appointments, campaign) {
  // Find appointments scheduled for 24h from now
}
```

### Step 4: Email/SMS Integration (Day 3-4)
Location: `/functions/messaging/`

**Email provider:** SendGrid or Mailgun
**SMS provider:** Twilio or AWS SNS

```javascript
async function sendCampaignMessage(clientId, campaign, message) {
  // Check opt-in status
  // Send via appropriate channel(s)
  // Log sent/opened/clicked events
  // Handle bounce/unsubscribe
}
```

### Step 5: Campaign Analytics Dashboard (Day 4-5)
Create: `/apps/Admin/src/components/analytics/CampaignMetrics.tsx`

**Metrics:**
- Campaign list (active, paused, completed)
- Performance by campaign (sent, opened, clicked, converted)
- Channel performance (email vs SMS)
- ROI by campaign type
- Trend over time

### Step 6: Opt-In Management (Day 5)
Create: `/apps/Portal/src/pages/CommunicationPreferences.tsx`

**Allows clients to:**
- Enable/disable campaigns
- Select preferred channels (email/SMS)
- Manage frequency
- Unsubscribe from specific types

## Integration Points

**Triggers from:**
- Appointment status changes (no-show)
- Appointment scheduling (create reminders)
- Service completion (trigger upsells)
- Time-based events (inactivity, birthday)

**Sends to:**
- Email provider API
- SMS provider API
- Client logs for analytics

## Email Template Example

See `STARTER_CODE/noShowRecovery.html` for template structure.

## Performance Considerations

- **Batch sending:** Queue 1000s of messages, send in batches
- **Rate limiting:** Respect provider API limits
- **Scheduling:** Process triggers during off-peak hours
- **Caching:** Cache template content, refresh hourly

## Testing Checklist

- [ ] Campaign creation and editing works
- [ ] Trigger detection accurate (test with sample data)
- [ ] Messages send to correct channels
- [ ] Variable substitution works correctly
- [ ] Opt-in/opt-out respected
- [ ] Analytics tracking accurate (opened, clicked)
- [ ] Bounce handling working
- [ ] Campaign can be paused/resumed
- [ ] Test email/SMS received within 1 min

## Files to Create/Modify

```
/functions/
  campaigns/
    triggerEngine.js (new)
    templates/
      noShowRecovery.html (new)
      appointmentReminder.html (new)
      serviceUpsell.html (new)
      winBackOffer.html (new)
      referralInvite.html (new)
      birthdaySpecial.html (new)
  messaging/
    emailService.js (new)
    smsService.js (new)
    
/apps/Admin/src/
  pages/Campaigns.tsx (new)
  components/
    campaigns/
      CampaignBuilder.tsx (new)
      CampaignList.tsx (new)
      TemplatePreview.tsx (new)
      
/apps/Portal/src/
  pages/CommunicationPreferences.tsx (new)
```

## Setup Requirements

1. **Email:** SendGrid account (or Mailgun)
2. **SMS:** Twilio account (or AWS SNS)
3. **Environment variables:** API keys in Cloud Functions config
4. **Firestore indexes:** `campaigns: (orgId, enabled, type)`

## Deployment Order

1. Deploy email and SMS services
2. Deploy campaign trigger engine (test manually first)
3. Build campaign builder UI
4. Test with staging data
5. Schedule trigger engine in Cloud Scheduler
6. Monitor for 1 week
7. Gather staff feedback
