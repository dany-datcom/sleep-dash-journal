'use client';

import { useState } from 'react';

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
  entry: Entry;
  onEdit: (entry: Entry) => void;
  onDelete: (id: number) => Promise<void>;
  setMessage: (msg: string) => void;
};


function calculateDuration(
  bedtime: string,
  wakeTime: string
): string {
  if (!bedtime || !wakeTime) {
    return '0h 0m';
  }

  function convertToMinutes(time: string) {
    const [hourMinute, period] = time.split(' ');
    const [hour, minute] = hourMinute.split(':').map(Number);

    let hours = hour;

    if (period === 'PM' && hour !== 12) {
      hours += 12;
    }

    if (period === 'AM' && hour === 12) {
      hours = 0;
    }

    return hours * 60 + minute;
  }

  let sleepMinutes =
    convertToMinutes(wakeTime) - convertToMinutes(bedtime);

  if (sleepMinutes < 0) {
    sleepMinutes += 24 * 60;
  }

  const hours = Math.floor(sleepMinutes / 60);
  const minutes = sleepMinutes % 60;

  return `${hours}h ${minutes}m`;
}


function getQualityLabel(score?: number | null) {
  if (!score) return 'No rating';

  if (score >= 9) return 'Excellent';
  if (score >= 7) return 'Good';
  if (score >= 5) return 'Fair';

  return 'Poor';
}


function getQualityEmoji(score?: number | null) {
  if (!score) return '😴';

  if (score >= 9) return '😊';
  if (score >= 7) return '🙂';
  if (score >= 5) return '😐';

  return '😞';
}


export default function JournalEntryCard({
  entry,
  onEdit,
  onDelete,
  setMessage,
}: Props) {

  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  const dateFormatted = new Date(entry.date).toLocaleDateString(
    'es-ES',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }
  );


  const duration = calculateDuration(
    entry.bedtime,
    entry.wakeTime
  );


  const qualityLabel = getQualityLabel(entry.mood);
  const qualityEmoji = getQualityEmoji(entry.mood);


  async function handleDelete() {
    setDeleting(true);

    try {
      await onDelete(entry.id);

      setMessage('Entry deleted successfully.');
      setShowDeleteConfirm(false);

    } catch (error) {
      setMessage('Failed to delete entry.');

    } finally {
      setDeleting(false);
    }
  }


  if (showDeleteConfirm) {
    return (
      <article className="rounded-lg border border-red-300 bg-red-50 p-4">

        <h3 className="font-semibold text-red-900 mb-2">
          Delete Confirmation
        </h3>

        <p className="text-sm text-red-800 mb-3">
          Are you sure you want to delete the entry from{' '}
          <strong>{dateFormatted}</strong>?
        </p>


        <div className="flex gap-2">

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-md bg-red-600 text-white px-3 py-2 text-sm disabled:opacity-60"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>


          <button
            onClick={() => setShowDeleteConfirm(false)}
            disabled={deleting}
            className="rounded-md border px-3 py-2 text-sm disabled:opacity-60"
          >
            Cancel
          </button>

        </div>

      </article>
    );
  }


  return (
    <article className="rounded-lg border p-4 hover:shadow-md transition-shadow">

      <div className="flex justify-between items-start gap-3">

        <div className="flex-1">

          <div className="font-semibold text-lg">
            {dateFormatted}
          </div>


          <div className="text-sm text-gray-600 mt-1">

            Bedtime:{' '}
            <span className="font-medium">
              {entry.bedtime}
            </span>

            {' • '}

            Wake:{' '}
            <span className="font-medium">
              {entry.wakeTime}
            </span>

          </div>


          <div className="text-sm text-gray-700 font-medium mt-1 bg-blue-50 px-2 py-1 rounded inline-block">
            Duration: {duration}
          </div>


          {entry.mood && (
            <div className="mt-2">

              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 px-2 py-1 rounded text-sm">

                <span>
                  {qualityEmoji}
                </span>

                <span>
                  {qualityLabel} Quality ({entry.mood}/10)
                </span>

              </span>

            </div>
          )}


          {entry.notes && (
            <p
              className="text-sm text-gray-700 mt-3 line-clamp-2"
              title={entry.notes}
            >
              <span className="text-gray-600">
                Notes:{' '}
              </span>

              {entry.notes}

            </p>
          )}


          <p className="text-xs text-gray-500 mt-2">
            Updated:{' '}
            {new Date(entry.updatedAt).toLocaleString('es-ES')}
          </p>


        </div>


        <div className="flex gap-2">

          <button
            onClick={() => onEdit(entry)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 transition"
          >
            Edit
          </button>


          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-md bg-red-600 text-white px-3 py-2 text-sm hover:bg-red-700 transition"
          >
            Delete
          </button>

        </div>

      </div>

    </article>
  );
}