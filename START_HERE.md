# 🎯 शुरुआत यहाँ से करें (START HERE)

## ✅ आपके लिए क्या तैयार किया गया है?

आपके **MLT Prep** project को **Android App** में convert करने के लिए **complete setup** तैयार है!

---

## 📦 तैयार Files

| File | क्या है? |
|------|---------|
| **README_ANDROID.md** | Quick overview (पढ़ें पहले!) |
| **ANDROID_SETUP_HINDI.md** | पूरी Hindi guide (step-by-step) |
| **ANDROID_SETUP_GUIDE.md** | पूरी English guide (detailed) |
| **setup-android.sh** | Automatic setup script |
| **verify-android-setup.sh** | Configuration checker |
| **capacitor.config.ts** | Updated with instructions |

---

## 🚀 अभी क्या करें? (3 Simple Steps)

### Step 1: Node Upgrade (5 minutes)

```bash
# NVM install करें
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Terminal restart करें (या नई terminal खोलें)

# Node 22 install करें
nvm install 22
nvm use 22
nvm alias default 22

# Verify करें
node --version  # v22.x.x दिखना चाहिए
```

---

### Step 2: Setup Script Run करें (10 minutes)

```bash
bash setup-android.sh
```

Ye script automatically:
- ✅ Dependencies install करेगी
- ✅ Web app build करेगी
- ✅ Android folder generate करेगी
- ✅ SHA-1 fingerprint निकालेगी

---

### Step 3: Firebase Configuration (5 minutes)

**A. Firebase Project बनाएं:**
1. Go to: https://console.firebase.google.com/
2. "Add project" → Name: "MLT Prep"
3. Continue → Disable Analytics → Create

**B. Android App Add करें:**
1. Click "Add app" → Android icon
2. Package name: `com.mltprep.app`
3. SHA-1 add करें (setup script से mila)
4. "Register app"

**C. google-services.json Download करें:**
1. Download button click करें
2. Terminal में run करें:
```bash
mv ~/Downloads/google-services.json android/app/google-services.json
```

**D. Android Client ID Copy करें:**
1. Firebase Console → Project Settings → General
2. "Your apps" → Android app
3. "Client ID" copy करें
4. `capacitor.config.ts` file open करें
5. Line 42 में paste करें
6. Save करें

**E. Sync करें:**
```bash
npm run mobile:sync
```

---

## ✅ Verification

Check करें कि सब सही है:

```bash
bash verify-android-setup.sh
```

**सब ✅ होना चाहिए!**

---

## 📱 Build & Test

### Android Studio में Open करें:

```bash
npm run mobile:open:android
```

### Build Process:
1. Gradle sync complete होने दें (3-5 min)
2. Green play button ▶️ click करें
3. Device/Emulator select करें
4. App install होगा

### Test करें:
1. App open करें
2. "Continue with Google" click करें
3. Account select करें
4. Login हो जाना चाहिए! 🎉

---

## 🆘 Problem हो तो?

### Error 1: Node version old
**Fix:** Step 1 follow करें (NVM से upgrade)

### Error 2: Android folder nahi bana
**Fix:**
```bash
node --version  # Check v22+ hai
npm run mobile:android
```

### Error 3: Google Sign-In fail (Code 10)
**Fix:** SHA-1 Google Console में add करें
```bash
cd android && ./gradlew signingReport
# SHA1 copy करके Google Cloud Console में add करें
```

### Error 4: "No ID token"
**Fix:** `capacitor.config.ts` में serverClientId update करें

---

## 📚 Detailed Guides

**Hindi में पढ़ें:**
```bash
cat ANDROID_SETUP_HINDI.md
```

**English में पढ़ें:**
```bash
cat ANDROID_SETUP_GUIDE.md
```

---

## 🎯 Current Status

Aapke project में:

✅ **Capacitor configured** - capacitor.config.ts ready
✅ **Google Auth plugin** - installed and configured
✅ **Native auth code** - Auth.tsx में ready (lines 109-193)
✅ **Backend ready** - Token verification already works
✅ **Build ready** - Web app successfully built

**Sirf 3 cheezein pending:**
1. Node v22 upgrade
2. Firebase setup + google-services.json
3. capacitor.config.ts में Android Client ID

---

## 💡 Quick Commands

```bash
# Setup script (automatic)
bash setup-android.sh

# Verify setup
bash verify-android-setup.sh

# Build web app
npm run build

# Sync to Android
npm run mobile:sync

# Open Android Studio
npm run mobile:open:android

# Get SHA-1
cd android && ./gradlew signingReport

# Build APK
cd android && ./gradlew assembleDebug
```

---

## 🎊 Success Checklist

App ready hai jab:

- [ ] `verify-android-setup.sh` shows 0 errors
- [ ] App Android Studio mein build hota hai
- [ ] Device pe install hota hai
- [ ] Google Sign-In button works
- [ ] Login successful
- [ ] Dashboard load hota hai
- [ ] Sare features kaam karte hain

---

## 🚀 Next Steps After Success

1. Real device pe test karein
2. App icon add karein
3. Play Store listing prepare karein
4. Beta testing karein
5. Production release karein!

---

## 📞 Need More Help?

**Detailed guides:**
- Hindi: `ANDROID_SETUP_HINDI.md`
- English: `ANDROID_SETUP_GUIDE.md`

**Quick reference:**
- Overview: `README_ANDROID.md`

**Troubleshooting:**
- Run: `bash verify-android-setup.sh`
- Check logs: `adb logcat | grep MLT`

---

## 🎯 तो शुरू करें!

```bash
# Step 1: Node upgrade
nvm install 22 && nvm use 22

# Step 2: Setup
bash setup-android.sh

# Step 3: Firebase (manual)
# - Download google-services.json
# - Update capacitor.config.ts

# Step 4: Build!
npm run mobile:open:android
```

---

**याद रखें:** सिर्फ 3 steps! Node upgrade, Firebase setup, और Build!

**Best of luck! 🚀**

---

**Version:** 1.0
**Created:** January 2026
**Target:** Android 8+ (API 26+)
