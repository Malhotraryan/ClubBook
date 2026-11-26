
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiFetch } from "../api";

interface EventItem {
  id: string;
  name?: string;
  title?: string;
  eventName?: string;
  description?: string;
  clubName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  venue?: string;
  roomName?: string;
}

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch("/api/events");
      const data: EventItem[] = await response.json();

      // Display approved events only
      setEvents(
        data.filter(
          (event) => event.status?.toUpperCase() === "APPROVED"
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load events."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, location.key]);

  const getEventName = (event: EventItem) => {
    return event.eventName || event.title || event.name || "Untitled Event";
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-600">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Campus Events
          </h1>
          <p className="mt-2 text-slate-600">
            Explore upcoming events organized by campus clubs.
          </p>
        </div>

        {sessionStorage.getItem("role") === "CLUB" && (
          <Link
            to="/create-event"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Create Event
          </Link>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!error && events.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-slate-800">
            No events available
          </h2>
          <p className="mt-2 text-slate-600">
            Approved events will appear here.
          </p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <article
            key={event.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="h-2 bg-blue-600" />

            <div className="p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Campus Event
                </span>

                {event.status && (
                  <span className="text-xs font-medium text-slate-500">
                    {event.status}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                {getEventName(event)}
              </h2>

              {event.description && (
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {event.description}
                </p>
              )}

              <div className="mt-5 space-y-3 text-sm text-slate-600">
                {event.clubName && (
                  <p>
                    <span className="font-semibold text-slate-800">
                      Organized by:
                    </span>{" "}
                    {event.clubName}
                  </p>
                )}

                {event.date && (
                  <p>
                    <span className="font-semibold text-slate-800">
                      Date:
                    </span>{" "}
                    {event.date}
                  </p>
                )}

                {(event.startTime || event.endTime) && (
                  <p>
                    <span className="font-semibold text-slate-800">
                      Time:
                    </span>{" "}
                    {event.startTime || "--"} - {event.endTime || "--"}
                  </p>
                )}

                {(event.roomName || event.venue) && (
                  <p>
                    <span className="font-semibold text-slate-800">
                      Venue:
                    </span>{" "}
                    {event.roomName || event.venue}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
