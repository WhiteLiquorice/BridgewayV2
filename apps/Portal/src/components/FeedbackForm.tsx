/**
 * Post-appointment feedback form — completable in under a minute.
 * (Tier 3, Feedback System)
 */
import React, { useState } from 'react';
import { useCallable } from '../../../shared/hooks/useCallable';
import { Button, Alert } from '../../../shared/components/ui';
import { trackEvent } from '../../../shared/lib/analytics';

interface FeedbackFormProps {
  orgId: string;
  appointmentId: string;
  onSubmitted?: () => void;
}

function StarPicker({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
      <div className="flex gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            onClick={() => onChange(star)}
            className={`text-3xl leading-none transition-colors ${star <= value ? 'text-amber-500' : 'text-gray-300 hover:text-amber-300'}`}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FeedbackForm({ orgId, appointmentId, onSubmitted }: FeedbackFormProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [staffRating, setStaffRating] = useState(0);
  const [comment, setComment] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { call: submit, loading, error } = useCallable<object, { ok: boolean }>('submitFeedback');

  const handleSubmit = async () => {
    if (overallRating === 0) return;
    const result = await submit({
      orgId,
      appointmentId,
      overallRating,
      serviceRating: serviceRating || undefined,
      staffRating: staffRating || undefined,
      comment: comment.trim() || undefined,
      wouldRecommend: wouldRecommend ?? undefined,
    });
    if (result) {
      trackEvent('feedback_submitted', { rating: overallRating });
      setSubmitted(true);
      onSubmitted?.();
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-10">
        <span className="text-5xl">🙏</span>
        <h2 className="text-xl font-bold text-gray-900 mt-3">Thank you!</h2>
        <p className="text-sm text-gray-500 mt-1">Your feedback helps us improve.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-md mx-auto">
      <div>
        <h2 className="text-lg font-bold text-gray-900">How was your visit?</h2>
        <p className="text-sm text-gray-500">Takes less than a minute.</p>
      </div>

      {error && (
        <Alert kind="error">
          {error.message.includes('already-exists') || error.message.includes('already')
            ? 'Feedback was already submitted for this appointment — thank you!'
            : error.message}
        </Alert>
      )}

      <StarPicker label="Overall experience *" value={overallRating} onChange={setOverallRating} />
      <StarPicker label="Service quality" value={serviceRating} onChange={setServiceRating} />
      <StarPicker label="Your provider" value={staffRating} onChange={setStaffRating} />

      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">Would you recommend us to a friend?</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setWouldRecommend(true)}
            className={`px-4 py-2 rounded-md text-sm border ${wouldRecommend === true ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}`}
          >
            👍 Yes
          </button>
          <button
            type="button"
            onClick={() => setWouldRecommend(false)}
            className={`px-4 py-2 rounded-md text-sm border ${wouldRecommend === false ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600'}`}
          >
            👎 Not yet
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Anything else? (optional)</label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          rows={3}
          maxLength={2000}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us what stood out…"
        />
      </div>

      <Button onClick={handleSubmit} loading={loading} disabled={overallRating === 0} className="w-full">
        Submit Feedback
      </Button>
    </div>
  );
}
