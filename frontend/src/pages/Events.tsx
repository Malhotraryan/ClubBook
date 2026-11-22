
import { useEffect, useState } from "react";
import EventCard, { type ClubEvent } from "../components/home/EventCard";

type BackendEvent = {
  id: string;
  title: string;
  description: string;
  clubName: string;
  date: string;
  startTime: string;
  endTime: string;
  expectedAttendees: number;
  bookingId: string;
  status: string;
};

type Booking = {
  id: string;
  roomId: string;
};

type Room = {
  id: string;
  name: string;
  building: string;
};

const EVENTS_API = "http://localhost:8080/api/events";
const BOOKINGS_API = "http://localhost:8080/api/bookings";
const ROOMS_API = "http://localhost:8080/api/rooms";

// Convert 2026-11-10 into Nov 10, 2026
function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Convert 14:00 into 2:00 PM
function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Events() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const [eventsResponse, bookingsResponse, roomsResponse] =
          await Promise.all([
            fetch(EVENTS_API),
            fetch(BOOKINGS_API),
            fetch(ROOMS_API),
          ]);

        if (
          !eventsResponse.ok ||
          !bookingsResponse.ok ||
          !roomsResponse.ok
        ) {
          throw new Error("Could not load event information.");
        }

        const backendEvents: BackendEvent[] =
          await eventsResponse.json();

        const bookings: Booking[] = await bookingsResponse.json();

        const rooms: Room[] = await roomsResponse.json();

        // Convert backend data into the format required by EventCard
        const formattedEvents: ClubEvent[] = backendEvents.map((event) => {
          const booking = bookings.find(
            (item) => item.id === event.bookingId
          );

          const room = rooms.find(
            (item) => item.id === booking?.roomId
          );

          return {
            id: event.id,
            title: event.title,
            club: event.clubName,
            date: formatDate(event.date),
            time: `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`,
            room: room
              ? `${room.name}, ${room.building}`
              : "Room details unavailable",
          };
        });

        setEvents(formattedEvents);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading events."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-center text-slate-500">
          Loading events...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="rounded-lg bg-red-50 p-4 text-center text-red-600">
          {error}
        </p>
      </section>
    );
  }

  const hasEvents = events.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Events
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          See upcoming events at LNMIIT
        </p>
      </div>

      {hasEvents ? (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <p className="text-base font-medium text-slate-600">
            No events scheduled right now.
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Check back soon for upcoming club events.
          </p>
        </div>
      )}
    </section>
  );
}
