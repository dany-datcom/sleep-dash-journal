import { createUser, getUserForAuth } from '@/lib/db';
import { NextResponse } from 'next/server';

type SignupBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SignupBody;

  const firstName = body.firstName?.trim();
  const lastName = body.lastName?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? '';

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json(
      { error: 'All fields are required.' },
      { status: 400 }
    );
  }

  if (!email.includes('@')) {
    return NextResponse.json(
      { error: 'Enter a valid email address.' },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters long.' },
      { status: 400 }
    );
  }

  const existingUser = await getUserForAuth(email);

  if (existingUser) {
    return NextResponse.json(
      { error: 'That email is already registered.' },
      { status: 409 }
    );
  }

  const user = await createUser({
    firstName,
    lastName,
    email,
    password,
  });

  return NextResponse.json({ user }, { status: 201 });
}