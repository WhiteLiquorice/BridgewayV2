import React, { useState } from 'react';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, notes: string) => Promise<void>;
  clientName?: string;
}

const CANCEL_REASONS = [
  'Schedule Conflict',
  'Financial Reasons',
  'Feeling Unwell',
  'Found Another Provider',
  'No-Show',
  'Other'
];

export function CancelModal({ isOpen, onClose, onConfirm, clientName }: CancelModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedReason) return;
    setIsSubmitting(true);
    try {
      await onConfirm(selectedReason, notes);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Cancel Appointment</h2>
          <p className="text-sm text-gray-400 mt-1">
            {clientName ? `Cancelling appointment for ${clientName}` : 'You are about to cancel this appointment.'}
          </p>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Why is this being cancelled?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CANCEL_REASONS.map(reason => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`px-3 py-2 text-sm rounded-lg border text-left transition-colors ${
                    selectedReason === reason 
                      ? 'bg-red-500/20 border-red-500 text-red-400' 
                      : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Additional Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder="Any details about why they cancelled..."
              rows={3}
            />
          </div>
        </div>

        <div className="p-5 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Keep Appointment
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedReason || isSubmitting}
            className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cancelling...
              </>
            ) : 'Confirm Cancellation'}
          </button>
        </div>
      </div>
    </div>
  );
}
