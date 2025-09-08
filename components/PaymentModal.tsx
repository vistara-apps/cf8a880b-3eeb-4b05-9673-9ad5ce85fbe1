'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { PaymentButton } from './PaymentButton';
import { UserAvatar } from './UserAvatar';
import { formatAmount } from '@/lib/utils';
import { useX402Payment } from '@/lib/hooks/useX402Payment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: {
    recipient: string;
    amount: string;
    currency: 'USDC' | 'ETH';
    recipientAddress?: string; // Wallet address for x402 payments
  };
  onConfirm: (txHash?: string) => Promise<void>;
}

export function PaymentModal({
  isOpen,
  onClose,
  paymentData,
  onConfirm,
}: PaymentModalProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error' | 'confirming'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [confirmationCount, setConfirmationCount] = useState(0);
  
  const { 
    processPayment, 
    verifyPayment, 
    getTransactionStatus, 
    isProcessing, 
    error: x402Error 
  } = useX402Payment();

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!paymentData.recipientAddress) {
      setStatus('error');
      return;
    }

    setStatus('processing');
    
    try {
      // Process x402 payment
      const result = await processPayment({
        amount: paymentData.amount,
        recipient: paymentData.recipientAddress,
        currency: paymentData.currency,
        description: `PayChat payment to @${paymentData.recipient}`,
      });

      if (result.success && result.txHash) {
        setTxHash(result.txHash);
        setStatus('confirming');
        
        // Start monitoring transaction confirmations
        monitorTransaction(result.txHash);
        
        // Call parent onConfirm with transaction hash
        await onConfirm(result.txHash);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setStatus('error');
    }
  };

  const monitorTransaction = async (hash: string) => {
    try {
      // Wait for initial confirmation
      const isConfirmed = await verifyPayment(hash);
      
      if (isConfirmed) {
        setConfirmationCount(1);
        setStatus('success');
        
        // Auto-close after showing success
        setTimeout(() => {
          onClose();
          resetModal();
        }, 3000);
      } else {
        // If not confirmed, set error state
        setStatus('error');
      }
    } catch (error) {
      console.error('Transaction monitoring error:', error);
      setStatus('error');
    }
  };

  const resetModal = () => {
    setStatus('idle');
    setTxHash(null);
    setConfirmationCount(0);
  };

  // Reset modal state when it opens
  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen]);

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
                  <span className="text-text-secondary">Network</span>
                  <span className="text-text">Base L2</span>
                </div>
                <div className="flex justify-between text-body">
                  <span className="text-text-secondary">Payment Method</span>
                  <span className="text-text">x402 Protocol</span>
                </div>
                <div className="flex justify-between text-body border-t border-gray-700 pt-3">
                  <span className="text-text font-medium">Total</span>
                  <span className="text-text font-medium">
                    {formatAmount(paymentData.amount, paymentData.currency)}
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

          {status === 'confirming' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-heading text-text mb-2">Confirming Transaction</h3>
              <p className="text-body text-text-secondary mb-4">
                Waiting for blockchain confirmation...
              </p>
              {txHash && (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-text-secondary">Transaction:</span>
                  <a
                    href={`https://basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    {txHash.slice(0, 6)}...{txHash.slice(-4)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-heading text-text mb-2">Payment Confirmed!</h3>
              <p className="text-body text-text-secondary mb-4">
                Your x402 payment has been successfully sent to @{paymentData.recipient}
              </p>
              {txHash && (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-text-secondary">Transaction:</span>
                  <a
                    href={`https://basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    {txHash.slice(0, 6)}...{txHash.slice(-4)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-heading text-text mb-2">Payment Failed</h3>
              <p className="text-body text-text-secondary mb-4">
                {x402Error || 'There was an error processing your x402 payment. Please check your wallet connection and try again.'}
              </p>
              {!paymentData.recipientAddress && (
                <p className="text-body text-red-400 mb-4">
                  Recipient wallet address is required for x402 payments.
                </p>
              )}
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
