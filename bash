# Initialize Capacitor (only once)
npx cap init

# Add Android platform
npx cap add android

# Sync web code to Android
npx cap sync

# Install Capacitor packages
pnpm add @capacitor/core @capacitor/cli @capacitor/android @capacitor/splash-screen @capacitor/status-bar

# Install Google Auth plugin for native login
pnpm add @codetrix-studio/capacitor-google-auth

# Build the web app
pnpm build

cd android
./gradlew signingReport