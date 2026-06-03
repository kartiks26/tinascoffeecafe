import { RequestHandler } from "express";
import { PaymentRequest, PaymentResponse } from "@shared/api";

const SQUARE_API_BASE = "https://connect.squareup.com/v2";

interface SquarePaymentError {
  errors?: Array<{ code?: string; detail?: string; field?: string }>;
}

interface SquarePayment {
  id?: string;
  status?: string;
  receipt_url?: string;
  amount_money?: { amount?: number };
}

// In-memory idempotency key tracking (in production, use database or Redis)
const processedIdempotencyKeys = new Map<
  string,
  { paymentId: string; response: PaymentResponse; timestamp: number }
>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  for (const [key, value] of processedIdempotencyKeys.entries()) {
    if (value.timestamp < fiveMinutesAgo) {
      processedIdempotencyKeys.delete(key);
    }
  }
}, 5 * 60 * 1000);

function getSquareHeaders(idempotencyKey?: string) {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) {
    throw new Error("SQUARE_ACCESS_TOKEN not configured");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Square-Version": "2024-01-18",
  };

  if (idempotencyKey) {
    headers["Idempotency-Key"] = idempotencyKey;
  }

  return headers;
}

async function squareFetch(
  endpoint: string,
  options: RequestInit = {},
  idempotencyKey?: string,
) {
  const url = `${SQUARE_API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getSquareHeaders(idempotencyKey),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = (await response.json()) as SquarePaymentError;
    throw new Error(
      `Square API error: ${error.errors?.[0]?.detail || response.statusText}`,
    );
  }

  return response.json();
}

export const handleProcessPayment: RequestHandler = async (req, res) => {
  try {
    const locationId = process.env.SQUARE_LOCATION_ID;
    if (!locationId) {
      return res.status(500).json({
        success: false,
        error: "SQUARE_LOCATION_ID not configured",
      } as PaymentResponse);
    }

    const {
      orderId,
      sourceId,
      idempotencyKey,
      customerName,
      customerEmail,
    } = req.body as PaymentRequest;

    if (!orderId || !sourceId || !idempotencyKey) {
      return res.status(400).json({
        success: false,
        error: "Missing required payment fields",
      } as PaymentResponse);
    }

    // Check if this idempotency key has already been processed
    const cached = processedIdempotencyKeys.get(idempotencyKey);
    if (cached) {
      console.log(`Idempotency key already processed: ${idempotencyKey}`);
      return res.json(cached.response);
    }

    // First, retrieve the order to get the total amount
    let orderResponse;
    try {
      orderResponse = await squareFetch(`/orders/${orderId}`);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: `Order not found: ${orderId}`,
        orderId,
      } as PaymentResponse);
    }

    const order = orderResponse.order || {};
    const totalAmount = order.totalMoney?.amount || 0;

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid order total",
        orderId,
      } as PaymentResponse);
    }

    // Process the payment
    const paymentBody = {
      source_id: sourceId,
      idempotency_key: idempotencyKey,
      amount_money: {
        amount: totalAmount,
        currency: "AUD",
      },
      order_id: orderId,
      ...(customerName && { customer_id: undefined }),
      note: `Payment for order ${orderId}`,
    };

    const paymentResponse = await squareFetch(
      "/payments",
      {
        method: "POST",
        body: JSON.stringify(paymentBody),
      },
      idempotencyKey,
    );

    const payment = paymentResponse.payment || ({} as SquarePayment);
    const paymentId = payment.id || "";
    const status = payment.status || "COMPLETED";
    const receiptUrl = payment.receipt_url || "";

    const successResponse: PaymentResponse = {
      success: true,
      orderId,
      paymentId,
      status,
      receiptUrl,
    };

    // Cache the successful response
    processedIdempotencyKeys.set(idempotencyKey, {
      paymentId,
      response: successResponse,
      timestamp: Date.now(),
    });

    console.log(`Payment processed successfully: ${paymentId} for order ${orderId}`);

    return res.json(successResponse);
  } catch (error) {
    console.error("Payment processing error:", error);

    const errorMessage = error instanceof Error ? error.message : "Payment failed";
    let errorCode = "PAYMENT_FAILED";

    // Parse Square-specific error codes
    if (errorMessage.includes("INVALID_REQUEST")) {
      errorCode = "INVALID_REQUEST";
    } else if (errorMessage.includes("CARD_DECLINED")) {
      errorCode = "CARD_DECLINED";
    } else if (errorMessage.includes("CVV_MISMATCH")) {
      errorCode = "CVV_MISMATCH";
    } else if (errorMessage.includes("CARD_EXPIRED")) {
      errorCode = "CARD_EXPIRED";
    } else if (errorMessage.includes("INSUFFICIENT_FUNDS")) {
      errorCode = "INSUFFICIENT_FUNDS";
    } else if (errorMessage.includes("RATE_LIMITED")) {
      errorCode = "RATE_LIMITED";
    }

    return res.status(400).json({
      success: false,
      error: errorMessage,
      errorCode,
    } as PaymentResponse);
  }
};

export const handleGetWebPaymentKey: RequestHandler = async (req, res) => {
  try {
    const applicationId = process.env.VITE_PUBLIC_SQUARE_APP_ID || process.env.SQUARE_APPLICATION_ID;
    const locationId = process.env.SQUARE_LOCATION_ID;

    if (!applicationId || !locationId) {
      return res.status(500).json({
        error: "Payment configuration incomplete",
      });
    }

    res.json({
      applicationId,
      locationId,
    });
  } catch (error) {
    console.error("Get payment key error:", error);
    res.status(500).json({
      error: "Failed to retrieve payment configuration",
    });
  }
};

export const handleVerifyPayment: RequestHandler = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ error: "Payment ID required" });
    }

    const paymentResponse = await squareFetch(`/payments/${paymentId}`);
    const payment = paymentResponse.payment || ({} as SquarePayment);

    res.json({
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amount_money?.amount || 0,
      receiptUrl: payment.receipt_url,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to verify payment",
    });
  }
};
