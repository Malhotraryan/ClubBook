
export type RoomStatus = "AVAILABLE" | "MAINTENANCE";

export type Room = {
  id: string;
  name: string;
  building: string;
  capacity: number;
  facilities?: string[];
  status?: RoomStatus;
};

type RoomCardProps = {
  room: Room;
};

const statusStyles: Record<RoomStatus, string> = {
  AVAILABLE: "bg-green-50 text-green-700",
  MAINTENANCE: "bg-amber-50 text-amber-700",
};

const statusLabels: Record<RoomStatus, string> = {
  AVAILABLE: "Available",
  MAINTENANCE: "Under Maintenance",
};

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {room.name}
          </h3>

          <p className="mt-0.5 text-sm text-slate-500">
            {room.building}
          </p>
        </div>

        {room.status && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[room.status]}`}
          >
            {statusLabels[room.status]}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 shrink-0 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5.13a4 4 0 11-6 0 4 4 0 016 0zm6 3a4 4 0 10-8 0"
          />
        </svg>

        <span>Capacity: {room.capacity}</span>
      </div>

      {room.facilities && room.facilities.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
          {room.facilities.map((facility) => (
            <span
              key={facility}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
            >
              {facility}
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        className="mt-4 w-full rounded-md border border-slate-300 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-600"
      >
        View Room
      </button>
    </div>
  );
}
