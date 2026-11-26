
import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import LogoutButton from "../components/LogoutButton";

interface Booking {
  id: string;
  clubName: string;
  purpose: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [bookingResponse, roomResponse, eventResponse] =
          await Promise.all([
            apiFetch("/api/bookings"),
            apiFetch("/api/rooms"),
            apiFetch("/api/events/mine"),
          ]);

        const bookingData: Booking[] = await bookingResponse.json();
        const roomData: Room[] = await roomResponse.json();
        const eventData: Event[] = await eventResponse.json();

        setBookings(bookingData);
        setRooms(roomData);
        setEvents(eventData);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const getRoomName = (roomId: string) => {
    const room = rooms.find((room) => room.id === roomId);
    return room ? `${room.name} — ${room.building}` : roomId;
  };

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;

  const approvedBookings = bookings.filter(
    (booking) => booking.status === "APPROVED"
  ).length;

  const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700",
    APPROVED: "bg-green-50 text-green-700",
    REJECTED: "bg-red-50 text-red-700",
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

      {/* Header and Logout */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-lg text-slate-600">
            Track your club's bookings and events.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="mt-10 text-slate-600">Loading dashboard...</p>
      ) : error ? (
        <p className="mt-10 text-red-600">{error}</p>
      ) : (
        <>
          {/* Booking Statistics */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total Bookings
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {bookings.length}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Pending Bookings
              </p>
              <p className="mt-2 text-3xl font-bold text-amber-600">
                {pendingBookings}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Approved Bookings
              </p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {approvedBookings}
              </p>
            </div>

          </div>

          {/* Booking History */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900">
              Booking History
            </h2>

            {bookings.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          {booking.purpose}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {booking.clubName}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[booking.status]
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                      <p>
                        <span className="font-medium text-slate-800">
                          Room:
                        </span>{" "}
                        {getRoomName(booking.roomId)}
                      </p>

                      <p>
                        <span className="font-medium text-slate-800">
                          Date:
                        </span>{" "}
                        {booking.date}
                      </p>

                      <p>
                        <span className="font-medium text-slate-800">
                          Time:
                        </span>{" "}
                        {booking.startTime} – {booking.endTime}
                      </p>

                      <p>
                        <span className="font-medium text-slate-800">
                          Attendees:
                        </span>{" "}
                        {booking.attendees}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
                <p className="font-medium text-slate-600">
                  No booking requests yet.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Your booking history will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Club Events */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900">
              My Events
            </h2>

            {events.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold text-slate-900">
                        {event.title}
                      </h3>

                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[event.status]
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>

                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                      <p>
                        <span className="font-medium text-slate-800">
                          Date:
                        </span>{" "}
                        {event.date}
                      </p>

                      <p>
                        <span className="font-medium text-slate-800">
                          Time:
                        </span>{" "}
                        {event.startTime} – {event.endTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
                <p className="font-medium text-slate-600">
                  No events created yet.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Your club's events will appear here.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
