import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cart = useCart();
  const location = useLocation();
  const queryString = location.search || "";

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
              className="text-white"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-full h-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#092622] border-t border-white/10">
          <div className="max-w-auto mx-auto px-6 py-4 space-y-3">
            {[
              { href: "/menu", label: "Menu" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => {
                  triggerHaptic("tap");
                  setMobileMenuOpen(false);
                }}
                className="block text-white font-light hover:opacity-80 transition-opacity text-sm uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
