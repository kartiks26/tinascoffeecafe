# Quick Testing Guide - Square Payment Integration

## Running the Application

```bash
pnpm dev
```

The dev server runs on `http://localhost:8080` with both frontend and backend integrated.

## Test Flow

### 1. Basic Happy Path

1. **Add Items to Cart**
   - Go to http://localhost:8080/order
   - Enter table number (e.g., "A1")
   - Select items and modifiers
   - Click "Continue Shopping" or proceed to checkout

2. **Complete Checkout**
   - Click "Proceed to Checkout"
   - Review items and totals
   - Click "Continue to Checkout"
   - Enter name and phone
   - Click "Continue to Payment"

3. **Payment Review**
   - Review order summary
   - Verify total amount
   - Click "Proceed to Payment"

4. **Payment Entry**
   - Card form will load (takes a moment)
   - Enter test card number: **4532015112830366**
   - Expiration: Any future date (e.g., 12/26)
   - CVV: Any 3 digits (e.g., 123)
   - Click "Pay Now"

5. **Success Confirmation**
   - See "Payment Confirmed!" screen
   - Order number displayed
   - Items listed with amounts
   - "Place Another Order" button works

### 2. Error Cases

#### Card Declined
```
Card: 4000002500003155
Expiration: Any future date
CVV: Any 3 digits
```
- Should show "Card Declined" error
- Button to retry payment
- Can go back and try different method

#### Network Failure (Testing Retry)
1. Start payment normally
2. Disconnect internet mid-payment (kill WiFi/network)
3. See timeout/network error message
4. Reconnect and click "Try Another Payment Method"
5. Same idempotency key prevents double charge

#### Validation Errors
1. Try to proceed without entering name/phone
2. Should show validation error alert
3. Fix and retry

### 3. Digital Wallets (Optional)

**Apple Pay** (requires iPhone)
1. Go to payment form
2. Look for "Pay with Apple Pay" button
3. Click and complete Face ID/Touch ID
4. Payment should process

**Google Pay** (requires Android)
1. Go to payment form
2. Look for "Pay with Google Pay" button
3. Click and complete authentication
4. Payment should process

### 4. Mobile Testing

Test on actual devices for best experience:

#### iPhone
```
1. Open http://[server-ip]:8080 in Safari
2. Add items to cart
3. Complete checkout to payment
4. "Pay with Apple Pay" button should appear
5. Test Apple Pay payment flow
```

#### Android
```
1. Open http://[server-ip]:8080 in Chrome
2. Add items to cart
3. Complete checkout to payment
4. "Pay with Google Pay" button should appear
5. Test Google Pay payment flow
```

### 5. Edge Cases to Test

#### Multiple Orders in Sequence
1. Complete first payment successfully
2. Click "Place Another Order"
3. Should return to menu with empty cart
4. Add new items and repeat payment
5. Verify second order has new order ID

#### Modify Order After Payment
1. Add items to cart
2. Go to payment review
3. Click "Back" to customer info
4. Click "Back" to review
5. Modify quantities
6. Re-submit order with new totals
7. Should calculate new total for payment

#### Very Large Order
1. Add many items (20+ items)
2. Complete checkout
3. Total should be calculated correctly
4. Payment should process for large amount

### 6. Console Logging

Open browser DevTools (F12) to see:

**Network Tab:**
- POST /api/square/create-order (order creation)
- POST /api/square/process-payment (payment processing)
- Verify responses have success: true

**Console Tab:**
- No red errors
- See any warnings about missing Square SDK
- Payment logging messages

### 7. Error Scenarios to Test

| Scenario | Result | How to Test |
|----------|--------|------------|
| Missing Square SDK | Error message shown, go back button works | Kill network temporarily |
| Invalid app ID | SDK fails to load | Check .env file |
| Network error during payment | Idempotency prevents double charge | Disconnect network during payment |
| Card declined | Specific error message shown | Use test decline card |
| CVV mismatch | Clear error message | Enter wrong CVV |
| Expired card | Helpful error with next steps | Use past expiration date |

## Debugging Tips

### Payment Not Processing
1. Check browser console for errors
2. Check network tab for API response
3. Verify .env variables set correctly
4. Look at server logs for payment processing errors

### Card Form Not Appearing
1. Wait 2-3 seconds (SDK takes time to load)
2. Check console for Square SDK errors
3. Verify HTTPS (required for Web Payments SDK)
4. Check VITE_PUBLIC_SQUARE_APP_ID in .env

### Payment Success But Cart Not Cleared
1. Check if success screen appears
2. If not, check browser console for errors
3. Verify PaymentSuccess component renders

### Order ID Not Showing
1. Verify order was created (check network tab)
2. Check if orderId is in response
3. Look at PaymentSuccess component rendering

## Browser Compatibility

### Desktop
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ⚠️ IE (not supported)

### Mobile
- ✅ iOS 13+ (Safari + Chrome)
- ✅ Android 8+ (Chrome)
- ✅ Samsung Internet

### Wallet Support
- Apple Pay: iOS only
- Google Pay: Android only
- Card fallback: All browsers

## Performance Checklist

- [ ] Page loads in < 3 seconds
- [ ] Payment form renders in < 2 seconds
- [ ] Payment processes in < 10 seconds
- [ ] Success screen appears instantly
- [ ] No memory leaks (DevTools memory tab)
- [ ] Responsive on 375px width (mobile)
- [ ] Works on 4G/LTE (throttle in DevTools)

## Accessibility Testing

### Keyboard Navigation
1. Tab through all form inputs
2. Verify focus visible on each element
3. Can submit form with Enter key
4. Can click buttons with Spacebar

### Screen Reader (NVDA/JAWS)
1. Read order items
2. Read form labels
3. Read error messages
4. Read success confirmation

### Mobile (Voice Control)
1. iOS Voice Control can navigate
2. Android TalkBack can use form

## Load Testing

```bash
# Simulate 10 concurrent users
ab -n 100 -c 10 http://localhost:8080/api/square/process-payment
```

Expected: < 500ms response time

## Security Checklist

- [ ] No card numbers in console logs
- [ ] No card numbers in network tab
- [ ] No payment tokens exposed
- [ ] HTTPS enforced in production
- [ ] Sensitive env vars not logged
- [ ] CORS configured correctly
- [ ] Rate limiting in place (future)

## After Testing, Before Production

1. **Remove test cards** - Use only real test account
2. **Enable logging** - Add request/error logging
3. **Test webhooks** - Set up Square webhook handling
4. **Add monitoring** - Sentry or similar error tracking
5. **Enable analytics** - Track payment conversion
6. **Test refunds** - Document refund process
7. **Security audit** - Review code for vulnerabilities
8. **Load test** - Simulate peak traffic
9. **User testing** - Real users complete payments
10. **Documentation** - Update support docs

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Payment form not ready" | Wait for SDK to load, check console |
| "Payment failed" | Check card details, try test card |
| "Order ID not found" | Refresh page, make sure order created |
| "Network error" | Check internet, try again |
| "Wallet not available" | Use correct device (iPhone for Apple Pay) |
| "Button disabled" | Wait for previous action to complete |
| "No payment total shown" | Check order total calculation |

## Questions?

Refer to:
1. PAYMENT_INTEGRATION.md - Full technical reference
2. IMPLEMENTATION_SUMMARY.md - Overview of changes
3. Square Docs: https://developer.squareup.com
4. Browser console errors
5. Network tab for API responses
