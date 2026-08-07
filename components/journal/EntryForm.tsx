'use client';

import { FormEvent, useState } from 'react';

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
  editing: Entry | null;
  setEditing: (entry: Entry | null) => void;
  onDone: () => Promise<void>;
  setMessage: (msg: string) => void;
  userId: number;
};

function convertTo12Hour(time: string) {
  const [hour, minute] = time.split(':').map(Number);

  const period = hour >= 12 ? 'PM' : 'AM';

  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${formattedHour}:${minute
    .toString()
    .padStart(2, '0')} ${period}`;
}

export default function EntryForm({
  editing,
  setEditing,
  onDone,
  setMessage,
  userId,
}: Props) {

  const [date, setDate] = useState(editing?.date.slice(0, 10) ?? '');
  const [bedtime, setBedtime] = useState(editing?.bedtime ?? '');
  const [wakeTime, setWakeTime] = useState(editing?.wakeTime ?? '');
  const [mood, setMood] = useState(editing?.mood?.toString() ?? '');
  const [notes, setNotes] = useState(editing?.notes ?? '');

  const [submitting, setSubmitting] = useState(false);


  function resetForm() {
    setDate('');
    setBedtime('');
    setWakeTime('');
    setMood('');
    setNotes('');
    setEditing(null);
  }


  async function handleSubmit(e: FormEvent) {

    e.preventDefault();

    setSubmitting(true);


    const payload = {
      date,
      bedtime: convertTo12Hour(bedtime),
      wake_time: convertTo12Hour(wakeTime),
      sleep_quality: mood
        ? Number(mood)
        : null,
      notes,
    };


    try {

      const isEditing = Boolean(editing);


      const url = isEditing
        ? `/api/entries/entry/${editing?.id}`
        : `/api/entries/${userId}`;


      const method = isEditing
        ? 'PUT'
        : 'POST';


      const res = await fetch(
        url,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );


      const data = await res
        .json()
        .catch(() => ({}));


      if (!res.ok) {

        setMessage(
          data?.error ||
          data?.message ||
          'Operation failed.'
        );

        return;
      }


      setMessage(
        isEditing
          ? 'Entry updated successfully.'
          : 'Entry created successfully.'
      );


      resetForm();

      await onDone();


    } catch {

      setMessage(
        'Network error. Please try again.'
      );


    } finally {

      setSubmitting(false);

    }

  }


  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border p-6 bg-white shadow-sm"
    >

      <h2 className="text-xl font-bold">
        {editing
          ? '✏️ Edit Sleep Entry'
          : '📝 Create Sleep Entry'}
      </h2>


      <div>

        <label className="block text-sm font-semibold mb-1">
          Date *
        </label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full rounded-md border px-3 py-2"
        />

      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        <div>

          <label className="block text-sm font-semibold mb-1">
            Bedtime *
          </label>

          <input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2"
          />

        </div>


        <div>

          <label className="block text-sm font-semibold mb-1">
            Wake Time *
          </label>

          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2"
          />

        </div>

      </div>


      <div>

        <label className="block text-sm font-semibold mb-1">
          Sleep Quality
        </label>

        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
        >

          <option value="">
            -- Select quality --
          </option>

          <option value="10">
            Excellent 😊
          </option>

          <option value="8">
            Good 🙂
          </option>

          <option value="6">
            Fair 😐
          </option>

          <option value="3">
            Poor 😞
          </option>

        </select>

      </div>


      <div>

        <label className="block text-sm font-semibold mb-1">
          Notes
        </label>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          className="w-full rounded-md border px-3 py-2 min-h-[100px]"
        />

      </div>


      <div className="flex gap-2">

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-60"
        >

          {submitting
            ? 'Saving...'
            : editing
              ? 'Update Entry'
              : 'Save Entry'}

        </button>


        {editing && (

          <button
            type="button"
            onClick={resetForm}
            className="rounded-md border px-4 py-2"
          >
            Cancel
          </button>

        )}

      </div>


    </form>

  );
}