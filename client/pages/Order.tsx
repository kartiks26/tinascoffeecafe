import { useState } from "react";
import { Loader } from "lucide-react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { useSquareMenu } from "@/hooks/useSquareMenu";
import { SquareProduct } from "@shared/api";

function triggerHaptic(pattern: "tap" | "success") {
  if ("vibrate" in navigator) {
    const patterns: Record<string, number | number[]> = {
      tap: 10,
      success: [10, 20, 10],
    };
    navigator.vibrate(patterns[pattern]);
  }
}

// Extract base name and size from "Latte (Medium)" → { base: "Latte", size: "Medium" }
function parseVariationName(name: string): {
  base: string;
  size: string | null;
} {
  const match = name.match(/^(.+?)\s*\(([^)]+)\)$/);
  if (match) return { base: match[1].trim(), size: match[2].trim() };
  return { base: name, size: null };
}

const SIZE_ORDER = ["Small", "Regular", "Medium", "Large", "Huge"];

// Group flat variation list into logical menu items
function groupProducts(products: SquareProduct[]) {
  const groups = new Map<string, SquareProduct[]>();

  products.forEach((p) => {
    const { base } = parseVariationName(p.name);
    const key = `${p.itemId}__${base}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  });

  return Array.from(groups.values()).map((variations) => {
    // Sort by SIZE_ORDER
    variations.sort((a, b) => {
      const { size: sA } = parseVariationName(a.name);
      const { size: sB } = parseVariationName(b.name);
      return (
        (SIZE_ORDER.indexOf(sA || "") ?? 99) -
        (SIZE_ORDER.indexOf(sB || "") ?? 99)
      );
    });
    return variations;
  });
}

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {},
  );

  const { menu, loading, error } = useSquareMenu();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-10 h-10 text-[#092622] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-light tracking-wide">
            Loading menu…
          </p>
        </div>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Unable to load menu
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {error || "Please try again later"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#092622] text-white text-sm rounded-full"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredProducts = selectedCategory
    ? menu.products.filter(
        (p) => p.categoryId === selectedCategory && p.available,
      )
    : menu.products.filter((p) => p.available);

  const groupedItems = groupProducts(filteredProducts);

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Category pills */}
        {menu.categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
            <button
              onClick={() => {
                setSelectedCategory(null);
                triggerHaptic("tap");
              }}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all border ${
                selectedCategory === null
                  ? "bg-[#092622] text-white border-[#092622]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
              }`}
            >
              All
            </button>
            {menu.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  triggerHaptic("tap");
                }}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? "bg-[#092622] text-white border-[#092622]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {groupedItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No items available in this category
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-6 lg:grid-cols-3 gap-5">
            {groupedItems.map((variations) => {
              const groupKey = variations[0].itemId;
              const hasMultipleSizes = variations.length > 1;
              const selectedId = selectedSizes[groupKey] || variations[0].id;
              const active =
                variations.find((v) => v.id === selectedId) || variations[0];
              const { base } = parseVariationName(active.name);

              return (
                <div
                  key={groupKey}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-44 bg-gray-100 overflow-hidden">
                    {active.imageUrl ? (
                      <img
                        src={active.imageUrl}
                        alt={base}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg
                          className="w-10 h-10"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    {/* Price badge */}
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-[#092622] text-sm font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      {active?.isVariablePrice
                        ? "Market price"
                        : `$${active?.price.toFixed(2)}`}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    {/* Name */}
                    <h3 className="font-medium text-gray-900 text-sm mb-1 leading-snug">
                      {base}
                    </h3>

                    {/* Description */}
                    {active.description && (
                      <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
                        {active.description}
                      </p>
                    )}

                    <div className="mt-auto space-y-3">
                      {/* Size selector */}
                      {/* {hasMultipleSizes && (
                        <div className="flex flex-wrap gap-1.5">
                          {variations.map((v) => {
                            const { size } = parseVariationName(v.name);
                            return (
                              <button
                                key={v.id}
                                onClick={() => {
                                  setSelectedSizes((prev) => ({
                                    ...prev,
                                    [groupKey]: v.id,
                                  }));
                                  triggerHaptic("tap");
                                }}
                                className={`px-3 py-1 rounded-full text-xs border transition-all ${
                                  v.id === selectedId
                                    ? "bg-[#092622] text-white border-[#092622]"
                                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400"
                                }`}
                              >
                                {size || v.name} · ${v.price.toFixed(2)}
                              </button>
                            );
                          })}
                        </div>
                      )} */}

                      {/* Modifiers */}
                      {active.modifierIds?.length > 0 && (
                        <div className="space-y-2">
                          {menu.modifiers
                            .filter((m) => active.modifierIds.includes(m.id))
                            .map((modifier) => (
                              <div key={modifier.id}>
                                <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-1.5">
                                  {modifier.name}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {modifier.options.map((option) => (
                                    <span
                                      key={option.id}
                                      className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full"
                                    >
                                      {option.name}
                                      {option.priceModifier > 0 && (
                                        <span className="text-gray-300 ml-1">
                                          +${option.priceModifier.toFixed(2)}
                                        </span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
