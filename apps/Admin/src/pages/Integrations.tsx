/**
 * Integration Hub — webhook endpoint management. (Tier 3, Integration Hub)
 */
import React, { useState } from 'react';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useFirestoreQuery } from '../../../shared/hooks/useFirestoreQuery';
import { Card, Badge, Button, Modal, Skeleton, Alert, EmptyState } from '../../../shared/components/ui';

const EVENT_OPTIONS = [
  'appointment.created',
  'appointment.completed',
  'appointment.cancelled',
  'appointment.no_show',
  'client.created',
  'payment.received',
  'feedback.submitted',
  'giftcard.issued',
  'giftcard.redeemed',
];

interface Integration {
  id: string;
  name: string;
  webhookUrl: string;
  events: string[];
  isActive: boolean;
}

function generateSecret(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export default function Integrations() {
  const { orgId } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState<string[]>([]);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: integrations, loading, error } = useFirestoreQuery<Integration>(db, 'integrations', {
    where: [['orgId', '==', orgId]],
    enabled: !!orgId,
  });

  const create = async () => {
    if (!name.trim() || !url.trim().startsWith('https://')) return;
    setSaving(true);
    try {
      const secret = generateSecret();
      await addDoc(collection(db, 'integrations'), {
        orgId,
        name: name.trim(),
        provider: 'webhook',
        webhookUrl: url.trim(),
        events,
        secret,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setNewSecret(secret);
      setShowCreate(false);
      setName('');
      setUrl('');
      setEvents([]);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (integration: Integration) => {
    await updateDoc(doc(db, 'integrations', integration.id), {
      isActive: !integration.isActive,
      updatedAt: serverTimestamp(),
    });
  };

  if (error) return <Alert kind="error" title="Couldn't load integrations">{error.message}</Alert>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Integrations</h1>
          <p className="text-sm text-gray-500">
            Webhooks fire on app events — connect Zapier, Make, or your own endpoints.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>Add Webhook</Button>
      </div>

      {newSecret && (
        <Alert kind="success" title="Webhook created — save this signing secret now">
          <code className="font-mono text-xs break-all">{newSecret}</code>
          <p className="mt-1 text-xs">
            Verify deliveries by comparing the <code>X-Bridgeway-Signature</code> header to an HMAC-SHA256 of the body
            using this secret. It won't be shown again.
          </p>
          <button className="underline" onClick={() => setNewSecret(null)}>dismiss</button>
        </Alert>
      )}

      {loading ? (
        <Skeleton rows={3} />
      ) : integrations.length === 0 ? (
        <Card>
          <EmptyState
            message="No integrations yet. Tip: a Zapier 'Catch Hook' URL connects Bridgeway to 5,000+ apps."
            action={<Button onClick={() => setShowCreate(true)}>Add your first webhook</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {integrations.map((i) => (
            <Card key={i.id}>
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{i.name}</span>
                    <Badge color={i.isActive ? 'green' : 'gray'}>{i.isActive ? 'Active' : 'Disabled'}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{i.webhookUrl}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {i.events?.length ? i.events.join(', ') : 'all events'}
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => toggle(i)}>
                  {i.isActive ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Add Webhook"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={create} loading={saving} disabled={!name.trim() || !url.trim().startsWith('https://')}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Zapier — new bookings to Slack"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL (https required)</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://hooks.zapier.com/hooks/catch/…"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Events (none = all)</label>
            <div className="grid grid-cols-2 gap-1.5">
              {EVENT_OPTIONS.map((ev) => (
                <label key={ev} className="flex items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={events.includes(ev)}
                    onChange={(e) =>
                      setEvents((prev) => (e.target.checked ? [...prev, ev] : prev.filter((x) => x !== ev)))
                    }
                  />
                  <code>{ev}</code>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

