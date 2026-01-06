#!/bin/bash

echo "🚀 MLT Prep Android Setup Script"
echo "=================================="
echo ""

# Check Node version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
    echo "❌ ERROR: Node version must be 22 or higher"
    echo "Current version: $(node --version)"
    echo ""
    echo "Please upgrade Node using NVM:"
    echo "  nvm install 22"
    echo "  nvm use 22"
    echo "  nvm alias default 22"
    exit 1
fi

echo "✅ Node version check passed: $(node --version)"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
pnpm install || npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Step 2: Build web app
echo "🔨 Step 2: Building web application..."
pnpm run build || npm run build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build web app"
    exit 1
fi
echo "✅ Web app built successfully"
echo ""

# Step 3: Initialize Capacitor (if not already done)
if [ ! -f "capacitor.config.ts" ]; then
    echo "⚙️ Step 3: Initializing Capacitor..."
    npx cap init "MLT Prep" "com.mltprep.app" --web-dir=dist
else
    echo "✅ Capacitor already initialized"
fi
echo ""

# Step 4: Add Android platform
if [ ! -d "android" ]; then
    echo "📱 Step 4: Adding Android platform..."
    npx cap add android
    if [ $? -ne 0 ]; then
        echo "❌ Failed to add Android platform"
        exit 1
    fi
    echo "✅ Android platform added"
else
    echo "✅ Android platform already exists"
fi
echo ""

# Step 5: Sync files
echo "🔄 Step 5: Syncing files to Android..."
npx cap sync android
if [ $? -ne 0 ]; then
    echo "❌ Failed to sync Android"
    exit 1
fi
echo "✅ Files synced successfully"
echo ""

# Step 6: Get SHA-1 fingerprints
echo "🔑 Step 6: Getting SHA-1 fingerprints..."
echo ""
echo "DEBUG SHA-1 (for development):"
cd android
./gradlew signingReport 2>/dev/null | grep "SHA1:" | head -1
cd ..
echo ""

echo "=================================="
echo "✅ SETUP COMPLETE!"
echo "=================================="
echo ""
echo "📋 NEXT STEPS (MANUAL):"
echo ""
echo "1. Copy the SHA-1 fingerprint shown above"
echo ""
echo "2. Go to Firebase Console: https://console.firebase.google.com/"
echo "   - Create/Select project 'MLT Prep'"
echo "   - Add Android app with package: com.mltprep.app"
echo "   - Add the SHA-1 fingerprint"
echo "   - Download google-services.json"
echo ""
echo "3. Place google-services.json:"
echo "   mv ~/Downloads/google-services.json android/app/google-services.json"
echo ""
echo "4. Update capacitor.config.ts:"
echo "   - Replace 'YOUR_ANDROID_CLIENT_ID_HERE' with your actual Android Client ID"
echo "   - Get it from Firebase Console → Project Settings → General"
echo ""
echo "5. Sync again:"
echo "   npm run mobile:sync"
echo ""
echo "6. Open in Android Studio:"
echo "   npm run mobile:open:android"
echo ""
echo "7. In Android Studio:"
echo "   - Wait for Gradle sync"
echo "   - Build → Clean Project"
echo "   - Build → Rebuild Project"
echo "   - Connect device and click Run ▶️"
echo ""
echo "📖 For detailed instructions, see ANDROID_SETUP_HINDI.md"
echo ""
