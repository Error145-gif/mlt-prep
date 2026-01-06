# 🚀 Android App Banane Ka Complete Guide (Zero Se Start)

## ⚡ Quick Start - Sirf 3 Steps!

### 📋 Pre-Requirements Check Karein

Aapka current Node version: **v20.19.5**  
Required: **v22+**

**NVM se upgrade karein:**  

---

### Step 2: Automatic Setup Run Karein

```bash
bash setup-android.sh
```

Ye script automatically ye sab kar degi:
- ✅ Dependencies install
- ✅ Web app build
- ✅ Android folder generate
- ✅ Files sync
- ✅ SHA-1 fingerprint nikale

---

### Step 3: Manual Configuration (Important!)

#### 3.1 Firebase Setup

**Go to:** https://console.firebase.google.com/

1. **New Project banayein:**  
   - Project name: "MLT Prep"  
   - Click "Continue"  
   - Google Analytics disable karein (optional)

2. **Android App add karein:**  
   - Click "Add app" → Android icon  
   - Package name enter karein: **com.mltprep.app**  
   - App nickname: MLT Prep  
   - **SHA-1 add karein** (setup script se mila tha)  
   - Click "Register app"

3. **google-services.json download karein:**  
   - Download button click karein  
   - File ko yahaan move karein:
   ```bash
   mv ~/Downloads/google-services.json android/app/google-services.json
   ```

#### 3.2 Google Cloud Console Setup

**Go to:** https://console.cloud.google.com/apis/credentials

1. **OAuth consent screen configure karein:**  
   - User Type: External  
   - App name: MLT Prep  
   - Support email: Your email  
   - Save

2. **Android Client ID copy karein:**  
   - Firebase Console → Project Settings → General  
   - "Your apps" section mein Android app select karein  
   - "Client ID" copy karein (format: `513889515278-xxxxx.apps.googleusercontent.com`)  

#### 3.3 capacitor.config.ts Update Karein

File open karein: `capacitor.config.ts`

**Line 42 update karein:**  
```typescript
// BEFORE (❌ Wrong):
serverClientId: '513889515278-YOUR_ANDROID_CLIENT_ID_HERE.apps.googleusercontent.com',
```  
**Line ko replace karein:**
```typescript
// AFTER (✅ Correct):
serverClientId: '513889515278-abc123xyz456.apps.googleusercontent.com',
// ↑ Apna actual Android Client ID paste karein
```  
**Save karein aur sync karein:**  
```bash
npm run mobile:sync
```

---

## 🏗️ Build aur Test Karein

### Android Studio mein Open karein

```bash
npm run mobile:open:android
```

### Build Process:

1. **Gradle Sync hone do** (3-5 minutes pehli baar)  
2. **Clean Project:** Menu → Build → Clean Project  
3. **Rebuild:** Menu → Build → Rebuild Project  
4. **Device Connect karein:**  
   - USB cable se phone connect karein  
   - Settings → Developer Options → USB Debugging ON  
5. **Run karein:** Green play button click karein ▶️

---

## 🎯 Google Sign-In Test Karein

### App open karke:

1. ✅ "Continue with Google" button click karein  
2. ✅ Google account select karein  
3. ✅ Permissions allow karein  
4. ✅ App mein login ho jaye!

### Agar error aaye:

#### **Error: "DEVELOPER_ERROR" (Code 10)**

**Matlab:** SHA-1 galat hai

**Fix:**  
```bash
# SHA-1 dobara nikaalein
cd android
./gradlew signingReport

# Output mein se SHA1 copy karein
# Google Cloud Console mein add karein
```  

#### **Error: "Something went wrong"**  
**Matlab:** google-services.json missing ya galat hai

**Fix:**  
```bash
# File check karein
ls -la android/app/google-services.json

# Agar nahi hai to Firebase se download karein
# Package name verify karein: com.mltprep.app
```  

#### **Error: "No ID token received"**  
**Matlab:** serverClientId galat hai capacitor.config.ts mein

**Fix:**  
1. Firebase se Android Client ID copy karein  
2. capacitor.config.ts mein paste karein (line 42)  
3. Sync karein: `npm run mobile:sync`  
4. App rebuild karein  

---

## 📱 APK Banayein (Testing ke liye)

### Debug APK (Development):

```bash
cd android
./gradlew assembleDebug
```

**APK location:**  
`android/app/build/outputs/apk/debug/app-debug.apk`

### Phone pe install karein:

```bash
# USB se connect karein
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🚀 Play Store Release (Production)

### Release Keystore banayein:

```bash
keytool -genkey -v -keystore upload-keystore.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

**Details enter karein:**  
- Name: Your Name  
- Organization: MLT Prep  
- City: Your City  
- State: Your State  
- Country Code: IN (for India)  
- Password: **Strong password (yaad rakhein!)**  

### Release APK/AAB build karein:

```bash
cd android

# AAB (Play Store ke liye)
./gradlew bundleRelease

# Ya APK (direct install ke liye)
./gradlew assembleRelease
```

**Output:**  
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`  
- APK: `android/app/build/outputs/apk/release/app-release.apk`  

### Play Console pe upload karein:

1. **Go to:** https://play.google.com/console  
2. **Create app** click karein  
3. **App details fill karein:**  
   - App name: MLT Prep  
   - Default language: Hindi/English  
   - App/Game: App  
   - Free/Paid: Free  
4. **Store listing complete karein:**  
   - Short description (80 chars)  
   - Full description (4000 chars)  
   - Screenshots (min 2)  
   - Feature graphic (1024x500)  
5. **Upload AAB:**  
   - Production → Create new release  
   - Upload AAB file  
   - Release notes add karein  
   - Review and rollout  

---

## ✅ Final Checklist

Test karne se pehle confirm karein:

- [ ] Node version v22+ hai  
- [ ] `android/` folder exist karta hai  
- [ ] `android/app/google-services.json` file hai  
- [ ] Package name `com.mltprep.app` hai (har jagah)  
- [ ] SHA-1 Google Cloud Console mein add kiya  
- [ ] SHA-1 Firebase Console mein add kiya  
- [ ] `capacitor.config.ts` mein serverClientId correct hai  
- [ ] Android Studio mein Gradle sync successful  
- [ ] App install aur open hota hai  
- [ ] Google Sign-In button click hoti hai  
- [ ] User successfully login hota hai  
- [ ] Backend token verify karta hai  
- [ ] Dashboard properly load hota hai  

---

## 🛠️ Troubleshooting

### Common Issues:

| Problem | Solution |
|---------|----------|
| Node version old | `nvm install 22 && nvm use 22` |
| Android folder nahi ban raha | Node upgrade karein pehle |
| SHA-1 error | Debug aur Release dono add karein |
| google-services.json missing | Firebase se download karein |
| Google Sign-In nahi khul raha | serverClientId check karein |
| App crash ho raha hai | Logcat check karein: `adb logcat` |
| Build fail ho raha | Clean karein: `cd android && ./gradlew clean` |

### Logs dekhein:

```bash
# Android logs
adb logcat | grep -E "GoogleAuth|MLT|Capacitor"

# App info check karein
adb shell dumpsys package com.mltprep.app

# App uninstall karein
adb uninstall com.mltprep.app

# Logcat live dekhein
adb logcat -c && adb logcat
```

---

## 📚 Important Files

**Check karne layak files:**

1. **capacitor.config.ts** → serverClientId correct hai?  
2. **android/app/google-services.json** → File exist karti hai?  
3. **android/app/build.gradle** → Google services plugin apply hai?  
4. **src/pages/Auth.tsx** → Lines 109-193 mein native login code  
5. **src/convex/authActions.ts** → Backend token verification  

---

## 💡 Pro Tips

1. **Development ke liye:**  
   - USB Debugging always ON rakhein  
   - Developer Options ON rakhein  
   - Wireless debugging use karein (Android 11+)  

2. **Testing ke liye:**  
   - Debug aur Release dono APK test karein  
   - Multiple devices pe test karein  
   - Emulator bhi use karein  

3. **Production ke liye:**  
   - Release keystore safe rakhein (backup lein!)  
   - SHA-1 production keystore ka bhi add karein  
   - ProGuard/R8 rules check karein  
   - App size optimize karein  

---

## 🎓 Learning Resources

**Hindi Tutorials:**  
- Capacitor: https://capacitorjs.com/docs  
- Firebase: https://firebase.google.com/docs  
- Android Development: https://developer.android.com  

**Video Tutorials:**  
- YouTube search: "Capacitor Android Google Sign In Hindi"  
- YouTube search: "Firebase Android Setup Hindi"  

---

## 📞 Help Chahiye?

**Common Error Codes:**  
- `10` → SHA-1 mismatch  
- `12501` → User ne cancel kiya  
- `12500` → Configuration issue  
- No ID token → serverClientId missing  

**Debug Commands:**  
```bash
# App info check karein
adb shell dumpsys package com.mltprep.app

# App uninstall karein
adb uninstall com.mltprep.app

# Logcat live dekhein
adb logcat -c && adb logcat
```

---

## 🎉 Success!

Agar sab kuch kaam kar raha hai, to congratulations! 🎊

**Ab kya karein:**  
1. ✅ Features test karein (login, dashboard, tests, etc.)  
2. ✅ Real device pe test karein (emulator nahi)  
3. ✅ Friends ko beta test ke liye bhejein  
4. ✅ Play Store listing prepare karein  
5. ✅ Production release karein!  

---

**Last Updated:** January 2026  
**Ye guide follow karke aapka app 100% kaam karega!** 💪

**Agar koi problem aaye, to `ANDROID_SETUP_GUIDE.md` (English) padhein.**