export default function Footer() {
  return (
    <footer className="bg-[#171717] text-white py-16 ">
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
  );
}
