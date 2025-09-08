import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmount(amount: string, currency: string = 'ETH'): string {
  const num = parseFloat(amount);
  if (num < 0.001) {
    return `${(num * 1000000).toFixed(0)} µ${currency}`;
  }
  if (num < 1) {
    return `${num.toFixed(4)} ${currency}`;
  }
  return `${num.toFixed(3)} ${currency}`;
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function parsePaymentCommand(message: string): {
  type: 'pay' | 'split' | null;
  amount?: string;
  currency?: string;
  recipient?: string;
  participants?: string[];
  description?: string;
} {
  const payRegex = /^\/pay\s+@(\w+)\s+([\d.]+)\s+(\w+)$/i;
  const splitRegex = /^\/split\s+(.+?)\s+([\d.]+)\s+(@\w+(?:\s+@\w+)*)$/i;

  const payMatch = message.match(payRegex);
  if (payMatch) {
    return {
      type: 'pay',
      recipient: payMatch[1],
      amount: payMatch[2],
      currency: payMatch[3],
    };
  }

  const splitMatch = message.match(splitRegex);
  if (splitMatch) {
    const participants = splitMatch[3].split(/\s+/).map(p => p.replace('@', ''));
    return {
      type: 'split',
      description: splitMatch[1],
      amount: splitMatch[2],
      currency: 'ETH', // Default currency
      participants,
    };
  }

  return { type: null };
}

export function generateTransactionId(): string {
  return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
