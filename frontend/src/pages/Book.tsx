
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
}

export default function Book() {
  const navigate = useNavigate();

  const role = sessionStorage.getItem("role");
  const clubName = sessionStorage.getItem("clubName") || "";

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    purpose: "",
    roomId: "",
    date: "",
    startTime: "",
    endTime: "",
    attendees: "",
  });

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    if (role !== "CLUB") {
      setLoading(false);
      return;
    }

    const fetchRooms = async () => {
      try {
        const response = await apiFetch("/api/rooms");
        const data: Room[] = await response.json();
        setRooms(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load rooms."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [navigate, role]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const attendees = Number(formData.attendees);

    if (!formData.purpose.trim()) {
      setError("Please enter the booking purpose.");
      return;
    }

    if (!formData.roomId) {
      setError("Please select a room.");
      return;
    }

    if (attendees <= 0 || !Number.isInteger(attendees)) {
      setError("Please enter a valid number of attendees.");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError("End time must be later than start time.");
      return;
    }

    const selectedRoom = rooms.find(
      (room) => room.id === formData.roomId
    );

    if (selectedRoom && attendees > selectedRoom.capacity) {
      setError(
        `This room has a maximum capacity of ${selectedRoom.capacity}.`
      );
      return;
    }

    setSubmitting(true);

    try {
      const bookingData = {
        id: crypto.randomUUID(),
        clubName,
        purpose: formData.purpose.trim(),
        roomId: formData.roomId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        attendees,
      };

      const response = await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error("Booking request failed.");
      }

      setSuccess("Booking request submitted successfully!");

      setFormData({
        purpose: "",
        roomId: "",
        date: "",
        startTime: "",
        endTime: "",
        attendees: "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting the booking."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-600">Loading rooms...</p>
      </div>
    );
  }

  if (role !== "CLUB") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Club access required
        </h2>
        <p className="mt-3 text-slate-600">
          Only club accounts can submit booking requests.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          Login as Club
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Book a Room
        </h1>
        <p className="mt-2 text-slate-600">
          Submit a room booking request for your club.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Club Name
          </label>
          <input
            type="text"
            value={clubName}
            readOnly
            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Purpose of Booking
          </label>
          <input
            type="text"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="e.g. Workshop, Meeting, Event"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Select Room
          </label>
          <select
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Choose a room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} - {room.building} (Capacity: {room.capacity})
              </option>
            ))}
          </select>

          {rooms.length === 0 && (
            <p className="mt-2 text-sm text-amber-600">
              No rooms are currently available.
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Booking Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toLocaleDateString("en-CA")}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Number of Attendees
          </label>
          <input
            type="number"
            name="attendees"
            value={formData.attendees}
            onChange={handleChange}
            min="1"
            required
            placeholder="Enter number of attendees"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || rooms.length === 0}
          className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Booking Request"}
        </button>
      </form>
    </div>
  );
}
