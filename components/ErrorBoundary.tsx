'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home, X } from 'lucide-react';
import { PaymentButton } from './PaymentButton';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
  goHome?: () => void;
}

function DefaultErrorFallback({ error, resetError, goHome }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="glass-card p-8 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-error" />
        </div>
        
        <h2 className="text-heading text-text mb-4">Something went wrong!</h2>
        
        <p className="text-body text-text-secondary mb-6">
          We encountered an unexpected error. This has been logged and we'll look into it.
        </p>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left mb-6 p-4 bg-bg rounded-lg border border-error/20">
            <summary className="text-caption font-medium text-error cursor-pointer mb-2">
              Error Details (Development)
            </summary>
            <pre className="text-xs text-text-muted overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        <div className="flex gap-3">
          <PaymentButton
            variant="secondary"
            onClick={resetError}
            className="flex-1"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </PaymentButton>
          
          {goHome && (
            <PaymentButton
              variant="primary"
              onClick={goHome}
              className="flex-1"
            >
              <Home className="w-4 h-4" />
              Go Home
            </PaymentButton>
          )}
        </div>
      </div>
    </div>
  );
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
    
    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  goHome = () => {
    this.resetError();
    // Navigate to home - in a real app you'd use router
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
          goHome={this.goHome}
        />
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to handle errors
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    console.error('Error caught by error handler:', error, errorInfo);
    
    // In a real app, you might want to show a toast notification
    // or trigger a global error state
  };
}

// Error notification component for non-critical errors
interface ErrorNotificationProps {
  message: string;
  type?: 'error' | 'warning';
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function ErrorNotification({ 
  message, 
  type = 'error', 
  onDismiss, 
  action 
}: ErrorNotificationProps) {
  const bgColor = type === 'error' ? 'bg-error/10 border-error/20' : 'bg-warning/10 border-warning/20';
  const textColor = type === 'error' ? 'text-error' : 'text-warning';
  const iconColor = type === 'error' ? 'text-error' : 'text-warning';

  return (
    <div className={`glass-card p-4 border ${bgColor} animate-slide-up`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <p className={`text-body ${textColor}`}>{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className={`text-caption ${textColor} underline hover:no-underline mt-1`}
            >
              {action.label}
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`${textColor} hover:opacity-70 transition-opacity duration-200`}
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
