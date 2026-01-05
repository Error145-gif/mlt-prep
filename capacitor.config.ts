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
      // serverClientId: The WEB Client ID (for backend verification)
      serverClientId: '513889515278-j5igvo075g0iigths2ifjs1agebfepti.apps.googleusercontent.com',
      // forceCodeForRefreshToken: true,
      // NOTE: 'clientId' for Android is usually read from google-services.json.
      // Do NOT set 'clientId' here to the Web Client ID.
    }
  }
};

export default config;
