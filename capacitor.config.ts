import type { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.mltprep.app',
  appName: 'MLT Prep',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    GoogleAuth: {
      // IMPORTANT: This is the WEB CLIENT ID for backend token verification
      // The Android Client ID is automatically read from google-services.json
      serverClientId: '513889515278-YOUR_ANDROID_CLIENT_ID_HERE.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      forceCodeForRefreshToken: false,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#7C3AED',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#7C3AED',
    },
  },
};

export default config;
