/**
 * TemplateComponent
 *
 * TODO: Update this description with your component's purpose
 *
 * Usage:
 * <TemplateComponent
 *   items={data}
 *   onSelect={handleSelect}
 *   loading={isLoading}
 * />
 */

import React, { useState } from 'react';

interface TemplateComponentProps {
  // TODO: Replace with your prop types
  items: Array<{ id: string; name: string }>;
  onSelect?: (id: string) => void;
  loading?: boolean;
  error?: Error | null;
  className?: string;
}

export default function TemplateComponent({
  items,
  onSelect,
  loading = false,
  error = null,
  className = '',
}: TemplateComponentProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelect?.(id);
  };

  // Loading state
  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        {/* TODO: Replace with your loading skeleton */}
        <div className="h-10 bg-gray-200 rounded mb-4" />
        <div className="h-10 bg-gray-200 rounded mb-4" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded ${className}`}>
        <h3 className="text-sm font-semibold text-red-900 mb-1">Error Loading Data</h3>
        <p className="text-sm text-red-700">{error.message}</p>
      </div>
    );
  }

  // Empty state
  if (!items || items.length === 0) {
    return (
      <div className={`p-8 text-center text-gray-500 ${className}`}>
        <p>No items to display</p>
      </div>
    );
  }

  // Main render
  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleSelect(item.id)}
          className={`
            w-full px-4 py-2 text-left rounded border transition-colors
            ${
              selectedId === item.id
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

/**
 * Loading skeleton component for better UX
 *
 * Usage:
 * <TemplateComponentSkeleton count={3} />
 */
export function TemplateComponentSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  );
}
