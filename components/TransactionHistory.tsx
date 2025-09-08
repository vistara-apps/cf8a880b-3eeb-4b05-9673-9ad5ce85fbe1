'use client';

import { useState } from 'react';
import { Transaction, TransactionType } from '@/lib/types';
import { TransactionItem } from './TransactionItem';
import { Filter, Search } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  currentUserId: string;
  onTransactionClick?: (transaction: Transaction) => void;
}

export function TransactionHistory({
  transactions,
  currentUserId,
  onTransactionClick,
}: TransactionHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'sent' | 'received' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getTransactionType = (transaction: Transaction): TransactionType => {
    if (transaction.status === 'pending') return 'pending';
    return transaction.fromUserId === currentUserId ? 'sent' : 'received';
  };

  const filteredTransactions = transactions.filter(transaction => {
    const type = getTransactionType(transaction);
    const matchesFilter = filter === 'all' || type === filter;
    const matchesSearch = searchQuery === '' || 
      transaction.fromUserId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.toUserId.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <button className="p-3 bg-surface border border-gray-700 rounded-lg hover:bg-surface/80 transition-colors duration-200">
            <Filter className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-2">
          {(['all', 'sent', 'received', 'pending'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                filter === filterType
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-secondary hover:text-text'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-heading text-text mb-2">No transactions found</h3>
            <p className="text-body text-text-secondary">
              {searchQuery ? 'Try adjusting your search terms' : 'Start by sending your first payment!'}
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.transactionId}
                transaction={transaction}
                variant={getTransactionType(transaction)}
                currentUserId={currentUserId}
                onClick={() => onTransactionClick?.(transaction)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
