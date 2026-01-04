import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mltprep.app',
  appName: 'MLT Prep',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    hostname: 'mltprep.app'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#6366f1',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Replace with your actual Web Client ID from Google Cloud Console
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
