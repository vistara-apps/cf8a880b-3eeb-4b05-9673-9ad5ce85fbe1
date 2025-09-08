'use client';

import { useState, useCallback } from 'react';
import { useWalletClient } from 'wagmi';
import { createX402Axios } from 'x402-axios';
import { parseEther, formatEther } from 'viem';
import { base } from 'wagmi/chains';

export interface X402PaymentConfig {
  amount: string; // Amount in ETH
  recipient: string; // Recipient address
  currency: 'USDC' | 'ETH';
  description?: string;
}

export interface X402PaymentResult {
  success: boolean;
  txHash?: string;
  error?: string;
  paymentId?: string;
}

export function useX402Payment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();

  const processPayment = useCallback(async (
    config: X402PaymentConfig
  ): Promise<X402PaymentResult> => {
    if (!walletClient) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create x402-axios instance with wallet client
      const x402Client = createX402Axios({
        walletClient,
        chainId: base.id,
        // Configure for USDC on Base
        tokenAddress: config.currency === 'USDC' 
          ? '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' // USDC on Base
          : undefined, // ETH
      });

      // Convert amount to proper units
      const amountInWei = config.currency === 'USDC' 
        ? parseEther(config.amount) / BigInt(1e12) // USDC has 6 decimals
        : parseEther(config.amount);

      // Create payment request
      const paymentRequest = {
        to: config.recipient,
        amount: amountInWei.toString(),
        currency: config.currency,
        description: config.description || 'PayChat payment',
        chainId: base.id,
      };

      // Process the x402 payment
      const response = await x402Client.post('/payment', paymentRequest);
      
      if (response.status === 200 && response.data.txHash) {
        return {
          success: true,
          txHash: response.data.txHash,
          paymentId: response.data.paymentId,
        };
      } else {
        throw new Error(response.data.error || 'Payment failed');
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Payment processing failed';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsProcessing(false);
    }
  }, [walletClient]);

  const verifyPayment = useCallback(async (
    txHash: string
  ): Promise<boolean> => {
    if (!walletClient) {
      return false;
    }

    try {
      // Wait for transaction confirmation
      const receipt = await walletClient.waitForTransactionReceipt({
        hash: txHash as `0x${string}`,
        confirmations: 1,
      });

      return receipt.status === 'success';
    } catch (err) {
      console.error('Payment verification failed:', err);
      return false;
    }
  }, [walletClient]);

  const getTransactionStatus = useCallback(async (
    txHash: string
  ) => {
    if (!walletClient) {
      return null;
    }

    try {
      const receipt = await walletClient.getTransactionReceipt({
        hash: txHash as `0x${string}`,
      });

      return {
        status: receipt.status,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        effectiveGasPrice: receipt.effectiveGasPrice,
      };
    } catch (err) {
      console.error('Failed to get transaction status:', err);
      return null;
    }
  }, [walletClient]);

  return {
    processPayment,
    verifyPayment,
    getTransactionStatus,
    isProcessing,
    error,
  };
}
