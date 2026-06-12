/**
 * Floating bulk-action bar — appears when rows are selected.
 * (Tier 2, Bulk Operations)
 */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCallable } from '../../../shared/hooks/useCallable';
import { Button, ConfirmDialog, Modal } from '../../../shared/components/ui';
import { trackEvent } from '../../../shared/lib/analytics';

interface BulkActionBarProps {
  selectedCount: number;
  selectedIds: string[];
  collection: 'clients' | 'appointments' | 'services' | 'inventory';
  onDone: () => void;
}

export default function BulkActionBar({ selectedCount, selectedIds, collection, onDone }: BulkActionBarProps) {
  const { orgId } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const { call: bulkDelete, loading: deleting } = useCallable<object, { deleted: number }>('bulkDelete');
  const { call: bulkTag, loading: tagging } = useCallable<object, { tagged: number }>('bulkTag');

  if (selectedCount === 0) return null;

  const runDelete = async () => {
    const result = await bulkDelete({ orgId, collection, ids: selectedIds });
    if (result) {
      trackEvent('bulk_operation', { operation: 'delete', collection, count: result.deleted });
      setStatus(`Archived ${result.deleted} record(s).`);
      onDone();
    }
  };

  const runTag = async () => {
    const tags = tagInput.split(',').map((t) => t.trim()).filter(Boolean);
    if (tags.length === 0) return;
    const result = await bulkTag({ orgId, ids: selectedIds, tags });
    if (result) {
      trackEvent('bulk_operation', { operation: 'tag', collection, count: result.tagged });
      setStatus(`Tagged ${result.tagged} client(s).`);
      setShowTag(false);
      setTagInput('');
      onDone();
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-gray-900 text-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
        <span className="text-sm font-medium">{selectedCount} selected</span>
        {collection === 'clients' && (
          <Button size="sm" variant="secondary" onClick={() => setShowTag(true)}>
            Add Tags
          </Button>
        )}
        <Button size="sm" variant="danger" onClick={() => setConfirmDelete(true)} loading={deleting}>
          Archive
        </Button>
        <button className="text-gray-400 hover:text-white text-sm" onClick={onDone}>
          Clear
        </button>
      </div>

      {status && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-green-600 text-white text-sm rounded-md px-3 py-2 shadow">
          {status}
          <button className="ml-2 underline" onClick={() => setStatus(null)}>dismiss</button>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={runDelete}
        title={`Archive ${selectedCount} record(s)?`}
        message="Records are soft-deleted and recoverable for 30 days, then purged permanently."
        confirmLabel="Archive"
        danger
      />

      <Modal
        open={showTag}
        onClose={() => setShowTag(false)}
        title={`Tag ${selectedCount} client(s)`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowTag(false)}>Cancel</Button>
            <Button onClick={runTag} loading={tagging} disabled={!tagInput.trim()}>Apply Tags</Button>
          </>
        }
      >
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="vip, summer-promo"
        />
      </Modal>
    </>
  );
}

