
'use client';

import { useState } from 'react';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import { useToast, ToastContainer } from './Toast';

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
  initialEntries: unknown[];
};

const DEMO_USER_ID = 1;


function mapEntry(entry: unknown): Entry {

  const item = entry as {
    entry_id?: number;
    id?: number;
    date?: string;
    sleep_time?: string;
    bedtime?: string;
    wake_time?: string;
    wakeTime?: string;
    sleep_quality?: number | null;
    mood?: number | null;
    notes?: string | null;
    updated_at?: string;
    updatedAt?: string;
  };

  return {
    id: item.entry_id ?? item.id ?? 0,
    date: item.date ?? '',
    bedtime: item.sleep_time ?? item.bedtime ?? '',
    wakeTime: item.wake_time ?? item.wakeTime ?? '',
    mood: item.sleep_quality ?? item.mood ?? null,
    notes: item.notes ?? null,
    updatedAt: item.updated_at ?? item.updatedAt ?? '',
  };
}


export default function JournalClient({
  initialEntries,
}: Props) {

  const [entries, setEntries] = useState<Entry[]>(
    initialEntries.map(mapEntry)
  );

  const [editing, setEditing] = useState<Entry | null>(null);

  const {
    toasts,
    addToast,
    removeToast,
  } = useToast();


  async function refresh() {

    try {

      const res = await fetch(`/api/entries/${DEMO_USER_ID}`);

      if (!res.ok) {
        throw new Error('Failed to load entries');
      }

      const data = await res.json();

      setEntries(
        data.map(mapEntry)
      );


    } catch (error) {

      addToast(
        'Unable to refresh sleep entries.',
        'error'
      );

    }
  }


  const handleSetMessage = (msg: string) => {

    if (msg) {

      addToast(
        msg,
        'success'
      );

    }

  };


  return (

    <div className="space-y-4">

      <EntryForm
        editing={editing}
        setEditing={setEditing}
        onDone={refresh}
        setMessage={handleSetMessage}
      />


      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
      />


      <EntryList
        entries={entries}
        onEdit={setEditing}
        onDeleted={refresh}
        setMessage={handleSetMessage}
      />

    </div>

  );
}