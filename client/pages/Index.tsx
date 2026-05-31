import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ArrowRight,
  Menu,
  X,
  Instagram,
} from "lucide-react";
import Reviews from "@/components/util/GoogleReviews";

function triggerHaptic(pattern: "tap" | "success") {
  if ("vibrate" in navigator) {
    const patterns: Record<string, number | number[]> = {
      tap: 10,
      success: [10, 20, 10],
    };
    navigator.vibrate(patterns[pattern]);
  }
}

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#014CE0] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="text-white font-bold text-2xl">TINA'S</div>
            <div className="text-white/80 text-sm font-light">COFFEE</div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {/* <Link
              to="/menu"
              onClick={() => triggerHaptic("tap")}
              className="text-white font-light hover:opacity-80 transition-opacity text-sm uppercase tracking-wide"
            >
              Menu
            </Link> */}
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

          <div className="md:hidden">
            <button
              type="button"
              aria-label={
                mobileMenuOpen ? "Close navigation" : "Open navigation"
              }
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="text-white"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#014CE0] border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4 space-y-3">
              {[
                // { href: "/menu", label: "Menu" },
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

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen md:min-h-[85vh] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/herovideo.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/50"></div>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center py-10">
          <div className="mb-8 animate-fade-in max-w-3xl">
            {/* Subtitle */}
            <p className="text-white/80 text-sm md:text-base uppercase tracking-[0.2em] font-light mb-6">
              The House Of Homemade
            </p>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 leading-tight">
              Tina`s
              <br />
              <span className="text-[#FFD700]">coffee Place</span>
            </h1>

            {/* Description */}
            <div className="space-y-2 text-white/90 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
              <p> 580 Ruthven St, Toowoomba City, Queensland</p>
              <p className="text-white/75 font-bold mt-2">Cafe & Catering</p>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-px bg-gradient-to-r from-transparent to-white/30 w-12"></div>
              <span className="text-white/70 text-sm tracking-widest">
                OPEN NOW
              </span>
              <div className="h-px bg-gradient-to-l from-transparent to-white/30 w-12"></div>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-8 mb-12">
              <a
                href="mailto:hello@tinascoffee.com"
                className="text-white hover:text-[#FFD700] transition-colors transform hover:scale-110 duration-200"
                title="Email"
              >
                <Mail className="w-6 h-6" />
              </a>
              <a
                href="tel:+61469633877"
                className="text-white hover:text-[#FFD700] transition-colors transform hover:scale-110 duration-200"
                title="Call"
              >
                <Phone className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/tinasplacecafe/"
                className="text-white hover:text-[#FFD700] transition-colors transform hover:scale-110 duration-200"
                title="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>

            {/* CTA Button */}
            <a
              href="/menu.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#014CE0] hover:bg-[#FFD700] hover:text-gray-900 text-white font-light uppercase tracking-widest text-sm rounded-full transition-all transform hover:scale-105 duration-200 shadow-2xl"
            >
              Explore Our Menu
              <ArrowRight className="w-5 h-5" />
            </a>

            {/* Scroll Indicator */}
            <div className="mt-16 animate-bounce">
              <svg
                className="w-6 h-6 text-white/60 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-r from-gray-50 to-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-4xl mb-4">☕</div>
              <h3 className="text-xl font-semibold text-[#014CE0] mb-2">
                Premium Coffee
              </h3>
              <p className="text-gray-600 font-light">
                Ethically sourced and freshly roasted beans from around the
                world
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-[#014CE0] mb-2">
                Artisan Crafted
              </h3>
              <p className="text-gray-600 font-light">
                Each cup is prepared with care and precision by our skilled
                baristas
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-[#014CE0] mb-2">
                Community First
              </h3>
              <p className="text-gray-600 font-light">
                A welcoming space for everyone to pause, connect, and enjoy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            Ready to Order?
          </h2>
          <p className="text-lg text-gray-600 mb-8 font-light">
            Explore our full menu of premium coffee and delicious food options
          </p>
          <a
            href="/menu.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-[#014CE0] hover:bg-[#0139A8] text-white font-light uppercase tracking-widest rounded-full transition-all hover:shadow-xl active:scale-95"
          >
            View Menu
          </a>
        </div>
      </section>

      <div
        id="featurable-806e1882-029c-4d23-abdf-d8ae34917291"
        data-featurable-async
      ></div>
      {/* Footer */}
      <footer className="bg-[#171717] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-white font-bold text-xl">TINA'S</div>
                <div className="text-white/70 text-xs font-light">
                  COFFEE PLACE
                </div>
              </div>
              <p className="text-gray-400 text-sm font-light">
                Crafting excellence in every cup since day one.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#014CE0] uppercase tracking-wide text-sm">
                Hours
              </h4>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Monday–Friday: 6:30 AM – 2:30 PM
                <br />
                Saturday : 7:00 AM – 1:00 PM
                <br />
                Sunday: Closed
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#014CE0] uppercase tracking-wide text-sm">
                Contact
              </h4>
              <div className="text-gray-400 text-sm font-light space-y-2">
                <p>580 Ruthven Street, Toowoomba, QLD 4350</p>
                <p>+61 469 633 877</p>
                <p>hello@tinascoffee.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm font-light">
            <p>&copy; 2026 Tina's Coffee. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
