
export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid items-center gap-16 lg:grid-cols-2">

        {/* LEFT: Hero content */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Book College Classrooms Effortlessly
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
            ClubBook lets student clubs and societies reserve classrooms and
            lecture halls for meetings, workshops, and events — without the
            back-and-forth emails or paperwork.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="/book"
              className="w-full rounded-md bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
            >
              Book a Room
            </a>

            <a
              href="/events"
              className="w-full rounded-md border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600 sm:w-auto"
            >
              Explore Events
            </a>
          </div>
        </div>

        {/* RIGHT: Booking illustration */}
        <div className="relative mx-auto flex aspect-square w-full max-w-[520px] items-center justify-center">

          {/* Soft background circles */}
          <div className="absolute h-[80%] w-[80%] rounded-full bg-blue-50" />
          <div className="absolute h-[62%] w-[62%] rounded-full border border-blue-100" />

          {/* Main calendar card */}
          <div className="absolute left-[15%] top-[17%] z-10 w-[70%] rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl shadow-blue-900/10 sm:p-7">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  YOUR SCHEDULE
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  Book a Room
                </h3>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M16 3v4M8 3v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="m9 15 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Calendar dates */}
            <div className="mt-6 grid grid-cols-7 gap-1 text-center">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <span key={index} className="py-2 text-xs font-medium text-slate-400">
                  {day}
                </span>
              ))}

              {Array.from({ length: 7 }, (_, index) => index + 10).map((date) => (
                <span
                  key={date}
                  className={`flex aspect-square items-center justify-center rounded-lg text-xs font-semibold ${
                    date === 12
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-slate-600"
                  }`}
                >
                  {date}
                </span>
              ))}
            </div>

            {/* Selected room */}
            <div className="mt-6 rounded-xl bg-blue-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                    <path d="M3 21h18M5 21V5l7-3 7 3v16M9 21v-6h6v6M9 8h.01M15 8h.01M9 11h.01M15 11h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">
                    Lecture Hall A
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Academic Block · 120 seats
                  </p>
                </div>
              </div>
            </div>

            {/* Time slot */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">TIME SLOT</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  10:00 AM – 12:00 PM
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                Available
              </span>
            </div>
          </div>

          {/* Floating confirmation card */}
          <div className="absolute bottom-[13%] right-[2%] z-20 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-xl shadow-slate-900/10 sm:p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900">
                Booking Confirmed
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Room successfully reserved
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
