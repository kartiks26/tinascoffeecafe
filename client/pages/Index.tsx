import { useState, useRef } from "react";
import { ShoppingCart, ArrowRight, MapPin, Clock, Phone, Mail, ChevronRight } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

const coffeeMenu: MenuItem[] = [
  {
    id: "espresso",
    name: "Classic Espresso",
    description: "Bold and rich double shot of pure espresso",
    price: 2.99,
  },
  {
    id: "cappuccino",
    name: "Silky Cappuccino",
    description: "Perfect blend of espresso, steamed milk & velvety foam",
    price: 4.49,
  },
  {
    id: "latte",
    name: "Smooth Latte",
    description: "Creamy espresso with perfectly steamed milk",
    price: 4.79,
  },
  {
    id: "americano",
    name: "Bold Americano",
    description: "Double espresso with hot water for balanced strength",
    price: 3.49,
  },
  {
    id: "mocha",
    name: "Rich Mocha",
    description: "Espresso, steamed milk, decadent chocolate, topped with cream",
    price: 5.29,
  },
  {
    id: "macchiato",
    name: "Artistic Macchiato",
    description: "Espresso with just a touch of steamed milk",
    price: 3.99,
  },
  {
    id: "cortado",
    name: "Balanced Cortado",
    description: "Equal parts espresso and steamed milk",
    price: 3.79,
  },
  {
    id: "flat-white",
    name: "Velvety Flat White",
    description: "Espresso with thin layer of microfoam",
    price: 4.99,
  },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

function triggerHaptic(pattern: "tap" | "success" | "warning") {
  if ("vibrate" in navigator) {
    const patterns: Record<string, number | number[]> = {
      tap: 10,
      success: [10, 20, 10],
      warning: [30, 20, 30],
    };
    navigator.vibrate(patterns[pattern]);
  }
}

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const cartRef = useRef<HTMLDivElement>(null);

  const addToCart = (item: MenuItem) => {
    triggerHaptic("success");
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    cartRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const removeFromCart = (itemId: string) => {
    triggerHaptic("tap");
    setCart((prevCart) =>
      prevCart
        .map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#014CE0] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-white font-bold text-2xl">TINA'S</div>
            <div className="text-white/80 text-sm font-light">COFFEE</div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => {
                triggerHaptic("tap");
                document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-white font-light hover:opacity-80 transition-opacity text-sm uppercase tracking-wide"
            >
              Menu
            </button>
            <button className="text-white font-light hover:opacity-80 transition-opacity text-sm uppercase tracking-wide">
              About
            </button>
            <button className="text-white font-light hover:opacity-80 transition-opacity text-sm uppercase tracking-wide">
              Contact
            </button>
          </div>

          <button
            onClick={() => {
              triggerHaptic("tap");
              cartRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative text-white hover:opacity-80 transition-opacity"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-[#014CE0] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
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

            <button
              onClick={() => {
                triggerHaptic("success");
                document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-3 border-2 border-[#014CE0] text-[#014CE0] rounded-full font-light uppercase tracking-widest text-sm hover:bg-[#014CE0] hover:text-white transition-all"
            >
              Order Now
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-r from-gray-50 to-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light text-[#014CE0] mb-6">
              Crafted for Community
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed font-light">
              We believe coffee is more than just a beverage—it's a moment of pause in your day. 
              Each cup is prepared with intention, using ethically sourced beans and time-honored 
              techniques. Come experience the warmth of genuine hospitality and exceptional taste.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
              Our Coffee Selection
            </h2>
            <p className="text-gray-600 text-lg font-light">
              Meticulously sourced and expertly prepared
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coffeeMenu.map((item, idx) => (
              <div
                key={item.id}
                className="group border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-all hover:border-[#014CE0] animate-slide-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#014CE0] transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 font-light line-clamp-2">
                  {item.description}
                </p>

                <div className="flex justify-between items-center mb-5">
                  <span className="text-2xl font-semibold text-[#014CE0]">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(item)}
                  className="w-full border-2 border-[#014CE0] text-[#014CE0] font-light py-3 rounded-lg hover:bg-[#014CE0] hover:text-white transition-all uppercase tracking-wide text-xs active:scale-95"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Section */}
      <section
        ref={cartRef}
        className="py-20 md:py-32 bg-gray-50"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-12">
            Your Order
          </h2>

          {cart.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <p className="text-gray-600 text-lg mb-8 font-light">
                Your cart is empty. Start building your order.
              </p>
              <button
                onClick={() => {
                  triggerHaptic("tap");
                  document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#014CE0] text-[#014CE0] rounded-full font-light uppercase tracking-widest text-sm hover:bg-[#014CE0] hover:text-white transition-all"
              >
                Browse Menu
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white rounded-lg p-6 border border-gray-200 hover:border-[#014CE0] transition-all"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-[#014CE0] font-light">${item.price.toFixed(2)} each</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="px-4 py-2 hover:bg-gray-100 transition-all font-light text-gray-600"
                      >
                        −
                      </button>
                      <span className="px-4 font-semibold text-gray-900 min-w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart({ ...item, id: item.id })}
                        className="px-4 py-2 hover:bg-gray-100 transition-all font-light text-gray-600"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-20">
                      <p className="text-xl font-semibold text-[#014CE0]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-white rounded-lg p-8 border-2 border-[#014CE0] mt-8">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-light">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-700 font-light">Tax & Service</span>
                    <span className="font-semibold text-gray-900">
                      ${(cartTotal * 0.1).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-[#014CE0] text-2xl">
                      ${(cartTotal * 1.1).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => triggerHaptic("success")}
                  className="w-full bg-[#014CE0] hover:bg-[#0139A8] text-white font-light py-4 rounded-lg text-lg uppercase tracking-widest transition-all active:scale-95"
                >
                  Complete Order
                </button>
              </div>
            </div>
          )}
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
              <p className="text-gray-400 text-sm font-light space-y-2">
                <div>Margaret Street, Toowoomba, QLD</div>
                <div>(555) 123-4567</div>
                <div>hello@tinascoffee.com</div>
              </p>
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
