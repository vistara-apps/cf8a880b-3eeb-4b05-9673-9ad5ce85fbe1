'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { AgentChat } from '@/components/AgentChat';
import { TransactionHistory } from '@/components/TransactionHistory';
import { PaymentModal } from '@/components/PaymentModal';
import { PaymentRequests } from '@/components/PaymentRequests';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Transaction } from '@/lib/types';
import { generateTransactionId } from '@/lib/utils';
import { MessageCircle, History, Wallet as WalletIcon, Users } from 'lucide-react';

export default function PayChatApp() {
  const { setFrameReady } = useMiniKit();
  const [activeTab, setActiveTab] = useState<'chat' | 'history' | 'requests' | 'wallet'>('chat');
  const [currentUserId] = useState('user123'); // Mock current user
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    data?: any;
  }>({ isOpen: false });
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setFrameReady();
    fetchTransactions();
  }, [setFrameReady]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/transactions?userId=${currentUserId}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions.map((tx: any) => ({
          ...tx,
          timestamp: new Date(tx.timestamp),
        })));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentInitiated = (paymentData: any) => {
    setPaymentModal({
      isOpen: true,
      data: paymentData,
    });
  };

  const handleSplitInitiated = async (splitData: any) => {
    try {
      // Create payment request via API
      const response = await fetch('/api/payment-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestorUserId: currentUserId,
          description: splitData.description || 'Split payment',
          totalAmount: splitData.totalAmount,
          currency: 'ETH',
          participants: splitData.participants,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Payment request created:', data.paymentRequest);
        // You could show a success message or update UI here
      } else {
        console.error('Failed to create payment request');
      }
    } catch (error) {
      console.error('Error creating payment request:', error);
    }
  };

  const handlePaymentConfirm = async () => {
    if (!paymentModal.data) return;
    
    try {
      // Create transaction via API
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUserId: currentUserId,
          toUserId: paymentModal.data.recipient,
          amount: paymentModal.data.amount,
          currency: paymentModal.data.currency,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newTransaction = {
          ...data.transaction,
          timestamp: new Date(data.transaction.timestamp),
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
        setPaymentModal({ isOpen: false });
        
        // Refresh transactions to get updates
        setTimeout(() => {
          fetchTransactions();
        }, 6000);
      } else {
        console.error('Failed to create transaction');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleTransactionClick = (transaction: Transaction) => {
    // Handle transaction details view
    console.log('Transaction clicked:', transaction);
  };

  const tabs = [
    { id: 'chat' as const, label: 'Chat', icon: MessageCircle },
    { id: 'history' as const, label: 'History', icon: History },
    { id: 'requests' as const, label: 'Requests', icon: Users },
    { id: 'wallet' as const, label: 'Wallet', icon: WalletIcon },
  ];

  const getTitle = () => {
    switch (activeTab) {
      case 'chat': return 'PayChat';
      case 'history': return 'Transaction History';
      case 'requests': return 'Payment Requests';
      case 'wallet': return 'Wallet';
      default: return 'PayChat';
    }
  };

  return (
    <AppShell
      title={getTitle()}
      rightAction={
        activeTab === 'wallet' ? (
          <Wallet>
            <ConnectWallet>
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
          </Wallet>
        ) : undefined
      }
    >
      {/* Tab Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'chat' && (
          <AgentChat
            currentUserId={currentUserId}
            onPaymentInitiated={handlePaymentInitiated}
            onSplitInitiated={handleSplitInitiated}
          />
        )}
        
        {activeTab === 'history' && (
          <TransactionHistory
            transactions={transactions}
            currentUserId={currentUserId}
            onTransactionClick={handleTransactionClick}
            isLoading={isLoading}
          />
        )}
        
        {activeTab === 'requests' && (
          <PaymentRequests
            currentUserId={currentUserId}
            onPaymentMade={(requestId, amount) => {
              console.log('Payment made:', requestId, amount);
              // Refresh transactions when a payment is made
              fetchTransactions();
            }}
          />
        )}
        
        {activeTab === 'wallet' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="glass-card p-8 text-center max-w-sm w-full">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <WalletIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-heading text-text mb-4">Connect Your Wallet</h2>
              <p className="text-body text-text-secondary mb-6">
                Connect your wallet to start sending and receiving payments on Base.
              </p>
              <Wallet>
                <ConnectWallet className="w-full">
                  <Avatar className="h-6 w-6" />
                  <Name />
                </ConnectWallet>
              </Wallet>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="glass-card rounded-none border-x-0 border-b-0 p-4">
        <div className="flex justify-around">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors duration-200 ${
                activeTab === id
                  ? 'text-primary bg-primary/10'
                  : 'text-text-secondary hover:text-text hover:bg-surface'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false })}
        paymentData={paymentModal.data}
        onConfirm={handlePaymentConfirm}
      />
    </AppShell>
  );
}
