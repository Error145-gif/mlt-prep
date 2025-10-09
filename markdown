### Changes Made:

*   **`src/pages/PaymentSummary.tsx`**: Removed a duplicate declaration of the `validateCouponQuery` variable. This resolves a redeclaration error and ensures the `useQuery` hook is declared only once.

**Outcome:**

This change addresses the "Identifier 'validateCouponQuery' has already been declared" error, which was preventing the coupon validation logic from being processed correctly. The coupon functionality should now be operational.
