'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function PaymentButton({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  loading = false,
  className,
}: PaymentButtonProps) {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2';
  
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent/90',
    secondary: 'bg-surface text-text border border-gray-700 hover:bg-surface/80',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
