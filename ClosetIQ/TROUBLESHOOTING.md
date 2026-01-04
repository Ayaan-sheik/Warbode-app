# ClosetIQ - Troubleshooting Guide 🔧

## Common Issues & Solutions

### Installation Issues

#### ❌ "npm install fails"
```bash
# Solution 1: Clear cache
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Solution 2: Use --legacy-peer-deps
npm install --legacy-peer-deps

# Solution 3: Update npm
npm install -g npm@latest
```

#### ❌ "Expo CLI not found"
```bash
npm install -g expo-cli
# OR use npx
npx expo start
```

### Runtime Issues

#### ❌ "Metro bundler won't start"
```bash
# Clear Metro cache
npm start -- --clear

# OR
npx expo start -c

# If still failing, reset everything
rm -rf node_modules .expo
npm install
npm start
```

#### ❌ "Firebase connection error"
**Check:**
1. `.env` file exists and has values
2. Firebase config is correct
3. Firebase project is active
4. Internet connection is stable

**Quick Fix for Demo:**
```env
# Use these demo values in .env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyDemo
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=demo.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=demo-project
```

App will work in offline/demo mode!

#### ❌ "Camera/Gallery permissions denied"
```bash
# iOS: Check Info.plist permissions
# Android: Manually grant in Settings → Apps → ClosetIQ → Permissions

# Or add to app.json:
"permissions": [
  "CAMERA",
  "READ_MEDIA_IMAGES",
  "READ_EXTERNAL_STORAGE"
]
```

#### ❌ "NativeWind styles not applying"
```bash
# Ensure babel.config.js has nativewind plugin
# Restart Metro with cache clear
npm start -- --clear

# Verify global.css is imported
# Check tailwind.config.js paths
```

### Build Issues

#### ❌ "Android build fails"
```bash
# Clear Gradle cache
cd android
./gradlew clean
cd ..

# Update Gradle wrapper
cd android
./gradlew wrapper --gradle-version=8.0
cd ..

# Rebuild
npm run android
```

#### ❌ "iOS build fails"
```bash
# Update pods (macOS only)
cd ios
pod deintegrate
pod install
cd ..

# Rebuild
npm run ios

# If still failing
rm -rf ios/Pods ios/Podfile.lock
pod install
```

#### ❌ "EAS Build errors"
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build with specific profile
eas build --platform android --profile development
```

### Development Issues

#### ❌ "TypeScript errors everywhere"
```bash
# Generate types
npx expo customize tsconfig.json

# Check for missing types
npm install --save-dev @types/react @types/react-native

# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "Restart TypeScript Server"
```

#### ❌ "Module not found" errors
```bash
# Common causes:
# 1. Import path wrong (case sensitive!)
# 2. File doesn't exist
# 3. Wrong relative path

# Debug:
console.log(__dirname)  # Check actual path

# Try absolute imports from project root
import { auth } from '@/services/firebase'
```

#### ❌ "Expo Router navigation not working"
```bash
# Check:
1. app/ folder structure correct
2. _layout.tsx files present
3. Correct import from 'expo-router'

# Clear .expo folder
rm -rf .expo
npm start
```

### Firebase Issues

#### ❌ "Authentication fails"
```bash
# Check Firebase Console:
1. Authentication enabled
2. Email/Password provider enabled
3. Correct API keys in .env

# Test with demo credentials:
Email: test@test.com
Password: Test123!
```

#### ❌ "Firestore permission denied"
```bash
# Update Firestore rules:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### ❌ "Storage upload fails"
```bash
# Check Firebase Storage rules:
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /closet/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == userId;
    }
  }
}
```

### Demo Day Issues

#### ❌ "App crashes during demo"
**Backup Plan:**
1. Have screenshots ready
2. Record demo video beforehand
3. Use web version (more stable)
4. Show admin panel static data

**Prevention:**
```bash
# Test thoroughly before demo
npm start
# Open on actual device
# Run through entire flow 3x
# Clear and reinstall if issues
```

#### ❌ "Internet connection fails"
**Demo Mode:**
- App works offline with mock data
- Firebase optional for core features
- All AI mocked for demos

**Quick offline setup:**
```typescript
// In services/firebase.ts
const USE_OFFLINE = true;

if (USE_OFFLINE) {
  // Use mock data
  enableNetwork(db).then(() => {
    disableNetwork(db);
  });
}
```

#### ❌ "Slow performance during demo"
```bash
# Optimize before demo:
1. Clear Metro cache
2. Close other apps
3. Ensure good WiFi
4. Use release build not debug

# Release build:
eas build --profile preview --platform android
```

### Performance Issues

#### ❌ "App is slow"
```typescript
// Add to images:
<Image 
  source={{ uri: imageUrl }}
  resizeMode="cover"
  defaultSource={require('./placeholder.png')}
/>

// Optimize lists:
<FlatList 
  data={items}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
/>

// Lazy load tabs
const ClosetScreen = lazy(() => import('./closet'));
```

#### ❌ "Memory leaks"
```typescript
// Always cleanup in useEffect
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, callback);
  return () => unsubscribe(); // Cleanup!
}, []);
```

### AI/API Issues

#### ❌ "Vision API not working"
```bash
# Check:
1. API key valid
2. API enabled in Google Cloud
3. Billing enabled
4. Quota not exceeded

# Use mock mode:
# services/vision.ts already has mock fallback
```

#### ❌ "GPT API fails"
```bash
# Check OpenAI key
# Monitor rate limits
# Use mock explanations (already implemented)

# Test:
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Quick Diagnostics

### Check Everything Script
```bash
#!/bin/bash
echo "🔍 ClosetIQ Diagnostics"
echo "======================="

# Node version
echo "Node: $(node -v)"

# NPM version
echo "NPM: $(npm -v)"

# Expo CLI
npx expo --version

# Dependencies
echo "Checking node_modules..."
ls node_modules > /dev/null && echo "✅ Dependencies installed"

# .env file
[ -f .env ] && echo "✅ .env exists" || echo "❌ .env missing"

# TypeScript
npx tsc --version

# Firebase config
grep -q "EXPO_PUBLIC_FIREBASE" .env && echo "✅ Firebase configured"

echo ""
echo "Run 'npm start' to begin!"
```

### Environment Check
```typescript
// Add to app/_layout.tsx for debugging
import Constants from 'expo-constants';

console.log('Firebase Config:', {
  apiKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_API_KEY ? '✅' : '❌',
  projectId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_PROJECT_ID ? '✅' : '❌',
});
```

## Still Having Issues?

### Debug Mode
```bash
# Run with debug logging
EXPO_DEBUG=1 npm start

# Check logs
npx react-native log-android
# OR
npx react-native log-ios
```

### Reset Everything
```bash
# Nuclear option - fresh start
rm -rf node_modules .expo ios/Pods
npm cache clean --force
npm install
cd ios && pod install && cd ..
npm start -- --clear
```

### Get Help
1. Check console errors first
2. Read error messages carefully
3. Google the exact error
4. Check Expo docs
5. Firebase docs

## Pre-Demo Checklist

Before your presentation:

- [ ] App runs without errors
- [ ] Internet connection tested
- [ ] Firebase connected OR offline mode working
- [ ] Sample data loaded
- [ ] All tabs navigate correctly
- [ ] Image upload works
- [ ] Outfit generation works
- [ ] Admin panel accessible
- [ ] Phone charged
- [ ] Backup screenshots/video ready

## Emergency Contact

During hackathon:
- Check STATUS.md for feature status
- Review DEMO.md for demo flow
- See PRESENTATION.md for talking points
- Console logs show debug info

---

**When in doubt, restart Metro bundler! 90% of issues solved this way.** 😄

Good luck! 🚀
