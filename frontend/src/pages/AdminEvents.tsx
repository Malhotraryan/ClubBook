
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api";

type Event = {
  id: string;
  title: string;
  description: string;
  clubName: string;
  date: string;
  startTime: string;
  endTime: string;
  expectedAttendees: number;
  bookingId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  // Fetch all pending events
  const loadEvents = useCallback(async () => {
    try {
      setError("");

      const response = await apiFetch("/api/events/pending");

      const data: Event[] = await response.json();
      setEvents(data);
    } catch (err) {
      console.error("Admin events error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Approve or reject an event
  const handleDecision = async (
    eventId: string,
    decision: "approve" | "reject"
  ) => {
    try {
      setActionId(eventId);
      setError("");

      await apiFetch(`/api/events/${eventId}/${decision}`, {
        method: "PUT",
      });

      await loadEvents();
    } catch (err) {
      console.error("Event action error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage Events
            </h1>

            <p className="mt-2 text-slate-600">
              Review event requests submitted by college clubs.
            </p>
          </div>

          <button
            onClick={loadEvents}
            disabled={loading}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-sm font-medium text-blue-700">
            Pending Event Requests
          </p>

          <p className="mt-1 text-3xl font-bold text-blue-900">
            {events.length}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading pending events...
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
            <h2 className="text-lg font-semibold text-slate-800">
              No pending events
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              All event requests have been reviewed.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {event.title}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {event.clubName}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Pending
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {event.description}
                </p>

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Date</span>
                    <span className="font-medium text-slate-800">
                      {event.date}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Time</span>
                    <span className="font-medium text-slate-800">
                      {event.startTime} – {event.endTime}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">
                      Expected attendees
                    </span>
                    <span className="font-medium text-slate-800">
                      {event.expectedAttendees}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Booking ID</span>
                    <span className="max-w-[60%] truncate font-mono text-xs text-slate-600">
                      {event.bookingId}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() =>
                      handleDecision(event.id, "approve")
                    }
                    disabled={actionId !== null}
                    className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {actionId === event.id
                      ? "Processing..."
                      : "Approve"}
                  </button>

                  <button
                    onClick={() =>
                      handleDecision(event.id, "reject")
                    }
                    disabled={actionId !== null}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {actionId === event.id
                      ? "Processing..."
                      : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
