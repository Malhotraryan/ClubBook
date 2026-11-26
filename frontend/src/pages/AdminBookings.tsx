
import { useEffect, useState } from "react";
import { apiFetch } from "../api";

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

interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState("");

  // Fetch pending bookings and rooms
  const fetchData = async () => {
    try {
      setError("");

      const [bookingResponse, roomResponse] = await Promise.all([
        apiFetch("/api/bookings/pending"),
        fetch("http://localhost:8080/api/rooms"),
      ]);

      if (!roomResponse.ok) {
        throw new Error("Failed to load rooms.");
      }

      const bookingData: Booking[] = await bookingResponse.json();
      const roomData: Room[] = await roomResponse.json();

      setBookings(bookingData);
      setRooms(roomData);
    } catch (error) {
      console.error("Admin bookings error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load booking requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get room details using room ID
  const getRoomName = (roomId: string) => {
    const room = rooms.find((room) => room.id === roomId);

    return room
      ? `${room.name} — ${room.building}`
      : roomId;
  };

  // Approve or reject a booking
  const handleBookingAction = async (
    id: string,
    action: "approve" | "reject"
  ) => {
    try {
      setActionLoadingId(id);
      setError("");

      await apiFetch(`/api/bookings/${id}/${action}`, {
        method: "PUT",
      });

      await fetchData();
    } catch (error) {
      console.error("Booking action error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Admin Bookings
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Review and manage pending classroom booking requests.
        </p>
      </div>

      <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Pending Requests
        </p>

        <p className="mt-2 text-3xl font-bold text-slate-900">
          {bookings.length}
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-900">
          Booking Requests
        </h2>

        {loading ? (
          <p className="mt-6 text-slate-600">
            Loading booking requests...
          </p>
        ) : bookings.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {booking.clubName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {booking.purpose}
                    </p>
                  </div>

                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    PENDING
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

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    disabled={actionLoadingId !== ""}
                    onClick={() =>
                      handleBookingAction(booking.id, "approve")
                    }
                    className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {actionLoadingId === booking.id
                      ? "Processing..."
                      : "Approve"}
                  </button>

                  <button
                    type="button"
                    disabled={actionLoadingId !== ""}
                    onClick={() =>
                      handleBookingAction(booking.id, "reject")
                    }
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {actionLoadingId === booking.id
                      ? "Processing..."
                      : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
            <h3 className="font-semibold text-slate-700">
              No pending requests
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              All booking requests have been reviewed.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
