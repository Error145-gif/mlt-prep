# Step 1: Fix the environment variables
npx convex env set AUTH_GOOGLE_ID "513889515278-jat46qtdgu4h2sfnhnik23jf48c68c3e.apps.googleusercontent.com"

# Step 2: Get your ACTUAL Client Secret from Google Cloud Console
# Go to: https://console.cloud.google.com/apis/credentials
# Click on your OAuth client → Copy the "Client secret" (starts with GOCSPX-)
# Then run:
npx convex env set AUTH_GOOGLE_SECRET "GOCSPX-your-actual-secret-here"

# Step 3: Fix the dependency issue
pnpm update @auth/core@0.34.2

# Step 4: Deploy the changes
npx convex deploy
