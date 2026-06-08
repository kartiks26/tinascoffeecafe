import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Instagram, Mail, Menu, Phone, X } from "lucide-react";

const navLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const contactLinks = [
  {
    href: "https://www.instagram.com/tinasplacecafe/",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "tel:+61469633877",
    label: "Call",
    icon: Phone,
  },
  {
    href: "mailto:hello@tinascoffee.com",
    label: "Mail",
    icon: Mail,
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  function triggerHaptic(pattern: "tap" | "success") {
    if ("vibrate" in navigator) {
      const patterns: Record<string, number | number[]> = {
        tap: 10,
        success: [10, 20, 10],
      };
      navigator.vibrate(patterns[pattern]);
    }
  }

  return (
    <nav className="sticky top-0 z-40 bg-[#092622] shadow-lg">
      <div className=" mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="text-white font-bold text-2xl">TINA'S</div>
          <div className="text-white/80 text-sm font-light">COFFEE</div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            to={`/menu`}
            onClick={() => triggerHaptic("tap")}
            className="text-white font-light hover:opacity-80 transition-opacity text-sm uppercase tracking-wide"
          >
            Menu
          </Link>
          <Link
            to="/about"
            onClick={() => triggerHaptic("tap")}
            className="text-white font-light hover:opacity-80 transition-opacity text-sm uppercase tracking-wide"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => triggerHaptic("tap")}
            className="text-white font-light hover:opacity-80 transition-opacity text-sm uppercase tracking-wide"
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <div>
            <button
              type="button"
              aria-label={
                mobileMenuOpen ? "Close navigation" : "Open navigation"
              }
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((p) => !p)}
              className="flex h-10 w-10 items-center justify-center text-white transition-opacity hover:opacity-80"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 md:hidden transition-[visibility] duration-300 ${
          mobileMenuOpen
            ? "pointer-events-auto visible"
            : "pointer-events-none invisible delay-300"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute right-0 top-0 flex h-full w-[82vw] max-w-sm flex-col bg-[#092622] px-6 py-5 text-white shadow-2xl transition-all duration-500 ${
            mobileMenuOpen
              ? "translate-x-0 opacity-100 ease-out"
              : "translate-x-full opacity-95 ease-in"
          }`}
          aria-label="Mobile navigation"
        >
          <div
            className={`flex items-center justify-between border-b border-white/10 pb-5 transition-all delay-150 duration-300 ${
              mobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            }`}
          >
            <Link
              to="/"
              onClick={() => {
                triggerHaptic("tap");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div className="text-xl font-bold">TINA'S</div>
              <div className="text-xs font-light text-white/80">COFFEE</div>
            </Link>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-80"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 py-6">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => {
                  triggerHaptic("tap");
                  setMobileMenuOpen(false);
                }}
                className={`block rounded-md px-3 py-3 text-base font-light uppercase tracking-[0.16em] text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white ${
                  mobileMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: mobileMenuOpen
                    ? `${180 + index * 70}ms`
                    : "0ms",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div
            className={`border-t border-white/10 pt-5 transition-all delay-300 duration-300 ${
              mobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
          >
            <div className="flex items-center justify-around gap-6">
              {contactLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noreferrer noopener" : undefined
                  }
                  onClick={() => triggerHaptic("tap")}
                  className="flex min-h-14 flex-col items-center justify-center gap-1.5 px-1 text-[0.65rem] font-light uppercase tracking-wide text-white transition-colors hover:text-[#FFD700]"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </nav>
  );
}
