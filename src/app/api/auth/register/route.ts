import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/core/domain/entities/User';

// Mock user storage
const mockUsers: User[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user
    const user = User.create(
      crypto.randomUUID(),
      email,
      name
    );

    // Store user (in a real app, this would be in a database)
    mockUsers.push(user);

    // Return user data without password
    return NextResponse.json(user.toPrimitives(), { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}