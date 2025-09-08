'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { AgentChat } from '@/components/AgentChat';
import { TransactionHistory } from '@/components/TransactionHistory';
import { PaymentModal } from '@/components/PaymentModal';
import { Transaction } from '@/lib/types';
import { generateTransactionId } from '@/lib/utils';
import { MessageCircle, History, Wallet as WalletIcon } from 'lucide-react';

export default function PayChatApp() {
  const [activeTab, setActiveTab] = useState<'chat' | 'history' | 'wallet'>('chat');
  const [currentUserId] = useState('user123'); // Mock current user
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    data?: any;
  }>({ isOpen: false });
  
  // Mock transaction data
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      transactionId: 'tx_1',
      fromUserId: 'alice',
      toUserId: 'user123',
      amount: '0.05',
      currency: 'ETH',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      status: 'completed',
      txHash: '0x1234567890abcdef',
    },
    {
      transactionId: 'tx_2',
      fromUserId: 'user123',
      toUserId: 'bob',
      amount: '0.02',
      currency: 'ETH',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'completed',
      txHash: '0xabcdef1234567890',
    },
    {
      transactionId: 'tx_3',
      fromUserId: 'user123',
      toUserId: 'charlie',
      amount: '0.01',
      currency: 'ETH',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      status: 'pending',
    },
  ]);

  const handlePaymentInitiated = (paymentData: any) => {
    setPaymentModal({
      isOpen: true,
      data: paymentData,
    });
  };

  const handleSplitInitiated = (splitData: any) => {
    // Handle split bill creation
    console.log('Split initiated:', splitData);
    // In a real app, this would create a payment request
  };

  const handlePaymentConfirm = async () => {
    if (!paymentModal.data) return;
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add new transaction
    const newTransaction: Transaction = {
      transactionId: generateTransactionId(),
      fromUserId: currentUserId,
      toUserId: paymentModal.data.recipient,
      amount: paymentModal.data.amount,
      currency: paymentModal.data.currency,
      timestamp: new Date(),
      status: 'pending',
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Simulate transaction confirmation after 5 seconds
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.transactionId === newTransaction.transactionId
            ? { ...tx, status: 'completed' as const, txHash: '0x' + Math.random().toString(16).substr(2, 40) }
            : tx
        )
      );
    }, 5000);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    // Handle transaction details view
    console.log('Transaction clicked:', transaction);
  };

  const tabs = [
    { id: 'chat' as const, label: 'Chat', icon: MessageCircle },
    { id: 'history' as const, label: 'History', icon: History },
    { id: 'wallet' as const, label: 'Wallet', icon: WalletIcon },
  ];

  return (
    <AppShell
      title={activeTab === 'chat' ? 'PayChat' : activeTab === 'history' ? 'Transaction History' : 'Wallet'}
      rightAction={
        activeTab === 'wallet' ? (
          <div className="text-sm text-text-secondary">Connect Wallet</div>
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
              <button className="btn-primary w-full">
                Connect Wallet
              </button>
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
