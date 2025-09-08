'use client';

import { Transaction, TransactionType } from '@/lib/types';
import { formatAmount, formatAddress } from '@/lib/utils';
import { UserAvatar } from './UserAvatar';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionItemProps {
  transaction: Transaction;
  variant: TransactionType;
  currentUserId: string;
  onClick?: () => void;
}

export function TransactionItem({
  transaction,
  variant,
  currentUserId,
  onClick,
}: TransactionItemProps) {
  const isSent = variant === 'sent';
  const isPending = variant === 'pending';
  
  const otherUserId = isSent ? transaction.toUserId : transaction.fromUserId;
  const otherUserAddress = isSent ? '0x1234...5678' : '0x9876...4321'; // Mock addresses
  
  const StatusIcon = isPending ? Clock : isSent ? ArrowUpRight : ArrowDownLeft;
  
  return (
    <div
      className={cn(
        'transaction-item flex items-center gap-4',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <div className="relative">
        <UserAvatar
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserId}`}
          alt={otherUserId}
          size="medium"
        />
        <div className={cn(
          'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center',
          isPending ? 'bg-yellow-500' : isSent ? 'bg-red-500' : 'bg-green-500'
        )}>
          <StatusIcon className="w-3 h-3 text-white" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-body text-text font-medium truncate">
            {isSent ? `To ${otherUserId}` : `From ${otherUserId}`}
          </p>
          <p className={cn(
            'text-body font-semibold',
            isPending ? 'text-yellow-400' : isSent ? 'text-red-400' : 'text-green-400'
          )}>
            {isSent && !isPending ? '-' : '+'}{formatAmount(transaction.amount, transaction.currency)}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className="text-caption text-text-secondary">
            {formatAddress(otherUserAddress)}
          </p>
          <p className="text-caption text-text-secondary">
            {transaction.timestamp.toLocaleDateString()}
          </p>
        </div>
        
        {isPending && (
          <p className="text-caption text-yellow-400 mt-1">
            Transaction pending...
          </p>
        )}
      </div>
    </div>
  );
}
