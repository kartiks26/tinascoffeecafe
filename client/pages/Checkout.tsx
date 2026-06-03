import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Plus, Minus, Loader, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { useSquareMenu } from "@/hooks/useSquareMenu";
import { useCart } from "@/hooks/useCart";
import { useSquarePayments } from "@/hooks/useSquarePayments";
import {
  CartItem,
  OrderRequest,
  CreateOrderResponse,
  SquareOrderResponse,
  PaymentRequest,
  PaymentResponse,
} from "@shared/api";
import { PaymentReview } from "@/components/PaymentReview";
import { PaymentForm } from "@/components/PaymentForm";
import { PaymentSuccess } from "@/components/PaymentSuccess";
import { PaymentError } from "@/components/PaymentError";

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

function generateIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

type CheckoutState =
  | "review"
  | "customer_info"
  | "payment_review"
  | "payment_form"
  | "processing_payment"
  | "success"
  | "error";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { menu } = useSquareMenu();
  const cart = useCart();
  const {
    form: paymentForm,
    loading: sdkLoading,
    error: sdkError,
  } = useSquarePayments();

  const [checkoutState, setCheckoutState] = useState<CheckoutState>("review");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // Payment tracking
  const [submittedOrder, setSubmittedOrder] =
    useState<SquareOrderResponse | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [submittedItems, setSubmittedItems] = useState<CartItem[] | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState("");

  const tableId = searchParams.get("table") || "unknown";
  const tableNumber =
    tableId.replace(/^table_/i, "").toUpperCase() || "Unknown";

  const orderPath =
    tableId && tableId !== "unknown"
      ? `/order?table=${encodeURIComponent(tableId)}`
      : "/order";

  const getModifierLabel = (modifierId: string, optionId: string) => {
    const modifier = menu?.modifiers.find((m) => m.id === modifierId);
    const option = modifier?.options.find((o) => o.id === optionId);

    if (modifier && option) {
      return `${modifier.name}: ${option.name}`;
    }

    return option?.name || modifier?.name || optionId;
  };

  // Check if cart is empty
  if (
    (!submittedItems || submittedItems.length === 0) &&
    cart.items.length === 0
  ) {
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
            onClick={() => navigate(orderPath)}
            className="px-6 py-3 bg-[#092622] text-white rounded-full font-light uppercase"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const handleCreateOrder = async (): Promise<SquareOrderResponse | null> => {
    try {
      if (!customerName.trim() || !customerPhone.trim()) {
        triggerHaptic("warning");
        setError("Please provide your name and phone number");
        return null;
      }

      setCheckoutState("processing_payment");
      setError(null);

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

      return data.order;
    } catch (err) {
      triggerHaptic("warning");
      const message =
        err instanceof Error ? err.message : "Failed to create order";
      setError(message);
      setCheckoutState("customer_info");
      return null;
    }
  };

  const handleProcessPayment = async (sourceId: string, method: string) => {
    if (!orderId) {
      setError("Order ID not found");
      return;
    }

    setCheckoutState("processing_payment");
    setError(null);
    setErrorCode(null);

    try {
      const paymentRequest: PaymentRequest = {
        orderId,
        sourceId,
        idempotencyKey,
        customerName: customerName.trim(),
      };

      const response = await fetch("/api/square/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentRequest),
      });

      const data = (await response.json()) as PaymentResponse;

      if (!data.success) {
        setErrorCode(data.errorCode || "PAYMENT_FAILED");
        throw new Error(data.error || "Payment failed");
      }

      triggerHaptic("success");
      setPaymentId(data.paymentId || "");
      setCheckoutState("success");
      cart.clearCart();
      toast.success("Payment successful! Your order is being prepared.");
    } catch (err) {
      triggerHaptic("warning");
      const message = err instanceof Error ? err.message : "Payment failed";
      setError(message);
      setCheckoutState("error");
      toast.error(message);
    }
  };

  // ===== RENDER: Cart Empty =====
  if (cart.items.length === 0 && !submittedItems) {
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
            onClick={() => navigate(orderPath)}
            className="px-6 py-3 bg-[#092622] text-white rounded-full font-light uppercase"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // ===== RENDER: Review Cart =====
  if (checkoutState === "review") {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Header />

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
                    navigate(orderPath);
                  }}
                  className="w-full px-6 py-3 border-2 border-gray-300 text-gray-900 font-light uppercase rounded-full hover:bg-gray-50 transition-all"
                >
                  Add More Items
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // ===== RENDER: Customer Info =====
  if (checkoutState === "customer_info") {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Header />

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
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 font-light uppercase rounded-full hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={async () => {
                  triggerHaptic("tap");
                  const newOrder = await handleCreateOrder();
                  if (newOrder) {
                    setSubmittedOrder(newOrder);
                    setOrderId(newOrder.orderId);
                    setSubmittedItems(cart.items);
                    setIdempotencyKey(generateIdempotencyKey());
                    setCheckoutState("payment_review");
                  }
                }}
                className="flex-1 px-6 py-3 bg-[#092622] hover:bg-[#064637] text-white font-light uppercase rounded-full transition-all flex items-center justify-center gap-2"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // ===== RENDER: Payment Review =====
  if (checkoutState === "payment_review" && submittedOrder && submittedItems) {
    return (
      <div>
        <Header />
        <div className="py-8">
          <PaymentReview
            items={submittedItems}
            order={submittedOrder}
            customerName={customerName}
            customerPhone={customerPhone}
            notes={notes}
            tableNumber={tableNumber}
            getModifierLabel={getModifierLabel}
            onBack={() => setCheckoutState("customer_info")}
            onProceed={() => setCheckoutState("payment_form")}
            isLoading={false}
          />
        </div>
        <Footer />
      </div>
    );
  }

  // ===== RENDER: Payment Form =====
  if (checkoutState === "payment_form" && submittedOrder && submittedItems) {
    if (sdkLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-[#092622] mx-auto mb-4" />
            <p className="text-gray-600">Loading payment form...</p>
          </div>
        </div>
      );
    }

    if (sdkError || !paymentForm) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
          <Header />
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Payment System Unavailable
            </h2>
            <p className="text-gray-600 mb-6">
              {sdkError || "Could not load the payment form. Please try again."}
            </p>
            <button
              onClick={() => setCheckoutState("payment_review")}
              className="px-8 py-3 bg-[#092622] hover:bg-[#064637] text-white font-light uppercase rounded-full"
            >
              Go Back
            </button>
          </div>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-between px-6 py-12">
        <PaymentForm
          form={paymentForm}
          totalAmount={submittedOrder.total}
          isProcessing={false}
          onPaymentSuccess={handleProcessPayment}
          onError={(err) => {
            setError(err);
            setCheckoutState("error");
            toast.error(err);
          }}
          onBack={() => setCheckoutState("payment_review")}
        />
      </div>
    );
  }

  // ===== RENDER: Success =====
  if (
    checkoutState === "success" &&
    orderId &&
    paymentId &&
    submittedOrder &&
    submittedItems
  ) {
    return (
      <>
        <Header />
        <PaymentSuccess
          orderId={orderId}
          paymentId={paymentId}
          order={submittedOrder}
          items={submittedItems}
          customerName={customerName}
          tableNumber={tableNumber}
          getModifierLabel={getModifierLabel}
          onNewOrder={() => {
            setCheckoutState("review");
            setCustomerName("");
            setCustomerPhone("");
            setNotes("");
            setSubmittedOrder(null);
            setOrderId(null);
            setPaymentId(null);
            setSubmittedItems(null);
            navigate(orderPath);
          }}
        />
        <Footer />
      </>
    );
  }

  // ===== RENDER: Error =====
  if (checkoutState === "error" && orderId && submittedOrder && error) {
    return (
      <>
        <Header />
        <PaymentError
          error={error}
          errorCode={errorCode || undefined}
          orderId={orderId}
          totalAmount={submittedOrder.total}
          onRetry={() => {
            setCheckoutState("payment_form");
            setError(null);
            setErrorCode(null);
            setIdempotencyKey(generateIdempotencyKey());
          }}
          onCancel={() => {
            setCheckoutState("review");
            setCustomerName("");
            setCustomerPhone("");
            setNotes("");
            setSubmittedOrder(null);
            setOrderId(null);
            setPaymentId(null);
            setSubmittedItems(null);
            setError(null);
            setErrorCode(null);
            navigate(orderPath);
          }}
        />
        <Footer />
      </>
    );
  }

  return null;
}
