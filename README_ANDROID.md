# 📱 MLT Prep - Android App Setup

## 🎯 Quick Overview

Aapke project ko Android app mein convert karne ke liye **3 main files** banaye gaye hain:

| File | Purpose |
|------|---------|
| **ANDROID_SETUP_HINDI.md** | Hindi mein detailed guide |
| **ANDROID_SETUP_GUIDE.md** | English detailed guide |
| **setup-android.sh** | Automatic setup script |
| **verify-android-setup.sh** | Configuration checker |

---

## 🚀 Quick Start (3 Steps Only!)

### Step 1: Node Upgrade

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then:
nvm install 22
nvm use 22
nvm alias default 22
```

### Step 2: Run Setup Script

```bash
bash setup-android.sh
```

### Step 3: Manual Configuration

1. **Firebase Setup:**
   - Go to: https://console.firebase.google.com/
   - Add Android app: `com.mltprep.app`
   - Download `google-services.json`
   - Place in: `android/app/google-services.json`

2. **Update capacitor.config.ts:**
   - Get Android Client ID from Firebase
   - Replace line 42 with your Client ID

3. **Build & Test:**
   ```bash
   npm run mobile:open:android
   ```

---

## ✅ Verify Setup

Check if everything is configured correctly:

```bash
bash verify-android-setup.sh
```

This will check:
- ✅ Node version (v22+)
- ✅ Android folder exists
- ✅ google-services.json present
- ✅ capacitor.config.ts configured
- ✅ Dependencies installed
- ✅ Build files present
- ✅ Native auth code ready

---

## 📚 Detailed Guides

### For Hindi Speakers:
```bash
cat ANDROID_SETUP_HINDI.md
```
Complete step-by-step guide in Hindi with troubleshooting.

### For English Speakers:
```bash
cat ANDROID_SETUP_GUIDE.md
```
Comprehensive guide with all technical details.

---

## 🛠️ Useful Commands

```bash
# Build web app
npm run build

# Add Android platform (requires Node 22+)
npm run mobile:android

# Sync files to Android
npm run mobile:sync

# Open in Android Studio
npm run mobile:open:android

# Get SHA-1 fingerprint
cd android && ./gradlew signingReport

# Build debug APK
cd android && ./gradlew assembleDebug

# Build release APK/AAB
cd android && ./gradlew assembleRelease
cd android && ./gradlew bundleRelease
```

---

## 🐛 Common Issues & Fixes

### Issue 1: Node Version Too Old
**Error:** `The Capacitor CLI requires NodeJS >=22.0.0`

**Fix:**
```bash
nvm install 22
nvm use 22
```

---

### Issue 2: DEVELOPER_ERROR (Code 10)
**Error:** Google Sign-In fails with error code 10

**Fix:**
1. Get SHA-1: `cd android && ./gradlew signingReport`
2. Add to Google Cloud Console
3. Add to Firebase Console

---

### Issue 3: "Something went wrong"
**Error:** Generic Google error

**Fix:**
1. Check `android/app/google-services.json` exists
2. Verify package name: `com.mltprep.app`
3. Clean and rebuild: `cd android && ./gradlew clean build`

---

### Issue 4: No ID Token Received
**Error:** `No ID token received from Google`

**Fix:**
1. Open `capacitor.config.ts`
2. Update `serverClientId` with Android Client ID from Firebase
3. Run: `npm run mobile:sync`
4. Rebuild app

---

## 📱 What's Already Configured

Your project already has:

✅ **Capacitor 8.0** installed
✅ **Google Auth plugin** (@codetrix-studio/capacitor-google-auth)
✅ **Native auth code** in Auth.tsx (lines 109-193)
✅ **Backend token verification** in authActions.ts
✅ **Web and mobile support** in same codebase
✅ **Splash screen and status bar** configured

---

## 🎯 What You Need to Do

Only 3 things are required:

1. **Upgrade Node to v22** → `nvm install 22`
2. **Setup Firebase** → Download google-services.json
3. **Update capacitor.config.ts** → Add Android Client ID

**That's it!** Everything else is already done.

---

## 📊 Project Structure

```
.
├── android/                    # Android platform (generate with npm run mobile:android)
│   ├── app/
│   │   ├── google-services.json  # ← Download from Firebase
│   │   └── build.gradle
│   └── build.gradle
│
├── src/
│   ├── pages/
│   │   └── Auth.tsx            # Native Google Sign-In code (lines 109-193)
│   └── convex/
│       ├── auth.ts             # Convex Auth config
│       └── authActions.ts      # Backend token verification
│
├── capacitor.config.ts         # ← Update serverClientId here (line 42)
│
├── ANDROID_SETUP_HINDI.md      # Hindi guide
├── ANDROID_SETUP_GUIDE.md      # English guide
├── setup-android.sh            # Auto setup script
└── verify-android-setup.sh     # Verification script
```

---

## 🔐 Security Notes

**DO NOT commit these files to git:**
- `android/app/google-services.json`
- `android/keystore/*.keystore`
- Passwords in `gradle.properties`

**Add to .gitignore:**
```gitignore
android/app/google-services.json
android/*.keystore
android/key.properties
```

---

## 🚢 Production Release Checklist

Before releasing to Play Store:

- [ ] Change app version in `android/app/build.gradle`
- [ ] Update version name and code
- [ ] Generate signed release keystore
- [ ] Add release SHA-1 to Google Cloud Console
- [ ] Test on real device (not just emulator)
- [ ] Test Google Sign-In
- [ ] Test all features
- [ ] Create store listing
- [ ] Prepare screenshots (min 2)
- [ ] Write app description
- [ ] Build AAB: `cd android && ./gradlew bundleRelease`
- [ ] Upload to Play Console
- [ ] Submit for review

---

## 💡 Pro Tips

1. **Development:**
   - Use debug keystore for testing
   - Enable USB debugging
   - Use Chrome DevTools for debugging WebView

2. **Performance:**
   - Test on low-end devices
   - Check app size (should be < 50MB)
   - Enable ProGuard/R8 for release

3. **Testing:**
   - Test on Android 8+ devices
   - Test with different Google accounts
   - Test offline scenarios
   - Test on different screen sizes

---

## 📞 Support

**For detailed help:**
- Read: `ANDROID_SETUP_HINDI.md` (Hindi guide)
- Read: `ANDROID_SETUP_GUIDE.md` (English guide)
- Run: `bash verify-android-setup.sh` (Check config)

**Common commands:**
```bash
# Check what's wrong
bash verify-android-setup.sh

# View Android logs
adb logcat | grep -E "GoogleAuth|MLT"

# Restart ADB
adb kill-server && adb start-server

# Check connected devices
adb devices
```

---

## 🎉 Success Criteria

Your app is ready when:

✅ `verify-android-setup.sh` shows 0 errors
✅ App builds without errors in Android Studio
✅ App installs on device
✅ Google Sign-In button works
✅ Login successful
✅ User dashboard loads
✅ All features work as expected

---

## 🌟 Next Steps After Setup

1. **Test thoroughly** on real devices
2. **Add app icon** (1024x1024 PNG)
3. **Add splash screen** (already configured!)
4. **Test payment flow** if using in-app purchases
5. **Prepare Play Store listing**
6. **Create promotional graphics**
7. **Submit to Play Store**
8. **Monitor crash reports** in Firebase Crashlytics

---

## 📈 Analytics & Monitoring

Consider adding:
- Firebase Analytics (already in google-services.json)
- Firebase Crashlytics for crash reports
- Google Analytics for user behavior
- Performance monitoring

---

**Version:** 1.0.0
**Last Updated:** January 2026
**Capacitor Version:** 8.0.0
**Target Android:** API 34 (Android 14)

**Ready to build your Android app? Start with Step 1! 🚀**
