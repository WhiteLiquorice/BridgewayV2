/**
 * Gift Cards — issue and look up balances. (Tier 3, Gift Cards)
 */
import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useFirestoreQuery } from '../../../shared/hooks/useFirestoreQuery';
import { useCallable } from '../../../shared/hooks/useCallable';
import { Card, StatCard, Badge, Button, Modal, Alert, Skeleton, EmptyState } from '../../../shared/components/ui';
import { trackEvent } from '../../../shared/lib/analytics';

interface GiftCard {
  id: string;
  initialAmount: number;
  currentBalance: number;
  recipientEmail: string | null;
  isActive: boolean;
  expirationDate: { toDate(): Date } | null;
}

const currency = (n: number) => `$${(n ?? 0).toFixed(2)}`;

export default function GiftCards() {
  const { orgId } = useAuth();
  const [showIssue, setShowIssue] = useState(false);
  const [amount, setAmount] = useState('50');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [issuedCode, setIssuedCode] = useState<string | null>(null);

  const { data: cards, loading, error } = useFirestoreQuery<GiftCard>(db, 'giftCards', {
    where: [['orgId', '==', orgId]],
    orderBy: [['createdAt', 'desc']],
    limit: 100,
    enabled: !!orgId,
  });

  const { call: issue, loading: issuing, error: issueError } = useCallable<object, { code: string; amount: number }>('issueGiftCard');

  const outstanding = cards.reduce((s, c) => s + (c.isActive ? c.currentBalance : 0), 0);
  const totalIssued = cards.reduce((s, c) => s + c.initialAmount, 0);

  const handleIssue = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    const result = await issue({ orgId, amount: amt, recipientEmail: recipientEmail || undefined });
    if (result) {
      trackEvent('gift_card_issued', { amount: amt });
      setIssuedCode(result.code);
      setShowIssue(false);
      setRecipientEmail('');
    }
  };

  if (error) return <Alert kind="error" title="Couldn't load gift cards">{error.message}</Alert>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Gift Cards</h1>
          <p className="text-sm text-gray-500">Issue cards and track outstanding balances.</p>
        </div>
        <Button onClick={() => setShowIssue(true)}>Issue Gift Card</Button>
      </div>

      {issuedCode && (
        <Alert kind="success" title="Gift card issued">
          Code: <code className="font-mono font-bold">{issuedCode}</code> — share this with the purchaser.
          <button className="underline ml-2" onClick={() => setIssuedCode(null)}>dismiss</button>
        </Alert>
      )}

      {loading ? (
        <Skeleton rows={4} />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Outstanding Liability" value={currency(outstanding)} sub="unredeemed balance" />
            <StatCard label="Total Issued" value={currency(totalIssued)} sub={`${cards.length} cards`} />
            <StatCard
              label="Redemption Rate"
              value={totalIssued > 0 ? `${Math.round(((totalIssued - outstanding) / totalIssued) * 100)}%` : '—'}
            />
          </div>

          <Card title="Recent Gift Cards">
            {cards.length === 0 ? (
              <EmptyState message="No gift cards issued yet." />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                    <th className="py-2 pr-4">Code</th>
                    <th className="py-2 pr-4 text-right">Original</th>
                    <th className="py-2 pr-4 text-right">Balance</th>
                    <th className="py-2 pr-4">Recipient</th>
                    <th className="py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 pr-4 font-mono text-xs">{c.id}</td>
                      <td className="py-2 pr-4 text-right">{currency(c.initialAmount)}</td>
                      <td className="py-2 pr-4 text-right font-medium">{currency(c.currentBalance)}</td>
                      <td className="py-2 pr-4 text-gray-500">{c.recipientEmail || '—'}</td>
                      <td className="py-2 text-right">
                        <Badge color={!c.isActive ? 'gray' : c.currentBalance === 0 ? 'gray' : 'green'}>
                          {!c.isActive ? 'inactive' : c.currentBalance === 0 ? 'fully used' : 'active'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}

      <Modal
        open={showIssue}
        onClose={() => setShowIssue(false)}
        title="Issue Gift Card"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowIssue(false)}>Cancel</Button>
            <Button onClick={handleIssue} loading={issuing}>Issue</Button>
          </>
        }
      >
        <div className="space-y-4">
          {issueError && <Alert kind="error">{issueError.message}</Alert>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
            <div className="flex gap-2 mb-2">
              {['25', '50', '100'].map((preset) => (
                <button
                  key={preset}
                  className={`px-3 py-1.5 text-sm rounded border ${amount === preset ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200'}`}
                  onClick={() => setAmount(preset)}
                >
                  ${preset}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              max="10000"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient email (optional)</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="recipient@example.com"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
