'use server';

import { redirect } from "next/navigation";
import { z } from 'zod';

import { signOut } from '@/auth';

import { signIn, auth } from '@/auth';
import { AuthError } from 'next-auth';
import { createUser } from './db';

import bcrypt from "bcryptjs"

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const email = formData.get("email")
  const password = formData.get("password")
  console.log(email);
  console.log(password);
  try {
    await signIn('credentials', {email, password, redirectTo: "/"});
    redirect('/');
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid email or password.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut();
  redirect('/');
}

export type State = {
  errors?: {
    first_name?: string[];
    last_name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

const userSchema = z.object({
  first_name: z.string().trim().min(1, { message: 'First name is required' }),
  last_name: z.string().trim().min(1, { message: 'Last name is required' }),
  email: z.email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export async function createUserAction(prevState: State, formData: FormData): Promise<State> {
  const raw = {
    first_name: formData.get('firstName')?.toString() ?? '',
    last_name: formData.get('lastName')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
  }

  const parsed = userSchema.safeParse(raw);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    console.error(`Parsing error: ${JSON.stringify(errors)}`);
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to create user.',
    };
  }

  const cryptedPassword = await bcrypt.hash(parsed.data.password, 12);

  try {
    await createUser(parsed.data.first_name, parsed.data.last_name, parsed.data.email, cryptedPassword);
    redirect('/login');
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      message: 'There was an error creating the user.'
    };
  }
};