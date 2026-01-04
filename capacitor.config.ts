import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mltprep.app',
  appName: 'MLT Prep',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    hostname: 'mltprep.online'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#7C3AED',
      showSpinner: false
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: process.env.AUTH_GOOGLE_ID || 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
