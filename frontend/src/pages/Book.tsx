import { useState } from "react";
import { rooms } from "../data/rooms.ts";

/**
 * Book Room page ("/book").
 * A simple controlled form for submitting a room booking request.
 * All fields live in one state object, updated by a single change
 * handler shared across inputs/selects.
 */
export default function Book() {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Temporary frontend-only behavior. This will later send the
    // booking request to a Spring Boot API (e.g. POST /api/bookings).
    console.log("Booking request:", formData);
    setSubmitted(true);
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
            className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="" disabled>
              Select a room
            </option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} &mdash; {room.building}
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
          className="w-full rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
        >
          Submit Booking
        </button>

        {submitted && (
          <p className="text-sm font-medium text-green-700">
            Booking request submitted successfully.
          </p>
        )}
      </form>
    </section>
  );
}