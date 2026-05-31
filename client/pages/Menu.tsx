import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "coffee" | "food";
  image: string;
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
    image: "https://images.unsplash.com/photo-1501339847302-ac426a36ae57?w=500&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=500&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1497636577773-f1231844b5a9?w=500&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1578365212468-0feb6f23bed3?w=500&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1514432324607-2e467f4af4d9?w=500&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1559056169-2b8b5a6b5f7d?w=500&h=400&fit=crop",
  },
  {
    id: "flat-white",
    name: "Velvety Flat White",
    description: "Espresso with thin layer of microfoam",
    price: 4.99,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=500&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&h=400&fit=crop",
  },
  {
    id: "bagel",
    name: "Smoked Salmon Bagel",
    description: "Cream cheese, smoked salmon, capers, and red onion",
    price: 8.99,
    category: "food",
    image: "https://images.unsplash.com/photo-1585238341710-4b4e6f289635?w=500&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=500&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1590080876872-da8dd4d1cb5f?w=500&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop",
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

export default function Menu() {
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
        </div>
      </nav>

      {/* Menu Header */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-4">Our Menu</h1>
          <p className="text-lg text-gray-600 font-light">
            Meticulously sourced and expertly prepared
          </p>
        </div>
      </section>

      {/* Coffee Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-light text-[#014CE0] mb-10 uppercase tracking-wide">
            Coffee
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coffeeItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all hover:border-[#014CE0]"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full text-left p-6 hover:bg-gray-50 transition-colors border-t border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h3>
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
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                          {group.name}
                        </h4>
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
      </section>

      {/* Food Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-light text-[#014CE0] mb-10 uppercase tracking-wide">
            Food
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {foodItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all hover:border-[#014CE0] bg-white"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full text-left p-6 hover:bg-gray-50 transition-colors border-t border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h3>
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
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                          {group.name}
                        </h4>
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
