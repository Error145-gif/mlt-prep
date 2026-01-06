#!/bin/bash

# ============================================================
# Android Setup Verification Script
# ============================================================
# Checks if all Android configuration is correct
# Run: bash verify-android-setup.sh
# ============================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Android Setup Verification${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

ERRORS=0
WARNINGS=0

# Check 1: Node Version
echo -e "${YELLOW}[1/10]${NC} Checking Node version..."
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 22 ]; then
  echo -e "${GREEN}✅ Node v${NODE_VERSION} (Good!)${NC}"
else
  echo -e "${RED}❌ Node v${NODE_VERSION} is too old (Need v22+)${NC}"
  ERRORS=$((ERRORS+1))
fi

# Check 2: Android Folder
echo ""
echo -e "${YELLOW}[2/10]${NC} Checking android folder..."
if [ -d "android" ]; then
  echo -e "${GREEN}✅ android/ folder exists${NC}"
else
  echo -e "${RED}❌ android/ folder NOT FOUND${NC}"
  echo -e "   Run: npm run mobile:android"
  ERRORS=$((ERRORS+1))
fi

# Check 3: google-services.json
echo ""
echo -e "${YELLOW}[3/10]${NC} Checking google-services.json..."
if [ -f "android/app/google-services.json" ]; then
  # Check if it's the placeholder
  if grep -q "YOUR_PROJECT_NUMBER" "android/app/google-services.json"; then
    echo -e "${YELLOW}⚠️  google-services.json is PLACEHOLDER${NC}"
    echo -e "   Download real file from Firebase!"
    WARNINGS=$((WARNINGS+1))
  else
    echo -e "${GREEN}✅ google-services.json looks good${NC}"
  fi
else
  echo -e "${RED}❌ google-services.json NOT FOUND${NC}"
  echo -e "   Download from Firebase and place in android/app/"
  ERRORS=$((ERRORS+1))
fi

# Check 4: capacitor.config.ts serverClientId
echo ""
echo -e "${YELLOW}[4/10]${NC} Checking capacitor.config.ts..."
if [ -f "capacitor.config.ts" ]; then
  if grep -q "YOUR_ANDROID_CLIENT_ID_HERE" "capacitor.config.ts"; then
    echo -e "${RED}❌ serverClientId NOT CONFIGURED${NC}"
    echo -e "   Update capacitor.config.ts with your Android Client ID"
    ERRORS=$((ERRORS+1))
  else
    echo -e "${GREEN}✅ serverClientId configured${NC}"
  fi
else
  echo -e "${RED}❌ capacitor.config.ts NOT FOUND${NC}"
  ERRORS=$((ERRORS+1))
fi

# Check 5: Package Name
echo ""
echo -e "${YELLOW}[5/10]${NC} Checking package name..."
if grep -q "com.mltprep.app" "capacitor.config.ts"; then
  echo -e "${GREEN}✅ Package name: com.mltprep.app${NC}"
else
  echo -e "${RED}❌ Package name incorrect${NC}"
  ERRORS=$((ERRORS+1))
fi

# Check 6: Build output (dist folder)
echo ""
echo -e "${YELLOW}[6/10]${NC} Checking build output..."
if [ -d "dist" ]; then
  echo -e "${GREEN}✅ dist/ folder exists${NC}"
else
  echo -e "${YELLOW}⚠️  dist/ folder not found${NC}"
  echo -e "   Run: npm run build"
  WARNINGS=$((WARNINGS+1))
fi

# Check 7: Dependencies
echo ""
echo -e "${YELLOW}[7/10]${NC} Checking Capacitor dependencies..."
if [ -d "node_modules/@capacitor/android" ]; then
  echo -e "${GREEN}✅ @capacitor/android installed${NC}"
else
  echo -e "${RED}❌ @capacitor/android NOT FOUND${NC}"
  echo -e "   Run: npm install"
  ERRORS=$((ERRORS+1))
fi

if [ -d "node_modules/@codetrix-studio/capacitor-google-auth" ]; then
  echo -e "${GREEN}✅ capacitor-google-auth installed${NC}"
else
  echo -e "${RED}❌ capacitor-google-auth NOT FOUND${NC}"
  ERRORS=$((ERRORS+1))
fi

# Check 8: Android build.gradle
echo ""
echo -e "${YELLOW}[8/10]${NC} Checking Android build files..."
if [ -f "android/app/build.gradle" ]; then
  echo -e "${GREEN}✅ android/app/build.gradle exists${NC}"
else
  echo -e "${RED}❌ android/app/build.gradle NOT FOUND${NC}"
  ERRORS=$((ERRORS+1))
fi

# Check 9: Auth.tsx native support
echo ""
echo -e "${YELLOW}[9/10]${NC} Checking Auth.tsx native support..."
if grep -q "Capacitor.isNativePlatform()" "src/pages/Auth.tsx"; then
  echo -e "${GREEN}✅ Native Google Auth code present${NC}"
else
  echo -e "${YELLOW}⚠️  Native auth code might be missing${NC}"
  WARNINGS=$((WARNINGS+1))
fi

# Check 10: Backend auth action
echo ""
echo -e "${YELLOW}[10/10]${NC} Checking backend auth action..."
if [ -f "src/convex/authActions.ts" ]; then
  if grep -q "verifyAndSignInGoogle" "src/convex/authActions.ts"; then
    echo -e "${GREEN}✅ Backend auth action exists${NC}"
  else
    echo -e "${YELLOW}⚠️  verifyAndSignInGoogle action not found${NC}"
    WARNINGS=$((WARNINGS+1))
  fi
else
  echo -e "${RED}❌ authActions.ts NOT FOUND${NC}"
  ERRORS=$((ERRORS+1))
fi

# Summary
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Verification Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}🎉 Perfect! All checks passed!${NC}"
  echo ""
  echo -e "${BLUE}Next steps:${NC}"
  echo "1. Open Android Studio: npm run mobile:open:android"
  echo "2. Wait for Gradle sync"
  echo "3. Run on device/emulator"
  echo "4. Test Google Sign-In!"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
  echo -e "${GREEN}✅ No critical errors${NC}"
  echo ""
  echo -e "${BLUE}You can proceed, but fix warnings for best results.${NC}"
  exit 0
else
  echo -e "${RED}❌ $ERRORS error(s) found${NC}"
  if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
  fi
  echo ""
  echo -e "${BLUE}Fix the errors above before proceeding.${NC}"
  echo ""
  echo -e "${YELLOW}Quick fixes:${NC}"
  echo "- Node upgrade: nvm install 22 && nvm use 22"
  echo "- Generate Android: npm run mobile:android"
  echo "- Get google-services.json from Firebase"
  echo "- Update serverClientId in capacitor.config.ts"
  echo ""
  echo -e "${BLUE}For detailed guide, read: ANDROID_SETUP_HINDI.md${NC}"
  exit 1
fi
