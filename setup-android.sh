#!/bin/bash

# ============================================================
# MLT Prep - Android App Setup Script
# ============================================================
# This script automates the Android app setup process
# Run: bash setup-android.sh
# ============================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}MLT Prep - Android Setup Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# ============================================================
# STEP 1: Check Node Version
# ============================================================
echo -e "${YELLOW}[1/8]${NC} Checking Node version..."

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt 22 ]; then
  echo -e "${RED}❌ Node version $NODE_VERSION is too old!${NC}"
  echo -e "${YELLOW}Capacitor 8.0 requires Node 22 or higher.${NC}"
  echo ""
  echo -e "${BLUE}Please upgrade Node using one of these methods:${NC}"
  echo ""
  echo -e "${GREEN}Option 1: Using NVM (Recommended)${NC}"
  echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
  echo "  source ~/.bashrc  # or restart terminal"
  echo "  nvm install 22"
  echo "  nvm use 22"
  echo "  nvm alias default 22"
  echo ""
  echo -e "${GREEN}Option 2: Direct Download${NC}"
  echo "  Visit: https://nodejs.org/"
  echo ""
  echo "After upgrading, run this script again!"
  exit 1
else
  echo -e "${GREEN}✅ Node version is v${NODE_VERSION} (good!)${NC}"
fi

# ============================================================
# STEP 2: Install Dependencies
# ============================================================
echo ""
echo -e "${YELLOW}[2/8]${NC} Installing dependencies..."

if [ ! -d "node_modules" ]; then
  npm install
else
  echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

# ============================================================
# STEP 3: Build Web App
# ============================================================
echo ""
echo -e "${YELLOW}[3/8]${NC} Building web app..."

npm run build

if [ -d "dist" ]; then
  echo -e "${GREEN}✅ Build successful${NC}"
else
  echo -e "${RED}❌ Build failed!${NC}"
  exit 1
fi

# ============================================================
# STEP 4: Generate Android Platform
# ============================================================
echo ""
echo -e "${YELLOW}[4/8]${NC} Generating Android platform..."

if [ -d "android" ]; then
  echo -e "${YELLOW}⚠️  Android folder already exists. Skipping...${NC}"
else
  npm run mobile:android
  echo -e "${GREEN}✅ Android platform generated${NC}"
fi

# ============================================================
# STEP 5: Sync Files to Android
# ============================================================
echo ""
echo -e "${YELLOW}[5/8]${NC} Syncing files to Android..."

npm run mobile:sync
echo -e "${GREEN}✅ Files synced${NC}"

# ============================================================
# STEP 6: Check google-services.json
# ============================================================
echo ""
echo -e "${YELLOW}[6/8]${NC} Checking google-services.json..."

if [ -f "android/app/google-services.json" ]; then
  echo -e "${GREEN}✅ google-services.json found${NC}"
else
  echo -e "${RED}❌ google-services.json NOT FOUND!${NC}"
  echo ""
  echo -e "${BLUE}To fix this:${NC}"
  echo "1. Go to: https://console.firebase.google.com/"
  echo "2. Select your project (or create new)"
  echo "3. Add Android app with package name: com.mltprep.app"
  echo "4. Download google-services.json"
  echo "5. Move to: android/app/google-services.json"
  echo ""
  echo -e "${YELLOW}Creating placeholder file for now...${NC}"

  mkdir -p android/app
  cat > android/app/google-services.json << 'EOF'
{
  "project_info": {
    "project_number": "YOUR_PROJECT_NUMBER",
    "project_id": "YOUR_PROJECT_ID",
    "storage_bucket": "YOUR_PROJECT_ID.appspot.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "YOUR_APP_ID",
        "android_client_info": {
          "package_name": "com.mltprep.app"
        }
      }
    }
  ],
  "configuration_version": "1"
}
EOF

  echo -e "${YELLOW}⚠️  PLACEHOLDER FILE CREATED${NC}"
  echo -e "${RED}You MUST replace this with real google-services.json from Firebase!${NC}"
fi

# ============================================================
# STEP 7: Get SHA-1 Fingerprint
# ============================================================
echo ""
echo -e "${YELLOW}[7/8]${NC} Getting SHA-1 fingerprint..."

if [ -d "android" ]; then
  echo ""
  echo -e "${BLUE}Running: cd android && ./gradlew signingReport${NC}"
  echo -e "${YELLOW}This may take a few minutes on first run...${NC}"
  echo ""

  cd android
  ./gradlew signingReport 2>/dev/null | grep "SHA1:" || echo -e "${RED}Could not get SHA-1. Run manually: cd android && ./gradlew signingReport${NC}"
  cd ..

  echo ""
  echo -e "${GREEN}✅ Copy the SHA1 value above and add it to Google Cloud Console${NC}"
else
  echo -e "${RED}❌ Android folder not found${NC}"
fi

# ============================================================
# STEP 8: Next Steps Summary
# ============================================================
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Android Setup Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}NEXT STEPS (MANUAL):${NC}"
echo ""
echo -e "${BLUE}1. Firebase Setup:${NC}"
echo "   - Go to: https://console.firebase.google.com/"
echo "   - Add Android app with package: com.mltprep.app"
echo "   - Download REAL google-services.json"
echo "   - Replace: android/app/google-services.json"
echo ""
echo -e "${BLUE}2. Add SHA-1 to Google Cloud Console:${NC}"
echo "   - Copy SHA1 from above output"
echo "   - Go to: https://console.cloud.google.com/apis/credentials"
echo "   - Add SHA-1 to your Android OAuth Client"
echo ""
echo -e "${BLUE}3. Update capacitor.config.ts:${NC}"
echo "   - Get Android Client ID from Firebase"
echo "   - Replace serverClientId in capacitor.config.ts"
echo ""
echo -e "${BLUE}4. Open Android Studio:${NC}"
echo "   - Run: npm run mobile:open:android"
echo "   - Wait for Gradle sync"
echo "   - Build and run on device/emulator"
echo ""
echo -e "${BLUE}5. Test Google Sign-In:${NC}"
echo "   - Open app on device"
echo "   - Click 'Continue with Google'"
echo "   - Should work without errors!"
echo ""
echo -e "${YELLOW}For detailed guide, read: ANDROID_SETUP_GUIDE.md${NC}"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
