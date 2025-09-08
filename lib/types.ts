export interface User {
  farcasterId: string;
  walletAddress: string;
  displayName: string;
  avatarUrl?: string;
}

export interface Transaction {
  transactionId: string;
  fromUserId: string;
  toUserId: string;
  amount: string;
  currency: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
}

export interface PaymentRequest {
  requestId: string;
  requestorUserId: string;
  description: string;
  totalAmount: string;
  currency: string;
  dueDate?: Date;
  status: 'active' | 'completed' | 'cancelled';
  participants: string[];
  payments: Transaction[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'payment' | 'split';
  paymentData?: {
    amount: string;
    currency: string;
    recipient?: string;
    participants?: string[];
  };
}

export type TransactionType = 'sent' | 'received' | 'pending';
