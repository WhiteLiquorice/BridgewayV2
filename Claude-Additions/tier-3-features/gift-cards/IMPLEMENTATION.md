# Gift Card / Prepaid Credits System

**Effort:** 4 days | **Impact:** Medium | **Priority:** Tier 3

## Overview

Allow businesses to sell gift cards and prepaid credit packages for services.

## Features

- **Gift card creation** – Create $25, $50, $100 denominations
- **Gift card sales** – Sell through admin portal
- **Redemption** – Use gift card to book services
- **Balance tracking** – Show remaining balance
- **Expiration** – Optional expiration dates
- **Bulk purchase** – Corporate gifts, group packages

## Database Schema Changes

**New Collection: `giftCards`**
```
{
  id: string (code, e.g., "GC-ABC123XYZ")
  orgId: string
  initialAmount: number
  currentBalance: number
  clientId: string (nullable, if purchased by client)
  purchasedBy: string (staff/client who bought it)
  purchaseDate: timestamp
  expirationDate: timestamp (nullable)
  isUsed: boolean
  usedBy: string (clientId, nullable)
  createdAt: timestamp
}
```

**New Collection: `giftCardTransactions`**
```
{
  id: string (UUID)
  giftCardId: string
  orgId: string
  type: string (purchase/redemption)
  amount: number
  appointmentId: string (nullable, if redemption)
  createdAt: timestamp
}
```

## Implementation

### Day 1: Gift Card CRUD
- Generate unique codes
- Create/delete gift cards
- Track balance

### Day 2: Admin UI
- Gift card creation form
- Sales dashboard
- Balance management

### Day 3: Client UI
- Apply gift card to booking
- Show balance
- Redemption history

### Day 4: Integrations
- Email delivery (if digital)
- Reporting

## Testing Checklist

- [ ] Gift card codes unique
- [ ] Balance tracking accurate
- [ ] Expiration working
- [ ] Redemption subtracts correctly
- [ ] Can handle $10k+ in outstanding gift cards

## Files to Create

```
/functions/
  payments/
    giftCardService.js (new)
    
/apps/Admin/src/
  pages/GiftCards.tsx (new)
  
/apps/Portal/src/
  components/
    GiftCardRedemption.tsx (new)
```
