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
      // IMPORTANT: This MUST be your WEB Client ID from Google Cloud Console.
      // Do NOT put the Android Client ID here.
      // The Android Client ID is linked automatically via the google-services.json file.
      serverClientId: '513889515278-j5igvo075g0iigths2ifjs1agebfepti.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#5B21B6",
      showSpinner: true,
      spinnerColor: "#ffffff"
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#5B21B6"
    }
  }
};

export default config;
