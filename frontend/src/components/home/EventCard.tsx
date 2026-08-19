export type ClubEvent = {
  id: string;
  title: string;
  club: string;
  date: string;
  time: string;
  room: string;
};

type EventCardProps = {
  event: ClubEvent;
};

/**
 * Single event card used by the Upcoming Events section.
 * Presentational only — takes a full ClubEvent object so future API
 * data can be passed straight through without reshaping.
 */
export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
        {event.club}
      </p>

      <h3 className="mt-1.5 text-base font-semibold leading-snug text-slate-900">
        {event.title}
      </h3>

      <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 shrink-0 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
            {event.date} &middot; {event.time}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 shrink-0 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{event.room}</span>
        </div>
      </div>
    </div>
  );
}