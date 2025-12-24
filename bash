# Remove the pinned version and update to the required version
pnpm remove @auth/core
pnpm add @auth/core@^0.37.0
pnpm install
npx convex deploy
