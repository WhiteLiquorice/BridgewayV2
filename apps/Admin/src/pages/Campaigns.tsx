/**
 * Marketing Campaigns — list, create, enable/disable.
 * (Tier 1, Marketing Campaigns)
 */
import React, { useState } from 'react';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useFirestoreQuery } from '../../../shared/hooks/useFirestoreQuery';
import { Card, Badge, Button, Modal, Skeleton, Alert, EmptyState } from '../../../shared/components/ui';
import { trackEvent } from '../../../shared/lib/analytics';

interface Campaign {
  id: string;
  name: string;
  templateKey: string;
  trigger: string;
  triggerParams: Record<string, unknown>;
  channels: string[];
  enabled: boolean;
}

const CAMPAIGN_TYPES = [
  { templateKey: 'no_show_recovery', trigger: 'no_show', label: 'No-Show Recovery', description: 'Email clients who missed an appointment with a reschedule link.' },
  { templateKey: 'appointment_reminder', trigger: 'appointment_reminder', label: 'Appointment Reminder', description: 'Remind clients 24 hours before their appointment.' },
  { templateKey: 'service_upsell', trigger: 'service_completed', label: 'Service Upsell', description: 'Suggest a related service after a completed visit.' },
  { templateKey: 'win_back', trigger: 'days_inactive', label: 'Win-Back (60d inactive)', description: 'Offer a discount to clients inactive for 60+ days.' },
  { templateKey: 'birthday_special', trigger: 'birthday', label: 'Birthday Special', description: 'Send a birthday offer on the client\'s birthday.' },
];

export default function Campaigns() {
  const { orgId } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [typeIdx, setTypeIdx] = useState(0);
  const [channels, setChannels] = useState<string[]>(['email']);
  const [offerText, setOfferText] = useState('10% off');
  const [saving, setSaving] = useState(false);

  const { data: campaigns, loading, error } = useFirestoreQuery<Campaign>(db, 'campaigns', {
    where: [['orgId', '==', orgId]],
    orderBy: [['createdAt', 'desc']],
    enabled: !!orgId,
  });

  const createCampaign = async () => {
    if (!name.trim() || !orgId) return;
    setSaving(true);
    try {
      const type = CAMPAIGN_TYPES[typeIdx];
      await addDoc(collection(db, 'campaigns'), {
        orgId,
        name: name.trim(),
        templateKey: type.templateKey,
        trigger: type.trigger,
        triggerParams: type.trigger === 'days_inactive' ? { daysInactive: 60, offerText } : { offerText },
        channels,
        enabled: false, // start paused; owner flips on when ready
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      trackEvent('campaign_created', { type: type.templateKey });
      setShowCreate(false);
      setName('');
    } finally {
      setSaving(false);
    }
  };

  const toggleEnabled = async (campaign: Campaign) => {
    await updateDoc(doc(db, 'campaigns', campaign.id), {
      enabled: !campaign.enabled,
      updatedAt: serverTimestamp(),
    });
  };

  if (error) return <Alert kind="error" title="Couldn't load campaigns">{error.message}</Alert>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Marketing Campaigns</h1>
          <p className="text-sm text-gray-500">Automated email and SMS triggered by client activity. Runs hourly.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>New Campaign</Button>
      </div>

      {loading ? (
        <Skeleton rows={3} />
      ) : campaigns.length === 0 ? (
        <Card>
          <EmptyState
            message="No campaigns yet. Start with No-Show Recovery — it usually pays for itself in the first week."
            action={<Button onClick={() => setShowCreate(true)}>Create your first campaign</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <Card key={c.id}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{c.name}</span>
                    <Badge color={c.enabled ? 'green' : 'gray'}>{c.enabled ? 'Active' : 'Paused'}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {CAMPAIGN_TYPES.find((t) => t.templateKey === c.templateKey)?.label || c.templateKey} ·{' '}
                    {(c.channels || []).join(' + ')}
                  </p>
                </div>
                <Button variant={c.enabled ? 'secondary' : 'primary'} size="sm" onClick={() => toggleEnabled(c)}>
                  {c.enabled ? 'Pause' : 'Activate'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="New Campaign"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={createCampaign} loading={saving} disabled={!name.trim()}>Create (paused)</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign name</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Win back lapsed clients"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <div className="space-y-2">
              {CAMPAIGN_TYPES.map((t, i) => (
                <label key={t.templateKey} className={`flex items-start gap-2 p-2 rounded border cursor-pointer ${typeIdx === i ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200'}`}>
                  <input type="radio" checked={typeIdx === i} onChange={() => setTypeIdx(i)} className="mt-1" />
                  <span>
                    <span className="text-sm font-medium text-gray-900 block">{t.label}</span>
                    <span className="text-xs text-gray-500">{t.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Channels</label>
            <div className="flex gap-4">
              {['email', 'sms'].map((ch) => (
                <label key={ch} className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={channels.includes(ch)}
                    onChange={(e) =>
                      setChannels((prev) => (e.target.checked ? [...prev, ch] : prev.filter((c) => c !== ch)))
                    }
                  />
                  {ch.toUpperCase()}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Offer text (for win-back/birthday)</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={offerText}
              onChange={(e) => setOfferText(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

