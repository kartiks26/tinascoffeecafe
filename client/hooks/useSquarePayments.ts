import { useState, useEffect, useRef } from "react";
import { PaymentWebKey } from "@shared/api";

interface WebPaymentsSDK {
  payments?: (applicationId: string) => Promise<PaymentsMethods>;
}

interface PaymentsMethods {
  paymentRequest: (config: any) => Promise<PaymentRequest>;
  card: (config?: any) => Promise<Card>;
  applePay: (config?: any) => Promise<ApplePay>;
  googlePay: (config?: any) => Promise<GooglePay>;
}

interface PaymentRequest {
  attach: (element: HTMLElement) => Promise<void>;
  detach: () => Promise<void>;
  show: () => Promise<void>;
}

interface Card {
  attach: (element: HTMLElement) => Promise<void>;
  detach: () => Promise<void>;
  requestCardholderData: () => Promise<CardholderData>;
  focus: () => void;
  blur: () => void;
  clear: () => void;
}

interface CardholderData {
  givenName?: string;
  familyName?: string;
  email?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
}

interface ApplePay {
  canPayWithApplePay: () => Promise<boolean>;
  requestPaymentMethod: (config: any) => Promise<ApplePayPaymentMethod>;
}

interface ApplePayPaymentMethod {
  token: { sourceId: string };
}

interface GooglePay {
  canPayWithGooglePay: () => Promise<boolean>;
  requestPaymentMethod: (config: any) => Promise<GooglePayPaymentMethod>;
}

interface GooglePayPaymentMethod {
  token: { sourceId: string };
}

export interface SquarePaymentForm {
  card: Card | null;
  applePay: ApplePay | null;
  googlePay: GooglePay | null;
  requestCardPayment: () => Promise<string>; // returns sourceId
  requestApplePayment: () => Promise<string>;
  requestGooglePayment: () => Promise<string>;
  canPayWithApplePay: () => Promise<boolean>;
  canPayWithGooglePay: () => Promise<boolean>;
}

export interface UseSquarePaymentsConfig {
  currency?: string;
  countryCode?: string;
}

export function useSquarePayments(config?: UseSquarePaymentsConfig) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<PaymentWebKey | null>(null);
  const [form, setForm] = useState<SquarePaymentForm | null>(null);

  const sdkLoadedRef = useRef(false);
  const paymentsRef = useRef<PaymentsMethods | null>(null);

  useEffect(() => {
    const initializePayments = async () => {
      try {
        // Load Square Web Payments SDK
        if (!window.Square) {
          const script = document.createElement("script");
          script.src =
            "https://web.squarecdn.com/v1/square.js?expand=payments";
          script.async = true;

          script.onerror = () => {
            setError("Failed to load Square payment SDK");
            setLoading(false);
          };

          script.onload = async () => {
            await setupPayments();
          };

          document.head.appendChild(script);
        } else {
          await setupPayments();
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to initialize payments";
        setError(message);
        setLoading(false);
      }
    };

    const setupPayments = async () => {
      try {
        // Wait for Square SDK to load and be available
        if (!window.Square) {
          throw new Error("Square SDK not loaded");
        }

        if (!window.Square.payments) {
          throw new Error("Square payments not available");
        }

        const appId = import.meta.env.VITE_PUBLIC_SQUARE_APP_ID;
        const locationId = import.meta.env.VITE_PUBLIC_SQUARE_LOCATION_ID;

        if (!appId) {
          throw new Error("Square Application ID not configured");
        }

        // Initialize Square Payments SDK
        const payments = await window.Square.payments(appId);
        paymentsRef.current = payments;

        setPaymentConfig({
          applicationId: appId,
          locationId: locationId || "",
        });

        // Initialize payment methods
        const card = await payments.card({
          style: {
            ".input": {
              "font-size": "14px",
              "font-family": "Poppins, sans-serif",
              "color": "#333",
              "background-color": "#f9f9f9",
              "border": "1px solid #e0e0e0",
              "border-radius": "8px",
              "padding": "10px 12px",
            },
            ".input:focus": {
              "border-color": "#092622",
              "box-shadow": "0 0 0 3px rgba(9, 38, 34, 0.1)",
            },
            ".input-label": {
              "font-size": "12px",
              "font-weight": "600",
              "color": "#666",
              "text-transform": "uppercase",
              "margin-bottom": "4px",
            },
          },
        });

        let applePay = null;
        let googlePay = null;

        // Try to initialize Apple Pay if available
        try {
          applePay = await payments.applePay();
        } catch (err) {
          console.debug("Apple Pay not available");
        }

        // Try to initialize Google Pay if available
        try {
          googlePay = await payments.googlePay();
        } catch (err) {
          console.debug("Google Pay not available");
        }

        const paymentForm: SquarePaymentForm = {
          card,
          applePay,
          googlePay,

          requestCardPayment: async () => {
            try {
              const token = await payments.requestCardToken(card);
              if (!token || !token.token) {
                throw new Error("Failed to create payment token");
              }
              return token.token.sourceId || token.token;
            } catch (err) {
              const message =
                err instanceof Error ? err.message : "Card payment failed";
              throw new Error(message);
            }
          },

          requestApplePayment: async () => {
            if (!applePay) {
              throw new Error("Apple Pay not available");
            }
            try {
              const canPay = await applePay.canPayWithApplePay();
              if (!canPay) {
                throw new Error("Apple Pay not supported on this device");
              }
              const result = await applePay.requestPaymentMethod({
                total: { label: "Tina's Coffee", amount: "0.00" },
                countryCode: "AU",
                currencyCode: "AUD",
              });
              if (!result || !result.token) {
                throw new Error("Failed to get Apple Pay token");
              }
              return result.token.sourceId || result.token;
            } catch (err) {
              const message =
                err instanceof Error ? err.message : "Apple Pay payment failed";
              throw new Error(message);
            }
          },

          requestGooglePayment: async () => {
            if (!googlePay) {
              throw new Error("Google Pay not available");
            }
            try {
              const canPay = await googlePay.canPayWithGooglePay();
              if (!canPay) {
                throw new Error("Google Pay not supported on this device");
              }
              const result = await googlePay.requestPaymentMethod({
                total: { label: "Tina's Coffee", amount: "0.00" },
                countryCode: "AU",
                currencyCode: "AUD",
              });
              if (!result || !result.token) {
                throw new Error("Failed to get Google Pay token");
              }
              return result.token.sourceId || result.token;
            } catch (err) {
              const message =
                err instanceof Error ? err.message : "Google Pay payment failed";
              throw new Error(message);
            }
          },

          canPayWithApplePay: async () => {
            if (!applePay) return false;
            try {
              return await applePay.canPayWithApplePay();
            } catch {
              return false;
            }
          },

          canPayWithGooglePay: async () => {
            if (!googlePay) return false;
            try {
              return await googlePay.canPayWithGooglePay();
            } catch {
              return false;
            }
          },
        };

        setForm(paymentForm);
        setError(null);
        sdkLoadedRef.current = true;
        setLoading(false);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to setup payments";
        setError(message);
        setLoading(false);
      }
    };

    if (!sdkLoadedRef.current) {
      initializePayments();
    }
  }, []);

  return {
    loading,
    error,
    paymentConfig,
    form,
  };
}

declare global {
  interface Window {
    Square?: any;
  }
}
