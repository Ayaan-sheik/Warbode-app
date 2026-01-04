# ClosetIQ — AI-Powered Wardrobe Management 👔✨

**Your Personal Fashion Assistant with AI-Powered Outfit Matching**

ClosetIQ is a hackathon MVP app that uses AI to help users organize their closet, get outfit suggestions, stay on-trend, and make sustainable fashion choices.

## 🚀 Features

- **📸 Smart Closet Upload** - AI-powered image analysis automatically tags clothing items by color, category, pattern, fabric, and season
- **🎨 Outfit Matching Engine** - Rule-based + AI outfit suggestions with confidence scoring and explanations
- **📈 Fashion Trends** - Stay updated with current fashion trends and get personalized recommendations
- **🛍️ Smart Marketplace** - Get product recommendations to complete your wardrobe
- **♻️ Sustainability Tracking** - Track cost-per-wear and make conscious fashion choices
- **👤 User Profiles** - Personalized fashion preferences and wardrobe analytics
- **🔧 Admin/Debug Panel** - Special view for judges to see AI processing details

## 🛠️ Tech Stack

### Frontend
- **React Native** (Expo)
- **Expo Router** - File-based navigation
- **TypeScript** - Type safety
- **NativeWind** - Tailwind CSS for React Native
- **React Query** - Data fetching
- **Reanimated** - Smooth animations

### Backend & AI
- **Firebase** - Authentication, Firestore, Storage
- **Google Vision API** - Image analysis (mockable)
- **GPT-4** - Outfit explanations (mockable)
- Rule-based outfit matching engine

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ClosetIQ

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase and AI API keys

# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on Web
npm run web
```

## 🔑 Environment Setup

Create a `.env` file with:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

EXPO_PUBLIC_GOOGLE_VISION_API_KEY=optional
EXPO_PUBLIC_OPENAI_API_KEY=optional
```

## 📁 Project Structure

```
app/
├── (auth)/           # Authentication screens
├── (tabs)/           # Main app tabs
├── upload/           # Image upload flow
├── outfit-preview/   # Outfit preview
├── marketplace/      # Product recommendations
└── admin/            # Debug/judge view

components/           # Reusable components
services/             # AI, Firebase, API services
data/                 # Mock JSON data
types/                # TypeScript definitions
```

## 🎯 Hackathon MVP Strategy

This app demonstrates:

1. **AI Integration** ✔ - Vision API for image tagging
2. **Polished UI** ✔ - Modern design with NativeWind
3. **Explainability** ✔ - Shows AI reasoning and confidence
4. **End-to-End Flow** ✔ - Complete user journey

**Smart Shortcuts for 48-72h:**
- Mock AI responses with realistic fallbacks
- Hardcoded trends instead of real scraping
- Demo marketplace data
- Simple but effective rule-based matching

## 🔍 Admin/Debug Panel

Access the hidden admin panel from the Profile tab to see:
- AI confidence scores
- Color/pattern detection details
- Outfit matching algorithm output
- System statistics

**Perfect for impressing judges!** 🎯

## 🏗️ Build & Deploy

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Submit to stores
eas submit
```

## 📱 Demo Credentials

For testing:
- Email: demo@closetiq.com
- Password: demo123

## 🎨 Design Highlights

- Purple (#8B5CF6) primary theme
- Clean, modern interface
- Smooth animations
- Intuitive navigation
- Beautiful color-coded analytics

## 🧪 Testing

The app works in demo mode without real AI APIs by using:
- Mock vision analysis
- Simplified GPT responses
- Dummy marketplace data

Replace with real APIs for production.

## 📄 License

MIT License - Built for hackathon demonstration

## 👥 Team

Built with ❤️ for the hackathon

---

**Made with Expo + Firebase + AI**
