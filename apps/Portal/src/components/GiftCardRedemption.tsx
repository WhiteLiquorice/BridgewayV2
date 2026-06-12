/**
 * Gift card redemption — check balance and apply to a booking.
 * (Tier 3, Gift Cards)
 */
import React, { useState } from 'react';
import { useCallable } from '../../../shared/hooks/useCallable';
import { Button, Alert, Badge } from '../../../shared/components/ui';
import { trackEvent } from '../../../shared/lib/analytics';

interface GiftCardRedemptionProps {
  orgId: string;
  /** Amount due on the current booking. */
  amountDue: number;
  appointmentId?: string;
  clientId?: string;
  /** Called with the amount covered by the gift card. */
  onApplied: (amountCovered: number, remainingDue: number) => void;
}

interface BalanceCheck {
  code: string;
  currentBalance: number;
  isActive: boolean;
  expired: boolean;
}

export default function GiftCardRedemption({ orgId, amountDue, appointmentId, clientId, onApplied }: GiftCardRedemptionProps) {
  const [code, setCode] = useState('');
  const [card, setCard] = useState<BalanceCheck | null>(null);

  const { call: checkBalance, loading: checking, error: checkError } = useCallable<object, BalanceCheck>('checkGiftCardBalance');
  const { call: redeem, loading: redeeming, error: redeemError } = useCallable<object, { redeemed: number; remainingBalance: number }>('redeemGiftCard');

  const lookup = async () => {
    setCard(null);
    const result = await checkBalance({ orgId, code: code.trim() });
    if (result) setCard(result);
  };

  const apply = async () => {
    if (!card) return;
    const amountToApply = Math.min(card.currentBalance, amountDue);
    const result = await redeem({
      orgId,
      code: card.code,
      amount: amountToApply,
      appointmentId,
      clientId,
    });
    if (result) {
      trackEvent('gift_card_redeemed', { amount: result.redeemed });
      onApplied(result.redeemed, Math.max(0, amountDue - result.redeemed));
      setCard(null);
      setCode('');
    }
  };

  const error = checkError || redeemError;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Have a gift card?</label>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm font-mono uppercase"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="GC-XXXX-XXXX"
          maxLength={12}
        />
        <Button variant="secondary" onClick={lookup} loading={checking} disabled={code.trim().length < 10}>
          Check
        </Button>
      </div>

      {error && <Alert kind="error">{error.message}</Alert>}

      {card && (
        <div className="bg-gray-50 rounded-md p-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono">{card.code}</span>
            {card.expired ? (
              <Badge color="red">expired</Badge>
            ) : !card.isActive ? (
              <Badge color="gray">inactive</Badge>
            ) : (
              <Badge color="green">${card.currentBalance.toFixed(2)} available</Badge>
            )}
          </div>
          {card.isActive && !card.expired && card.currentBalance > 0 && (
            <>
              <p className="text-xs text-gray-500">
                Applies ${Math.min(card.currentBalance, amountDue).toFixed(2)} to your ${amountDue.toFixed(2)} total
                {card.currentBalance < amountDue
                  ? ` — $${(amountDue - card.currentBalance).toFixed(2)} remaining due.`
                  : card.currentBalance > amountDue
                    ? ` — $${(card.currentBalance - amountDue).toFixed(2)} stays on the card.`
                    : '.'}
              </p>
              <Button size="sm" onClick={apply} loading={redeeming}>
                Apply Gift Card
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
