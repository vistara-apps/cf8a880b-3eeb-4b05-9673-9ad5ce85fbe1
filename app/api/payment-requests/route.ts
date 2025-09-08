import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { PaymentRequest } from '@/lib/types';
import { generateTransactionId } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const requestId = searchParams.get('requestId');

    if (requestId) {
      const paymentRequest = await db.getPaymentRequest(requestId);
      if (!paymentRequest) {
        return NextResponse.json(
          { error: 'Payment request not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ paymentRequest });
    }

    if (userId) {
      const paymentRequests = await db.getPaymentRequestsByUser(userId);
      return NextResponse.json({ paymentRequests });
    }

    const allPaymentRequests = await db.getAllPaymentRequests();
    return NextResponse.json({ paymentRequests: allPaymentRequests });
  } catch (error) {
    console.error('Error fetching payment requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestorUserId, description, totalAmount, currency, participants, dueDate } = body;

    if (!requestorUserId || !description || !totalAmount || !currency || !participants) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const paymentRequest: PaymentRequest = {
      requestId: generateTransactionId(),
      requestorUserId,
      description,
      totalAmount,
      currency,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status: 'active',
      participants,
      payments: [],
    };

    const createdRequest = await db.createPaymentRequest(paymentRequest);
    return NextResponse.json({ paymentRequest: createdRequest });
  } catch (error) {
    console.error('Error creating payment request:', error);
    return NextResponse.json(
      { error: 'Failed to create payment request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, ...updates } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    const updatedRequest = await db.updatePaymentRequest(requestId, updates);
    
    if (!updatedRequest) {
      return NextResponse.json(
        { error: 'Payment request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ paymentRequest: updatedRequest });
  } catch (error) {
    console.error('Error updating payment request:', error);
    return NextResponse.json(
      { error: 'Failed to update payment request' },
      { status: 500 }
    );
  }
}
