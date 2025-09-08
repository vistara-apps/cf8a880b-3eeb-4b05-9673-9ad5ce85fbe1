'use client';

import { cn } from '@/lib/utils';
import { Loader2, Check } from 'lucide-react';
import { useState } from 'react';

interface PaymentButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  success?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function PaymentButton({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  success = false,
  className,
  'aria-label': ariaLabel,
}: PaymentButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = 'font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg relative overflow-hidden';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-lg',
  };
  
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent-hover focus:ring-accent/50 active:bg-accent-hover',
    secondary: 'bg-surface text-text border border-gray-700/50 hover:bg-surface-hover focus:ring-gray-500/50 active:bg-surface-hover',
    success: 'bg-success text-white hover:bg-success/90 focus:ring-success/50 active:bg-success/90',
    warning: 'bg-warning text-white hover:bg-warning/90 focus:ring-warning/50 active:bg-warning/90',
    error: 'bg-error text-white hover:bg-error/90 focus:ring-error/50 active:bg-error/90',
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        isPressed && !disabled && !loading && 'scale-95',
        loading && 'cursor-wait',
        success && 'bg-success hover:bg-success/90',
        className
      )}
    >
      {/* Ripple effect */}
      <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-200 hover:opacity-100 rounded-inherit" />
      
      {/* Content */}
      <span className="relative flex items-center gap-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {success && !loading && <Check className="w-4 h-4" />}
        {!loading && children}
      </span>
    </button>
  );
}
