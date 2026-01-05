  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      // IMPORTANT: This should be your ANDROID Client ID from Google Cloud Console
      // NOT the Web Client ID. Get it from:
      // Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client IDs > Android
      serverClientId: 'YOUR_ANDROID_CLIENT_ID_HERE.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },