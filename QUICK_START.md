# 🚀 MLT Prep Android App - Quick Start

## ✅ Setup Complete! Ab sirf yeh 3 kaam karein:

---

## 1️⃣ Firebase Setup (5 minutes)

### A. Firebase Project
1. Go to: https://console.firebase.google.com/
2. Click **"Add project"**
3. Name: **"MLT Prep"**
4. Disable Analytics → **Create**

### B. Add Android App
1. Click Android icon
2. Package name: `com.mltprep.app`
3. Get SHA-1:
   ```bash
   cd android && ./gradlew signingReport
   ```
   Copy the SHA1 line under "Variant: debug"
4. Paste SHA-1 in Firebase
5. Click **"Register app"**

### C. Download Config
1. Download **google-services.json**
2. Move to:
   ```bash
   mv ~/Downloads/google-services.json android/app/google-services.json
   ```

### D. Update Client ID
1. Firebase → **Project Settings** → **General**
2. Under "Your apps" → Android → Copy **Web Client ID**
3. Open `capacitor.config.ts`
4. Update line 15:
   ```typescript
   serverClientId: 'PASTE_YOUR_WEB_CLIENT_ID_HERE',
   ```
5. Save file

---

## 2️⃣ Sync Changes

```bash
npm run mobile:sync
```

---

## 3️⃣ Open & Build

```bash
npm run mobile:open:android
```

In Android Studio:
1. Wait for Gradle sync (3-5 min)
2. Click green **Play** button ▶️
3. Select device/emulator
4. App will install!

---

## 🎉 Test

1. App opens
2. Click **"Continue with Google"**
3. Select account
4. ✅ Logged in!

---

## 🐛 Common Issues

### Google Sign-In fails?
- Check SHA-1 is correct in Firebase
- Re-download google-services.json
- Verify serverClientId in capacitor.config.ts

### Build fails?
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

---

## 📱 Generate APK

Debug (testing):
```bash
cd android
./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📖 Need Details?

Read: `NEXT_STEPS_HINDI.md` (complete guide)

---

**That's it! App ready in 15 minutes! 🚀**
