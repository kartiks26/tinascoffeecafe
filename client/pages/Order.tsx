import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Plus, Minus, ShoppingCart, Loader, Menu, X } from "lucide-react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { useSquareMenu } from "@/hooks/useSquareMenu";
import { useCart } from "@/hooks/useCart";
import { CartItem, SquareProduct, SquareModifier } from "@shared/api";

function triggerHaptic(pattern: "tap" | "success") {
  if ("vibrate" in navigator) {
    const patterns: Record<string, number | number[]> = {
      tap: 10,
      success: [10, 20, 10],
    };
    navigator.vibrate(patterns[pattern]);
  }
}

interface TableSession {
  tableNumber: string;
  tableId: string;
}

export default function Order() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<TableSession | null>(null);
  const [showTableInput, setShowTableInput] = useState(false);
  const [tableInput, setTableInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<
    Record<string, Record<string, string>>
  >({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { menu, loading, error } = useSquareMenu();
  const cart = useCart();
  const navigate2 = useNavigate();

  // Initialize table from URL params
  useEffect(() => {
    const tableId = searchParams.get("table");
    if (tableId) {
      // Decode table ID - should match QR code format
      const tableNumber = tableId.replace(/^table_/i, "").toUpperCase();
      setSession({
        tableId: tableId,
        tableNumber: tableNumber,
      });
    }
  }, [searchParams]);

  const handleTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic("success");
    const tableNumber = tableInput.toUpperCase().trim();
    if (tableNumber) {
      setSession({
        tableNumber,
        tableId: `table_${tableNumber.toLowerCase()}`,
      });
      setShowTableInput(false);
      setTableInput("");
    }
  };

  const handleAddToCart = (product: SquareProduct) => {
    triggerHaptic("success");
    const modifiers = selectedModifiers[product.id] || {};
    const modifierTotal = Object.entries(modifiers).reduce(
      (sum, [modifierId, optionId]) => {
        const modifier = menu?.modifiers.find((m) => m.id === modifierId);
        const option = modifier?.options.find((o) => o.id === optionId);
        return sum + (option?.priceModifier || 0);
      },
      0,
    );

    const cartItem: CartItem = {
      productId: product.id,
      productName: product.name,
      price: product.price + modifierTotal,
      quantity: 1,
      modifiers,
    };
    cart.addToCart(cartItem);
  };

  const handleModifierSelect = (
    productId: string,
    modifierId: string,
    optionId: string,
  ) => {
    triggerHaptic("tap");
    setSelectedModifiers((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [modifierId]: optionId,
      },
    }));
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-gray-900 mb-3">
              Welcome to Tina's Coffee
            </h1>
            <p className="text-gray-600 font-light mb-6">
              Enter your table number to get started
            </p>
          </div>

          <form onSubmit={handleTableSubmit} className="space-y-4">
            <input
              type="text"
              value={tableInput}
              onChange={(e) => setTableInput(e.target.value)}
              placeholder="e.g., A1, 5, Table 3"
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-[#092622] text-center text-lg font-light uppercase"
              autoFocus
            />
            <button
              type="submit"
              disabled={!tableInput.trim()}
              className="w-full px-6 py-4 bg-[#092622] hover:bg-[#064637] disabled:bg-gray-300 text-white font-light uppercase tracking-widest rounded-full transition-all"
            >
              Continue to Menu
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 font-light">
              Scanned a QR code? It should auto-detect your table.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#092622] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-light">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-light text-gray-900 mb-3">
            Unable to Load Menu
          </h2>
          <p className="text-gray-600 font-light mb-6">
            {error || "Please try again later"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#092622] text-white rounded-full font-light uppercase"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayedProducts = selectedCategory
    ? menu.products.filter(
        (p) => p.categoryId === selectedCategory && p.available,
      )
    : menu.products.filter((p) => p.available);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      {/* Main Content */}
      <div className=" min-h-screen max-w-7xl mx-auto px-6 py-8">
        {/* Category Filter */}
        {menu.categories.length > 0 && (
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => {
                setSelectedCategory(null);
                triggerHaptic("tap");
              }}
              className={`px-4 py-2 rounded-full font-light uppercase text-sm whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? "bg-[#092622] text-white"
                  : "bg-white text-gray-900 border border-gray-300"
              }`}
            >
              All Items
            </button>
            {menu.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  triggerHaptic("tap");
                }}
                className={`px-4 py-2 rounded-full font-light uppercase text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#092622] text-white"
                    : "bg-white text-gray-900 border border-gray-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {product.imageUrl && (
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              )}

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-sm text-gray-600 font-light mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-[#092622]">
                    ${product.price.toFixed(2)}
                  </span>
                  {!product.available && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Modifiers */}
                {expandedProduct === product.id &&
                  menu.modifiers.length > 0 && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-2xl space-y-3 border-t pt-4">
                      {menu.modifiers.map((modifier) => (
                        <div key={modifier.id}>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                            {modifier.name}
                          </h4>
                          <div className="space-y-2">
                            {modifier.options.map((option) => (
                              <label
                                key={option.id}
                                className="flex items-center p-2 rounded-full hover:bg-white cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name={`${product.id}-${modifier.id}`}
                                  checked={
                                    selectedModifiers[product.id]?.[
                                      modifier.id
                                    ] === option.id
                                  }
                                  onChange={() =>
                                    handleModifierSelect(
                                      product.id,
                                      modifier.id,
                                      option.id,
                                    )
                                  }
                                  className="w-4 h-4 accent-[#092622]"
                                />
                                <span className="ml-2 text-sm text-gray-700 flex-1">
                                  {option.name}
                                </span>
                                {option.priceModifier > 0 && (
                                  <span className="text-xs text-[#092622] font-semibold">
                                    +${option.priceModifier.toFixed(2)}
                                  </span>
                                )}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setExpandedProduct(
                        expandedProduct === product.id ? null : product.id,
                      );
                      triggerHaptic("tap");
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-full font-light text-sm hover:bg-gray-50 transition-all"
                  >
                    {menu.modifiers.length > 0
                      ? expandedProduct === product.id
                        ? "Done"
                        : "Customize"
                      : "Details"}
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 px-4 py-2 bg-[#092622] hover:bg-[#064637] text-white rounded-full font-light text-sm transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 font-light">
              No items available in this category
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
