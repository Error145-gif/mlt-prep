#!/bin/bash

echo "🚀 Starting MLT Prep Android Setup..."

# 1. Install Dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Build Web App
echo "🔨 Building web app..."
npm run build

# 3. Initialize Capacitor (if needed)
if [ ! -f "capacitor.config.ts" ]; then
    echo "⚙️ Initializing Capacitor..."
    npx cap init "MLT Prep" "com.mltprep.app" --web-dir dist
fi

# 4. Add Android Platform
if [ ! -d "android" ]; then
    echo "🤖 Adding Android platform..."
    npx cap add android
else
    echo "✅ Android platform already exists."
fi

# 5. Sync Files
echo "🔄 Syncing with Android..."
npx cap sync android

echo "---------------------------------------------------"
echo "🎉 SETUP COMPLETE!"
echo "---------------------------------------------------"
echo "NEXT STEPS (IMPORTANT):"
echo "1. Download 'google-services.json' from Firebase Console."
echo "2. Move it to: android/app/google-services.json"
echo "3. Run: npx cap open android"
echo "4. In Android Studio, click the 'Play' button to run."
echo "---------------------------------------------------"
