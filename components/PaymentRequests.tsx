'use client';

import { useState, useEffect } from 'react';
import { PaymentRequest } from '@/lib/types';
import { PaymentButton } from './PaymentButton';
import { UserAvatar } from './UserAvatar';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentRequestsProps {
  currentUserId: string;
  onPaymentMade?: (requestId: string, amount: string) => void;
}

export function PaymentRequests({ currentUserId, onPaymentMade }: PaymentRequestsProps) {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPaymentRequests();
  }, [currentUserId]);

  const fetchPaymentRequests = async () => {
    try {
      const response = await fetch(`/api/payment-requests?userId=${currentUserId}`);
      if (response.ok) {
        const data = await response.json();
        setPaymentRequests(data.paymentRequests.map((req: any) => ({
          ...req,
          dueDate: req.dueDate ? new Date(req.dueDate) : undefined,
        })));
      }
    } catch (error) {
      console.error('Error fetching payment requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayShare = async (request: PaymentRequest) => {
    const shareAmount = (parseFloat(request.totalAmount) / request.participants.length).toFixed(6);
    
    try {
      // Create transaction for the share
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUserId: currentUserId,
          toUserId: request.requestorUserId,
          amount: shareAmount,
          currency: request.currency,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onPaymentMade?.(request.requestId, shareAmount);
        
        // Update the payment request with the new payment
        const updatedPayments = [...request.payments, data.transaction];
        const updatedRequest = { ...request, payments: updatedPayments };
        
        // Check if all participants have paid
        const allPaid = updatedRequest.participants.every(participantId => 
          updatedPayments.some(payment => payment.fromUserId === participantId)
        );
        
        if (allPaid) {
          // Mark request as completed
          await fetch('/api/payment-requests', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              requestId: request.requestId,
              status: 'completed',
            }),
          });
        }
        
        // Refresh the list
        fetchPaymentRequests();
      }
    } catch (error) {
      console.error('Error paying share:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const hasUserPaid = (request: PaymentRequest) => {
    return request.payments.some(payment => payment.fromUserId === currentUserId);
  };

  const getPaidCount = (request: PaymentRequest) => {
    return request.payments.filter(payment => payment.status === 'completed').length;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-body text-text-secondary">Loading payment requests...</p>
      </div>
    );
  }

  if (paymentRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-text-secondary" />
        </div>
        <h3 className="text-heading text-text mb-2">No payment requests</h3>
        <p className="text-body text-text-secondary">
          Create a split payment in chat to see requests here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {paymentRequests.map((request) => {
        const shareAmount = (parseFloat(request.totalAmount) / request.participants.length).toFixed(6);
        const paidCount = getPaidCount(request);
        const userPaid = hasUserPaid(request);
        
        return (
          <div key={request.requestId} className="glass-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(request.status)}
                <h3 className="text-heading text-text">{request.description}</h3>
              </div>
              <div className="text-right">
                <div className="text-sm text-text-secondary">Total</div>
                <div className="text-heading text-text">
                  {request.totalAmount} {request.currency}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-text-secondary" />
                <span className="text-sm text-text-secondary">
                  {paidCount}/{request.participants.length} paid
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-text-secondary">Your share</div>
                <div className="text-body text-text">
                  {shareAmount} {request.currency}
                </div>
              </div>
            </div>

            {request.status === 'active' && !userPaid && (
              <PaymentButton
                variant="primary"
                onClick={() => handlePayShare(request)}
                className="w-full"
              >
                Pay My Share ({shareAmount} {request.currency})
              </PaymentButton>
            )}

            {userPaid && (
              <div className="flex items-center justify-center gap-2 p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">You've paid your share</span>
              </div>
            )}

            {request.status === 'completed' && (
              <div className="flex items-center justify-center gap-2 p-2 bg-primary/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">Payment request completed</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
