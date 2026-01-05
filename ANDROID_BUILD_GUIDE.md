# Complete Android App Build Guide for MLT Prep

## Prerequisites
- Node.js 22.x installed
- Android Studio installed
- Java JDK 17 or higher
- Google Cloud Console access

---

## Step 1: Google Cloud Console Setup

### 1.1 Create Android OAuth Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services > Credentials**
4. Click **+ CREATE CREDENTIALS > OAuth client ID**
5. Select **Android** as application type
6. Enter:
   - **Name**: MLT Prep Android
   - **Package name**: `com.mltprep.app`
   - **SHA-1 certificate fingerprint**: (see Step 1.2)

### 1.2 Get SHA-1 Fingerprint

**For Debug Build:**
