type NavLinkItem = {
  label: string;
  href: string;
};

const navLinks: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Book Room", href: "/book" },
  { label: "Events", href: "/events" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        {/* Branding */}
        <a href="/" className="text-xl font-bold tracking-tight text-slate-900">
          Club<span className="text-blue-600">Book</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Login */}
        <div className="hidden items-center gap-4 md:flex">
          <a
            href="/login"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Login
          </a>
        </div>

        {/* Mobile menu button - interaction will be added later */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 md:hidden"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>
    </header>
  );
}
