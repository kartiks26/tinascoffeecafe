import { useEffect, useRef, useState } from "react";
import { Loader, AlertCircle, Wallet } from "lucide-react";
import { SquarePaymentForm } from "@/hooks/useSquarePayments";

interface PaymentFormProps {
  form: SquarePaymentForm | null;
  totalAmount: number;
  isProcessing: boolean;
  onPaymentSuccess: (sourceId: string, method: string) => void;
  onError: (error: string) => void;
  onBack: () => void;
}

export function PaymentForm({
  form,
  totalAmount,
  isProcessing,
  onPaymentSuccess,
  onError,
  onBack,
}: PaymentFormProps) {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [cardAttached, setCardAttached] = useState(false);
  const [canPayWithApplePay, setCanPayWithApplePay] = useState(false);
  const [canPayWithGooglePay, setCanPayWithGooglePay] = useState(false);
  const [activeMethod, setActiveMethod] = useState<"card" | "apple" | "google">(
    "card",
  );
  const [cardError, setCardError] = useState<string | null>(null);
  const attachedRef = useRef(false);

  useEffect(() => {
    const attachCard = async () => {
      if (
        form?.card &&
        cardContainerRef.current &&
        !cardAttached &&
        !attachedRef.current
      ) {
        try {
          attachedRef.current = true;
          await form.card.attach(cardContainerRef.current);
          setCardAttached(true);
          setCardError(null);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to attach card";
          setCardError(message);
          attachedRef.current = false;
        }
      }
    };

    const checkWallets = async () => {
      if (form) {
        try {
          const hasApple = await form.canPayWithApplePay();
          setCanPayWithApplePay(hasApple);
        } catch {
          setCanPayWithApplePay(false);
        }

        try {
          const hasGoogle = await form.canPayWithGooglePay();
          setCanPayWithGooglePay(hasGoogle);
        } catch {
          setCanPayWithGooglePay(false);
        }
      }
    };

    attachCard();
    checkWallets();

    return () => {
      // Cleanup is handled by Square SDK
    };
  }, [form, cardAttached]);

  const handleCardPayment = async () => {
    if (!form?.card) {
      onError("Card form not ready");
      return;
    }

    try {
      const sourceId = await form.requestCardPayment();
      onPaymentSuccess(sourceId, "card");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Card payment failed";
      onError(message);
    }
  };

  const handleApplePayment = async () => {
    try {
      const sourceId = await form?.requestApplePayment();
      if (sourceId) {
        onPaymentSuccess(sourceId, "apple_pay");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Apple Pay failed";
      onError(message);
    }
  };

  const handleGooglePayment = async () => {
    try {
      const sourceId = await form?.requestGooglePayment();
      if (sourceId) {
        onPaymentSuccess(sourceId, "google_pay");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Google Pay failed";
      onError(message);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
        {/* Header */}
        <div className="border-b pb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Complete Payment
          </h2>
          <p className="text-gray-600 font-light">
            Total:{" "}
            <span className="font-semibold text-[#092622]">
              ${totalAmount.toFixed(2)}
            </span>
          </p>
        </div>

        {/* Digital Wallets */}
        {(canPayWithApplePay || canPayWithGooglePay) && (
          <div className="space-y-3">
            {canPayWithApplePay && (
              <button
                onClick={handleApplePayment}
                disabled={isProcessing}
                className="w-full px-6 py-4 bg-black text-white font-medium rounded-xl hover:bg-gray-800 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                <Wallet className="w-5 h-5" />
                Pay with Apple Pay
              </button>
            )}
            {canPayWithGooglePay && (
              <button
                onClick={handleGooglePayment}
                disabled={isProcessing}
                className="w-full px-6 py-4 bg-white border-2 border-gray-300 text-gray-900 font-medium rounded-xl hover:bg-gray-50 disabled:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                <Wallet className="w-5 h-5" />
                Pay with Google Pay
              </button>
            )}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-600">Or pay with</span>
              </div>
            </div>
          </div>
        )}

        {/* Card Form */}
        <div className="space-y-4">
          <div
            ref={cardContainerRef}
            className="min-h-[100px] rounded-xl border border-gray-200 p-4"
          />

          {cardError && (
            <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-light">{cardError}</p>
            </div>
          )}

          <button
            onClick={handleCardPayment}
            disabled={!cardAttached || isProcessing}
            className="w-full px-6 py-4 bg-[#092622] hover:bg-[#064637] disabled:bg-gray-400 text-white font-medium uppercase rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {isProcessing && <Loader className="w-5 h-5 animate-spin" />}
            {isProcessing ? "Processing Payment..." : "Pay Now"}
          </button>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="w-full px-6 py-3 border-2 border-gray-300 text-gray-900 font-light uppercase rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>

        {/* Security Info */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-xs text-gray-600 font-light">
            Your payment information is secure and encrypted. We never store
            your full card details.
          </p>
        </div>
      </div>
    </div>
  );
}
