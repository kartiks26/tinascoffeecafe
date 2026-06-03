import { useState } from "react";
import { Minus, Plus, AlertCircle } from "lucide-react";
import { CartItem, SquareOrderResponse } from "@shared/api";
import { useCart } from "@/hooks/useCart";

interface PaymentReviewProps {
  items: CartItem[];
  order: SquareOrderResponse;
  customerName: string;
  customerPhone: string;
  notes: string;
  tableNumber: string;
  onBack: () => void;
  onProceed: () => void;
  isLoading?: boolean;
  getModifierLabel: (modifierId: string, optionId: string) => string;
}

export function PaymentReview({
  items,
  order,
  customerName,
  customerPhone,
  notes,
  tableNumber,
  onBack,
  onProceed,
  isLoading = false,
  getModifierLabel,
}: PaymentReviewProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Payment Review
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Please verify your order details before payment
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                What you're ordering
              </h2>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-100 p-4"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.productName}
                        </h3>
                        {Object.keys(item.modifiers || {}).length > 0 && (
                          <p className="text-xs text-gray-600 mt-2 font-light">
                            {Object.entries(item.modifiers)
                              .map(([modifierId, optionId]) =>
                                getModifierLabel(modifierId, optionId),
                              )
                              .join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900">
                          x{item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pickup details
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium text-gray-900">
                    {customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-mono font-medium text-gray-900">
                    {customerPhone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Table</span>
                  <span className="font-medium text-gray-900">
                    {tableNumber}
                  </span>
                </div>
                {notes && (
                  <div className="border-t pt-3">
                    <p className="text-gray-600 mb-2">Special requests</p>
                    <p className="text-gray-900 font-light italic">{notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Order summary
              </h2>

              <div className="space-y-2 text-sm border-b pb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-[#092622]">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 font-light">
                  We accept all major credit and debit cards. Your payment is
                  secure and encrypted.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={onBack}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 font-light uppercase rounded-full hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  onClick={onProceed}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-[#092622] hover:bg-[#064637] disabled:bg-gray-400 text-white font-light uppercase rounded-full transition-all disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
