# Use ADB to test the deep link manually
adb shell am start -W -a android.intent.action.VIEW -d "mltprep://auth-success?token=test123"
