import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
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
      <Header />

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
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#092622] hover:bg-[#FFD700] hover:text-gray-900 text-white font-light uppercase tracking-widest text-sm rounded-full transition-all transform hover:scale-105 duration-200 shadow-2xl"
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
              <h3 className="text-xl font-semibold text-[#092622] mb-2">
                Premium Coffee
              </h3>
              <p className="text-gray-600 font-light">
                Ethically sourced and freshly roasted beans from around the
                world
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-[#092622] mb-2">
                Artisan Crafted
              </h3>
              <p className="text-gray-600 font-light">
                Each cup is prepared with care and precision by our skilled
                baristas
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-[#092622] mb-2">
                Community First
              </h3>
              <p className="text-gray-600 font-light">
                A welcoming space for everyone to pause, connect, and enjoy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Categories Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 text-center">
            Our Collections
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 font-light">
            Explore our carefully curated selections
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="/menu#coffee"
              className="group relative overflow-hidden rounded-2xl h-48 hover:shadow-2xl transition-shadow duration-300"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=800&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-light mb-1 tracking-wide">Coffee</h3>
                <p className="text-sm text-white/70 font-light">Premium selections</p>
              </div>
            </a>

            <a
              href="/menu#tea"
              className="group relative overflow-hidden rounded-2xl h-48 hover:shadow-2xl transition-shadow duration-300"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&h=800&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-light mb-1 tracking-wide">Tea & Refreshers</h3>
                <p className="text-sm text-white/70 font-light">Cool & relaxing</p>
              </div>
            </a>

            <a
              href="/menu#breakfast"
              className="group relative overflow-hidden rounded-2xl h-48 hover:shadow-2xl transition-shadow duration-300"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=800&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-light mb-1 tracking-wide">Breakfast</h3>
                <p className="text-sm text-white/70 font-light">Morning favorites</p>
              </div>
            </a>

            <a
              href="/menu#wrap"
              className="group relative overflow-hidden rounded-2xl h-48 hover:shadow-2xl transition-shadow duration-300"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1509375206418-3e01e5fbef0e?w=600&h=800&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-light mb-1 tracking-wide">Wraps & Lunch</h3>
                <p className="text-sm text-white/70 font-light">Hearty selections</p>
              </div>
            </a>
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
            className="inline-block px-10 py-4 bg-[#092622] hover:bg-[#0139A8] text-white font-light uppercase tracking-widest rounded-full transition-all hover:shadow-xl active:scale-95"
          >
            View Menu
          </a>
        </div>
      </section>

      <div
        id="featurable-806e1882-029c-4d23-abdf-d8ae34917291"
        data-featurable-async
      ></div>
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-light text-[#092622] mb-8 uppercase tracking-wide">
            Find Us
          </h2>
          <div className="bg-gray-200 rounded-lg h-200 flex items-center justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3417.1927968908212!2d151.9504918753185!3d-27.564598876264707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b965d1a7b0e5baf%3A0xfce9b5d7b7320700!2zVGluYeKAmXMgUGxhY2UgQ2FmZSAmIENhdGVyaW5nLvCfkpU!5e1!3m2!1sen!2sau!4v1780207589144!5m2!1sen!2sau"
              width="100%"
              height="450"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
