import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, Instagram } from "lucide-react";

function triggerHaptic(pattern: "tap") {
  if ("vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic("tap");
    // Form submission would go here
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
  };

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
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 font-light">
            We'd love to hear from you. Reach out with any questions or
            feedback.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-1 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-light text-[#014CE0] mb-8 uppercase tracking-wide">
                Contact Information
              </h2>

              <div className="space-y-8">
                {/* Location */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#014CE0]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Location
                    </h3>
                    <p className="text-gray-600 font-light">
                      588 Ruthven Street
                      <br />
                      Toowoomba, Queensland 4350
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#014CE0]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                    <a
                      href="tel:+61551234567"
                      className="text-gray-600 font-light hover:text-[#014CE0] transition-colors"
                    >
                      +61 469 633 877
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#014CE0]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                    <a
                      href="mailto:hello@tinascoffee.com"
                      className="text-gray-600 font-light hover:text-[#014CE0] transition-colors"
                    >
                      hello@tinascoffee.com
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#014CE0]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Hours</h3>
                    <p className="text-gray-600 font-light">
                      Monday–Friday: 6:30 AM – 2:30 PM
                      <br />
                      Saturday: 7:00 AM – 1:00 PM
                      <br />
                      Sunday: Closed
                      <br />
                      <span className="block mt-2 text-sm text-[#014CE0]">
                        Walk-ins only
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/tinascoffeeplace"
                    className="text-[#014CE0] hover:opacity-70 transition-opacity"
                    title="Instagram"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                  {/* <a
                    href="#"
                    className="text-[#014CE0] hover:opacity-70 transition-opacity"
                    title="Facebook"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a> */}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-light text-[#014CE0] mb-8 uppercase tracking-wide">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#014CE0] focus:ring-1 focus:ring-[#014CE0] transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#014CE0] focus:ring-1 focus:ring-[#014CE0] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#014CE0] focus:ring-1 focus:ring-[#014CE0] transition-colors resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  onClick={() => triggerHaptic("tap")}
                  className="w-full px-8 py-4 bg-[#014CE0] hover:bg-[#0139A8] text-white font-light uppercase tracking-widest rounded-lg transition-all hover:shadow-lg active:scale-95"
                >
                  Send Message
                </button>
              </form>

              <p className="mt-6 text-sm text-gray-600 font-light">
                We typically respond within 24 hours. For urgent matters, please
                call us directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-light text-[#014CE0] mb-8 uppercase tracking-wide">
            Find Us
          </h2>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3417.1927968908212!2d151.9504918753185!3d-27.564598876264707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b965d1a7b0e5baf%3A0xfce9b5d7b7320700!2zVGluYeKAmXMgUGxhY2UgQ2FmZSAmIENhdGVyaW5nLvCfkpU!5e1!3m2!1sen!2sau!4v1780207589144!5m2!1sen!2sau"
              width="600"
              height="450"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

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
                Saturday: 7:00 AM – 1:00 PM
                <br />
                Sunday: Closed
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#014CE0] uppercase tracking-wide text-sm">
                Contact
              </h4>
              <div className="text-gray-400 text-sm font-light space-y-2">
                <p>588 Ruthven Street, Toowoomba, QLD</p>
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
