# 🚀 Android App Setup Guide - MLT Prep

## Step 1: Node Version Upgrade (REQUIRED)

Capacitor 8.0 requires Node 22+. Aapka current version hai `v20.19.5`.

### Option A: NVM se upgrade (Recommended)
```bash
# Install NVM if not installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then:
nvm install 22
nvm use 22
nvm alias default 22

# Verify
node --version  # Should show v22.x.x
```

### Option B: Direct Node Installation
Download Node 22 LTS from: https://nodejs.org/

---

## Step 2: Generate Android Platform

Upgrade ke baad, ye commands run karein:

```bash
# Build your web app
npm run build

# Add Android platform
npm run mobile:android

# Sync files to Android
npm run mobile:sync
```

---

## Step 3: Google Cloud Console Setup

### 3.1 Create OAuth 2.0 Credentials

1. **Go to:** https://console.cloud.google.com/apis/credentials
2. **Select your project** (या new project बनाएं)
3. **Click:** "Create Credentials" → "OAuth 2.0 Client ID"

### 3.2 Configure Web Client (Already Done ✅)
आपका Web Client ID already है:
```
513889515278-j5igvo075g0iigths2ifjs1agebfepti.apps.googleusercontent.com
```

### 3.3 Create Android Client

**Important Settings:**
- **Application type:** Android
- **Package name:** `com.mltprep.app` (capacitor.config.ts से)
- **SHA-1 certificate fingerprint:** (Step 4 से)

---

## Step 4: Get SHA-1 Fingerprint

### Debug Keystore SHA-1 (Development के लिए)

```bash
# Android folder में जाएं
cd android

# Debug SHA-1 निकालें
./gradlew signingReport

# या direct keytool से:
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**Output में से SHA-1 copy करें:**
```
SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

### Release Keystore SHA-1 (Production के लिए)

```bash
# Release keystore बनाएं (if not exists)
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Release SHA-1 निकालें
keytool -list -v -keystore my-release-key.keystore -alias my-key-alias
```

**⚠️ IMPORTANT:** Debug और Release दोनों SHA-1 Google Console में add करें!

---

## Step 5: Google Cloud Console में SHA-1 Add करें

1. **Go to:** https://console.cloud.google.com/apis/credentials
2. **Click on your Android OAuth Client** (या create करें)
3. **Add SHA-1:**
   - Package name: `com.mltprep.app`
   - SHA-1 certificate fingerprint: (Step 4 से copy किया हुआ)
4. **Click "Save"**

**Example:**
```
Package name: com.mltprep.app
SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

---

## Step 6: Firebase Setup (CRITICAL) 🔥

### 6.1 Create Firebase Project

1. **Go to:** https://console.firebase.google.com/
2. **Add project** → Enter "MLT Prep" → Continue
3. **Disable Google Analytics** (optional)
4. **Create Project**

### 6.2 Add Android App to Firebase

1. **Click "Add app"** → Select Android icon
2. **Enter Package Name:** `com.mltprep.app`
3. **Enter Debug SHA-1** (from Step 4)
4. **Click "Register app"**

### 6.3 Download google-services.json

1. **Download** `google-services.json` file
2. **Move to:** `android/app/google-services.json`

```bash
# Move downloaded file
mv ~/Downloads/google-services.json android/app/google-services.json
```

### 6.4 Link Firebase to Google Cloud

Firebase automatically creates OAuth credentials. **Copy the Android Client ID:**

1. Go to Firebase Console → Project Settings → General
2. Scroll down to "Your apps" → Android app
3. Find "Web API Key" and "OAuth 2.0 client IDs"
4. Copy the **Android Client ID** (ends with `.apps.googleusercontent.com`)

**Example:**
```
513889515278-abc123xyz456.apps.googleusercontent.com
```

---

## Step 7: Update capacitor.config.ts

Open `capacitor.config.ts` and update `serverClientId`:

```typescript
plugins: {
  GoogleAuth: {
    scopes: ['profile', 'email'],
    serverClientId: '513889515278-YOUR_ANDROID_CLIENT_ID_HERE.apps.googleusercontent.com', // ❌ REPLACE THIS
    forceCodeForRefreshToken: true,
  },
}
```

**Replace with:**
```typescript
serverClientId: '513889515278-abc123xyz456.apps.googleusercontent.com', // ✅ Your actual Android Client ID
```

---

## Step 8: Verify Android Configuration

```bash
# Sync changes
npm run mobile:sync

# Open Android Studio
npm run mobile:open:android
```

### In Android Studio:

1. **Wait for Gradle sync to complete**
2. **Check if google-services.json exists** in `app/` folder
3. **Build → Clean Project**
4. **Build → Rebuild Project**
5. **Run on device/emulator**

---

## Step 9: Test Google Sign-In

### Test in Development:

1. **Connect Android device** (या emulator चलाएं)
2. **Enable USB Debugging** (Settings → Developer Options)
3. **Run from Android Studio** (or `npx cap run android`)
4. **Click "Continue with Google"**
5. **Select account and allow permissions**

### Expected Behavior:
✅ Google Sign-In popup खुले
✅ Account select हो जाए
✅ App में login हो जाए
✅ User dashboard दिखे

### Common Errors & Fixes:

#### Error: "DEVELOPER_ERROR" (Error Code 10)
**Cause:** SHA-1 mismatch
**Fix:**
- Verify SHA-1 in Google Cloud Console matches your keystore
- Re-run `./gradlew signingReport`
- Add BOTH debug and release SHA-1

#### Error: "Something went wrong"
**Cause:** Missing or incorrect google-services.json
**Fix:**
- Re-download google-services.json from Firebase
- Ensure package name matches: `com.mltprep.app`
- Clean and rebuild project

#### Error: "No ID token received"
**Cause:** serverClientId not set in capacitor.config.ts
**Fix:**
- Copy Android Client ID from Firebase/Google Console
- Update capacitor.config.ts
- Re-sync: `npm run mobile:sync`

---

## Step 10: Build APK for Testing

### Debug APK (Development):
```bash
cd android
./gradlew assembleDebug

# APK location:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (Production):
```bash
cd android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

Install on device:
```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

---

## Step 11: Backend Verification

Your backend (`src/convex/auth.ts`) already supports mobile:

```typescript
// ✅ Lines 42-60 in Auth.tsx handle native login
if (Capacitor.isNativePlatform()) {
  const googleUser = await GoogleAuth.signIn();
  const idToken = googleUser.authentication?.idToken;
  // Verify with backend...
}
```

Backend action `verifyAndSignInGoogle` (line 131) handles token verification.

**No backend changes needed!** ✅

---

## Step 12: Production Release (Play Store)

### Generate Signed APK:

1. **Create upload keystore:**
```bash
keytool -genkey -v -keystore upload-keystore.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

2. **Update android/gradle.properties:**
```properties
MYAPP_UPLOAD_STORE_FILE=upload-keystore.keystore
MYAPP_UPLOAD_KEY_ALIAS=upload
MYAPP_UPLOAD_STORE_PASSWORD=yourpassword
MYAPP_UPLOAD_KEY_PASSWORD=yourpassword
```

3. **Update android/app/build.gradle:**
```gradle
signingConfigs {
    release {
        storeFile file(MYAPP_UPLOAD_STORE_FILE)
        storePassword MYAPP_UPLOAD_STORE_PASSWORD
        keyAlias MYAPP_UPLOAD_KEY_ALIAS
        keyPassword MYAPP_UPLOAD_KEY_PASSWORD
    }
}
```

4. **Build Release APK/AAB:**
```bash
cd android
./gradlew bundleRelease  # For AAB (Play Store)
# or
./gradlew assembleRelease  # For APK
```

5. **Upload to Play Console:**
- Go to https://play.google.com/console
- Create new app
- Upload AAB file
- Fill store listing, content rating, pricing

---

## Troubleshooting Checklist ✅

- [ ] Node version >= 22
- [ ] Android folder generated (`npm run mobile:android`)
- [ ] google-services.json in `android/app/`
- [ ] Package name: `com.mltprep.app` (everywhere)
- [ ] SHA-1 added in Google Cloud Console
- [ ] SHA-1 added in Firebase Console
- [ ] serverClientId updated in capacitor.config.ts
- [ ] Gradle sync successful in Android Studio
- [ ] App installs and opens
- [ ] Google Sign-In button works
- [ ] Token verification happens in backend
- [ ] User logged in successfully

---

## Important Files to Check

1. **capacitor.config.ts** - serverClientId must match Android OAuth Client
2. **android/app/google-services.json** - Must exist, from Firebase
3. **android/app/build.gradle** - Google Services plugin applied
4. **src/pages/Auth.tsx** - Lines 42-60 handle native login
5. **src/convex/authActions.ts** - Backend token verification

---

## Quick Commands Reference

```bash
# Node upgrade
nvm install 22 && nvm use 22

# Generate Android
npm run build
npm run mobile:android
npm run mobile:sync

# Get SHA-1
cd android && ./gradlew signingReport

# Open Android Studio
npm run mobile:open:android

# Build APK
cd android && ./gradlew assembleDebug

# Install APK
adb install app/build/outputs/apk/debug/app-debug.apk
```

---

## Next Steps

1. **Upgrade Node to v22** (Step 1)
2. **Generate Android folder** (Step 2)
3. **Get SHA-1** (Step 4)
4. **Setup Firebase and download google-services.json** (Step 6)
5. **Update capacitor.config.ts** (Step 7)
6. **Build and test!** (Step 8-9)

---

## Need Help?

**Error codes:**
- `10` - SHA-1 mismatch
- `12501` - User cancelled
- No ID token - serverClientId missing

**Logs:**
```bash
# View Android logs
adb logcat | grep -E "GoogleAuth|MLT"
```

**Contact:** Check project git history for previous Android setup attempts.

---

**Last Updated:** January 2026
**Capacitor Version:** 8.0.0
**Target SDK:** Android 14 (API 34)
