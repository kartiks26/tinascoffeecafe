# Square POS Integration Setup

This application integrates with Square's API to sync your menu and process table orders. Follow these steps to set up the integration.

## Prerequisites

1. **Square Account**: Create a Square account at https://squareup.com
2. **Square Location**: Set up at least one location in Square
3. **Square Catalog**: Import your products, categories, and modifiers into Square's Catalog

## Step 1: Get Your Square API Credentials

1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Sign in with your Square account
3. Select your application (or create a new one)
4. In the **Credentials** section:
   - Copy your **Access Token** (Production or Sandbox)
   - Copy your **Location ID**

## Step 2: Set Environment Variables

Add the following to your `.env` file:

```env
SQUARE_ACCESS_TOKEN=your_access_token_here
SQUARE_LOCATION_ID=your_location_id_here
```

### Getting Your Values:

**Access Token**:
- Dashboard → Credentials → Production/Sandbox → Access Token (Personal)
- Never commit this to version control!

**Location ID**:
- Dashboard → Locations
- Click on your location
- Copy the Location ID

## Step 3: Configure Your Square Catalog

The app will sync items from your Square Catalog. Ensure:

1. **Products**: Each item must have:
   - Name
   - Price (in the first variation)
   - Description (optional but recommended)
   - Category
   - Image (optional but improves UX)

2. **Categories**: Organize products into categories
   - Coffee
   - Food
   - etc.

3. **Modifiers**: Create modifier lists for customization:
   - Milk type (None, Oat, Almond, Soy) - optional prices
   - Size (Small, Medium, Large) - optional prices
   - Extra options (Extra shot, Extra flavor, etc.)

### Example Catalog Structure:

```
Category: Coffee
├── Classic Espresso
│   ├── Price: $2.99
│   ├── Modifiers:
│   │   ├── Size: Single (+$0), Double (+$0.50)
│
├── Cappuccino
│   ├── Price: $4.49
│   ├── Modifiers:
│   │   ├── Milk: Whole (+$0), Oat (+$0.50)
│   │   ├── Size: Small (+$0), Medium (+$0.50), Large (+$1)
│
Category: Food
├── Croissant
│   ├── Price: $3.99
│   ├── Modifiers:
│   │   ├── Filling: Plain (+$0), Chocolate (+$1.50)
```

## Step 4: Deploy with Environment Variables

When deploying to production:

1. **Netlify**:
   - Go to Site settings → Environment
   - Add `SQUARE_ACCESS_TOKEN` and `SQUARE_LOCATION_ID`

2. **Vercel**:
   - Go to Settings → Environment Variables
   - Add both variables for Production, Preview, and Development

3. **Other Platforms**:
   - Follow your platform's documentation for adding environment variables

## Step 5: Test the Integration

1. Visit the app homepage
2. Click "Explore Our Menu" or navigate to `/order?table=TABLE_1`
3. Verify the menu loads correctly
4. Test adding items to the cart
5. Test the checkout flow

## API Endpoints

### Menu Sync
- **Endpoint**: `GET /api/square/sync-menu`
- **Response**: Returns menu categories, products, and modifiers
- **Cache**: Cached for 5 minutes in browser localStorage

### Create Order
- **Endpoint**: `POST /api/square/create-order`
- **Body**:
```json
{
  "tableId": "table_A1",
  "tableNumber": "A1",
  "items": [
    {
      "productId": "product_id",
      "productName": "Product Name",
      "price": 4.99,
      "quantity": 1,
      "modifiers": {
        "modifier_id": "option_id"
      }
    }
  ],
  "customerName": "John Doe",
  "customerPhone": "(555) 123-4567",
  "notes": "No sugar, extra hot"
}
```
- **Response**: Returns Order ID, status, and totals

### Get Order Status
- **Endpoint**: `GET /api/square/order-status/:orderId`
- **Response**: Returns current order status and update time

## Table Ordering

### QR Codes

Generate QR codes for each table that link to:
```
https://yourdomain.com/order?table=table_A1
```

Where `A1` is your table number/ID.

### Manual Table Entry

Users can also manually enter their table number on the ordering page.

## Troubleshooting

### "SQUARE_ACCESS_TOKEN not configured"
- Ensure you've set the environment variable
- Restart the development server
- Check `.env` file exists and has correct format

### Menu not loading
- Verify your Location ID is correct
- Check that products exist in Square Catalog
- Verify access token has correct permissions
- Check browser console for error messages

### Orders not appearing in Square
- Confirm products and categories exist in Square
- Check order status via `GET /api/square/order-status/:orderId`
- Verify tax rate configuration in Square

### Pricing issues
- Ensure all products have prices set in Square
- Check modifier prices are configured correctly
- Tax is calculated based on Square location settings

## Security Best Practices

1. **Never commit credentials**: Always use environment variables
2. **Use Production Token**: Once live, switch from Sandbox to Production token
3. **Rotate Tokens**: Periodically rotate your access token in Square dashboard
4. **HTTPS Only**: Ensure API calls use HTTPS in production
5. **Rate Limiting**: Square API has rate limits; monitor usage
6. **Order Validation**: Validate orders server-side before submission

## Support

For issues with:
- **Square API**: Visit [Square Developer Docs](https://developer.squareup.com/docs)
- **This App**: Check the app logs and error messages
- **Deployment**: Check your hosting platform's documentation

## Next Steps

1. Set up QR codes for your tables
2. Configure payment processing via Square (optional)
3. Set up order notifications
4. Train staff on new ordering system
