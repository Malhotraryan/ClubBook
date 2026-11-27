import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api";
import type { Room } from "../components/rooms/RoomCard";

interface RoomBooking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  clubName: string;
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-IN", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

export default function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
        if (!id) {
            setError("Room ID is missing.");
            setLoading(false);
            return;
        }

        const roomId = id;

        async function loadRoomDetails() {
            try {
            const [roomResponse, bookingsResponse] = await Promise.all([
                apiFetch(`/api/rooms/${encodeURIComponent(roomId)}`),
                apiFetch(`/api/rooms/${encodeURIComponent(roomId)}/bookings/upcoming`),
            ]);

            const roomData: Room = await roomResponse.json();
            const bookingData: RoomBooking[] = await bookingsResponse.json();

            if (!roomData) throw new Error("Room not found.");

            setRoom(roomData);
            setBookings(bookingData);
            } catch (err) {
            console.error("Room details error:", err);
            setError(
                err instanceof Error ? err.message : "Unable to load room details."
            );
            } finally {
            setLoading(false);
            }
        }

        loadRoomDetails();
        }, [id]);
        
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/rooms" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
        ← Back to Rooms
      </Link>
      {loading ? (
        <p className="mt-10 text-slate-600">Loading room details...</p>
      ) : error ? (
        <p className="mt-10 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>
      ) : room ? (
        <>
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{room.name}</h1>
            <p className="mt-2 text-lg text-slate-600">{room.building}</p>
            <p className="mt-4 text-sm text-slate-600"><span className="font-semibold text-slate-800">Capacity:</span> {room.capacity} people</p>
            {room.facilities && room.facilities.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {room.facilities.map((facility) => <span key={facility} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{facility}</span>)}
              </div>
            )}
          </div>

          <div className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Upcoming Bookings</h2>
                <p className="mt-1 text-sm text-slate-600">Confirmed reservations for this room.</p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{bookings.length} {bookings.length === 1 ? "booking" : "bookings"}</span>
            </div>
            {bookings.length > 0 ? (
              <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-4 font-semibold">Date</th>
                        <th className="px-5 py-4 font-semibold">Time</th>
                        <th className="px-5 py-4 font-semibold">Purpose</th>
                        <th className="px-5 py-4 font-semibold">Club</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="text-slate-600">
                          <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-800">{formatDate(booking.date)}</td>
                          <td className="whitespace-nowrap px-5 py-4">{formatTime(booking.startTime)} – {formatTime(booking.endTime)}</td>
                          <td className="px-5 py-4">{booking.purpose}</td>
                          <td className="px-5 py-4">{booking.clubName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                <p className="font-semibold text-slate-700">No upcoming bookings</p>
                <p className="mt-2 text-sm text-slate-500">This room has no confirmed reservations at the moment.</p>
              </div>
            )}
          </div>
        </>
      ) : null}
    </section>
  );
}
