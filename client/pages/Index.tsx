import { useState, useRef } from "react";
import { Coffee, Droplets, Wind, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

const coffeeMenu: MenuItem[] = [
  {
    id: "espresso",
    name: "Classic Espresso",
    description: "Bold and rich double shot of pure espresso",
    price: 2.99,
    icon: "☕",
  },
  {
    id: "cappuccino",
    name: "Silky Cappuccino",
    description: "Perfect blend of espresso, steamed milk & velvety foam",
    price: 4.49,
    icon: "🤍",
  },
  {
    id: "latte",
    name: "Smooth Latte",
    description: "Creamy espresso with perfectly steamed milk",
    price: 4.79,
    icon: "☁️",
  },
  {
    id: "americano",
    name: "Bold Americano",
    description: "Double espresso with hot water for balanced strength",
    price: 3.49,
    icon: "💪",
  },
  {
    id: "mocha",
    name: "Rich Mocha",
    description: "Espresso, steamed milk, decadent chocolate, topped with cream",
    price: 5.29,
    icon: "🍫",
  },
  {
    id: "macchiato",
    name: "Artistic Macchiato",
    description: "Espresso with just a touch of steamed milk",
    price: 3.99,
    icon: "🎨",
  },
  {
    id: "cortado",
    name: "Balanced Cortado",
    description: "Equal parts espresso and steamed milk",
    price: 3.79,
    icon: "⚖️",
  },
  {
    id: "flat-white",
    name: "Velvety Flat White",
    description: "Espresso with thin layer of microfoam",
    price: 4.99,
    icon: "🥛",
  },
];

const specialties = [
  {
    name: "Ethically Sourced",
    description: "Direct trade with sustainable coffee farms",
    icon: <Coffee className="w-8 h-8" />,
  },
  {
    name: "Artisan Brewing",
    description: "Small batch roasted to perfection daily",
    icon: <Droplets className="w-8 h-8" />,
  },
  {
    name: "Smooth Flavor",
    description: "Premium quality with exceptional taste",
    icon: <Wind className="w-8 h-8" />,
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
  const [selectedCategory, setSelectedCategory] = useState<"all" | "espresso" | "specialty">("all");
  const cartRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <div className="bg-gradient-to-b from-amber-50 via-white to-amber-50 min-h-screen">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-amber-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              ☕
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
              Tina's Coffee
            </h1>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => {
              triggerHaptic("tap");
              setIsMenuOpen(!isMenuOpen);
            }}
            className="md:hidden"
          >
            <svg className="w-6 h-6 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => {
                triggerHaptic("tap");
                setSelectedCategory("all");
              }}
              className={`font-medium transition-all ${
                selectedCategory === "all" ? "text-amber-700" : "text-gray-700 hover:text-amber-700"
              }`}
            >
              Menu
            </button>
            <button className="text-gray-700 hover:text-amber-700 font-medium transition-all">
              About
            </button>
            <button className="text-gray-700 hover:text-amber-700 font-medium transition-all">
              Contact
            </button>
            <button
              onClick={() => {
                triggerHaptic("tap");
                cartRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="relative bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <ShoppingCart className="w-5 h-5 inline mr-2" />
              Cart {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-orange-100/20 rounded-full blur-3xl -top-40 left-0 w-96 h-96"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 to-amber-100/10 rounded-full blur-3xl -bottom-40 right-0 w-96 h-96"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fade-in">
            <div className="mb-6 inline-block">
              <div className="text-6xl sm:text-7xl animate-float">☕</div>
            </div>

            <h2 className="text-4xl sm:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              Craft Your Perfect{" "}
              <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                Coffee Moment
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience premium, ethically-sourced coffee crafted with passion. Every cup is an
              artisan masterpiece designed for your perfect day.
            </p>

            <button
              onClick={() => {
                triggerHaptic("success");
                document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 sm:px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              Explore Our Menu
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 sm:py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 sm:gap-6">
            {specialties.map((specialty, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition-all border border-amber-50 animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-amber-600 mb-4">{specialty.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{specialty.name}</h3>
                <p className="text-gray-600">{specialty.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 sm:py-32 bg-gradient-to-b from-transparent to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              Our Coffee Collection
            </h2>
            <p className="text-gray-600 text-lg">
              Handpicked selections for every coffee lover
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {["all", "espresso", "specialty"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  triggerHaptic("tap");
                  setSelectedCategory(cat as any);
                }}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-amber-200 hover:border-amber-400"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coffeeMenu.map((item, idx) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl hover:scale-105 transition-all border border-amber-100 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-amber-600">${item.price.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => addToCart(item)}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-bold py-3 rounded-xl transition-all hover:shadow-lg active:scale-95"
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
        className="py-20 sm:py-32 bg-gradient-to-b from-white to-amber-50/50"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">Your Order</h2>

          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-amber-200">
              <div className="text-5xl mb-4">☕</div>
              <p className="text-gray-600 text-lg mb-6">
                Your cart is empty. Start building your perfect coffee order!
              </p>
              <button
                onClick={() => {
                  triggerHaptic("tap");
                  document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
              >
                Browse Menu
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white rounded-xl p-6 shadow-md border border-amber-100 hover:shadow-lg transition-all"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-amber-600 font-semibold">${item.price.toFixed(2)} each</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-amber-50 rounded-lg border border-amber-200">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 hover:bg-amber-100 transition-all"
                      >
                        <Minus className="w-4 h-4 text-amber-700" />
                      </button>
                      <span className="px-4 font-bold text-gray-900 min-w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart({ ...item, id: item.id, icon: "", description: "" })}
                        className="p-2 hover:bg-amber-100 transition-all"
                      >
                        <Plus className="w-4 h-4 text-amber-700" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200 mt-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg text-gray-700">Subtotal:</span>
                  <span className="text-2xl font-bold text-amber-700">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-6 border-b border-amber-200 mb-6">
                  <span className="text-lg text-gray-700">Tax & Service:</span>
                  <span className="text-2xl font-bold text-amber-700">
                    ${(cartTotal * 0.1).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-2xl font-bold text-gray-900">Total:</span>
                  <span className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                    ${(cartTotal * 1.1).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => triggerHaptic("success")}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 rounded-xl text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
                >
                  Complete Order
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center font-bold">
                  ☕
                </div>
                <h3 className="text-xl font-bold">Tina's Coffee</h3>
              </div>
              <p className="text-gray-400">
                Crafting excellence in every cup since day one.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-amber-400">Hours</h4>
              <p className="text-gray-400 text-sm">
                Mon - Fri: 6:00 AM - 8:00 PM<br />
                Sat - Sun: 7:00 AM - 9:00 PM
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-amber-400">Contact</h4>
              <p className="text-gray-400 text-sm">
                📍 123 Coffee Street, Brew City<br />
                📞 (555) 123-4567<br />
                ✉️ hello@tinascoffee.com
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Tina's Coffee. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
