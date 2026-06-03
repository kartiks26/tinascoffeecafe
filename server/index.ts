import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleSyncMenu, handleCreateOrder, handleGetOrderStatus } from "./routes/square";
import {
  handleProcessPayment,
  handleGetWebPaymentKey,
  handleVerifyPayment,
} from "./routes/payment";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Square POS Integration routes
  app.get("/api/square/sync-menu", handleSyncMenu);
  app.post("/api/square/create-order", handleCreateOrder);
  app.get("/api/square/order-status/:orderId", handleGetOrderStatus);

  // Square Payments routes
  app.get("/api/square/web-payment-key", handleGetWebPaymentKey);
  app.post("/api/square/process-payment", handleProcessPayment);
  app.get("/api/square/verify-payment/:paymentId", handleVerifyPayment);

  return app;
}
