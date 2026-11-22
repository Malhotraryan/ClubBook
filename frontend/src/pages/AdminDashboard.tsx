
import { useEffect, useState } from "react";

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

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/bookings")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        return response.json();
      })
      .then((data: Booking[]) => {
        setBookings(data);
      })
      .catch((error) => {
        console.error("Admin dashboard error:", error);
        setError("Unable to load dashboard data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const pendingCount = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;

  const approvedCount = bookings.filter(
    (booking) => booking.status === "APPROVED"
  ).length;

  const rejectedCount = bookings.filter(
    (booking) => booking.status === "REJECTED"
  ).length;

  const stats = [
    {
      title: "Total Bookings",
      count: bookings.length,
      style: "bg-blue-50 text-blue-700",
    },
    {
      title: "Pending Requests",
      count: pendingCount,
      style: "bg-amber-50 text-amber-700",
    },
    {
      title: "Approved Bookings",
      count: approvedCount,
      style: "bg-green-50 text-green-700",
    },
    {
      title: "Rejected Bookings",
      count: rejectedCount,
      style: "bg-red-50 text-red-700",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Admin Dashboard
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Overview of classroom bookings and requests.
        </p>
      </div>

      {loading ? (
        <p className="mt-10 text-slate-600">Loading dashboard...</p>
      ) : error ? (
        <p className="mt-10 text-red-600">{error}</p>
      ) : (
        <>
          {/* Statistics */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {stat.count}
                </p>

                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${stat.style}`}
                >
                  {stat.title}
                </span>
              </div>
            ))}
          </div>

          {/* Recent bookings */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900">
              Recent Booking Requests
            </h2>

            {bookings.length > 0 ? (
              <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Club</th>
                      <th className="px-5 py-4 font-semibold">Purpose</th>
                      <th className="px-5 py-4 font-semibold">Date</th>
                      <th className="px-5 py-4 font-semibold">Time</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {bookings.slice(-5).reverse().map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50">
                        <td className="px-5 py-4 font-medium text-slate-900">
                          {booking.clubName}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {booking.purpose}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {booking.date}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {booking.startTime} – {booking.endTime}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              booking.status === "PENDING"
                                ? "bg-amber-50 text-amber-700"
                                : booking.status === "APPROVED"
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                No bookings have been submitted yet.
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
