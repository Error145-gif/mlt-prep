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
      serverClientId: '513889515278-j5igvo075g0iigths2ifjs1agebfepti.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
