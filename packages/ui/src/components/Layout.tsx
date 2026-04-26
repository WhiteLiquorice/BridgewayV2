import React from 'react';

interface LayoutProps {
  sidebar: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
}

export function Layout({ sidebar, header, children }: LayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bw-bg)] selection:bg-amber-500/30">
      {/* Sidebar Area - Clean, solid, touching edges */}
      <aside className="w-64 flex-shrink-0 border-r border-[var(--lt-surface-border)] bg-[var(--bw-sidebar)] overflow-hidden flex flex-col z-10 shadow-sm">
        {sidebar}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-[var(--bw-bg)]">
        {header && (
          <header className="h-16 flex-shrink-0 flex items-center px-8 z-10 border-b border-[var(--lt-surface-border)] bg-[var(--bw-sidebar)]">
            {header}
          </header>
        )}
        
        <main className="flex-1 overflow-y-auto p-8 z-0">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
