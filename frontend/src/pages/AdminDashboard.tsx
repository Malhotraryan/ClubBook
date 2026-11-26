
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";
import LogoutButton from "../components/LogoutButton";

interface Booking {
  id: string;
  clubName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface ClubEvent {
  id: string;
  title: string;
  clubName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAdminDashboard() {
      try {
        const [bookingResponse, eventResponse] = await Promise.all([
          apiFetch("/api/bookings"),
          apiFetch("/api/events/all"),
        ]);

        const bookingData: Booking[] = await bookingResponse.json();
        const eventData: ClubEvent[] = await eventResponse.json();

        setBookings(bookingData);
        setEvents(eventData);
      } catch (err) {
        console.error("Admin dashboard error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAdminDashboard();
  }, []);

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;

  const pendingEvents = events.filter(
    (event) => event.status === "PENDING"
  ).length;

  const totalClubs = new Set(
    bookings.map((booking) => booking.clubName).filter(Boolean)
  ).size;

  const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700",
    APPROVED: "bg-green-50 text-green-700",
    REJECTED: "bg-red-50 text-red-700",
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Manage club bookings, events and approvals.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="mt-10 text-slate-600">Loading admin dashboard...</p>
      ) : error ? (
        <p className="mt-10 text-red-600">{error}</p>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                Total Events
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {events.length}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Pending Events
              </p>
              <p className="mt-2 text-3xl font-bold text-amber-600">
                {pendingEvents}
              </p>
            </div>
          </div>

          {/* Management links */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900">
              Management
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
              <Link
                to="/admin/bookings"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <h3 className="font-semibold text-slate-900">
                  Manage Bookings
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Review and approve or reject club booking requests.
                </p>
                <p className="mt-4 text-sm font-semibold text-blue-600">
                  View bookings →
                </p>
              </Link>

              <Link
                to="/admin/events"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <h3 className="font-semibold text-slate-900">
                  Manage Events
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Review event requests submitted by clubs.
                </p>
                <p className="mt-4 text-sm font-semibold text-blue-600">
                  View events →
                </p>
              </Link>

              <Link
                to="/rooms"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <h3 className="font-semibold text-slate-900">
                  Manage Rooms
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  View available rooms and room information.
                </p>
                <p className="mt-4 text-sm font-semibold text-blue-600">
                  View rooms →
                </p>
              </Link>
            </div>
          </div>

          {/* Recent bookings */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900">
              Recent Booking Requests
            </h2>

            {bookings.length === 0 ? (
              <p className="mt-5 text-slate-500">No bookings found.</p>
            ) : (
              <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-5 py-4">Club</th>
                      <th className="px-5 py-4">Booking ID</th>
                      <th className="px-5 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking.id} className="border-t border-slate-100">
                        <td className="px-5 py-4 font-medium text-slate-900">
                          {booking.clubName}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {booking.id}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
