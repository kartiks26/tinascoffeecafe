import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import coffeeItemsJson from "@/data/coffee-items.json";
import foodItemsJson from "@/data/food-items.json";

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
  const [selectedAddons, setSelectedAddons] = useState<
    Record<string, Record<string, string>>
  >({});
  const [customizeItem, setCustomizeItem] = useState<MenuItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCustomize = (item: MenuItem) => {
    triggerHaptic("tap");
    setCustomizeItem(item);
    setDialogOpen(true);
  };

  const handleAddonSelect = (
    itemId: string,
    groupName: string,
    option: string,
  ) => {
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
          const option = group.options.find(
            (opt) => opt.label === selectedOption,
          );
          if (option) {
            total += option.priceModifier;
          }
        }
      });
    }
    return total;
  };

  const coffeeItems = coffeeItemsJson as MenuItem[];
  const foodItems = foodItemsJson as MenuItem[];

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Header />

      {/* Menu Header */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl md:text-6xl font-light text-gray-900 mb-4">
            Our Menu
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Meticulously sourced and expertly prepared
          </p>
        </div>
      </section>

      {/* Coffee Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl sm:text-4xl font-light text-[#092622] mb-10 uppercase tracking-wide">
            Coffee
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coffeeItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-none overflow-hidden hover:shadow-xl transition-all hover:border-[#092622] bg-white"
              >
                <button
                  type="button"
                  onClick={() => handleCustomize(item)}
                  className="w-full text-left group"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.7fr]">
                    <div className="hidden sm:block relative h-40 sm:h-48 overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col justify-between p-4 sm:p-6">
                      <div>
                        <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2">
                          {item.name}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 font-light mb-3">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-base sm:text-2xl font-semibold text-[#092622]">
                          ${calculatePrice(item).toFixed(2)}
                        </div>
                        <div className="text-xs uppercase tracking-[0.24em] text-[#092622] font-semibold hidden sm:block">
                          {item.addons
                            ? item.addons.map((group) => group.name).join(" • ")
                            : "No customization"}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-light text-[#092622] mb-10 uppercase tracking-wide">
            Food
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {foodItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-none overflow-hidden hover:shadow-xl transition-all hover:border-[#092622] bg-white"
              >
                <button
                  type="button"
                  onClick={() => handleCustomize(item)}
                  className="w-full text-left group"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.7fr]">
                    <div className="hidden sm:block relative h-40 sm:h-48 overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col justify-between p-4 sm:p-6">
                      <div>
                        <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2">
                          {item.name}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 font-light mb-3">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-base sm:text-2xl font-semibold text-[#092622]">
                          ${calculatePrice(item).toFixed(2)}
                        </div>
                        <div className="text-xs uppercase tracking-[0.24em] text-[#092622] font-semibold hidden sm:block">
                          {item.addons
                            ? item.addons.map((group) => group.name).join(" • ")
                            : "No customization"}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
          <div className="bg-white max-h-[calc(100vh-3rem)] overflow-y-auto">
            {customizeItem?.image && (
              <div className="w-full">
                <img
                  src={customizeItem.image}
                  alt={customizeItem.name}
                  className="w-full h-56 sm:h-72 object-cover"
                />
              </div>
            )}
            <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-200">
              <div>
                <DialogTitle className="text-2xl font-semibold text-gray-900">
                  Customize {customizeItem?.name}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mt-2">
                  Choose your preferred options for milk, size, flavors, and
                  more.
                </DialogDescription>
              </div>
            </div>

            <div className="space-y-8 p-6">
              {customizeItem?.addons?.length ? (
                customizeItem.addons.map((group) => (
                  <div key={group.name} className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#092622]">
                      {group.name}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {group.options.map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() =>
                            handleAddonSelect(
                              customizeItem.id,
                              group.name,
                              option.label,
                            )
                          }
                          className={`rounded-none border p-4 text-left transition ${
                            selectedAddons[customizeItem.id]?.[group.name] ===
                            option.label
                              ? "border-[#092622] bg-[#e8efff]"
                              : "border-gray-200 bg-white hover:border-[#092622]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-medium text-gray-900">
                              {option.label}
                            </span>
                            {option.priceModifier > 0 ? (
                              <span className="text-sm text-[#092622] font-semibold">
                                +${option.priceModifier.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">
                                Included
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-none bg-gray-50 p-6 text-center text-sm text-gray-600">
                  No additional customization options are available for this
                  item.
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-600">Estimated total</p>
                <p className="text-2xl font-semibold text-[#092622]">
                  $
                  {customizeItem
                    ? calculatePrice(customizeItem).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <DialogClose asChild>
                  <button
                    type="button"
                    className="rounded-none bg-white px-5 py-3 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-100"
                  >
                    Close
                  </button>
                </DialogClose>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
