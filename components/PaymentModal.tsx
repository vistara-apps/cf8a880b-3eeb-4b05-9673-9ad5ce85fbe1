'use client';

import { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { PaymentButton } from './PaymentButton';
import { UserAvatar } from './UserAvatar';
import { formatAmount } from '@/lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: {
    recipient: string;
    amount: string;
    currency: string;
  };
  onConfirm: () => Promise<void>;
}

export function PaymentModal({
  isOpen,
  onClose,
  paymentData,
  onConfirm,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsProcessing(true);
    setStatus('processing');
    
    try {
      await onConfirm();
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      setStatus('error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card w-full max-w-sm animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-heading text-text">Confirm Payment</h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 hover:bg-surface rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {status === 'idle' && (
            <>
              <div className="text-center mb-6">
                <UserAvatar
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${paymentData.recipient}`}
                  alt={paymentData.recipient}
                  size="large"
                  className="mx-auto mb-3"
                />
                <h3 className="text-heading text-text mb-1">
                  Send to @{paymentData.recipient}
                </h3>
                <p className="text-display text-primary">
                  {formatAmount(paymentData.amount, paymentData.currency)}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-body">
                  <span className="text-text-secondary">Amount</span>
                  <span className="text-text">{formatAmount(paymentData.amount, paymentData.currency)}</span>
                </div>
                <div className="flex justify-between text-body">
                  <span className="text-text-secondary">Network Fee</span>
                  <span className="text-text">~0.0001 ETH</span>
                </div>
                <div className="flex justify-between text-body border-t border-gray-700 pt-3">
                  <span className="text-text font-medium">Total</span>
                  <span className="text-text font-medium">
                    {formatAmount((parseFloat(paymentData.amount) + 0.0001).toString(), paymentData.currency)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <PaymentButton
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </PaymentButton>
                <PaymentButton
                  variant="primary"
                  onClick={handleConfirm}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Confirm Payment
                </PaymentButton>
              </div>
            </>
          )}

          {status === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-heading text-text mb-2">Processing Payment</h3>
              <p className="text-body text-text-secondary">
                Please wait while we process your transaction...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-heading text-text mb-2">Payment Sent!</h3>
              <p className="text-body text-text-secondary">
                Your payment has been successfully sent to @{paymentData.recipient}
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-heading text-text mb-2">Payment Failed</h3>
              <p className="text-body text-text-secondary mb-4">
                There was an error processing your payment. Please try again.
              </p>
              <PaymentButton
                variant="primary"
                onClick={() => setStatus('idle')}
                className="w-full"
              >
                Try Again
              </PaymentButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
