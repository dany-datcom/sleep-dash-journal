import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SignUpForm from '@/components/auth/SignUpForm';

export default async function SignupPage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect('/journal');
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center p-6">
      <SignUpForm />
    </main>
  );
}