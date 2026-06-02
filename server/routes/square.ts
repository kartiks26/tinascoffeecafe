import { RequestHandler } from "express";
import { SquareMenu, MenuSyncResponse, OrderRequest, CreateOrderResponse, SquareOrderResponse } from "@shared/api";

const SQUARE_API_BASE = "https://connect.squareup.com/v2";

interface SquareError {
  errors?: Array<{ code?: string; detail?: string }>;
}

function getSquareHeaders() {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) {
    throw new Error("SQUARE_ACCESS_TOKEN not configured");
  }
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "Square-Version": "2024-01-18",
  };
}

async function squareFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${SQUARE_API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getSquareHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = (await response.json()) as SquareError;
    throw new Error(
      `Square API error: ${error.errors?.[0]?.detail || response.statusText}`
    );
  }

  return response.json();
}

function calculateModifierPrice(modifiers: Record<string, string>, modifierData: any[]): number {
  let total = 0;
  
  Object.entries(modifiers).forEach(([modifierId, optionId]) => {
    const modifier = modifierData.find(m => m.id === modifierId);
    if (modifier?.modifierOptions) {
      const option = modifier.modifierOptions.find((opt: any) => opt.id === optionId);
      if (option?.priceMoney) {
        total += (option.priceMoney.amount || 0) / 100;
      }
    }
  });

  return total;
}

export const handleSyncMenu: RequestHandler = async (req, res) => {
  try {
    const locationId = process.env.SQUARE_LOCATION_ID;
    if (!locationId) {
      return res.status(500).json({ success: false, error: "SQUARE_LOCATION_ID not configured" });
    }

    // Fetch catalog
    const catalogResponse = await squareFetch("/catalog/list?types=CATEGORY,ITEM,MODIFIER_LIST");
    const objects = catalogResponse.objects || [];

    // Parse categories
    const categories = objects
      .filter((obj: any) => obj.type === "CATEGORY")
      .map((obj: any) => ({
        id: obj.id,
        name: obj.categoryData?.name || "",
      }));

    // Parse modifiers
    const modifierData = objects.filter((obj: any) => obj.type === "MODIFIER_LIST");

    // Parse products
    const products = objects
      .filter((obj: any) => obj.type === "ITEM")
      .map((obj: any) => {
        const itemData = obj.itemData || {};
        const categoryId = itemData.categoryId || "";
        const category = categories.find((c: any) => c.id === categoryId);

        return {
          id: obj.id,
          name: itemData.name || "",
          description: itemData.description || "",
          price: itemData.variations?.[0]?.itemVariationData?.priceMoney?.amount
            ? (itemData.variations[0].itemVariationData.priceMoney.amount / 100)
            : 0,
          categoryId: categoryId,
          categoryName: category?.name || "Other",
          imageUrl: itemData.imageIds?.[0] ? `/square/image/${itemData.imageIds[0]}` : undefined,
          available: !itemData.isArchived,
        };
      });

    // Parse modifiers with options
    const modifiers = modifierData.map((mod: any) => ({
      id: mod.id,
      name: mod.modifierListData?.name || "",
      options: (mod.modifierListData?.modifiers || []).map((opt: any) => ({
        id: opt.id,
        name: opt.modifierData?.name || "",
        priceModifier: opt.modifierData?.priceMoney?.amount
          ? (opt.modifierData.priceMoney.amount / 100)
          : 0,
      })),
    }));

    const menu: SquareMenu = {
      categories,
      products,
      modifiers,
      lastSyncTime: Date.now(),
    };

    const response: MenuSyncResponse = {
      menu,
      success: true,
    };

    res.json(response);
  } catch (error) {
    console.error("Menu sync error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to sync menu",
    } as MenuSyncResponse);
  }
};

export const handleCreateOrder: RequestHandler = async (req, res) => {
  try {
    const locationId = process.env.SQUARE_LOCATION_ID;
    if (!locationId) {
      return res.status(500).json({ success: false, error: "SQUARE_LOCATION_ID not configured" });
    }

    const { tableNumber, tableId, items, notes, customerName, customerPhone } = req.body as OrderRequest;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: "No items in order" });
    }

    // Build line items
    const lineItems = items.map((item) => {
      const modifiers = Object.entries(item.modifiers || {}).map(([modifierId, optionId]) => ({
        uid: modifierId,
        catalog_object_id: optionId as string,
      }));

      return {
        quantity: item.quantity.toString(),
        catalog_object_id: item.productId,
        note: Object.entries(item.modifiers || {})
          .map(([, optionId]) => optionId)
          .join(", "),
        modifiers: modifiers.length > 0 ? modifiers : undefined,
      };
    });

    // Create order body
    const orderBody = {
      order: {
        locationId,
        lineItems,
        referenceId: `TABLE_${tableId}_${Date.now()}`,
        note: `Table: ${tableNumber}${notes ? `\n${notes}` : ""}`,
        customerId: customerPhone ? undefined : undefined,
      },
    };

    // Add customer info if provided
    if (customerName || customerPhone) {
      (orderBody.order as any).fulfillment = {
        type: "PICKUP",
        pickupDetails: {
          recipient: {
            displayName: customerName,
            phoneNumber: customerPhone,
          },
          note: `Pickup from table ${tableNumber}`,
        },
      };
    }

    const orderResponse = await squareFetch("/orders", {
      method: "POST",
      body: JSON.stringify(orderBody),
    });

    // Calculate totals from response
    const order = orderResponse.order || {};
    const totalMoney = order.totalMoney || { amount: 0 };
    const taxMoney = order.totalTaxMoney || { amount: 0 };

    const squareOrder: SquareOrderResponse = {
      orderId: order.id || "",
      status: order.state || "OPEN",
      total: totalMoney.amount / 100 || 0,
      tax: taxMoney.amount / 100 || 0,
      subtotal: (totalMoney.amount - taxMoney.amount) / 100 || 0,
    };

    const response: CreateOrderResponse = {
      order: squareOrder,
      success: true,
    };

    res.json(response);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    } as CreateOrderResponse);
  }
};

export const handleGetOrderStatus: RequestHandler = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID required" });
    }

    const orderResponse = await squareFetch(`/orders/${orderId}`);
    const order = orderResponse.order || {};

    res.json({
      orderId: order.id,
      status: order.state,
      updatedAt: order.updatedAt,
    });
  } catch (error) {
    console.error("Get order status error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to get order status",
    });
  }
};
