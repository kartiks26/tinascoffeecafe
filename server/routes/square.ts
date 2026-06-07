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

function parseSquareMoney(money: any): number {
  const amount = money?.amount ?? money?.amount_money?.amount ?? 0;
  return typeof amount === "number" ? amount / 100 : 0;
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

    // --- FIX: Use searchCatalogObjects instead of list to bypass pagination limits ---
    // We pass include_related_objects: true so Square automatically attaches the IMAGE objects
    const catalogResponse = await squareFetch("/catalog/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        object_types: ["ITEM", "MODIFIER_LIST", "CATEGORY"],
        include_related_objects: true,
        include_deleted_objects: false,
      }),
    });

    const objects = catalogResponse.objects || [];
    const relatedObjects = catalogResponse.related_objects || [];

    // --- Build image lookup map from both main and related objects ---
    const imageMap = new Map<string, string>();
    [...objects, ...relatedObjects]
      .filter((obj: any) => obj.type === "IMAGE")
      .forEach((obj: any) => {
        const imgData = obj.imageData || obj.image_data || {};
        if (imgData.url) {
          imageMap.set(obj.id, imgData.url);
        }
      });

    // Parse categories
    const catObjects = objects.filter((obj: any) => obj.type === "CATEGORY");
    const categories = catObjects.map((obj: any) => {
      const data = obj.categoryData || obj.category_data || {};
      return {
        id: obj.id,
        name: data.name || "",
      };
    });
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    // Parse modifier lists
    const modifierData = objects.filter(
      (obj: any) => obj.type === "MODIFIER_LIST",
    );

    // Parse products into variation-aware menu items
    const products = objects
      .filter((obj: any) => obj.type === "ITEM")
      .flatMap((obj: any) => {
        const item = obj.itemData || obj.item_data || {};

        let categoryId = "";
        if (item.categoryId) categoryId = item.categoryId;
        else if (item.category_id) categoryId = item.category_id;
        else if (Array.isArray(item.categories) && item.categories.length > 0) {
          const first = item.categories[0];
          categoryId = typeof first === "string" ? first : first.id || "";
        }

        const category = categoryMap.get(categoryId);

        // Get parent item image ID
        const imageId =
          (item.imageIds && item.imageIds[0]) ||
          (item.image_ids && item.image_ids[0]);

        const imageUrl = imageId ? imageMap.get(imageId) || "" : "";
        const itemArchived = item.isArchived ?? item.is_archived ?? false;

        const modifierListInfo =
          item.modifierListInfo || item.modifier_list_info || [];
        const modifierIds: string[] = [
          ...new Set(
            Array.isArray(modifierListInfo)
              ? modifierListInfo
                  .map((m: any) => m.modifierListId || m.modifier_list_id || "")
                  .filter(Boolean)
              : [],
          ),
        ] as string[];

        const variations = item.variations || [];
        if (!Array.isArray(variations) || variations.length === 0) return [];

        return variations
          .filter((variation: any) => {
            if (variation.is_deleted || variation.isDeleted) return false;

            const vData =
              variation.item_variation_data ||
              variation.itemVariationData ||
              {};
            if (vData.sellable === false) return false;

            const presentAtAll =
              variation.present_at_all_locations ||
              variation.presentAtAllLocations;
            if (!presentAtAll) {
              const locationIds =
                variation.present_at_location_ids ||
                variation.presentAtLocationIds ||
                [];
              if (!locationIds.includes(locationId)) return false;
            }
            return true;
          })
          .map((variation: any) => {
            const vData =
              variation.item_variation_data ||
              variation.itemVariationData ||
              {};

            const priceMoney = vData.priceMoney || vData.price_money;
            const price = parseSquareMoney(priceMoney);
            const currency = priceMoney?.currency || "AUD";
            const isVariablePrice =
              (vData.pricing_type || vData.pricingType) === "VARIABLE_PRICING";

            const variationName = vData.name || "";
            const displayName =
              variationName && variationName !== item.name
                ? `${item.name} (${variationName})`
                : item.name || variationName || "Untitled Item";

            const available = !itemArchived && (vData.sellable ?? true);

            // Handle variation-specific image, or fall back to item image
            const variationImageId =
              (variation.image_ids && variation.image_ids[0]) ||
              (variation.imageIds && variation.imageIds[0]);
            const finalImageUrl = variationImageId
              ? imageMap.get(variationImageId) || imageUrl
              : imageUrl;

            return {
              id: variation.id,
              itemId: obj.id,
              variationId: variation.id,
              name: displayName,
              description: item.description || "",
              price,
              currency,
              isVariablePrice,
              categoryId,
              categoryName: category?.name || "Other",
              imageUrl: finalImageUrl,
              available,
              modifierIds,
            };
          });
      });

    // Filter categories to only those that have at least one product
    const usedCategoryIds = new Set(products.map((p) => p.categoryId));
    const filteredCategories = categories.filter((c) =>
      usedCategoryIds.has(c.id),
    );

    // Parse modifiers with options
    const modifiers = modifierData.map((mod: any) => {
      const listData = mod.modifierListData || mod.modifier_list_data || {};
      const opts = listData.modifiers || [];
      return {
        id: mod.id,
        name: listData.name || "",
        options: opts
          .filter((opt: any) => !(opt.is_deleted || opt.isDeleted))
          .map((opt: any) => {
            const optData = opt.modifierData || opt.modifier_data || {};
            const priceMoney = optData.priceMoney || optData.price_money || {};
            return {
              id: opt.id,
              name: optData.name || "",
              priceModifier: priceMoney.amount ? priceMoney.amount / 100 : 0,
              catalogObjectId: opt.id,
            };
          }),
      };
    });

    const menu: SquareMenu = {
      categories: filteredCategories,
      products,
      modifiers,
      lastSyncTime: Date.now(),
    };

    res.json({ menu, success: true } as MenuSyncResponse);
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

    if (!tableId) {
      return res
        .status(400)
        .json({ success: false, error: "Table ID is required" });
    }

    // Validate item variation IDs and modifier catalog object IDs.
    const catalogResponse = await squareFetch(
      "/catalog/list?types=ITEM_VARIATION,MODIFIER_LIST",
    );
    const catalogObjects = catalogResponse.objects || [];

    const validVariationIds = new Set(
      catalogObjects
        .filter((obj: any) => obj.type === "ITEM_VARIATION")
        .map((obj: any) => obj.id),
    );

    const modifierListObjects = catalogObjects.filter(
      (obj: any) => obj.type === "MODIFIER_LIST",
    );

    // Build lookup map: modifierId -> { optionId -> catalogObjectId }
    const modifierLookup: Record<string, Record<string, string>> = {};
    modifierListObjects.forEach((mod: any) => {
      const listData = mod.modifierListData || mod.modifier_list_data || {};
      const opts = listData.modifiers || [];
      modifierLookup[mod.id] = {};
      opts.forEach((opt: any) => {
        modifierLookup[mod.id][opt.id] = opt.id; // opt.id is the catalog object ID
      });
    });

    // Validate item variation IDs before building the order body.
    for (const item of items) {
      if (!item.variationId) {
        return res.status(400).json({
          success: false,
          error: "Missing variationId for one or more items",
        });
      }

      if (!validVariationIds.has(item.variationId)) {
        return res.status(400).json({
          success: false,
          error: `Invalid variationId ${item.variationId} for item ${
            item.itemId || item.productName
          }`,
        });
      }
    }

    // Build line items
    const lineItems = items.map((item) => {
      console.log("Creating order line item", {
        itemId: item.itemId,
        variationId: item.variationId,
      });

      const modifiers = Object.entries(item.modifiers || {}).map(
        ([modifierId, optionId]) => {
          const catalogObjectId =
            modifierLookup[modifierId]?.[optionId as string] ||
            (optionId as string);

          return {
            uid: modifierId,
            catalog_object_id: catalogObjectId,
          };
        },
      );

      const lineItem: any = {
        quantity: item.quantity.toString(),
        catalog_object_id: item.variationId,
      };

      if (modifiers.length > 0) {
        lineItem.modifiers = modifiers;
      }

      return lineItem;
    });

    const TAX_RATE = 8; // 8% tax

    // Create order body with required fields only
    const orderBody: any = {
      order: {
        location_id: locationId,
        line_items: lineItems,
        currency: "AUD",
      },
    };

    // Add optional fields only if they have values
    if (tableNumber && tableNumber.trim()) {
      orderBody.order.note = `Table: ${tableNumber}${notes ? `\n${notes}` : ""}`;
    } else if (notes && notes.trim()) {
      orderBody.order.note = notes.trim();
    }

    if (tableId) {
      orderBody.order.reference_id = `TABLE_${tableId}_${Date.now()}`;
    }
    const pickupAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    // Add customer info if provided
    if (
      customerName &&
      customerName.trim() &&
      customerPhone &&
      customerPhone.trim()
    ) {
      (orderBody.order as any).fulfillments = [
        {
          type: "PICKUP",
          state: "PROPOSED",
          pickup_details: {
            pickup_at: pickupAt,
            recipient: {
              display_name: customerName.trim(),
              phone_number: customerPhone.trim(),
            },
            note: `Pickup from table ${tableNumber}`,
          },
        },
      ];
    }

    const orderResponse = await squareFetch("/orders", {
      method: "POST",
      body: JSON.stringify(orderBody),
    });

    // Calculate totals from response
    const order = orderResponse.order || {};
    const totalMoney = order.totalMoney || order.total_money || {};
    const taxMoney = order.totalTaxMoney || order.total_tax_money || {};
    const subtotalMoney = order.subtotalMoney || order.subtotal_money || {};

    const squareOrder: SquareOrderResponse = {
      orderId: order.id || order.order_id || "",
      status: order.state || "OPEN",
      total: parseSquareMoney(totalMoney),
      tax: parseSquareMoney(taxMoney),
      subtotal:
        parseSquareMoney(subtotalMoney) ||
        parseSquareMoney(totalMoney) - parseSquareMoney(taxMoney),
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
