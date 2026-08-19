type FooterLink = {
  label: string;
  href: string;
};

const footerLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Book Room", href: "/book" },
  { label: "Events", href: "/events" },
];

const CONTACT_EMAIL = "support@clubbook.app";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3 sm:text-left">
          
          {/* Branding */}
          <div>
            <a
              href="/"
              className="text-lg font-bold tracking-tight text-slate-900"
            >
              Club<span className="text-blue-600">Book</span>
            </a>

            <p className="mt-2 text-sm text-slate-500">
              Classroom booking, simplified for college clubs.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer">
            <p className="text-sm font-semibold text-slate-900">
              Quick Links
            </p>

            <ul className="mt-2 flex flex-col items-center gap-2 sm:items-start">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-blue-600"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Contact
            </p>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-2 inline-block text-sm text-slate-600 transition-colors hover:text-blue-600"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-slate-200 pt-6 text-center">
          <p className="text-xs text-slate-500">
            © {currentYear} ClubBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}