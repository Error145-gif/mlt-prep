import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mltprep.app',
  appName: 'MLT Prep',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      // NOTE: This must be the WEB Client ID, not the Android one.
      // The Android one is read automatically from google-services.json
      serverClientId: '513889515278-j5igvo075g0iigths2ifjs1agebfepti.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    }
  }
};

export default config;
