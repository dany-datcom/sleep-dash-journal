import JournalClient from "@/components/journal/JournalClient";
import LoginForm from "@/components/auth/LoginForm";
import SignOutButton from "@/components/auth/SignOutButton";
import { auth } from "@/auth";
import { getEntries } from "@/lib/db";

export default async function JournalPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center p-6">
        <LoginForm />
      </main>
    );
  }

  const userId = Number(session.user.id);
  const initialEntries = await getEntries(userId);

  const safeEntries = initialEntries.map((e) => ({
    ...e,
    date:
      e.date instanceof Date
        ? e.date.toISOString().split("T")[0]
        : e.date,
    updatedAt:
      e.updatedAt instanceof Date
        ? e.updatedAt.toISOString()
        : e.updatedAt,
  }));

  return (
    <main className="mx-auto w-full max-w-3xl p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sleep Journal</h1>
          <p className="text-sm text-slate-600">
            Create, edit, and delete your sleep entries.
          </p>
        </div>

        <SignOutButton />
      </div>

      <JournalClient initialEntries={safeEntries} userId={userId} />
    </main>
  );
}