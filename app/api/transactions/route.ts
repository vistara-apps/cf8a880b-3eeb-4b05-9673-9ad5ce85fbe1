import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { Transaction } from '@/lib/types';
import { generateTransactionId } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      const transactions = await db.getTransactionsByUser(userId);
      return NextResponse.json({ transactions });
    }

    const allTransactions = await db.getAllTransactions();
    return NextResponse.json({ transactions: allTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromUserId, toUserId, amount, currency } = body;

    if (!fromUserId || !toUserId || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transaction: Transaction = {
      transactionId: generateTransactionId(),
      fromUserId,
      toUserId,
      amount,
      currency,
      timestamp: new Date(),
      status: 'pending',
    };

    const createdTransaction = await db.createTransaction(transaction);
    
    // Simulate transaction processing
    setTimeout(async () => {
      await db.updateTransaction(transaction.transactionId, {
        status: 'completed',
        txHash: '0x' + Math.random().toString(16).substr(2, 40),
      });
    }, 5000);

    return NextResponse.json({ transaction: createdTransaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, ...updates } = body;

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const updatedTransaction = await db.updateTransaction(transactionId, updates);
    
    if (!updatedTransaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ transaction: updatedTransaction });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}
