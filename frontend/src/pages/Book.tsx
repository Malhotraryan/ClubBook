
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Room } from "../components/rooms/RoomCard";

export default function Book() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  const [formData, setFormData] = useState({
    clubName: "",
    purpose: "",
    roomId: "",
    date: "",
    startTime: "",
    endTime: "",
    attendees: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch rooms from Spring Boot when the page loads
  useEffect(() => {
    fetch("http://localhost:8080/api/rooms")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }

        return response.json();
      })
      .then((data: Room[]) => {
        setRooms(data);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
        setError("Unable to load rooms. Please try again.");
      })
      .finally(() => {
        setLoadingRooms(false);
      });
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitted(false);
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);
    setSubmitted(false);
    setError("");

    try {
      const bookingData = {
        id: crypto.randomUUID(),
        ...formData,
        attendees: Number(formData.attendees),
      };

      const response = await fetch(
        "http://localhost:8080/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Booking failed.");
      }

      setSubmitted(true);

      setFormData({
        clubName: "",
        purpose: "",
        roomId: "",
        date: "",
        startTime: "",
        endTime: "",
        attendees: "",
      });
    } catch (error) {
      console.error("Booking error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Book a Room
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Submit a room booking request for your club's meeting, workshop,
          or event.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <label
            htmlFor="clubName"
            className="block text-sm font-medium text-slate-700"
          >
            Club Name
          </label>

          <input
            id="clubName"
            name="clubName"
            type="text"
            required
            value={formData.clubName}
            onChange={handleChange}
            placeholder="e.g. Robotics Club"
            className="mt-2 w-full rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div>
          <label
            htmlFor="purpose"
            className="block text-sm font-medium text-slate-700"
          >
            Event / Purpose
          </label>

          <input
            id="purpose"
            name="purpose"
            type="text"
            required
            value={formData.purpose}
            onChange={handleChange}
            placeholder="e.g. Weekly team meeting"
            className="mt-2 w-full rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div>
          <label
            htmlFor="roomId"
            className="block text-sm font-medium text-slate-700"
          >
            Room
          </label>

          <select
            id="roomId"
            name="roomId"
            required
            value={formData.roomId}
            onChange={handleChange}
            disabled={loadingRooms || rooms.length === 0}
            className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="" disabled>
              {loadingRooms
                ? "Loading rooms..."
                : rooms.length === 0
                  ? "No rooms available"
                  : "Select a room"}
            </option>

            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} — {room.building}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-slate-700"
            >
              Date
            </label>

            <input
              id="date"
              name="date"
              type="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-slate-700"
            >
              Start Time
            </label>

            <input
              id="startTime"
              name="startTime"
              type="time"
              required
              value={formData.startTime}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-slate-700"
            >
              End Time
            </label>

            <input
              id="endTime"
              name="endTime"
              type="time"
              required
              value={formData.endTime}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="attendees"
            className="block text-sm font-medium text-slate-700"
          >
            Number of Attendees
          </label>

          <input
            id="attendees"
            name="attendees"
            type="number"
            min={1}
            required
            value={formData.attendees}
            onChange={handleChange}
            placeholder="e.g. 30"
            className="mt-2 w-full rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 sm:max-w-[200px]"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || loadingRooms || rooms.length === 0}
          className="w-full rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitting ? "Submitting..." : "Submit Booking"}
        </button>

        {submitted && (
          <p className="text-sm font-medium text-green-700">
            Booking request submitted successfully!
          </p>
        )}

        {error && (
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}
