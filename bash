# 1. Build web app
pnpm run build

# 2. Add Android platform (first time only)
pnpm run mobile:android

# 3. Copy google-services.json
cp /path/to/google-services.json android/app/

# 4. Sync everything
pnpm run mobile:sync

# 5. Open in Android Studio
pnpm run mobile:open:android