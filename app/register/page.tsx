'use client';

import { useActionState } from 'react';
import { createUserAction, type State } from '@/lib/actions';

const initialState: State = { message: null, errors: {} };

export default function RegisterForm() {
    const [state, formAction, isPending] = useActionState(createUserAction, initialState);

    return (
      <main className="min-h-screen bg-background p-6 text-text md:p-12 flex-1">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 border-b border-secondary/20 pb-4">
          <h1 className="text-3xl font-bold text-primary">Register</h1>
        </div>
        <form action={formAction} className="rounded-xl border border-secondary/30 bg-background/60 p-6 shadow-md backdrop-blur-sm">
            <div>
                <label htmlFor="firstName" className="mb-2 block text-sm font-medium">First Name</label>
                <input id="firstName" type="text" name="firstName" required className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>
              <div id="first-name-error" aria-live="polite" aria-atomic="true">
                {state.errors?.first_name?.map((error) => (
                  <p key={error} className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                ))}
              </div>
            <div>
                <label htmlFor="lastName" className="mb-2 block text-sm font-medium">Last Name</label>
                <input id="lastName" type="text" name="lastName" required className="w-full rounded-md border border-gray-300 px-3 py-2" />
                <div id="last-name-error" aria-live="polite" aria-atomic="true">
                {state.errors?.last_name?.map((error) => (
                  <p key={error} className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                ))}
              </div>
            </div>
            <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">Email</label>
                <input id="email" type="email" name="email" required className="w-full rounded-md border border-gray-300 px-3 py-2" />
                <div id="email-error" aria-live="polite" aria-atomic="true">
                {state.errors?.email?.map((error) => (
                  <p key={error} className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                ))}
              </div>
            </div>
            <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium">Password</label>
                <input id="password" type="text" name="password" minLength={6} required className="w-full rounded-md border border-gray-300 px-3 py-2" />
                <div id="password-error" aria-live="polite" aria-atomic="true">
                {state.errors?.password?.map((error) => (
                  <p key={error} className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                ))}
              </div>
            </div>
            {state.message && <p role="alert">{state.message}</p>}
            <button aria-disabled={isPending} type="submit" className="cursor-pointer rounded-lg border border-accent bg-accent px-4 py-2 mt-2 text-sm font-semibold text-background shadow transition-colors duration-200 hover:!bg-background hover:!text-accent">
                {isPending ? 'Registering...' : 'Register'}
            </button>
            </form>
        </div>
        </main>
  );
}