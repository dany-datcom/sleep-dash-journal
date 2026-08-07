'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

    return (
      <main className="min-h-screen bg-background p-6 text-text md:p-12 flex-1">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 border-b border-secondary/20 pb-4">
          <h1 className="text-3xl font-bold text-primary">Log In</h1>
        </div>
        <form action={formAction} className="rounded-xl border border-secondary/30 bg-background/60 p-6 shadow-md backdrop-blur-sm">
            <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">Email</label>
                <input id="email" type="email" name="email" required className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>
            <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium">Password</label>
                <input id="password" type="password" name="password" minLength={6} required className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>
            <button aria-disabled={isPending} type="submit" className="cursor-pointer rounded-lg border border-accent bg-accent px-4 py-2 mt-2 text-sm font-semibold text-background shadow transition-colors duration-200 hover:!bg-background hover:!text-accent">
                {isPending ? 'Signing in...' : 'Sign In'}
            </button>
            {errorMessage && <p role="alert">{errorMessage}</p>}
            </form>
        </div>
        </main>
  );
}