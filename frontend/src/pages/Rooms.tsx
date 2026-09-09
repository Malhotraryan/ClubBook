import { useState } from "react";
import RoomCard from "../components/rooms/RoomCard";
import { rooms } from "../data/rooms.ts";

export default function Rooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [minCapacity, setMinCapacity] = useState("");

  const filteredRooms = rooms.filter((room) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      room.name.toLowerCase().includes(query) ||
      room.building.toLowerCase().includes(query);

    const capacityValue = Number(minCapacity);
    const matchesCapacity =
      minCapacity === "" || room.capacity >= capacityValue;

    return matchesSearch && matchesCapacity;
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Available Rooms
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Browse classrooms and lecture halls available for your club's next
          meeting, workshop, or event.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by room name or building"
          className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 sm:max-w-xs"
        />

        <input
          type="number"
          min={0}
          value={minCapacity}
          onChange={(e) => setMinCapacity(e.target.value)}
          placeholder="Minimum capacity"
          className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 sm:max-w-[180px]"
        />
      </div>

      {filteredRooms.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <p className="text-base font-medium text-slate-600">
            No rooms match your current filters.
          </p>
        </div>
      )}
    </section>
  );
}