import { useState } from "react";
import { MapPin, Clock, Phone, Mail, ChevronRight } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "coffee" | "food";
  addons?: AddonGroup[];
}

interface AddonGroup {
  name: string;
  options: AddonOption[];
}

interface AddonOption {
  label: string;
  priceModifier: number;
}

const menuItems: MenuItem[] = [
  // Coffee
  {
    id: "espresso",
    name: "Classic Espresso",
    description: "Bold and rich double shot of pure espresso",
    price: 2.99,
    category: "coffee",
    addons: [
      {
        name: "Size",
        options: [
          { label: "Single Shot", priceModifier: 0 },
          { label: "Double Shot", priceModifier: 0.5 },
          { label: "Triple Shot", priceModifier: 1 },
        ],
      },
    ],
  },
  {
    id: "cappuccino",
    name: "Silky Cappuccino",
    description: "Perfect blend of espresso, steamed milk & velvety foam",
    price: 4.49,
    category: "coffee",
    addons: [
      {
        name: "Milk",
        options: [
          { label: "Whole Milk", priceModifier: 0 },
          { label: "Oat Milk", priceModifier: 0.5 },
          { label: "Almond Milk", priceModifier: 0.5 },
          { label: "Soy Milk", priceModifier: 0.5 },
        ],
      },
      {
        name: "Size",
        options: [
          { label: "Small", priceModifier: 0 },
          { label: "Medium", priceModifier: 0.5 },
          { label: "Large", priceModifier: 1 },
        ],
      },
    ],
  },
  {
    id: "latte",
    name: "Smooth Latte",
    description: "Creamy espresso with perfectly steamed milk",
    price: 4.79,
    category: "coffee",
    addons: [
      {
        name: "Milk",
        options: [
          { label: "Whole Milk", priceModifier: 0 },
          { label: "Oat Milk", priceModifier: 0.5 },
          { label: "Almond Milk", priceModifier: 0.5 },
          { label: "Soy Milk", priceModifier: 0.5 },
        ],
      },
      {
        name: "Flavor",
        options: [
          { label: "Original", priceModifier: 0 },
          { label: "Vanilla", priceModifier: 0.5 },
          { label: "Hazelnut", priceModifier: 0.5 },
          { label: "Caramel", priceModifier: 0.5 },
        ],
      },
    ],
  },
  {
    id: "americano",
    name: "Bold Americano",
    description: "Double espresso with hot water for balanced strength",
    price: 3.49,
    category: "coffee",
    addons: [
      {
        name: "Size",
        options: [
          { label: "Single", priceModifier: 0 },
          { label: "Double", priceModifier: 0.5 },
          { label: "Triple", priceModifier: 1 },
        ],
      },
    ],
  },
  {
    id: "mocha",
    name: "Rich Mocha",
    description: "Espresso, steamed milk, decadent chocolate, topped with cream",
    price: 5.29,
    category: "coffee",
    addons: [
      {
        name: "Milk",
        options: [
          { label: "Whole Milk", priceModifier: 0 },
          { label: "Oat Milk", priceModifier: 0.5 },
          { label: "Almond Milk", priceModifier: 0.5 },
        ],
      },
      {
        name: "Extras",
        options: [
          { label: "No Cream", priceModifier: 0 },
          { label: "Extra Cream", priceModifier: 0.5 },
          { label: "Whipped Cream", priceModifier: 0.75 },
        ],
      },
    ],
  },
  {
    id: "macchiato",
    name: "Artistic Macchiato",
    description: "Espresso with just a touch of steamed milk",
    price: 3.99,
    category: "coffee",
    addons: [
      {
        name: "Size",
        options: [
          { label: "Small", priceModifier: 0 },
          { label: "Medium", priceModifier: 0.5 },
          { label: "Large", priceModifier: 1 },
        ],
      },
    ],
  },
  {
    id: "cortado",
    name: "Balanced Cortado",
    description: "Equal parts espresso and steamed milk",
    price: 3.79,
    category: "coffee",
  },
  {
    id: "flat-white",
    name: "Velvety Flat White",
    description: "Espresso with thin layer of microfoam",
    price: 4.99,
    category: "coffee",
    addons: [
      {
        name: "Milk",
        options: [
          { label: "Whole Milk", priceModifier: 0 },
          { label: "Oat Milk", priceModifier: 0.5 },
          { label: "Almond Milk", priceModifier: 0.5 },
        ],
      },
    ],
  },
  // Food
  {
    id: "croissant",
    name: "Butter Croissant",
    description: "Flaky, buttery croissant with a delicate crumb",
    price: 3.99,
    category: "food",
    addons: [
      {
        name: "Add-ons",
        options: [
          { label: "Plain", priceModifier: 0 },
          { label: "Chocolate", priceModifier: 1.5 },
          { label: "Almond", priceModifier: 1.5 },
        ],
      },
    ],
  },
  {
    id: "sandwich",
    name: "Morning Sandwich",
    description: "Fresh egg, bacon, and cheddar on artisan bread",
    price: 7.99,
    category: "food",
    addons: [
      {
        name: "Bread",
        options: [
          { label: "White", priceModifier: 0 },
          { label: "Whole Wheat", priceModifier: 0 },
          { label: "Sourdough", priceModifier: 0.5 },
        ],
      },
      {
        name: "Temperature",
        options: [
          { label: "Cold", priceModifier: 0 },
          { label: "Toasted", priceModifier: 0 },
        ],
      },
    ],
  },
  {
    id: "muffin",
    name: "Blueberry Muffin",
    description: "Fresh blueberries in a tender, moist muffin",
    price: 4.49,
    category: "food",
  },
  {
    id: "bagel",
    name: "Smoked Salmon Bagel",
    description: "Cream cheese, smoked salmon, capers, and red onion",
    price: 8.99,
    category: "food",
    addons: [
      {
        name: "Add-ons",
        options: [
          { label: "Standard", priceModifier: 0 },
          { label: "Extra Salmon", priceModifier: 2 },
          { label: "Extra Cream Cheese", priceModifier: 0.75 },
        ],
      },
    ],
  },
  {
    id: "avocado-toast",
    name: "Avocado Toast",
    description: "Ripe avocado, poached egg, cherry tomatoes on whole grain",
    price: 7.49,
    category: "food",
    addons: [
      {
        name: "Bread",
        options: [
          { label: "Whole Grain", priceModifier: 0 },
          { label: "Sourdough", priceModifier: 0.5 },
          { label: "Multigrain", priceModifier: 0.5 },
        ],
      },
      {
        name: "Egg",
        options: [
          { label: "Poached", priceModifier: 0 },
          { label: "Scrambled", priceModifier: 0 },
          { label: "Fried", priceModifier: 0 },
        ],
      },
    ],
  },
  {
    id: "granola",
    name: "Yogurt Granola Bowl",
    description: "Creamy yogurt, house-made granola, fresh berries, honey",
    price: 6.99,
    category: "food",
    addons: [
      {
        name: "Yogurt",
        options: [
          { label: "Greek", priceModifier: 0 },
          { label: "Coconut", priceModifier: 0.5 },
          { label: "Regular", priceModifier: 0 },
        ],
      },
    ],
  },
  {
    id: "fruit-salad",
    name: "Fresh Fruit Salad",
    description: "Seasonal mix of fresh fruits with mint and lime dressing",
    price: 5.99,
    category: "food",
  },
];

function triggerHaptic(pattern: "tap" | "success") {
  if ("vibrate" in navigator) {
    const patterns: Record<string, number | number[]> = {
      tap: 10,
      success: [10, 20, 10],
    };
    navigator.vibrate(patterns[pattern]);
  }
}

interface ExpandedItem {
  id: string;
  selectedAddons: Record<string, string>;
}

export default function Index() {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [selectedAddons, setSelectedAddons] = useState<Record<string, Record<string, string>>>({});

  const toggleExpand = (itemId: string) => {
    triggerHaptic("tap");
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleAddonSelect = (itemId: string, groupName: string, option: string) => {
    triggerHaptic("tap");
    setSelectedAddons((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [groupName]: option,
      },
    }));
  };

  const calculatePrice = (item: MenuItem) => {
    let total = item.price;
    if (selectedAddons[item.id] && item.addons) {
      item.addons.forEach((group) => {
        const selectedOption = selectedAddons[item.id][group.name];
        if (selectedOption) {
          const option = group.options.find((opt) => opt.label === selectedOption);
          if (option) {
            total += option.priceModifier;
          }
        }
      });
    }
    return total;
  };

  const coffeeItems = menuItems.filter((item) => item.category === "coffee");
  const foodItems = menuItems.filter((item) => item.category === "food");

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
              Our Menu
            </h2>
            <p className="text-gray-600 text-lg font-light">
              Meticulously sourced and expertly prepared
            </p>
          </div>

          {/* Coffee Section */}
          <div className="mb-20">
            <h3 className="text-3xl font-light text-[#014CE0] mb-8 uppercase tracking-wide">
              Coffee
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {coffeeItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#014CE0] transition-all animate-slide-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#014CE0] transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600 font-light line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-[#014CE0] transition-transform flex-shrink-0 ml-4 ${
                          expandedItems[item.id] ? "rotate-90" : ""
                        }`}
                      />
                    </div>

                    <div className="text-2xl font-semibold text-[#014CE0]">
                      ${calculatePrice(item).toFixed(2)}
                    </div>
                  </button>

                  {expandedItems[item.id] && item.addons && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
                      {item.addons.map((group) => (
                        <div key={group.name}>
                          <h5 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                            {group.name}
                          </h5>
                          <div className="space-y-2">
                            {group.options.map((option) => (
                              <label
                                key={option.label}
                                className="flex items-center p-2 rounded hover:bg-white cursor-pointer transition-colors"
                              >
                                <input
                                  type="radio"
                                  name={`${item.id}-${group.name}`}
                                  checked={
                                    selectedAddons[item.id]?.[group.name] === option.label
                                  }
                                  onChange={() =>
                                    handleAddonSelect(item.id, group.name, option.label)
                                  }
                                  className="w-4 h-4 accent-[#014CE0]"
                                />
                                <span className="ml-3 text-sm text-gray-700 flex-1">
                                  {option.label}
                                </span>
                                {option.priceModifier > 0 && (
                                  <span className="text-sm text-[#014CE0] font-semibold">
                                    +${option.priceModifier.toFixed(2)}
                                  </span>
                                )}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-700 font-light">
                          Total: <span className="font-bold text-[#014CE0] text-lg">${calculatePrice(item).toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Food Section */}
          <div>
            <h3 className="text-3xl font-light text-[#014CE0] mb-8 uppercase tracking-wide">
              Food
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {foodItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#014CE0] transition-all animate-slide-up"
                  style={{ animationDelay: `${(idx + coffeeItems.length) * 0.05}s` }}
                >
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#014CE0] transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600 font-light line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      </div>
                      {item.addons && (
                        <ChevronRight
                          className={`w-5 h-5 text-[#014CE0] transition-transform flex-shrink-0 ml-4 ${
                            expandedItems[item.id] ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </div>

                    <div className="text-2xl font-semibold text-[#014CE0]">
                      ${calculatePrice(item).toFixed(2)}
                    </div>
                  </button>

                  {expandedItems[item.id] && item.addons && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
                      {item.addons.map((group) => (
                        <div key={group.name}>
                          <h5 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                            {group.name}
                          </h5>
                          <div className="space-y-2">
                            {group.options.map((option) => (
                              <label
                                key={option.label}
                                className="flex items-center p-2 rounded hover:bg-white cursor-pointer transition-colors"
                              >
                                <input
                                  type="radio"
                                  name={`${item.id}-${group.name}`}
                                  checked={
                                    selectedAddons[item.id]?.[group.name] === option.label
                                  }
                                  onChange={() =>
                                    handleAddonSelect(item.id, group.name, option.label)
                                  }
                                  className="w-4 h-4 accent-[#014CE0]"
                                />
                                <span className="ml-3 text-sm text-gray-700 flex-1">
                                  {option.label}
                                </span>
                                {option.priceModifier > 0 && (
                                  <span className="text-sm text-[#014CE0] font-semibold">
                                    +${option.priceModifier.toFixed(2)}
                                  </span>
                                )}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-700 font-light">
                          Total: <span className="font-bold text-[#014CE0] text-lg">${calculatePrice(item).toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
