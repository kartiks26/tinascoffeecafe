import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Plus,
  Minus,
  Loader,
  AlertCircle,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { useSquareMenu } from "@/hooks/useSquareMenu";
import { useCart } from "@/hooks/useCart";
import { OrderRequest, CreateOrderResponse } from "@shared/api";

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

type CheckoutState =
  | "review"
  | "customer_info"
  | "submitting"
  | "success"
  | "error";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { menu } = useSquareMenu();
  const cart = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [checkoutState, setCheckoutState] = useState<CheckoutState>("review");

  const getModifierLabel = (modifierId: string, optionId: string) => {
    const modifier = menu?.modifiers.find((m) => m.id === modifierId);
    const option = modifier?.options.find((o) => o.id === optionId);

    if (modifier && option) {
      return `${modifier.name}: ${option.name}`;
    }

    return option?.name || modifier?.name || optionId;
  };
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const tableId = searchParams.get("table") || "unknown";
  const tableNumber =
    tableId.replace(/^table_/i, "").toUpperCase() || "Unknown";

  if (cart.itemCount === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-light text-gray-900 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-600 font-light mb-6">
            Add some items from the menu before checking out
          </p>
          <button
            onClick={() => navigate("/order")}
            className="px-6 py-3 bg-[#092622] text-white rounded-full font-light uppercase"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      triggerHaptic("warning");
      setError("Please provide your name and phone number");
      return;
    }

    setCheckoutState("submitting");
    setError(null);

    try {
      const orderRequest: OrderRequest = {
        tableId,
        tableNumber,
        items: cart.items,
        notes,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
      };

      const response = await fetch("/api/square/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderRequest),
      });

      const data = (await response.json()) as CreateOrderResponse;

      if (!data.success) {
        throw new Error(data.error || "Failed to create order");
      }

      triggerHaptic("success");
      setOrderId(data.order.orderId);
      setCheckoutState("success");
      cart.clearCart();
    } catch (err) {
      triggerHaptic("warning");
      setError(err instanceof Error ? err.message : "Failed to submit order");
      setCheckoutState("error");
    }
  };

  // Success state
  if (checkoutState === "success" && orderId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-light text-gray-900 mb-3">
            Order Placed!
          </h2>
          <p className="text-gray-600 font-light mb-2">
            Your order has been sent to the kitchen
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Order ID: <span className="font-mono font-semibold">{orderId}</span>
          </p>
          <p className="text-gray-600 font-light mb-8">
            Your order will be prepared and ready at your table shortly
          </p>

          <button
            onClick={() => {
              triggerHaptic("tap");
              navigate("/order");
            }}
            className="inline-block px-8 py-3 bg-[#092622] text-white rounded-full font-light uppercase hover:bg-[#064637] transition-all"
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  // Review state
  if (checkoutState === "review") {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Header />

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.productName}
                      </h3>
                      {Object.keys(item.modifiers || {}).length > 0 && (
                        <p className="text-xs text-gray-600 mt-1 font-light">
                          {Object.entries(item.modifiers)
                            .map(([modifierId, optionId]) =>
                              getModifierLabel(modifierId, optionId),
                            )
                            .join(", ")}
                        </p>
                      )}
                    </div>
                    <span className="text-xl font-bold text-[#092622]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          triggerHaptic("tap");
                          cart.updateQuantity(
                            item.productId,
                            item.quantity - 1,
                            item.modifiers,
                          );
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-all"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          triggerHaptic("tap");
                          cart.updateQuantity(
                            item.productId,
                            item.quantity + 1,
                            item.modifiers,
                          );
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-all"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <span className="text-sm text-gray-600 font-light">
                      ${item.price.toFixed(2)} each
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (est.)</span>
                    <span>${cart.estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg text-[#092622]">
                    <span>Total</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic("tap");
                    setCheckoutState("customer_info");
                  }}
                  className="w-full px-6 py-3 bg-[#092622] hover:bg-[#064637] text-white font-light uppercase rounded-full transition-all"
                >
                  Continue to Checkout
                </button>

                <button
                  onClick={() => {
                    triggerHaptic("tap");
                    navigate("/order");
                  }}
                  className="w-full px-6 py-3 border-2 border-gray-300 text-gray-900 font-light uppercase rounded-full hover:bg-gray-50 transition-all"
                >
                  Add More Items
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Customer Info & Submission
  if (
    checkoutState === "customer_info" ||
    checkoutState === "submitting" ||
    checkoutState === "error"
  ) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Header />

        {/* Content */}
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            {error && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900">Error</h4>
                  <p className="text-sm text-red-800 font-light">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#092622] focus:ring-1 focus:ring-[#092622]"
                disabled={checkoutState === "submitting"}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#092622] focus:ring-1 focus:ring-[#092622]"
                disabled={checkoutState === "submitting"}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., No sugar, extra hot, etc."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-[#092622] focus:ring-1 focus:ring-[#092622] resize-none"
                disabled={checkoutState === "submitting"}
              />
            </div>

            {/* Order Summary */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-semibold">
                  ${cart.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Tax (est.)</span>
                <span className="font-semibold">
                  ${cart.estimatedTax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#092622] border-t pt-3">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  triggerHaptic("tap");
                  setCheckoutState("review");
                  setError(null);
                }}
                disabled={checkoutState === "submitting"}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 font-light uppercase rounded-full hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmitOrder}
                disabled={checkoutState === "submitting"}
                className="flex-1 px-6 py-3 bg-[#092622] hover:bg-[#064637] disabled:bg-gray-400 text-white font-light uppercase rounded-full transition-all flex items-center justify-center gap-2"
              >
                {checkoutState === "submitting" && (
                  <Loader className="w-4 h-4 animate-spin" />
                )}
                {checkoutState === "submitting"
                  ? "Placing Order..."
                  : "Place Order"}
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return null;
}
