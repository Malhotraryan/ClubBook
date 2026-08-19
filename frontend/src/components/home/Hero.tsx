export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Book College Classrooms Effortlessly
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600 lg:mx-0">
            ClubBook lets student clubs and societies reserve classrooms and
            lecture halls for meetings, workshops, and events — without the
            back-and-forth emails or paperwork.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="/book"
              className="w-full rounded-md bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
            >
              Book a Room
            </a>

            <a
              href="/events"
              className="w-full rounded-md border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-600 sm:w-auto"
            >
              Explore Events
            </a>
          </div>
        </div>

        <div
          className="hidden aspect-[4/3] w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 lg:block"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
