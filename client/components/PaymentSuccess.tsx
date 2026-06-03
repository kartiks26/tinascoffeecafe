import { CheckCircle, Copy, Download } from "lucide-react";
import { CartItem, SquareOrderResponse } from "@shared/api";
import { useState } from "react";

interface PaymentSuccessProps {
  orderId: string;
  paymentId: string;
  order: SquareOrderResponse;
  items: CartItem[];
  customerName: string;
  tableNumber: string;
  onNewOrder: () => void;
  getModifierLabel: (modifierId: string, optionId: string) => string;
}

export function PaymentSuccess({
  orderId,
  paymentId,
  order,
  items,
  customerName,
  tableNumber,
  onNewOrder,
  getModifierLabel,
}: PaymentSuccessProps) {
  const [copied, setCopied] = useState(false);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl w-full">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-3">
            Payment Confirmed!
          </h1>
          <p className="text-lg text-gray-600 font-light mb-4">
            Your order has been placed and sent to the kitchen.
          </p>

          {/* Order ID */}
          <div className="bg-gray-50 rounded-2xl p-6 inline-block">
            <p className="text-xs text-gray-600 uppercase mb-2">Order Number</p>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-mono font-semibold text-[#092622]">
                {orderId}
              </p>
              <button
                onClick={copyOrderId}
                className="p-2 hover:bg-gray-200 rounded-lg transition-all"
                title="Copy order ID"
              >
                <Copy className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {copied && (
              <p className="text-xs text-green-600 mt-2 font-medium">
                Copied to clipboard
              </p>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* What You Ordered */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                What you ordered
              </h2>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
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

            {/* Pickup Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pickup Information
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Name</p>
                  <p className="font-semibold text-gray-900">{customerName}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Table</p>
                  <p className="font-semibold text-gray-900">{tableNumber}</p>
                </div>
                <div className="border-t border-blue-300 pt-3 mt-3">
                  <p className="text-xs text-blue-900 font-light">
                    Your order is being prepared. We'll notify you when it's
                    ready for pickup.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-2xl p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-900">
                  ${order.tax.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-base text-[#092622]">
                <span>Total Paid</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 mb-4 border border-gray-200">
              <p className="text-xs text-gray-600 font-mono">
                <span className="text-gray-400">Payment ID: </span>
                <span className="font-semibold text-gray-900">{paymentId}</span>
              </p>
            </div>

            <p className="text-xs text-gray-600 text-center">
              A confirmation email will be sent shortly.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onNewOrder}
            className="px-8 py-4 bg-[#092622] hover:bg-[#064637] text-white font-light uppercase rounded-full transition-all"
          >
            Place Another Order
          </button>
        </div>
      </div>
    </div>
  );
}
