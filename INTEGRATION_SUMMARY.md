# Square POS Integration - Implementation Summary

## Overview

Tina's Coffee app now includes a complete Square POS integration with table-based ordering. The system synchronizes your Square menu in real-time and enables customers to order directly from tables.

## Architecture

### Backend (Node.js/Express)
```
server/routes/square.ts
├── handleSyncMenu()         → GET /api/square/sync-menu
├── handleCreateOrder()      → POST /api/square/create-order
└── handleGetOrderStatus()   → GET /api/square/order-status/:orderId
```

**Key Features:**
- Fetches products, categories, and modifiers from Square Catalog
- Calculates accurate pricing with modifier adjustments
- Creates orders in Square with table reference
- Handles customer info and special requests
- Robust error handling and Square API versioning

### Frontend (React)

**Custom Hooks:**
- `useSquareMenu()` - Menu management with caching
  - Automatic sync on app load
  - 5-minute cache in localStorage
  - Methods: getProduct, getCategory, getModifier, getProductsByCategory
  
- `useCart()` - Shopping cart management
  - Persistent storage in localStorage
  - Automatic tax calculation (configurable rate)
  - Total price calculations with modifiers
  - Add/remove/update quantity methods

**Pages:**
1. **Landing Page** (`Index.tsx`)
   - Hero section with table ordering CTA
   - Features overview
   - Links to menu and table ordering

2. **Browse Menu** (`Menu.tsx`)
   - View all items from Square catalog
   - Filter by category
   - Expandable modifiers/add-ons
   - Dynamic pricing

3. **Table Ordering** (`Order.tsx`)
   - Table selection (QR code or manual input)
   - Browse Square menu with images
   - Customize items with modifiers
   - Real-time cart preview
   - Persistent cart state

4. **Checkout** (`Checkout.tsx`)
   - Review order items
   - Update quantities
   - Enter customer details (name, phone)
   - Special requests/notes
   - Order submission to Square
   - Success confirmation with Order ID

## Data Flow

```
1. Customer scans QR code or enters table number
   ↓
2. Order page loads → triggers menu sync
   ↓
3. useSquareMenu fetches /api/square/sync-menu
   ↓
4. Backend queries Square Catalog API
   ↓
5. Menu data cached in localStorage (5 min)
   ↓
6. Customer browses, customizes, adds items to cart
   ↓
7. Cart persisted in localStorage
   ↓
8. Customer proceeds to checkout
   ↓
9. Enters name, phone, special requests
   ↓
10. POST /api/square/create-order
    ↓
11. Backend creates order in Square POS
    ↓
12. Order appears in Square's order management
    ↓
13. Customer gets Order ID confirmation
```

## Square API Integration Details

### Menu Sync (`/api/square/sync-menu`)

**Request:** None (GET)

**Response:**
```json
{
  "success": true,
  "menu": {
    "categories": [
      { "id": "CATEGORY_ID", "name": "Coffee" }
    ],
    "products": [
      {
        "id": "PRODUCT_ID",
        "name": "Cappuccino",
        "description": "...",
        "price": 4.49,
        "categoryId": "CATEGORY_ID",
        "categoryName": "Coffee",
        "imageUrl": "...",
        "available": true
      }
    ],
    "modifiers": [
      {
        "id": "MODIFIER_ID",
        "name": "Milk",
        "options": [
          { "id": "OPTION_ID", "name": "Oat", "priceModifier": 0.50 }
        ]
      }
    ],
    "lastSyncTime": 1704067200000
  }
}
```

**Square API Calls:**
- `GET /v2/catalog/list?types=CATEGORY,ITEM,MODIFIER_LIST`

### Create Order (`/api/square/create-order`)

**Request:**
```json
{
  "tableId": "table_A1",
  "tableNumber": "A1",
  "items": [
    {
      "productId": "PRODUCT_ID",
      "productName": "Cappuccino",
      "price": 4.49,
      "quantity": 1,
      "modifiers": {
        "MODIFIER_ID": "OPTION_ID"
      }
    }
  ],
  "customerName": "John Doe",
  "customerPhone": "(555) 123-4567",
  "notes": "No sugar, extra hot"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "orderId": "ORDER_ID",
    "status": "OPEN",
    "subtotal": 8.98,
    "tax": 0.72,
    "total": 9.70
  }
}
```

**Square API Calls:**
- `POST /v2/orders` - Creates order with line items and modifiers

## Configuration

### Environment Variables

Required for production:
```env
SQUARE_ACCESS_TOKEN=your_production_token
SQUARE_LOCATION_ID=your_location_id
```

### Tax Configuration

- Currently hardcoded to 8% in `useCart()` hook
- Should be fetched from Square location settings for accuracy
- Modifiable in: `client/hooks/useCart.ts` line 14

### Cache Configuration

- Menu cache: 5 minutes (localStorage)
- Modifiable in: `client/hooks/useSquareMenu.ts` line 10

## Features Implemented

✅ **Real-time Menu Sync**
- Automatic sync on app load
- Respects product availability
- Caches menu data locally

✅ **Complete Product Customization**
- Support for all modifier types
- Dynamic pricing with modifiers
- Radio button selection for single-choice modifiers

✅ **Table-Based Ordering**
- QR code support (URL params: `?table=table_ID`)
- Manual table number entry
- Table reference in Square orders

✅ **Shopping Cart**
- Persistent storage across sessions
- Real-time total calculations
- Tax estimation
- Quantity adjustment

✅ **Checkout Flow**
- Customer information collection
- Special requests/notes
- Order confirmation with ID
- Order creation in Square POS

✅ **Error Handling**
- Graceful error states with user messaging
- Fallback to cached menu
- Network error recovery
- Input validation

✅ **Responsive Design**
- Mobile-optimized ordering flow
- Desktop support for QR scanning
- Touch-friendly modifiers selection

## Testing Checklist

### Menu Sync
- [ ] Menu loads on app startup
- [ ] Categories display correctly
- [ ] All products visible
- [ ] Prices accurate
- [ ] Modifiers load correctly
- [ ] Out-of-stock items marked

### Table Ordering
- [ ] QR code creates session with table ID
- [ ] Manual table entry works
- [ ] Table number displays in header
- [ ] Cart shows correct count

### Customization
- [ ] Modifiers expand/collapse
- [ ] Modifier selection updates price
- [ ] Multiple modifiers selectable
- [ ] Prices display correctly

### Checkout
- [ ] Items review displays quantities
- [ ] Quantity adjustment works
- [ ] Subtotal/tax/total calculated correctly
- [ ] Customer info required
- [ ] Special requests optional
- [ ] Order submission succeeds

### Square Integration
- [ ] Order appears in Square POS
- [ ] Order has correct table reference
- [ ] Customer info visible in Square
- [ ] Items and modifiers correct
- [ ] Pricing matches Square calculations

## Future Enhancements

1. **Order Status Updates**
   - Real-time WebSocket updates
   - Order ready notifications
   - Pickup confirmation

2. **Inventory Management**
   - Sync availability from Square in real-time
   - Show out-of-stock items
   - Suggest alternatives

3. **Payment Integration**
   - Square Payments API for in-table checkout
   - Digital payment confirmation
   - Tip options

4. **Analytics**
   - Order history per table
   - Popular items tracking
   - Peak ordering times

5. **Admin Features**
   - Order management dashboard
   - Manual order creation
   - Customer management

6. **Multi-language Support**
   - Internationalization setup
   - Menu translations

## Security Considerations

✅ **Implemented:**
- Access token stored in environment variables
- CORS configured
- Input validation on order creation
- HTTPS enforcement recommended

⚠️ **Recommendations:**
- Use production access token in live environment
- Implement rate limiting
- Monitor API usage
- Regular security audits
- PCI compliance for payments

## Troubleshooting

### Menu not loading
1. Check SQUARE_ACCESS_TOKEN is set
2. Verify SQUARE_LOCATION_ID is correct
3. Ensure products exist in Square Catalog
4. Check browser console for errors

### Orders not appearing in Square
1. Verify order response status
2. Check Square Dashboard for orders
3. Confirm location ID is correct
4. Review error messages in server logs

### Pricing incorrect
1. Verify prices in Square Catalog
2. Check modifier prices in Square
3. Confirm tax rate setting
4. Review cart calculations in browser

## Deployment Notes

### Before Going Live

1. **Migrate to Production Token**
   - Replace sandbox token with production
   - Update SQUARE_LOCATION_ID to production location

2. **QR Code Generation**
   - Generate QR codes for each table
   - Format: `https://yourdomain.com/order?table=TABLE_ID`

3. **Testing**
   - Complete full ordering flow
   - Verify orders in Square
   - Test all modifiers
   - Check mobile experience

4. **Training**
   - Brief staff on new system
   - Test order workflow
   - Set up order notifications

### Hosting Requirements

- Node.js environment for Express backend
- HTTPS (required for production)
- Environment variable support
- localStorage (client-side caching)

## API Rate Limits

Square API has standard rate limits:
- 10 requests per second
- Monitor usage for peak times
- Consider caching strategy adjustments

## Support Resources

- [Square Developer Docs](https://developer.squareup.com/docs)
- [Square Catalog API](https://developer.squareup.com/reference/square/catalog-api)
- [Square Orders API](https://developer.squareup.com/reference/square/orders-api)
- [Setup Guide](./SQUARE_SETUP.md)
