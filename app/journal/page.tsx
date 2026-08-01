import JournalClient from "@/components/journal/JournalClient";
import { getEntries } from "@/lib/db";

const DEMO_USER_ID = 1;

export default async function JournalPage() {
  const initialEntries = await getEntries(DEMO_USER_ID);

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
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Sleep Journal</h1>

      <p className="text-sm text-slate-600">
        Create, edit, and delete your sleep entries.
      </p>

      <JournalClient initialEntries={safeEntries} />
    </main>
  );
}