grep -r "@ts-nocheck" src/
sed -i 's/\/\/ @ts-nocheck//g' src/pages/Landing.tsx src/components/SubscriptionStatus.tsx
npx convex dev --once && npx tsc -b --noEmit
