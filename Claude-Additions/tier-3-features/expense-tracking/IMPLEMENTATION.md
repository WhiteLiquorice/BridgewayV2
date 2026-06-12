# Expense Tracking & Cost Analysis

**Effort:** 3 days | **Impact:** Low | **Priority:** Tier 3

## Overview

Track business expenses and calculate profitability by service, staff, and client.

## Features

- **Expense categories** – Supplies, rent, utilities, marketing, etc.
- **Expense entry** – Log daily expenses
- **Cost allocation** – Assign to services or clients
- **Profitability** – Revenue minus costs by service
- **Budget tracking** – Compare to budget
- **Reports** – Monthly expense summaries

## Database Schema Changes

**New Collection: `expenses`**
```
{
  id: string (UUID)
  orgId: string
  amount: number
  category: string (supplies/rent/utilities/marketing/other)
  description: string
  serviceId: string (nullable)
  date: timestamp
  receipt: string (file URL, optional)
  createdAt: timestamp
}
```

## Implementation

### Day 1: Expense CRUD
- Create/edit/delete expenses
- Categorize expenses

### Day 2: Admin UI
- Expense list with filters
- Monthly summary

### Day 3: Analytics
- Profitability by service
- Cost trends
- Budget vs. actual

## Testing Checklist

- [ ] Expenses calculate correctly
- [ ] Profitability = Revenue - Costs
- [ ] Category filtering works
- [ ] Budget alerts work

## Files to Create

```
/functions/
  accounting/
    expenseService.js (new)
    
/apps/Admin/src/
  pages/Expenses.tsx (new)
  components/
    ExpenseForm.tsx (new)
    ProfitabilityChart.tsx (new)
```

## Note

This is useful for accounting but lower priority for growth/retention focus.
