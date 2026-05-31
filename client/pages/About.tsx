import { Link } from "react-router-dom";

function triggerHaptic(pattern: "tap") {
  if ("vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

export default function About() {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#092622] shadow-lg">
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
            About Tina's Coffee
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Our story, our values, and our passion for exceptional coffee
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-4xl font-light text-[#092622] mb-6 uppercase tracking-wide">
              Our Story
            </h2>
            <p className="text-lg text-gray-700 font-light leading-relaxed mb-6">
              Tina's Coffee began as a simple dream: to create a space where
              exceptional coffee and genuine community come together. Founded on
              the belief that great coffee is an art form, we've dedicated
              ourselves to sourcing, roasting, and brewing the finest beans from
              around the world.
            </p>
            <p className="text-lg text-gray-700 font-light leading-relaxed">
              Located in 588 Ruthven Street on 588 Ruthven Street, our cozy café
              has become a beloved destination for coffee lovers and community
              members seeking a moment of connection and comfort.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 my-16">
            <div>
              <h3 className="text-2xl font-light text-[#092622] mb-4 uppercase tracking-wide">
                Our Values
              </h3>
              <ul className="space-y-4 text-gray-700 font-light">
                <li className="flex gap-3">
                  <span className="text-[#092622] font-bold">•</span>
                  <span>
                    <strong>Quality First</strong> - We never compromise on the
                    quality of our coffee or service
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#092622] font-bold">•</span>
                  <span>
                    <strong>Ethical Sourcing</strong> - Direct trade
                    relationships with sustainable coffee farms
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#092622] font-bold">•</span>
                  <span>
                    <strong>Community Connection</strong> - A welcoming space
                    for everyone
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#092622] font-bold">•</span>
                  <span>
                    <strong>Artisan Craftsmanship</strong> - Each cup prepared
                    with care and precision
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-light text-[#092622] mb-4 uppercase tracking-wide">
                Why Choose Us
              </h3>
              <ul className="space-y-4 text-gray-700 font-light">
                <li className="flex gap-3">
                  <span className="text-[#092622] font-bold">•</span>
                  <span>
                    <strong>Expertly Roasted</strong> - Small batch roasting
                    ensures freshness and flavor
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#092622] font-bold">•</span>
                  <span>
                    <strong>Skilled Baristas</strong> - Our team trained in the
                    art of coffee preparation
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#092622] font-bold">•</span>
                  <span>
                    <strong>Perfect Pairing</strong> - Complementary food
                    offerings prepared fresh daily
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#092622] font-bold">•</span>
                  <span>
                    <strong>Local Pride</strong> - Supporting the Toowoomba
                    community
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mt-12">
            <h3 className="text-2xl font-light text-[#092622] mb-4 uppercase tracking-wide">
              Our Process
            </h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-3 font-light text-gray-400">1</div>
                <h4 className="font-semibold text-gray-900 mb-2">Source</h4>
                <p className="text-gray-600 font-light text-sm">
                  Carefully select beans from ethical, sustainable farms
                  worldwide
                </p>
              </div>
              <div>
                <div className="text-4xl mb-3 font-light text-gray-400">2</div>
                <h4 className="font-semibold text-gray-900 mb-2">Roast</h4>
                <p className="text-gray-600 font-light text-sm">
                  Small batch roasting to achieve perfect flavor and aroma
                </p>
              </div>
              <div>
                <div className="text-4xl mb-3 font-light text-gray-400">3</div>
                <h4 className="font-semibold text-gray-900 mb-2">Brew</h4>
                <p className="text-gray-600 font-light text-sm">
                  Expert preparation by our skilled baristas for every cup
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-lg text-gray-600 mb-8 font-light">
            Visit us in 588 Ruthven Street or explore our menu online
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
              <h4 className="font-semibold mb-4 text-[#3bbdac] uppercase tracking-wide text-sm">
                Hours
              </h4>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Monday–Friday: 6:00 AM – 8:00 PM
                <br />
                Saturday–Sunday: 7:00 AM – 9:00 PM
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#3bbdac] uppercase tracking-wide text-sm">
                Contact
              </h4>
              <div className="text-gray-400 text-sm font-light space-y-2">
                <p>588 Ruthven Street, Toowoomba, QLD</p>
                <p>(555) 123-4567</p>
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
