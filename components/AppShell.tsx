'use client';

import { ReactNode } from 'react';
import { ArrowLeft, Menu, Bell } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightAction?: ReactNode;
}

export function AppShell({
  children,
  title = 'PayChat',
  showBackButton = false,
  onBackClick,
  rightAction,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg flex flex-col max-w-xl mx-auto">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header 
        className="glass-card rounded-none border-x-0 border-t-0 px-4 py-3 flex items-center justify-between sticky top-0 z-50"
        role="banner"
      >
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <button
              onClick={onBackClick}
              className="p-2 hover:bg-surface-hover focus:bg-surface-hover rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </button>
          ) : (
            <button 
              className="p-2 hover:bg-surface-hover focus:bg-surface-hover rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
          <h1 className="text-heading text-text" id="page-title">{title}</h1>
        </div>
        
        {rightAction || (
          <button 
            className="p-2 hover:bg-surface-hover focus:bg-surface-hover rounded-lg transition-colors duration-200 relative focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label="Notifications (1 unread)"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            <span 
              className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
              aria-hidden="true"
            ></span>
          </button>
        )}
      </header>

      {/* Main Content */}
      <main 
        id="main-content"
        className="flex-1 flex flex-col"
        role="main"
        aria-labelledby="page-title"
      >
        {children}
      </main>
    </div>
  );
}
