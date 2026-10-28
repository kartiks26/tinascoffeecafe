"use client";

import "@google/model-viewer";
import { useState } from "react";
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
  CalendarDays,
} from "lucide-react";
import Reviews from "@/components/util/GoogleReviews";
import CoffeeCupViewer from "@/components/ui/CoffeeCupViewer";
import GoogleReviews from "@/components/ui/googleReviews";

function triggerHaptic(pattern: "tap" | "success") {
  if ("vibrate" in navigator) {
    const patterns: Record<string, number | number[]> = {
      tap: 10,
      success: [10, 20, 10],
    };
    navigator.vibrate(patterns[pattern]);
  }
}
const topSelections = [
  {
    name: "Spanish Latte",
    description:
      "Rich espresso blended with steamed milk and sweet condensed milk",
    price: "$6.00",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800",
  },
  {
    name: "Magic Coffee",
    description:
      "Double ristretto topped with silky steamed milk in a smooth, strong coffee",
    price: "$4.50",
    badge: "Popular",
    image:
      "https://www.livingnorth.com/images/media/articles/food-and-drink/eat-and-drink/coffee.png?",
  },
  {
    name: "Caesar Wrap with Chips",
    description:
      "Grilled chicken, crisp cos lettuce, parmesan and creamy Caesar dressing in a toasted wrap, served with golden chips",
    price: "$18.50",
    badge: "Best Seller",
    image:
      "https://media.hellofresh.com/q_100,w_3840,f_auto,c_limit,fl_lossy/recipes/image/HF_Y26_R1011_W08_NZ_R50242-5_Main__4high-db55c774.jpg",
  },
  {
    name: "Omelette with Relish",
    description:
      "Fluffy golden omelette served with house relish and toasted sourdough",
    price: "$18.50",
    badge: "Popular",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1gkj2eIiPMspBgdvaiHv6_TLqCZKTVYWK-2fM5dEjsQ&s=10",
  },
];
export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cateringForm, setCateringForm] = useState({
    name: "",
    phone: "",
    dayNeeded: "",
    people: "",
    details: "",
  });
  const [emailStatus, setEmailStatus] = useState<"idle" | "opened">("idle");

  const handleCateringSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent(
      `Catering enquiry from ${cateringForm.name}`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${cateringForm.name}`,
        `Phone: ${cateringForm.phone}`,
        `Day needed: ${cateringForm.dayNeeded}`,
        `How many people: ${cateringForm.people}`,
        "",
        "What you have in mind:",
        cateringForm.details,
      ].join("\n"),
    );

    setEmailStatus("opened");
    window.location.href = `mailto:tinasplacecafe75@gmail.com?subject=${subject}&body=${body}`;
  };

  const updateCateringField = (
    field: keyof typeof cateringForm,
    value: string,
  ) => {
    setCateringForm((current) => ({ ...current, [field]: value }));
    setEmailStatus("idle");
  };

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
              Tina`s Place
              <br />
              <span className="text-[#FFD700] text-4xl"> Cafe & Catering.</span>
            </h1>

            {/* Description */}
            <div className="space-y-2 text-white/90 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
              <p> 580 Ruthven St, Toowoomba City, Queensland</p>
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
                href="mailto:tinasplacecafe75@gmail.com"
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
              href="/menu"
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
      {/* Somerset Coffee Section */}
      {/* Somerset Coffee Feature */}
      <section className="bg-[#092622] text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Supplier Branding */}
            {/* Somerset Coffee Branding */}
            <div
              className="bg-[#F49926] rounded-3xl p-6 md:p-10
                flex flex-col items-center justify-center
                min-h-[300px]"
            >
              <img
                src="/images/Somerset-coffee-logo.png"
                alt="Somerset Artisan Coffee"
                className="w-full max-w-[340px] h-auto object-contain"
              />

              <p className="text-[#092622] text-sm mt-5 tracking-wide text-center">
                Proudly served at Tina's Place
              </p>
            </div>

            {/* Story */}
            <div>
              <p
                className="text-[#d6c1a1] uppercase tracking-[0.25em]
                      text-xs md:text-sm mb-5"
              >
                Our Coffee Partner
              </p>

              <h2
                className="text-4xl md:text-5xl font-semibold
                       leading-tight mb-6"
              >
                Great coffee
                <span className="block text-[#d6c1a1]">starts here.</span>
              </h2>

              <p className="text-gray-300 leading-relaxed mb-6">
                At Tina’s Place, we proudly serve Somerset Coffee, featuring
                distinctive blends sourced from coffee-growing regions around
                the world and roasted in Queensland.
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
              href="/menu?category=coffee"
              className="group relative overflow-hidden rounded-2xl h-48 hover:shadow-2xl transition-shadow duration-300"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=800&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-light mb-1 tracking-wide">
                  Coffee
                </h3>
                <p className="text-sm text-white/70 font-light">
                  Premium selections
                </p>
              </div>
            </a>

            <a
              href="/menu?category=tea"
              className="group relative overflow-hidden rounded-2xl h-48 hover:shadow-2xl transition-shadow duration-300"
              style={{
                backgroundImage:
                  "url('https://static.vecteezy.com/system/resources/thumbnails/076/353/572/small/hot-green-tea-with-lemon-showcasing-antioxidants-and-mild-caffeine-that-refresh-the-body-while-supporting-immune-health-during-a-cold-free-photo.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-light mb-1 tracking-wide">
                  Tea & Refreshers
                </h3>
                <p className="text-sm text-white/70 font-light">
                  Cool & relaxing
                </p>
              </div>
            </a>

            <a
              href="/menu?category=breakfast"
              className="group relative overflow-hidden rounded-2xl h-48 hover:shadow-2xl transition-shadow duration-300"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=800&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-light mb-1 tracking-wide">
                  Breakfast
                </h3>
                <p className="text-sm text-white/70 font-light">
                  Morning favorites
                </p>
              </div>
            </a>

            <a
              href="/menu?category=Lunch Wraps"
              className="group relative overflow-hidden rounded-2xl h-48 hover:shadow-2xl transition-shadow duration-300"
              style={{
                backgroundImage:
                  "url('https://www.deerandoak.co.uk/cdn/shop/articles/D_O_website_imagery_17_2048x.jpg?v=1745590921')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-light mb-1 tracking-wide">Lunch</h3>
                <p className="text-sm text-white/70 font-light">
                  Hearty selections
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>
      {/* This Week's Top Selections */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 text-center">
            This Week's Top Selections
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 font-light">
            Customer favorites we're obsessed with
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {topSelections.map((item) => (
              <div
                key={item.name}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200"
              >
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  <div
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                    style={{
                      backgroundImage: `url('${item.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.name}
                  </h3>

                  <p className="text-gray-600 text-sm font-light mb-4">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-[#092622]">
                      {item.price}
                    </span>

                    {item.badge && (
                      <span className="text-xs text-[#FFD700] font-semibold uppercase tracking-widest">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
            href="/menu"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-[#092622] hover:bg-[#0139A8] text-white font-light uppercase tracking-widest rounded-full transition-all hover:shadow-xl active:scale-95"
          >
            View Menu
          </a>
        </div>
      </section>
      <section className="bg-[#efe7dc] px-5 py-10 text-[#2d1f1c] sm:px-6 md:px-8 md:py-16 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="border-b border-[#2d1f1c]/40 pb-5 md:pb-6">
            <p className="mb-4 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-[#2d1f1c] sm:text-[0.7rem]">
              Catering
            </p>
            <h2 className="max-w-5xl text-[2.7rem] font-light leading-[0.92] tracking-[-0.06em] text-[#2d1f1c] sm:text-[3.4rem] md:text-7xl lg:text-[6rem]">
              Platters for the
              <span className="mt-2 block">office,</span>
              <span className="mt-2 block italic text-[#2c6960]">
                boxed up in-house.
              </span>
            </h2>
          </div>

          <div className="mt-7 grid gap-7 lg:mt-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-8">
            <div>
              <p
                className="max-w-3xl text-lg leading-relaxed text-[#2d1f1c]/80 sm:text-xl md:text-[1.9rem] md:leading-[1.35]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                The catering half of our name: sandwich triangles and wraps, and
                sweet boxes of muffins, tarts and biscuits, for your next
                meeting or get-together.
              </p>

              <div className="mt-8 space-y-0 border-t border-[#2d1f1c]/35 md:mt-10">
                {[
                  {
                    number: "01",
                    title: "Tell us the day and the numbers",
                    description: "Call 0490 883 932 or send the form below.",
                  },
                  {
                    number: "02",
                    title: "Choose what goes in the boxes",
                    description:
                      "Sandwiches, wraps, something sweet, or a mix.",
                  },
                  {
                    number: "03",
                    title: "We sort out the details with you",
                    description:
                      "Timing and what goes in each box, over the phone or by email.",
                  },
                ].map((item) => (
                  <div
                    key={item.number}
                    className="grid gap-3 border-b border-[#2d1f1c]/35 py-5 md:grid-cols-[90px_1fr] md:gap-6 md:py-7"
                  >
                    <div
                      className="text-[2.3rem] font-light leading-none text-[#b05f7a] sm:text-[2.8rem] md:text-5xl"
                      style={{
                        fontFamily: "Georgia, 'Times New Roman', serif",
                      }}
                    >
                      {item.number}
                    </div>
                    <div>
                      <h3
                        className="text-[1.5rem] leading-tight text-[#2d1f1c] sm:text-[1.8rem] md:text-3xl"
                        style={{
                          fontFamily: "Georgia, 'Times New Roman', serif",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="mt-2 max-w-xl text-sm leading-relaxed text-[#2d1f1c]/75 sm:text-base md:text-lg"
                        style={{
                          fontFamily: "Georgia, 'Times New Roman', serif",
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 rounded-[18px] border border-[#2d1f1c]/30 bg-[#f7f1ea] p-4 shadow-[0_10px_25px_rgba(45,31,28,0.04)] sm:p-5 md:p-7">
              <h3
                className="mb-5 text-[2.3rem] leading-none text-[#2d1f1c] sm:text-[2.7rem] md:text-[3.2rem]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Catering <span className="italic text-[#2c6960]">enquiry</span>
              </h3>

              <form
                id="catering-enquiry"
                onSubmit={handleCateringSubmit}
                className="space-y-3 sm:space-y-4"
              >
                <label className="block text-[0.6rem] font-medium uppercase tracking-[0.24em] text-[#2d1f1c] sm:text-[0.68rem]">
                  Your Name
                  <input
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    value={cateringForm.name}
                    onChange={(event) =>
                      updateCateringField("name", event.target.value)
                    }
                    className="mt-2 h-12 w-full border border-[#2d1f1c]/35 bg-[#f1e8df] px-3 text-base text-[#2d1f1c] shadow-inner outline-none transition focus:border-[#2c6960] sm:h-14 sm:px-4"
                  />
                </label>

                <label className="block text-[0.6rem] font-medium uppercase tracking-[0.24em] text-[#2d1f1c] sm:text-[0.68rem]">
                  Phone
                  <input
                    type="tel"
                    name="phone"
                    required
                    autoComplete="tel"
                    value={cateringForm.phone}
                    onChange={(event) =>
                      updateCateringField("phone", event.target.value)
                    }
                    className="mt-2 h-12 w-full border border-[#2d1f1c]/35 bg-[#f1e8df] px-3 text-base text-[#2d1f1c] shadow-inner outline-none transition focus:border-[#2c6960] sm:h-14 sm:px-4"
                  />
                </label>

                <label className="block text-[0.6rem] font-medium uppercase tracking-[0.24em] text-[#2d1f1c] sm:text-[0.68rem]">
                  Day Needed
                  <div className="relative mt-2">
                    <input
                      type="date"
                      name="dayNeeded"
                      required
                      value={cateringForm.dayNeeded}
                      onChange={(event) =>
                        updateCateringField("dayNeeded", event.target.value)
                      }
                      className="h-12 w-[95%] border border-[#2d1f1c]/35 bg-[#f1e8df] px-3 pr-10 text-base text-[#2d1f1c] shadow-inner outline-none transition focus:border-[#2c6960] sm:h-14 sm:px-4 sm:pr-12"
                    />
                    <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2d1f1c]/60 sm:right-4 sm:h-4 sm:w-4" />
                  </div>
                </label>

                <label className="block text-[0.6rem] font-medium uppercase tracking-[0.24em] text-[#2d1f1c] sm:text-[0.68rem]">
                  How Many People
                  <input
                    type="number"
                    name="people"
                    required
                    min="1"
                    step="1"
                    value={cateringForm.people}
                    onChange={(event) =>
                      updateCateringField("people", event.target.value)
                    }
                    className="mt-2 h-12 w-full border border-[#2d1f1c]/35 bg-[#f1e8df] px-3 text-base text-[#2d1f1c] shadow-inner outline-none transition focus:border-[#2c6960] sm:h-14 sm:px-4"
                  />
                </label>

                <label className="block text-[0.6rem] font-medium uppercase tracking-[0.24em] text-[#2d1f1c] sm:text-[0.68rem]">
                  What You Have In Mind
                  <textarea
                    name="details"
                    required
                    rows={4}
                    value={cateringForm.details}
                    onChange={(event) =>
                      updateCateringField("details", event.target.value)
                    }
                    className="mt-2 w-full resize-none border border-[#2d1f1c]/35 bg-[#f1e8df] px-3 py-3 text-base text-[#2d1f1c] shadow-inner outline-none transition focus:border-[#2c6960] sm:px-4"
                  />
                </label>
              </form>

              <button
                type="submit"
                form="catering-enquiry"
                className="mt-7 inline-flex w-full items-center justify-between bg-[#0d3d3a] px-4 py-3 text-left text-base font-medium uppercase tracking-[0.12em] text-white transition hover:bg-[#0a302e] hover:text-[#f5d88f] sm:px-5 sm:py-4 sm:text-xl"
              >
                <span>Email the enquiry</span>
                <ArrowRight className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              </button>

              {emailStatus === "opened" && (
                <p
                  role="status"
                  className="mt-4 text-sm font-medium text-[#2c6960] sm:text-base"
                >
                  Your email app should now be open with the enquiry ready to
                  send.
                </p>
              )}

              <p
                className="mt-4 text-sm leading-relaxed text-[#2d1f1c]/75 sm:text-base"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                This opens your email app with the details filled in, addressed
                to
                <span className="mt-1 block underline">
                  tinasplacecafe75@gmail.com.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
      <div
        id="featurable-806e1882-029c-4d23-abdf-d8ae34917291"
        data-featurable-async
      ></div>
      <section className="overflow-hidden bg-[#efe7dc] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#d8c9b8] shadow-[0_24px_70px_rgba(45,31,28,0.14)] sm:aspect-[5/4] lg:aspect-[4/5]">
                <CoffeeCupViewer />
              </div>
              <div className="absolute -bottom-5 -right-2 rounded-full bg-[#b05f7a] px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-xl sm:right-5 sm:px-6">
                Poured with a heart
              </div>
            </div>

            <div className="lg:pl-2">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#2c6960]">
                Coffee, made for lingering
              </p>
              <h2 className="max-w-2xl text-5xl font-light leading-[0.94] tracking-[-0.055em] text-[#2d1f1c] sm:text-6xl md:text-7xl lg:text-[5.2rem]">
                First cup at
                <span className="mt-2 block italic text-[#2c6960]">6:30.</span>
              </h2>
              <p
                className="mt-8 max-w-xl text-lg leading-relaxed text-[#2d1f1c]/80 sm:text-xl"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Espresso coffee with latte art on the cup, whether you sit in or
                take it up Ruthven Street.
              </p>

              <blockquote className="mt-8 border-l-2 border-[#b05f7a] pl-6 text-base leading-relaxed text-[#2d1f1c]/75 sm:text-lg">
                “Coffee is great and fair price.”
                <cite className="mt-3 block text-xs font-semibold uppercase tracking-[0.18em] text-[#2c6960]">
                  AFRI3ND · Google review
                </cite>
              </blockquote>

              <div className="mt-9 grid gap-5 border-t border-[#2d1f1c]/30 pt-7 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2c6960]">
                    Weekdays
                  </p>
                  <p className="mt-2 text-lg font-medium text-[#2d1f1c]">
                    6:30am — 2:30pm
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2c6960]">
                    Saturday
                  </p>
                  <p className="mt-2 text-lg font-medium text-[#2d1f1c]">
                    7:00am — 1:00pm
                  </p>
                </div>
              </div>

              <a
                href="/menu"
                className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#0d3d3a] px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#0a302e] hover:text-[#f5d88f]"
              >
                See what’s brewing
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>
      <GoogleReviews />
      <section className="bg-[#f4efe8] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#2c6960]">
                Come by
              </p>
              <h2 className="text-5xl font-light leading-none tracking-[-0.05em] text-[#092622] sm:text-6xl md:text-7xl">
                Find Us
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-[#2d1f1c]/70 sm:text-lg">
              Your table is waiting in the heart of Toowoomba.
            </p>
          </div>

          <div className="grid overflow-hidden rounded-[2rem] bg-[#fffdf9] shadow-[0_24px_70px_rgba(45,31,28,0.12)] lg:grid-cols-[0.78fr_1.22fr]">
            <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
              <div>
                <div className="mb-10 flex items-start gap-4 border-b border-[#2d1f1c]/15 pb-8">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#092622] text-white">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2c6960]">
                      Address
                    </p>
                    <address className="not-italic text-xl leading-snug text-[#2d1f1c] sm:text-2xl">
                      588 Ruthven Street
                      <br />
                      Toowoomba, QLD
                    </address>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className="flex gap-4">
                    <Clock
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#b05f7a]"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2c6960]">
                        Hours
                      </p>
                      <p className="text-sm leading-relaxed text-[#2d1f1c]/75">
                        Mon–Fri: 6am–8pm
                        <br />
                        Sat–Sun: 7am–9pm
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Phone
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#b05f7a]"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2c6960]">
                        Call us
                      </p>
                      <a
                        href="tel:+61469633877"
                        className="text-sm text-[#2d1f1c]/75 transition hover:text-[#092622]"
                      >
                        +61 469 633 877
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row lg:mt-14">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=588+Ruthven+Street+Toowoomba+QLD"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#092622] px-6 py-4 text-sm font-semibold uppercase tracking-[0.13em] text-white transition hover:bg-[#0139a8]"
                >
                  Get directions
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="mailto:hello@tinascoffee.com"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2d1f1c]/25 px-6 py-4 text-sm font-semibold uppercase tracking-[0.13em] text-[#092622] transition hover:border-[#092622] hover:bg-[#f4efe8]"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Email
                </a>
              </div>
            </div>

            <div className="relative min-h-[390px] overflow-hidden bg-gray-200 lg:min-h-[570px]">
              <iframe
                title="Map showing Tina's Coffee Place at 588 Ruthven Street, Toowoomba"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3417.1927968908212!2d151.9504918753185!3d-27.564598876264707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b965d1a7b0e5baf%3A0xfce9b5d7b7320700!2zVGluYeKAmXMgUGxhY2UgQ2FmZSAmIENhdGVyaW5nLvCfkpU!5e1!3m2!1sen!2sau!4v1780207589144!5m2!1sen!2sau"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
