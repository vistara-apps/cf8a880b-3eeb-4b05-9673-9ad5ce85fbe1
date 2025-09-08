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
      {/* Header */}
      <header className="glass-card rounded-none border-x-0 border-t-0 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <button
              onClick={onBackClick}
              className="p-2 hover:bg-surface rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button className="p-2 hover:bg-surface rounded-lg transition-colors duration-200">
              <Menu className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-heading text-text">{title}</h1>
        </div>
        
        {rightAction || (
          <button className="p-2 hover:bg-surface rounded-lg transition-colors duration-200 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
