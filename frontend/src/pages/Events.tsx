import EventCard, { type ClubEvent } from "../components/home/EventCard";

// Temporary frontend-only data. Will be replaced by a Spring Boot API
// call (e.g. GET /api/events) later. Same shape as the events used on
// the homepage's Upcoming Events section.
const events: ClubEvent[] = [
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
  {
    id: "evt-4",
    title: "Photography Walk",
    club: "Photography Club",
    date: "Sep 22, 2026",
    time: "5:00 PM",
    room: "Main Gate Lawn",
  },
  {
    id: "evt-5",
    title: "Startup Pitch Night",
    club: "Entrepreneurship Cell",
    date: "Sep 25, 2026",
    time: "3:30 PM",
    room: "Seminar Hall 2, Science Block",
  },
];

/**
 * Events page ("/events").
 * Lists every upcoming club event using the same EventCard component
 * and ClubEvent data shape as the homepage's Upcoming Events section.
 */
export default function Events() {
  const hasEvents = events.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Events
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          See what clubs and societies across campus are organizing, from
          workshops to competitions.
        </p>
      </div>

      {hasEvents ? (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <p className="text-base font-medium text-slate-600">
            No events scheduled right now.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Check back soon for upcoming club events.
          </p>
        </div>
      )}
    </section>
  );
}