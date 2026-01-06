# 🪟 Windows Se MLT Prep Android App Banana - Complete Guide

## 🎯 Goal: Play Store Ready Android App

Aapko **Windows computer** se **professional Android app** banana hai with:
- ✅ Google Sign-In/Sign-Up
- ✅ All features working
- ✅ Play Store ready (signed APK/AAB)
- ✅ No errors

---

## 📦 Part 1: Software Installation (30-45 minutes)

### Step 1: Java JDK Install Karein (Required)

**Download:**
1. Go to: https://adoptium.net/
2. Click **"Download Latest LTS"**
3. Select: **Windows x64** (OpenJDK 17 or 21)
4. Download `.msi` file

**Install:**
1. Downloaded file ko double-click karein
2. "Add to PATH" option **CHECK** karein ✓
3. Install karein (default location theek hai)
4. Finish

**Verify:**
```cmd
java -version
```
Output: `openjdk version "17.x.x"` dikhna chahiye

---

### Step 2: Android Studio Install Karein (Required)

**Download:**
1. Go to: https://developer.android.com/studio
2. Click **"Download Android Studio"**
3. Accept terms → Download (900 MB+)

**Install:**
1. Downloaded `.exe` file run karein
2. **Standard Installation** select karein
3. All components install hone dein:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (Emulator)
4. Finish (20-30 min install time)

**First Time Setup:**
1. Android Studio open karein
2. "Welcome to Android Studio" window aayegi
3. More Actions → **SDK Manager**
4. Install these:
   - ✅ Android SDK Platform 33 (Android 13)
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Command-line Tools
   - ✅ Android Emulator
5. "Apply" → Download/Install

**Set Environment Variables:**
1. Search "Environment Variables" in Windows
2. Click "Environment Variables" button
3. Under "System Variables":
   - Click "New"
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\YourUsername\AppData\Local\Android\Sdk`
   - Click OK
4. Edit "Path" variable:
   - Click "Path" → "Edit" → "New"
   - Add: `%ANDROID_HOME%\platform-tools`
   - Add: `%ANDROID_HOME%\tools`
   - Click OK

**Verify:**
```cmd
adb --version
```

---

### Step 3: Node.js v22 Install Karein (Required)

**Download:**
1. Go to: https://nodejs.org/
2. Click **"Download Node.js (LTS)"** - version 22.x
3. Download Windows Installer (.msi)

**Install:**
1. Run downloaded file
2. Accept → Next → Next → Install
3. Finish

**Verify:**
```cmd
node --version
npm --version
```
Output: `v22.x.x` and `10.x.x`

---

### Step 4: Git Install Karein (Optional but Recommended)

**Download:**
1. Go to: https://git-scm.com/download/win
2. Download 64-bit installer

**Install:**
1. Run installer
2. All default options theek hain
3. Finish

---

## 🚀 Part 2: Project Setup (15 minutes)

### Step 1: Project Folder Open Karein

**Option A: Agar Daytona/Cloud mein kaam kar rahe ho:**
```cmd
# Download karein ya sync karein apna project
# Example:
git clone <your-repo-url>
cd mltprep
```

**Option B: Agar local Windows folder hai:**
```cmd
cd C:\Users\YourName\Desktop\mltprep
```

---

### Step 2: Dependencies Install Karein

```cmd
npm install
```

Yeh 5-10 minutes lagega (2-3 GB download)

---

### Step 3: Web App Build Karein

```cmd
npm run build
```

Output: `dist` folder banega with web files

---

### Step 4: Android Platform Add Karein

```cmd
npm run mobile:android
```

Yeh `android` folder generate karega

---

### Step 5: Sync Karein

```cmd
npm run mobile:sync
```

---

## 🔥 Part 3: Firebase Setup (10 minutes)

### Step 1: Firebase Project Banayein

1. Browser mein jaayein: https://console.firebase.google.com/
2. **"Add project"** click karein
3. Project name: **"MLT Prep"**
4. Google Analytics: **Disable** karein (optional)
5. **"Create project"** click karein
6. Wait 30 seconds → **"Continue"**

---

### Step 2: Android App Add Karein

1. Firebase Console dashboard mein jaayein
2. Click **Android icon** (robot symbol)
3. Form fill karein:
   - **Android package name:** `com.mltprep.app`
   - **App nickname:** MLT Prep
   - **Debug signing certificate SHA-1:** (next step se milega)

---

### Step 3: SHA-1 Fingerprint Get Karein

**Windows Command Prompt (CMD) open karein:**

```cmd
cd android
gradlew signingReport
```

**Output mein dhundhein:**
```
Variant: debug
Config: debug
Store: C:\Users\YourName\.android\debug.keystore
Alias: AndroidDebugKey
MD5: ...
SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
SHA-256: ...
```

**SHA1 line copy karein** aur Firebase mein paste karein

**"Register app"** click karein

---

### Step 4: google-services.json Download Karein

1. Firebase mein **"Download google-services.json"** button dikhega
2. Click karke download karein
3. Downloaded file ko copy karein
4. Paste karein: `android\app\google-services.json`

**Verify path:**
```
mltprep/
  android/
    app/
      google-services.json  ← Yahan honi chahiye
```

---

### Step 5: Web Client ID Copy Karein

1. Firebase Console → **Project Settings** (gear icon ⚙️)
2. Scroll down → **"Your apps"** section
3. Android app ke neeche expand karein
4. **"Web client (auto created by Google Service)"** dikhega
5. **Client ID** copy karein (format: `xxxxx-xxxxxx.apps.googleusercontent.com`)

**Ab project mein update karein:**

File open karein: `capacitor.config.ts`

**Line 15 dhundhein:**
```typescript
serverClientId: '513889515278-YOUR_ANDROID_CLIENT_ID_HERE.apps.googleusercontent.com',
```

**Replace karein with your actual Client ID:**
```typescript
serverClientId: '513889515278-abc123def456.apps.googleusercontent.com',
```

**Save karein** (Ctrl+S)

---

### Step 6: Changes Sync Karein

```cmd
npm run build
npm run mobile:sync
```

---

## 📱 Part 4: Build & Test (15 minutes)

### Step 1: Android Studio Mein Open Karein

**Command Prompt se:**
```cmd
npm run mobile:open:android
```

Ya manually:
1. Android Studio open karein
2. **"Open"** click karein
3. Navigate: `C:\Users\YourName\...\mltprep\android`
4. Select `android` folder → **OK**

---

### Step 2: Gradle Sync Wait Karein

- Android Studio mein **automatically Gradle sync** shuru hoga
- Bottom mein progress bar dikhega: "Syncing Gradle..."
- **3-5 minutes wait karein** (pehli baar slow hota hai)
- Downloads bhi ho sakte hain (dependencies)

**Agar error aaye:**
1. File → **Invalidate Caches** → Restart
2. Build → **Clean Project**
3. Build → **Rebuild Project**

---

### Step 3: Device/Emulator Setup

**Option A: Real Android Phone (Recommended - Fast)**

1. Phone ko USB cable se connect karein
2. Phone mein:
   - Settings → About Phone
   - "Build Number" ko **7 times tap** karein
   - "Developer Mode Enabled" message aayega
   - Back → Developer Options
   - **"USB Debugging"** enable karein ✓
3. Phone se permission allow karein ("Always allow")
4. Android Studio mein top toolbar mein phone ka naam dikhega

**Option B: Emulator (Slow but no phone needed)**

1. Android Studio → Tools → **Device Manager**
2. Click **"Create Device"**
3. Select: **Pixel 5** → Next
4. Select System Image: **Android 13 (API 33)** → Download → Next
5. Finish
6. Green Play ▶️ button click karke emulator start karein

---

### Step 4: App Build & Install Karein

1. Top toolbar mein **device select** karein (phone/emulator)
2. Green **Play button ▶️** click karein
3. Build process shuru hoga:
   - "Building APK..."
   - "Installing APK..."
   - Progress bottom mein dikhega
4. **First build 5-10 minutes** lag sakta hai
5. App automatically open hoga!

---

### Step 5: Test Google Sign-In

1. App open hone ke baad **"Continue with Google"** button dikhega
2. Click karein
3. Google account select karein
4. **Sign-In successful!** ✅
5. Dashboard load hoga

**Agar Error Code 10 aaye:**
- SHA-1 fingerprint **galat** hai
- Firebase Console mein SHA-1 check karein
- `gradlew signingReport` se correct SHA-1 copy karein
- Firebase mein update karein
- `google-services.json` **re-download** karein
- App **rebuild** karein

---

## 🏗️ Part 5: Release APK/AAB Banana (Play Store ke liye)

### Step 1: Signing Key Generate Karein

**Command Prompt open karein:**

```cmd
cd android\app
keytool -genkey -v -keystore mltprep-release.keystore -alias mltprep -keyalg RSA -keysize 2048 -validity 10000
```

**Prompts aayenge (fill carefully):**
```
Enter keystore password: [Strong password - YAAD RAKHEIN!]
Re-enter password: [Same password]
What is your first and last name? Your Name
What is the name of your organizational unit? IT
What is the name of your organization? MLT Prep
What is the name of your City? Your City
What is the name of your State? Your State
What is the two-letter country code? IN
Is this correct? yes

Enter key password for <mltprep>: [Press Enter for same as keystore]
```

**Output:**
```
Generating keypair...
Storing mltprep-release.keystore
```

**⚠️ IMPORTANT: Yeh file aur password SAFE rakhein!**
- Agar yeh khoya to app update nahi kar paayenge
- Backup lein multiple locations mein

---

### Step 2: Key Config Setup

**Create file:** `android\key.properties`

```properties
storeFile=mltprep-release.keystore
storePassword=YourKeystorePassword
keyAlias=mltprep
keyPassword=YourKeyPassword
```

**⚠️ Yeh file Git mein KABHI mat daalna!**

---

### Step 3: Build Configuration Update

**Edit file:** `android\app\build.gradle`

**Find this section (around line 5-10):**
```gradle
android {
    namespace "com.mltprep.app"
    compileSdkVersion rootProject.ext.compileSdkVersion
```

**Add BEFORE `android {`:**
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

**Find `buildTypes` section (around line 100-110):**
```gradle
buildTypes {
    release {
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

**Add signing config BEFORE `buildTypes`:**
```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

**Save file** (Ctrl+S)

---

### Step 4: Version Update

**Edit:** `android\app\build.gradle`

**Find (around line 5-10):**
```gradle
defaultConfig {
    applicationId "com.mltprep.app"
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 1
    versionName "1.0"
}
```

**Update for first release:**
```gradle
versionCode 1
versionName "1.0.0"
```

---

### Step 5: Release Build Banayein

**For APK (testing/direct distribution):**
```cmd
cd android
gradlew assembleRelease
```

**APK location:**
```
android\app\build\outputs\apk\release\app-release.apk
```

**For AAB (Play Store upload - Recommended):**
```cmd
cd android
gradlew bundleRelease
```

**AAB location:**
```
android\app\build\outputs\bundle\release\app-release.aab
```

**Build time:** 5-15 minutes (first time)

---

### Step 6: Test Release Build

**Install APK on phone:**
```cmd
adb install android\app\build\outputs\apk\release\app-release.apk
```

**Test:**
1. Open app
2. Google Sign-In test karein
3. All features check karein
4. Koi crash nahi honi chahiye

---

## 🎨 Part 6: App Customization (Optional but Recommended)

### Update App Name

**Edit:** `android\app\src\main\res\values\strings.xml`
```xml
<string name="app_name">MLT Prep</string>
<string name="title_activity_main">MLT Prep</string>
```

---

### Update App Icon

**Icon requirements:**
- 512x512 PNG (Play Store)
- Transparent background (optional)
- Simple, clear design

**Generate icons:**
1. Go to: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
2. Upload your logo (512x512 recommended)
3. Download icon pack
4. Extract
5. Copy folders to: `android\app\src\main\res\`
   - `mipmap-hdpi`
   - `mipmap-mdpi`
   - `mipmap-xhdpi`
   - `mipmap-xxhdpi`
   - `mipmap-xxxhdpi`

---

### Update Splash Screen

**Edit:** `capacitor.config.ts`
```typescript
SplashScreen: {
  launchShowDuration: 2000,
  backgroundColor: '#7C3AED', // Your brand color
  showSpinner: false,
},
```

**Custom splash screen image:**
1. Create: `public/splash.png` (2732x2732 px)
2. Android Studio → Resource Manager → Add image

---

### Update Package Name (if needed)

**⚠️ Warning: Do this BEFORE generating signing key**

1. **Edit:** `capacitor.config.ts`
   ```typescript
   appId: 'com.yourcompany.mltprep',
   ```

2. **Edit:** `android\app\build.gradle`
   ```gradle
   applicationId "com.yourcompany.mltprep"
   ```

3. **Refactor in Android Studio:**
   - Right-click `com.mltprep.app` folder
   - Refactor → Rename
   - Update package name

4. **Re-generate Firebase app** with new package name

---

## 🚀 Part 7: Play Store Upload

### Step 1: Play Console Setup

1. Go to: https://play.google.com/console/
2. **Create account** ($25 one-time fee)
3. Fill developer profile:
   - Name
   - Email
   - Address
   - Phone
4. Accept agreements
5. Payment ($25 via credit card)

---

### Step 2: Create App

1. Click **"Create app"**
2. Fill details:
   - App name: **MLT Prep**
   - Default language: **English**
   - App/Game: **App**
   - Free/Paid: **Free** (ya paid)
3. Declarations:
   - ✓ Accept Play policies
   - ✓ Export laws compliance
4. **Create app**

---

### Step 3: Dashboard Complete Karein

**App Dashboard mein complete karein:**

#### A. Store Settings
- App category: **Education**
- Tags: medical, exam prep, MLT
- Contact details: email, phone

#### B. Privacy Policy
**Required!** Create a privacy policy:
- Use generator: https://www.privacypolicygenerator.info/
- Upload to website OR Google Docs (public link)
- Add URL in Play Console

#### C. App Content
- Target audience: **18+** (or appropriate)
- Content rating questionnaire fill karein
- Ads: Agar ads hain to declare karein
- Data safety: User data collection disclosure

#### D. Store Listing
- App name: **MLT Prep - Medical Lab Tech Exam**
- Short description (80 chars):
  ```
  AI-powered exam preparation for Medical Lab Technician students
  ```
- Full description (4000 chars):
  ```
  MLT Prep is the ultimate exam preparation app for Medical Lab Technician
  (MLT) students. Prepare for DMLT, MLT, and Lab Technician exams with:

  ✓ 5000+ practice questions
  ✓ AI-powered adaptive learning
  ✓ Mock tests & weekly challenges
  ✓ Previous year questions (PYQs)
  ✓ Detailed explanations
  ✓ Performance analytics
  ✓ Study materials library
  ✓ Leaderboard & rewards

  Features:
  - Smart question recommendations
  - Subject-wise practice
  - Real exam simulation
  - Progress tracking
  - Offline access
  - Referral rewards

  Perfect for DMLT, MLT, and all medical lab entrance exams!
  ```

#### E. Graphics Assets

**Required:**
1. **App icon** - 512x512 PNG
2. **Feature graphic** - 1024x500 PNG
3. **Screenshots** (minimum 2):
   - Phone: 1080x1920 to 1080x2340 px
   - Take from emulator/phone
   - Show key features
   - At least 2, max 8

**Optional:**
4. Promo video (YouTube link)
5. TV/Wear screenshots (if applicable)

**Screenshot tips:**
- Show login screen
- Show dashboard
- Show test interface
- Show results
- Show study materials
- Clean, professional looking

---

### Step 4: Release Setup

#### A. Countries
Select countries:
- India (minimum)
- Or "All countries"

#### B. Production Release

1. Dashboard → **Production** (left menu)
2. Click **"Create new release"**
3. **Upload AAB:**
   - Click "Upload"
   - Select: `android\app\build\outputs\bundle\release\app-release.aab`
   - Wait for upload (50-200 MB)
4. **Release name:** `1.0.0 (1)`
5. **Release notes:**
   ```
   Initial release:
   - Complete exam preparation platform
   - 5000+ practice questions
   - Mock tests & weekly tests
   - AI-powered learning
   - Google Sign-In
   - Offline support
   ```
6. Click **"Save"**

---

### Step 5: Review & Submit

1. **Review release** - Check for warnings
2. Fix any issues (usually Store Listing incomplete)
3. Click **"Start rollout to Production"**
4. Confirm

**Review time:** 1-7 days (usually 2-3 days)

**Email notification aayega:**
- ✅ Approved: App live on Play Store!
- ❌ Rejected: Reasons batayenge, fix karke re-submit

---

## 🎯 Part 8: Testing & Quality Checklist

### Before Play Store Submission

- [ ] Google Sign-In working
- [ ] All features tested
- [ ] No crashes
- [ ] Offline functionality working
- [ ] Payment integration tested
- [ ] UI responsive on different screen sizes
- [ ] Proper error messages
- [ ] Fast loading times
- [ ] Privacy policy uploaded
- [ ] Terms & conditions accessible
- [ ] Contact information provided

---

### Testing on Different Devices

**Test karein:**
1. Small phone (5" screen)
2. Large phone (6.5"+ screen)
3. Tablet (optional)
4. Different Android versions:
   - Android 8 (API 26)
   - Android 10
   - Android 13+

**Android Studio Emulator use karein:**
- Create multiple emulators
- Test each feature
- Check UI layout

---

## 🔧 Part 9: Common Issues & Solutions

### Issue 1: Gradle Build Failed

**Error:**
```
Execution failed for task ':app:processDebugResources'
```

**Solution:**
```cmd
cd android
gradlew clean
gradlew assembleDebug
```

---

### Issue 2: Google Sign-In Error Code 10

**Error:** "Developer Error" or "Code 10"

**Solution:**
1. SHA-1 galat hai
2. Get correct SHA-1:
   ```cmd
   cd android
   gradlew signingReport
   ```
3. Firebase Console → Settings → SHA-1 update karein
4. Re-download `google-services.json`
5. Replace in `android\app\`
6. Rebuild app

---

### Issue 3: App Crashes on Startup

**Check Logcat:**
```cmd
adb logcat | findstr "MLT"
```

**Common causes:**
- `google-services.json` missing
- Wrong package name
- API keys missing
- Network permission missing

**Solution:**
- Check all files copied correctly
- Verify package name matches everywhere
- Check `AndroidManifest.xml` for permissions

---

### Issue 4: "Duplicate Class" Error

**Error:**
```
Duplicate class found in modules
```

**Solution:**

Edit `android\app\build.gradle`:
```gradle
android {
    ...
    configurations {
        all*.exclude group: 'com.google.guava', module: 'listenablefuture'
    }
}
```

---

### Issue 5: Release Build Different from Debug

**Problem:** Release build behaves differently

**Solution:**
1. Check ProGuard rules (`proguard-rules.pro`)
2. Add keep rules for critical classes
3. Test release build thoroughly before uploading

---

## 📊 Part 10: Post-Launch

### Update Strategy

**For updates:**
1. Fix bugs/add features
2. Update `versionCode` and `versionName` in `build.gradle`:
   ```gradle
   versionCode 2
   versionName "1.0.1"
   ```
3. Build new AAB:
   ```cmd
   cd android
   gradlew bundleRelease
   ```
4. Upload to Play Console → Create new release
5. Add release notes explaining changes

---

### User Feedback

**Monitor:**
- Play Console → Reviews
- Crash reports (Play Console → Quality)
- ANRs (App Not Responding)
- User ratings

**Respond to reviews:**
- Thank positive reviews
- Address negative reviews professionally
- Fix reported bugs quickly

---

### Analytics

**Add Firebase Analytics:**
1. Firebase Console → Analytics
2. Track key metrics:
   - Daily active users
   - Session duration
   - Feature usage
   - Conversion rates

---

## 🎓 Complete Command Reference

```cmd
# Initial Setup
npm install
npm run build
npm run mobile:android
npm run mobile:sync

# Development
npm run dev                          # Web development
npm run mobile:open:android         # Open in Android Studio

# Sync after changes
npm run build
npm run mobile:sync

# Testing
adb devices                          # Check connected devices
adb install path\to\app.apk         # Install APK
adb logcat                           # View logs

# Release Build
cd android
gradlew clean                        # Clean build
gradlew assembleRelease              # Build APK
gradlew bundleRelease                # Build AAB (Play Store)

# Signing Report (SHA-1)
cd android
gradlew signingReport
```

---

## 📁 Important Files & Locations

```
mltprep/
├── android/
│   ├── app/
│   │   ├── google-services.json         ⚠️ Firebase config
│   │   ├── build.gradle                 ⚠️ App config
│   │   └── src/
│   │       └── main/
│   │           ├── AndroidManifest.xml  ⚠️ Permissions
│   │           └── res/                 📱 Icons, strings
│   ├── key.properties                   🔐 Signing key config
│   └── build.gradle                     ⚠️ Project config
├── capacitor.config.ts                  ⚠️ Capacitor config
├── package.json                         📦 Dependencies
└── dist/                                🌐 Built web app
```

---

## ✅ Final Checklist

### Development Complete:
- [ ] All features working
- [ ] Google Sign-In working
- [ ] No crashes in testing
- [ ] Tested on real device
- [ ] UI looks good on different screens
- [ ] Offline features working

### Release Ready:
- [ ] Signing key generated & backed up
- [ ] Release AAB built successfully
- [ ] Version number updated
- [ ] App icon customized
- [ ] Splash screen updated
- [ ] Privacy policy created

### Play Store Ready:
- [ ] Play Console account created ($25 paid)
- [ ] App created in console
- [ ] Store listing complete
- [ ] Screenshots uploaded (2-8)
- [ ] Feature graphic uploaded
- [ ] Privacy policy URL added
- [ ] Content rating complete
- [ ] Data safety complete
- [ ] AAB uploaded
- [ ] Release notes written

### Post-Launch:
- [ ] App approved & live
- [ ] Test download from Play Store
- [ ] Monitor crash reports
- [ ] Respond to user reviews
- [ ] Plan next update

---

## 🎉 Congratulations!

Aapka **MLT Prep Android App** ab **Play Store** par live hai! 🚀

**Remember:**
- Keep keystore safe (backup multiple locations)
- Regular updates release karein
- User feedback respond karein
- Analytics monitor karein
- Bugs fix karein quickly

---

## 📞 Troubleshooting Resources

**Android Documentation:**
- https://developer.android.com/docs

**Capacitor Documentation:**
- https://capacitorjs.com/docs

**Firebase Documentation:**
- https://firebase.google.com/docs

**Play Console Help:**
- https://support.google.com/googleplay/android-developer

---

**Good luck! Aapka app successful ho! 💪**

---

**Version:** Windows Complete Guide v1.0
**Last Updated:** January 2026
**Target:** Windows 10/11, Android 8+, Play Store
