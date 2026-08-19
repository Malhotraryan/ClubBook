import EventCard, { type ClubEvent } from "./EventCard";

// Temporary frontend-only data. Will be replaced by a Spring Boot API
// call later.
const upcomingEvents: ClubEvent[] = [
  {
    id: "evt-1",
    title: "Intro to Robotics Workshop",
    club: "Robotics Club",
    date: "Sep 12, 2026",
    time: "4:00 PM",
    room: "Room 204, Engineering Block",
  },
  {
    id: "evt-2",
    title: "Open Mic Night",
    club: "Music Society",
    date: "Sep 15, 2026",
    time: "6:30 PM",
    room: "Auditorium",
  },
  {
    id: "evt-3",
    title: "Debate Championship Prelims",
    club: "Debate Club",
    date: "Sep 18, 2026",
    time: "2:00 PM",
    room: "Room 110, Arts Block",
  },
];

const MAX_EVENTS_ON_HOMEPAGE = 3;

export default function UpcomingEvents() {
  const visibleEvents = upcomingEvents.slice(0, MAX_EVENTS_ON_HOMEPAGE);
  const hasEvents = visibleEvents.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Upcoming Events
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            See what clubs on campus are hosting next.
          </p>
        </div>

        <a
          href="/events"
          className="shrink-0 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          View all events &rarr;
        </a>
      </div>

      {hasEvents ? (
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="mt-14 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <p className="text-base font-medium text-slate-600">
            No upcoming events right now.
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Check back soon, or explore past events.
          </p>
        </div>
      )}
    </section>
  );
}