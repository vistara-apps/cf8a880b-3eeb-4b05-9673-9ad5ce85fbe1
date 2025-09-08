'use client';

import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'avatar' | 'card' | 'button';
  lines?: number;
}

export function LoadingSkeleton({ 
  className, 
  variant = 'text',
  lines = 1 
}: LoadingSkeletonProps) {
  const baseClasses = 'loading-shimmer rounded';
  
  const variantClasses = {
    text: 'h-4 w-full',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-24 w-full',
    button: 'h-10 w-24',
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              index === lines - 1 && 'w-3/4', // Last line shorter
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
    />
  );
}

// Specific skeleton components for common use cases
export function TransactionSkeleton() {
  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <LoadingSkeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton className="h-4 w-32" />
          <LoadingSkeleton className="h-3 w-24" />
        </div>
        <LoadingSkeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

export function ChatMessageSkeleton({ sent = false }: { sent?: boolean }) {
  return (
    <div className={cn(
      'flex gap-3',
      sent ? 'justify-end' : 'justify-start'
    )}>
      {!sent && <LoadingSkeleton variant="avatar" className="h-8 w-8" />}
      <div className={cn(
        'bg-surface/95 rounded-2xl p-4 max-w-xs space-y-2',
        sent && 'bg-primary/20'
      )}>
        <LoadingSkeleton lines={2} />
      </div>
      {sent && <LoadingSkeleton variant="avatar" className="h-8 w-8" />}
    </div>
  );
}
