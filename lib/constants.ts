export const SUPPORTED_CURRENCIES = ['ETH', 'USDC', 'DAI'] as const;

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const PAYMENT_REQUEST_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const CHAT_MESSAGE_TYPES = {
  MESSAGE: 'message',
  PAYMENT: 'payment',
  SPLIT: 'split',
} as const;

export const MOCK_USERS = [
  {
    farcasterId: 'alice',
    walletAddress: '0x1234567890123456789012345678901234567890',
    displayName: 'Alice',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  },
  {
    farcasterId: 'bob',
    walletAddress: '0x0987654321098765432109876543210987654321',
    displayName: 'Bob',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  },
  {
    farcasterId: 'charlie',
    walletAddress: '0x1111222233334444555566667777888899990000',
    displayName: 'Charlie',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
  },
];
