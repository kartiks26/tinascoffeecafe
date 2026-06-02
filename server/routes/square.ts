import { RequestHandler } from "express";
import {
  SquareMenu,
  MenuSyncResponse,
  OrderRequest,
  CreateOrderResponse,
  SquareOrderResponse,
} from "@shared/api";

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
    Authorization: `Bearer ${token}`,
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
      `Square API error: ${error.errors?.[0]?.detail || response.statusText}`,
    );
  }

  return response.json();
}

function calculateModifierPrice(
  modifiers: Record<string, string>,
  modifierData: any[],
): number {
  let total = 0;

  Object.entries(modifiers).forEach(([modifierId, optionId]) => {
    const modifier = modifierData.find((m) => m.id === modifierId);
    if (!modifier) return;

    // possible locations for option arrays
    const optionsArr =
      modifier.modifierOptions ||
      modifier.modifiers ||
      modifier.modifierListData?.modifiers ||
      modifier.modifier_list_data?.modifiers ||
      [];

    const option = optionsArr.find((opt: any) => opt.id === optionId);
    if (!option) return;

    // option may wrap data in modifierData/modifier_data
    const optData = option.modifierData || option.modifier_data || option;
    const priceMoney = optData.priceMoney || optData.price_money || {};
    total += (priceMoney.amount || 0) / 100;
  });

  return total;
}

export const handleSyncMenu: RequestHandler = async (req, res) => {
  try {
    const locationId = process.env.SQUARE_LOCATION_ID;
    if (!locationId) {
      return res
        .status(500)
        .json({ success: false, error: "SQUARE_LOCATION_ID not configured" });
    }

    // Fetch catalog
    const catalogResponse = await squareFetch(
      "/catalog/list?types=CATEGORY,ITEM,MODIFIER_LIST",
    );
    const objects = catalogResponse.objects || [];
    console.log(objects);
    // Parse categories (support camelCase and snake_case)
    const categories = objects
      .filter((obj: any) => obj.type === "CATEGORY")
      .map((obj: any) => {
        const data = obj.categoryData || obj.category_data || {};
        return {
          id: obj.id,
          name: data.name || "",
        };
      });

    // Parse modifiers
    const modifierData = objects.filter(
      (obj: any) => obj.type === "MODIFIER_LIST",
    );

    // Parse products (support camelCase and snake_case)
    const products = objects
      .filter((obj: any) => obj.type === "ITEM")
      .map((obj: any) => {
        const item = obj.itemData || obj.item_data || {};

        // determine category id: categoryId, category_id, or first element of categories
        let categoryId = "";
        if (item.categoryId) categoryId = item.categoryId;
        else if (item.category_id) categoryId = item.category_id;
        else if (Array.isArray(item.categories) && item.categories.length > 0) {
          const first = item.categories[0];
          categoryId = typeof first === "string" ? first : first.id || "";
        }

        const category = categories.find((c: any) => c.id === categoryId);

        // extract price from variation (support camelCase and snake_case)
        const firstVariation = (item.variations && item.variations[0]) || {};
        const variationData =
          firstVariation.itemVariationData ||
          firstVariation.item_variation_data ||
          {};
        const priceMoney =
          variationData.priceMoney || variationData.price_money || {};
        const price = priceMoney.amount ? priceMoney.amount / 100 : 0;

        const imageId =
          (item.imageIds && item.imageIds[0]) ||
          (item.image_ids && item.image_ids[0]);
        const available =
          item.isArchived !== undefined
            ? !item.isArchived
            : !(item.is_archived ?? false);

        return {
          id: obj.id,
          name: item.name || "",
          description: item.description || "",
          price,
          categoryId,
          categoryName: category?.name || "Other",
          imageUrl: imageId ? `/square/image/${imageId}` : undefined,
          available,
        };
      });

    // Parse modifiers with options (support camelCase and snake_case)
    const modifiers = modifierData.map((mod: any) => {
      const listData = mod.modifierListData || mod.modifier_list_data || {};
      const opts = listData.modifiers || [];
      return {
        id: mod.id,
        name: listData.name || "",
        options: opts.map((opt: any) => {
          const optData = opt.modifierData || opt.modifier_data || {};
          const priceMoney = optData.priceMoney || optData.price_money || {};
          return {
            id: opt.id,
            name: optData.name || "",
            priceModifier: priceMoney.amount ? priceMoney.amount / 100 : 0,
          };
        }),
      };
    });

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
      return res
        .status(500)
        .json({ success: false, error: "SQUARE_LOCATION_ID not configured" });
    }

    const { tableNumber, tableId, items, notes, customerName, customerPhone } =
      req.body as OrderRequest;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No items in order" });
    }

    // Build line items
    const lineItems = items.map((item) => {
      const modifiers = Object.entries(item.modifiers || {}).map(
        ([modifierId, optionId]) => ({
          uid: modifierId,
          catalog_object_id: optionId as string,
        }),
      );

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
      error:
        error instanceof Error ? error.message : "Failed to get order status",
    });
  }
};
