import { SleepEntry } from "@/lib/types";

interface EntryCardProps {
  entry: SleepEntry;
}

export default function EntryCard({ entry }: EntryCardProps) {
  // Formatear la fecha
  const formattedDate = new Date(entry.date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="rounded-xl border border-secondary/30 bg-background/50 p-5 shadow-md backdrop-blur-sm transition-all hover:shadow-lg hover:border-primary">
      <div className="flex items-start justify-between border-b border-secondary/20 pb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Entry #{entry.entry_id}
          </span>
          <h3 className="text-lg font-bold text-primary">{formattedDate}</h3>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-background shadow">
            {entry.sleep_quality}
          </div>
          <span className="mt-1 text-[10px] text-text/70">Quality / 10</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-secondary/10 p-2 text-center">
          <p className="text-xs text-text/70">Bedtime</p>
          <p className="font-semibold text-text">{entry.sleep_time}</p>
        </div>
        <div className="rounded-lg bg-secondary/10 p-2 text-center">
          <p className="text-xs text-text/70">Wake Time</p>
          <p className="font-semibold text-text">{entry.wake_time}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-text/70">Notes:</p>
        <p className="mt-1 text-sm italic text-text/90">
          {entry.notes ? entry.notes : "No notes recorded for this night."}
        </p>
      </div>
    </div>
  );
}
