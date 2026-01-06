import { CapacitorConfig } from '@capacitor/core';

// ===================================================================
// ANDROID GOOGLE SIGN-IN SETUP INSTRUCTIONS
// ===================================================================
//
// STEP 1: Get your Android OAuth Client ID from Firebase/Google Cloud Console
//         - Go to: https://console.firebase.google.com/
//         - Select your project > Project Settings > General
//         - Under "Your apps", find your Android app
//         - Copy the "Client ID" (ends with .apps.googleusercontent.com)
//
// STEP 2: Add SHA-1 fingerprint to Google Cloud Console
//         Run: cd android && ./gradlew signingReport
//         Copy SHA-1 and add to Google Cloud Console > Credentials > Android Client
//
// STEP 3: Download google-services.json from Firebase
//         Place it in: android/app/google-services.json
//
// STEP 4: Replace serverClientId below with your Android Client ID
//
// CURRENT WEB CLIENT ID (DO NOT USE FOR ANDROID):
// 513889515278-j5igvo075g0iigths2ifjs1agebfepti.apps.googleusercontent.com
//
// ===================================================================

const config: CapacitorConfig = {
  appId: 'com.mltprep.app',
  appName: 'MLT Prep',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    hostname: 'mltprep.app',
    cleartext: false
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      // ⚠️ IMPORTANT: Replace this with your ANDROID OAuth Client ID from Firebase
      // This is NOT the same as Web Client ID!
      // Format: 513889515278-xxxxxxxxx.apps.googleusercontent.com
      serverClientId: '513889515278-YOUR_ANDROID_CLIENT_ID_HERE.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#5B21B6',
      showSpinner: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#5B21B6',
    },
  },
};

export default config;
