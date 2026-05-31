import { Link } from "react-router-dom";
import { MapPin, Clock, Phone, Mail, ArrowRight } from "lucide-react";

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
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#014CE0] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="text-white font-bold text-2xl">TINA'S</div>
            <div className="text-white/80 text-sm font-light">COFFEE</div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/menu"
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

          <div className="md:hidden">
            <button className="text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white overflow-hidden py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-6 leading-tight">
              Located at The Longs Quarter
            </h1>

            <div className="space-y-3 text-gray-600 text-lg md:text-xl font-light mb-8">
              <p>Margaret Street, Toowoomba, Queensland</p>
              <p>Monday to Sunday from 7am</p>
              <p>Walk ins only</p>
            </div>

            <div className="flex justify-center gap-6 mb-10">
              <a
                href="mailto:hello@tinascoffee.com"
                className="text-[#014CE0] hover:opacity-70 transition-opacity"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="tel:+61551234567"
                className="text-[#014CE0] hover:opacity-70 transition-opacity"
                title="Call"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[#014CE0] hover:opacity-70 transition-opacity"
                title="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.646.069 4.85 0 3.204-.012 3.584-.07 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.69.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 11.001 2.881 1.44 1.44 0 01-.001-2.881z" />
                </svg>
              </a>
            </div>

            <Link
              to="/menu"
              onClick={() => triggerHaptic("success")}
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#014CE0] text-[#014CE0] rounded-full font-light uppercase tracking-widest text-sm hover:bg-[#014CE0] hover:text-white transition-all"
            >
              Order Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-r from-gray-50 to-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-4xl mb-4">☕</div>
              <h3 className="text-xl font-semibold text-[#014CE0] mb-2">Premium Coffee</h3>
              <p className="text-gray-600 font-light">
                Ethically sourced and freshly roasted beans from around the world
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-[#014CE0] mb-2">Artisan Crafted</h3>
              <p className="text-gray-600 font-light">
                Each cup is prepared with care and precision by our skilled baristas
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-[#014CE0] mb-2">Community First</h3>
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
          <Link
            to="/menu"
            onClick={() => triggerHaptic("success")}
            className="inline-block px-10 py-4 bg-[#014CE0] hover:bg-[#0139A8] text-white font-light uppercase tracking-widest rounded-full transition-all hover:shadow-xl active:scale-95"
          >
            View Menu
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#171717] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-white font-bold text-xl">TINA'S</div>
                <div className="text-white/70 text-xs font-light">COFFEE</div>
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
                Monday–Friday: 6:00 AM – 8:00 PM<br />
                Saturday–Sunday: 7:00 AM – 9:00 PM
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#014CE0] uppercase tracking-wide text-sm">
                Contact
              </h4>
              <div className="text-gray-400 text-sm font-light space-y-2">
                <p>Margaret Street, Toowoomba, QLD</p>
                <p>(555) 123-4567</p>
                <p>hello@tinascoffee.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm font-light">
            <p>&copy; 2024 Tina's Coffee. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
