/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// ============ SQUARE INTEGRATION TYPES ============

export interface SquareProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  categoryName?: string;
  imageUrl?: string;
  available: boolean;
}

export interface SquareModifier {
  id: string;
  name: string;
  options: SquareModifierOption[];
}

export interface SquareModifierOption {
  id: string;
  name: string;
  priceModifier: number;
}

export interface SquareCategory {
  id: string;
  name: string;
}

export interface SquareMenu {
  categories: SquareCategory[];
  products: SquareProduct[];
  modifiers: SquareModifier[];
  lastSyncTime: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  modifiers: Record<string, string>; // modifierId -> selectedOptionId
}

export interface OrderRequest {
  tableNumber: string;
  tableId: string;
  items: CartItem[];
  notes?: string;
  customerName?: string;
  customerPhone?: string;
}

export interface SquareOrderResponse {
  orderId: string;
  status: string;
  total: number;
  tax: number;
  subtotal: number;
}

export interface MenuSyncResponse {
  menu: SquareMenu;
  success: boolean;
  error?: string;
}

export interface CreateOrderResponse {
  order: SquareOrderResponse;
  success: boolean;
  error?: string;
}
