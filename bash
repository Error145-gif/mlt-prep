# 1. Install Capacitor packages (if not already done)
pnpm add @capacitor/core @capacitor/cli @capacitor/android @codetrix-studio/capacitor-google-auth

# 2. Build your web app first
pnpm build

# 3. Add Android platform (skip npx cap init!)
npx cap add android

# 4. Sync web code to Android
npx cap sync android

# 5. Open in Android Studio
npx cap open android
