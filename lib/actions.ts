'use server';

import { redirect } from "next/navigation";
import { z } from 'zod';

import { signOut } from '@/auth';

import { signIn, auth } from '@/auth';
import { AuthError } from 'next-auth';

async function requireOwnerSession() {
  const session = await auth();
  if (!session?.user) throw new Error('Not authenticated');
  return session;
}

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