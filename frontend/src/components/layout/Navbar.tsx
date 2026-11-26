
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type NavLinkItem = {
  label: string;
  to: string;
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Get logged-in user's information
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  const isLoggedIn = Boolean(token);
  const isAdmin = isLoggedIn && role === "ADMIN";
  const isClub = isLoggedIn && role === "CLUB";

  // Common links
  const navLinks: NavLinkItem[] = [
    { label: "Home", to: "/" },
    { label: "Rooms", to: "/rooms" },
    { label: "Events", to: "/events" },
  ];

  // CLUB-specific links
  if (isClub) {
    navLinks.push(
      { label: "Dashboard", to: "/dashboard" },
      { label: "Book Room", to: "/book" },
      { label: "Create Event", to: "/create-event" }
    );
  }

  // ADMIN-specific links
  if (isAdmin) {
    navLinks.push({
      label: "Admin Dashboard",
      to: "/admin",
    });
  }

  // Logout
  const handleLogout = () => {
    sessionStorage.clear();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  // Close mobile menu when navigating
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Re-read session information when the route changes
  // so Navbar reflects the latest login/logout state.
  const currentPath = location.pathname;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <nav
        className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        {/* Branding */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          Club<span className="text-blue-600">Book</span>
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  currentPath === link.to
                    ? "text-blue-600"
                    : "text-slate-600"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Login / Logout */}
        <div className="hidden items-center gap-4 md:flex">
          {!isLoggedIn ? (
            <Link
              to="/login"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={closeMobileMenu}
                  className={`block rounded-md px-3 py-2 text-sm font-medium ${
                    currentPath === link.to
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li className="border-t border-slate-100 pt-3">
              {!isLoggedIn ? (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600"
                >
                  Logout
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
