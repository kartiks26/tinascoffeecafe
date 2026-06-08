import { useState, useEffect } from "react";
import { Grid2X2, List, Loader, X } from "lucide-react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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

function parseVariationName(name: string): {
  base: string;
  size: string | null;
} {
  const match = name.match(/^(.+?)\s*\(([^)]+)\)$/);
  if (match) return { base: match[1].trim(), size: match[2].trim() };
  return { base: name, size: null };
}

const SIZE_ORDER = ["Small", "Regular", "Medium", "Large", "Huge"];

function groupProducts(products: SquareProduct[]) {
  const groups = new Map<string, SquareProduct[]>();

  products.forEach((product) => {
    const { base } = parseVariationName(product.name);
    const key = `${product.itemId}__${base}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(product);
  });

  return Array.from(groups.values()).map((variations) => {
    variations.sort((a, b) => {
      const { size: sizeA } = parseVariationName(a.name);
      const { size: sizeB } = parseVariationName(b.name);
      const indexA = SIZE_ORDER.indexOf(sizeA || "");
      const indexB = SIZE_ORDER.indexOf(sizeB || "");

      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });

    return variations;
  });
}

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"grid" | "list">("grid");
  const [detailVariations, setDetailVariations] = useState<
    SquareProduct[] | null
  >(null);

  const { menu, loading, error } = useSquareMenu();

  useEffect(() => {
    const hash = window.location.hash.slice(1).toLowerCase();
    if (hash && menu.categories.length > 0) {
      const matchedCategory = menu.categories.find(
        (cat) => cat.name.toLowerCase() === hash
      );
      if (matchedCategory) {
        setSelectedCategory(matchedCategory.id);
      }
    }
  }, [menu.categories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-10 h-10 text-[#092622] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-light tracking-wide">
            Loading menu...
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

  const visibleCategories = [
    "Coffee",
    "Tea",
    "Iced Coffee",
    "Breakfast",
    "Wrap",
  ];
  const filteredProducts = selectedCategory
    ? menu.products.filter(
        (product) =>
          product.categoryId === selectedCategory &&
          product.available &&
          visibleCategories.includes(product.categoryName || ""),
      )
    : menu.products.filter(
        (product) =>
          product.available &&
          visibleCategories.includes(product.categoryName || ""),
      );

  const groupedItems = groupProducts(filteredProducts);
  const detailActive = detailVariations?.[0] || null;
  const detailName = detailActive
    ? parseVariationName(detailActive.name).base
    : "";
  const detailModifiers = detailActive?.modifierIds?.length
    ? menu.modifiers.filter((modifier) =>
        detailActive.modifierIds?.includes(modifier.id),
      )
    : [];

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        {menu.categories.length > 0 && (
          <div className="mb-5 md:mb-8">
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  triggerHaptic("tap");
                }}
                className={`min-h-10 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all border ${
                  selectedCategory === null
                    ? "bg-[#092622] text-white border-[#092622] shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                }`}
              >
                All
              </button>
              {menu.categories
                .filter((category) => visibleCategories.includes(category.name))
                .map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      triggerHaptic("tap");
                    }}
                    className={`min-h-10 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all border ${
                      selectedCategory === category.id
                        ? "bg-[#092622] text-white border-[#092622] shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
            </div>

            <div className="mt-2 flex items-center justify-between gap-3 md:hidden">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                {groupedItems.length} items
              </p>
              <div className="inline-flex h-10 rounded-full border border-gray-200 bg-white p-1 shadow-sm">
                <button
                  type="button"
                  aria-label="Grid view"
                  onClick={() => {
                    setMobileView("grid");
                    triggerHaptic("tap");
                  }}
                  className={`flex h-8 w-9 items-center justify-center rounded-full transition-colors ${
                    mobileView === "grid"
                      ? "bg-[#092622] text-white shadow-sm"
                      : "text-gray-500 hover:text-[#092622]"
                  }`}
                >
                  <Grid2X2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="List view"
                  onClick={() => {
                    setMobileView("list");
                    triggerHaptic("tap");
                  }}
                  className={`flex h-8 w-9 items-center justify-center rounded-full transition-colors ${
                    mobileView === "list"
                      ? "bg-[#092622] text-white shadow-sm"
                      : "text-gray-500 hover:text-[#092622]"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {groupedItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No items available in this category
          </div>
        ) : (
          <div className="max-h-[calc(100svh-235px)] overflow-y-auto overscroll-contain pr-1 scroll-smooth md:max-h-none md:overflow-visible md:pr-0">
            <div
              className={`grid gap-3 sm:grid-cols-6 sm:gap-5 lg:grid-cols-3 ${
                mobileView === "list" ? "grid-cols-1" : "grid-cols-2"
              }`}
            >
              {groupedItems.map((variations) => {
                const active = variations[0];
                const { base } = parseVariationName(active.name);

                return (
                  <button
                    type="button"
                    key={active.itemId}
                    onClick={() => {
                      setDetailVariations(variations);
                      triggerHaptic("tap");
                    }}
                    className={`group bg-white text-left overflow-hidden border border-gray-100 shadow-sm transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-[#092622]/30 hover:shadow-md active:scale-[0.99] sm:flex-col sm:rounded-2xl ${
                      mobileView === "list"
                        ? "flex min-h-[116px] rounded-xl"
                        : "flex h-[228px] flex-col rounded-xl"
                    }`}
                  >
                    <div
                      className={`relative shrink-0 bg-gray-100 overflow-hidden sm:h-44 sm:w-full ${
                        mobileView === "list"
                          ? "h-[116px] w-[104px]"
                          : "h-32 w-full"
                      }`}
                    >
                      {active.imageUrl ? (
                        <img
                          src={active.imageUrl}
                          alt={base}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                      <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm text-[#092622] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm sm:text-sm">
                        {active.isVariablePrice
                          ? "Market price"
                          : `$${active.price.toFixed(2)}`}
                      </div>
                    </div>

                    <div
                      className={`flex min-w-0 flex-1 flex-col ${
                        mobileView === "list" ? "p-2.5" : "p-3.5 sm:p-4"
                      }`}
                    >
                      <h3 className="font-medium text-gray-900 text-sm mb-1 leading-snug line-clamp-2">
                        {base}
                      </h3>

                      {active.description && (
                        <p
                          className={`text-xs text-gray-500 leading-relaxed ${
                            mobileView === "list"
                              ? "line-clamp-4"
                              : "line-clamp-5"
                          }`}
                        >
                          {active.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Drawer
        open={detailVariations !== null}
        onOpenChange={(open) => {
          if (!open) setDetailVariations(null);
        }}
      >
        <DrawerContent className="max-h-[92svh] rounded-t-2xl border-0 bg-white p-0">
          {detailActive && (
            <>
              <div className="overflow-y-auto">
                <div className="relative h-56 bg-gray-100">
                  <DrawerClose asChild>
                    <button
                      type="button"
                      aria-label="Close details"
                      className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-900 shadow-sm backdrop-blur transition-colors hover:bg-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </DrawerClose>

                  {detailActive.imageUrl ? (
                    <img
                      src={detailActive.imageUrl}
                      alt={detailName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                      <svg
                        className="h-12 w-12"
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
                  <div className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-[#092622] shadow-sm backdrop-blur">
                    {detailActive.isVariablePrice
                      ? "Market price"
                      : `$${detailActive.price.toFixed(2)}`}
                  </div>
                </div>

                <DrawerHeader className="px-5 pb-3 pt-5 text-left">
                  <DrawerTitle className="text-2xl font-semibold text-gray-900">
                    {detailName}
                  </DrawerTitle>
                  {detailActive.description && (
                    <DrawerDescription className="text-sm leading-6 text-gray-500">
                      {detailActive.description}
                    </DrawerDescription>
                  )}
                </DrawerHeader>

                <div className="space-y-6 px-5 pb-5">
                  {detailModifiers.map((modifier) => (
                    <div key={modifier.id}>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                        {modifier.name}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {modifier.options.map((option) => (
                          <div
                            key={option.id}
                            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3"
                          >
                            <span className="block text-sm font-medium text-gray-800">
                              {option.name}
                            </span>
                            <span className="mt-1 block text-xs font-semibold text-[#092622]">
                              {option.priceModifier > 0
                                ? `+$${option.priceModifier.toFixed(2)}`
                                : "Included"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {detailModifiers.length === 0 && (
                    <div className="rounded-xl bg-gray-50 px-4 py-5 text-center text-sm text-gray-500">
                      No additional options are available for this item.
                    </div>
                  )}
                </div>
              </div>

            </>
          )}
        </DrawerContent>
      </Drawer>

      <Footer />
    </div>
  );
}
