import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { User } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farcasterId = searchParams.get('farcasterId');
    const walletAddress = searchParams.get('walletAddress');

    if (farcasterId) {
      const user = await db.getUserById(farcasterId);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ user });
    }

    if (walletAddress) {
      const user = await db.getUserByWallet(walletAddress);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ user });
    }

    const allUsers = await db.getAllUsers();
    return NextResponse.json({ users: allUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { farcasterId, walletAddress, displayName, avatarUrl } = body;

    if (!farcasterId || !walletAddress || !displayName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.getUserById(farcasterId);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    const user: User = {
      farcasterId,
      walletAddress,
      displayName,
      avatarUrl,
    };

    const createdUser = await db.createUser(user);
    return NextResponse.json({ user: createdUser });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { farcasterId, ...updates } = body;

    if (!farcasterId) {
      return NextResponse.json(
        { error: 'Farcaster ID is required' },
        { status: 400 }
      );
    }

    const updatedUser = await db.updateUser(farcasterId, updates);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
