import { User, Transaction, PaymentRequest } from './types';

// In-memory storage (replace with real database in production)
class InMemoryDatabase {
  private users: Map<string, User> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private paymentRequests: Map<string, PaymentRequest> = new Map();

  // User operations
  async createUser(user: User): Promise<User> {
    this.users.set(user.farcasterId, user);
    return user;
  }

  async getUserById(farcasterId: string): Promise<User | null> {
    return this.users.get(farcasterId) || null;
  }

  async getUserByWallet(walletAddress: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.walletAddress.toLowerCase() === walletAddress.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  async updateUser(farcasterId: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(farcasterId);
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(farcasterId, updatedUser);
    return updatedUser;
  }

  // Transaction operations
  async createTransaction(transaction: Transaction): Promise<Transaction> {
    this.transactions.set(transaction.transactionId, transaction);
    return transaction;
  }

  async getTransaction(transactionId: string): Promise<Transaction | null> {
    return this.transactions.get(transactionId) || null;
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    const userTransactions: Transaction[] = [];
    for (const transaction of this.transactions.values()) {
      if (transaction.fromUserId === userId || transaction.toUserId === userId) {
        userTransactions.push(transaction);
      }
    }
    return userTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<Transaction | null> {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) return null;
    
    const updatedTransaction = { ...transaction, ...updates };
    this.transactions.set(transactionId, updatedTransaction);
    return updatedTransaction;
  }

  // Payment request operations
  async createPaymentRequest(request: PaymentRequest): Promise<PaymentRequest> {
    this.paymentRequests.set(request.requestId, request);
    return request;
  }

  async getPaymentRequest(requestId: string): Promise<PaymentRequest | null> {
    return this.paymentRequests.get(requestId) || null;
  }

  async getPaymentRequestsByUser(userId: string): Promise<PaymentRequest[]> {
    const userRequests: PaymentRequest[] = [];
    for (const request of this.paymentRequests.values()) {
      if (request.requestorUserId === userId || request.participants.includes(userId)) {
        userRequests.push(request);
      }
    }
    return userRequests;
  }

  async updatePaymentRequest(requestId: string, updates: Partial<PaymentRequest>): Promise<PaymentRequest | null> {
    const request = this.paymentRequests.get(requestId);
    if (!request) return null;
    
    const updatedRequest = { ...request, ...updates };
    this.paymentRequests.set(requestId, updatedRequest);
    return updatedRequest;
  }

  // Utility methods
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getAllPaymentRequests(): Promise<PaymentRequest[]> {
    return Array.from(this.paymentRequests.values());
  }

  // Initialize with mock data
  async initializeMockData(): Promise<void> {
    // Mock users
    const mockUsers: User[] = [
      {
        farcasterId: 'alice',
        walletAddress: '0x1234567890123456789012345678901234567890',
        displayName: 'Alice',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      },
      {
        farcasterId: 'bob',
        walletAddress: '0x2345678901234567890123456789012345678901',
        displayName: 'Bob',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      },
      {
        farcasterId: 'charlie',
        walletAddress: '0x3456789012345678901234567890123456789012',
        displayName: 'Charlie',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
      },
      {
        farcasterId: 'user123',
        walletAddress: '0x4567890123456789012345678901234567890123',
        displayName: 'You',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user123',
      },
    ];

    for (const user of mockUsers) {
      await this.createUser(user);
    }

    // Mock transactions
    const mockTransactions: Transaction[] = [
      {
        transactionId: 'tx_1',
        fromUserId: 'alice',
        toUserId: 'user123',
        amount: '0.05',
        currency: 'ETH',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        status: 'completed',
        txHash: '0x1234567890abcdef1234567890abcdef12345678',
      },
      {
        transactionId: 'tx_2',
        fromUserId: 'user123',
        toUserId: 'bob',
        amount: '0.02',
        currency: 'ETH',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        status: 'completed',
        txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
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
    ];

    for (const transaction of mockTransactions) {
      await this.createTransaction(transaction);
    }
  }
}

// Export singleton instance
export const db = new InMemoryDatabase();

// Initialize mock data
db.initializeMockData();
