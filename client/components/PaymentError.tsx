import { AlertTriangle, HelpCircle, Home } from "lucide-react";

interface PaymentErrorProps {
  error: string;
  errorCode?: string;
  orderId: string;
  totalAmount: number;
  onRetry: () => void;
  onCancel: () => void;
}

export function PaymentError({
  error,
  errorCode,
  orderId,
  totalAmount,
  onRetry,
  onCancel,
}: PaymentErrorProps) {
  const getErrorDetails = (
    code?: string,
  ): { title: string; message: string; advice: string } => {
    switch (code) {
      case "CARD_DECLINED":
        return {
          title: "Card Declined",
          message:
            "Your card was declined by the bank. Please check the card details or use a different payment method.",
          advice:
            "Verify the card number, expiration date, and CVV are correct. Contact your bank if the issue persists.",
        };
      case "CVV_MISMATCH":
        return {
          title: "Invalid Security Code",
          message: "The CVV/security code entered is incorrect.",
          advice: "Please check the 3-4 digit code on the back of your card.",
        };
      case "CARD_EXPIRED":
        return {
          title: "Card Expired",
          message: "Your card has expired.",
          advice: "Please use a different card that has not expired.",
        };
      case "INSUFFICIENT_FUNDS":
        return {
          title: "Insufficient Funds",
          message:
            "Your card does not have enough funds to complete this transaction.",
          advice: "Please use a different payment method or add funds to your account.",
        };
      case "RATE_LIMITED":
        return {
          title: "Too Many Attempts",
          message:
            "Too many payment attempts. Please try again in a few moments.",
          advice: "This is a security measure. Please wait a few minutes before retrying.",
        };
      default:
        return {
          title: "Payment Failed",
          message:
            "Unfortunately, we couldn't process your payment. Please try again.",
          advice:
            "If the problem persists, please contact our support or try a different payment method.",
        };
    }
  };

  const details = getErrorDetails(errorCode);

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        {/* Error Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <AlertTriangle className="w-20 h-20 text-red-600 mx-auto" />
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            {details.title}
          </h1>
          <p className="text-lg text-gray-700 font-light">{details.message}</p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 space-y-6">
          {/* Order Info */}
          <div className="border-b pb-6">
            <p className="text-sm text-gray-600 mb-2">Your order</p>
            <div className="flex justify-between items-baseline gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Order ID
                </p>
                <p className="font-mono font-semibold text-gray-900">
                  {orderId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase mb-1">Amount</p>
                <p className="text-2xl font-bold text-[#092622]">
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Advice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
            <HelpCircle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-900 font-light">{details.advice}</p>
          </div>

          {/* What Happens Next */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              What happens next?
            </h3>
            <ul className="text-sm text-blue-800 font-light space-y-1 list-disc list-inside">
              <li>Your order has been created but NOT paid</li>
              <li>You can retry payment using the button below</li>
              <li>Or cancel and start a new order</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <button
            onClick={onRetry}
            className="flex-1 px-8 py-4 bg-[#092622] hover:bg-[#064637] text-white font-light uppercase rounded-full transition-all"
          >
            Try Another Payment Method
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-900 font-light uppercase rounded-full hover:bg-gray-50 transition-all"
          >
            Return to Menu
          </button>
        </div>

        {/* Support Info */}
        <p className="text-center text-sm text-gray-600 mt-8 font-light">
          Need help?{" "}
          <a
            href="/contact"
            className="text-[#092622] hover:underline font-medium"
          >
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
