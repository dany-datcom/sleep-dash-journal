import EntryCard from "@/components/journal/EntryCard";
import { getEntries } from "@/lib/db";
import { auth } from "@/auth";
import Link from "next/link";


export default async function HomePage() {
  // userId is being hardcoded for now until we have a way to get it from the user
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="min-h-screen bg-background p-6 md:p-10 text-text">
          <div>
            <h1 className="text-3xl font-extrabold text-primary">Sleep Dashboard</h1>
            <p className="mt-1 text-sm text-text/80">
              Please log in to view your sleep entries and track your sleep patterns.
            </p>
          </div>
      </main>
    );
  }
  const userId = Number(session.user.id);

  const entries = await getEntries(userId);

  return (
    <main className="min-h-screen bg-background p-6 md:p-10 text-text">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-primary">Sleep Dashboard</h1>
            <p className="mt-1 text-sm text-text/80">
              Track your daily sleep patterns and quality
            </p>
          </div>

          <Link
  href="/journal"
  className="self-start rounded-lg bg-accent px-4 py-2 font-semibold text-white shadow transition-hover hover:bg-accent/80 md:self-auto"
>
  + New Entry
</Link>
        </header>

        {entries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-secondary/50 p-12 text-center">
            <p className="text-lg text-text/70">No sleep entries found yet.</p>
            <p className="text-sm text-text/50">Start logging your sleep to see your stats here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <EntryCard key={entry.entry_id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
