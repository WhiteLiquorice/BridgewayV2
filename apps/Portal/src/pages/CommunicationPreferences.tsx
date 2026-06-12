/**
 * Client communication preferences — opt-in/out per channel.
 * (Tier 1, Marketing Campaigns — compliance requirement)
 */
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Alert, Skeleton } from '../../../shared/components/ui';

export default function CommunicationPreferences() {
  const { clientId } = useAuth(); // portal session exposes the client record id
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [smsOptIn, setSmsOptIn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;
    getDoc(doc(db, 'clients', clientId))
      .then((snap) => {
        if (snap.exists()) {
          setEmailOptIn(snap.data().emailOptIn !== false);
          setSmsOptIn(snap.data().smsOptIn !== false);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [clientId]);

  const save = async () => {
    if (!clientId) return;
    setSaving(true);
    setError(null);
    try {
      await updateDoc(doc(db, 'clients', clientId), {
        emailOptIn,
        smsOptIn,
        subscriptionStatus: emailOptIn || smsOptIn ? 'subscribed' : 'unsubscribed',
        updatedAt: serverTimestamp(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton rows={3} />;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Communication Preferences</h1>
        <p className="text-sm text-gray-500">Choose how we can reach you. Appointment confirmations are always sent.</p>
      </div>

      {error && <Alert kind="error">{error}</Alert>}
      {saved && <Alert kind="success">Preferences saved.</Alert>}

      <Card>
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailOptIn}
              onChange={(e) => setEmailOptIn(e.target.checked)}
              className="mt-1 h-4 w-4 text-indigo-600 rounded"
            />
            <span>
              <span className="block text-sm font-medium text-gray-900">Email</span>
              <span className="block text-xs text-gray-500">
                Reminders, offers, and updates by email.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={smsOptIn}
              onChange={(e) => setSmsOptIn(e.target.checked)}
              className="mt-1 h-4 w-4 text-indigo-600 rounded"
            />
            <span>
              <span className="block text-sm font-medium text-gray-900">Text messages (SMS)</span>
              <span className="block text-xs text-gray-500">
                Appointment reminders and time-sensitive offers. Message rates may apply.
              </span>
            </span>
          </label>
        </div>
      </Card>

      <Button onClick={save} loading={saving}>Save Preferences</Button>
    </div>
  );
}

