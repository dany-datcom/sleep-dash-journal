'use client';

import JournalEntryCard from './JournalEntryCard';


type Entry = {
  id: number;
  date: string;
  bedtime: string;
  wakeTime: string;
  mood?: number | null;
  notes: string | null;
  updatedAt: string;
};


type Props = {
  entries: Entry[];
  onEdit: (entry: Entry) => void;
  onDeleted: () => Promise<void>;
  setMessage: (msg: string) => void;
};


export default function EntryList({
  entries,
  onEdit,
  onDeleted,
  setMessage,
}: Props) {


  async function handleDelete(id: number) {

    try {

      const res = await fetch(`/api/entries/entry/${id}`, {
        method: 'DELETE',
      });


      const data = await res
        .json()
        .catch(() => ({}));


      if (!res.ok) {
        throw new Error(data?.error || data?.message || 'Delete failed.');
      }


      await onDeleted();


    } catch (error) {

      setMessage(error instanceof Error ? error.message : 'Network error while deleting entry.');

    }

  }



  if (!entries.length) {

    return (

      <section className="rounded-xl border p-6 bg-white text-center">

        <h2 className="text-lg font-semibold mb-2">
          Your Journal
        </h2>


        <p className="text-gray-600">
          No sleep entries yet. Create your first entry!
        </p>

      </section>

    );

  }



console.log("ENTRIES IN LIST:", entries);
  return (

    <section className="rounded-xl border p-4 bg-white">

      <h2 className="text-lg font-semibold mb-4">
        Your Journal
      </h2>


      <div className="space-y-3">

        {entries.map((entry) => (

          <JournalEntryCard

            key={entry.id}

            entry={entry}

            onEdit={onEdit}

            onDelete={handleDelete}

            setMessage={setMessage}

          />

        ))}

      </div>


    </section>

  );
}