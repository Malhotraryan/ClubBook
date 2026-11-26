
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

type Room = {
  id: string;
  name: string;
  building: string;
  capacity: number;
};

type EventForm = {
  title: string;
  description: string;
  clubName: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  expectedAttendees: string;
};

const initialForm: EventForm = {
  title: "",
  description: "",
  clubName: "",
  roomId: "",
  date: "",
  startTime: "",
  endTime: "",
  expectedAttendees: "",
};

const ROOMS_API = "http://localhost:8080/api/rooms";
const EVENTS_API =
  "http://localhost:8080/api/events/create-with-booking";

export default function CreateEvent() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formData, setFormData] = useState<EventForm>(initialForm);

  const [loadingRooms, setLoadingRooms] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch rooms when the page loads
  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await fetch(ROOMS_API);

        if (!response.ok) {
          throw new Error("Could not load rooms.");
        }

        const data: Room[] = await response.json();
        setRooms(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoadingRooms(false);
      }
    }

    fetchRooms();
  }, []);

  // Update form fields
  function handleChange(
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  // Submit event and room booking together
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const selectedRoom = rooms.find(
      (room) => room.id === formData.roomId
    );

    if (!selectedRoom) {
      setError("Please select a valid room.");
      return;
    }

    const attendees = Number(formData.expectedAttendees);

    if (attendees > selectedRoom.capacity) {
      setError(
        `This room can accommodate only ${selectedRoom.capacity} people.`
      );
      return;
    }

    if (formData.endTime <= formData.startTime) {
      setError("End time must be after start time.");
      return;
    }

    try {
      setSubmitting(true);

      const requestData = {
        event: {
          title: formData.title,
          description: formData.description,
          clubName: formData.clubName,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          expectedAttendees: attendees,
        },

        booking: {
          clubName: formData.clubName,
          purpose: formData.title,
          roomId: formData.roomId,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          attendees: attendees,
        },
      };

      // Get JWT token from browser session storage
      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login again. Authentication token not found."
        );
      }

      // Send event request with JWT authentication
      const response = await fetch(EVENTS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || `Request failed: ${response.status}`
        );
      }

      setSuccess(
        "Event and room booking request submitted successfully! Both are pending admin approval."
      );

      setFormData(initialForm);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Create an Event
          </h1>

          <p className="mt-2 text-slate-500">
            Organising an event? Submit its details and request a room
            together.
          </p>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >

          {/* Event details */}
          <section>
            <h2 className="mb-5 text-xl font-semibold text-slate-900">
              Event Details
            </h2>

            <div className="space-y-4">

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Event Title
                </label>

                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Robotics Workshop"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Tell students what this event is about..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Organising Club
                </label>

                <input
                  name="clubName"
                  value={formData.clubName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Robotics Club"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

            </div>
          </section>

          <div className="border-t border-slate-200" />

          {/* Room booking details */}
          <section>
            <h2 className="mb-5 text-xl font-semibold text-slate-900">
              Room Booking Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Select Room
                </label>

                <select
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  required
                  disabled={loadingRooms || rooms.length === 0}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 disabled:bg-slate-100"
                >
                  <option value="">
                    {loadingRooms ? "Loading rooms..." : "Choose a room"}
                  </option>

                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} — {room.building} (Capacity: {room.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Event Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toLocaleDateString("en-CA")}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Expected Attendees
                </label>

                <input
                  type="number"
                  name="expectedAttendees"
                  value={formData.expectedAttendees}
                  onChange={handleChange}
                  min="1"
                  required
                  placeholder="e.g. 50"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Start Time
                </label>

                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  End Time
                </label>

                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

            </div>
          </section>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting || loadingRooms || rooms.length === 0}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Submitting Request..."
              : "Submit Event & Room Request"}
          </button>

          <p className="text-center text-xs text-slate-500">
            Your event and room booking will be submitted separately for
            admin approval.
          </p>

        </form>
      </div>
    </div>
  );
}
