# KrishiSaarthi Setup Guide

## Quick Start for Development

### 1. Prerequisites
- Node.js 18+ and npm
- Firebase account
- Google Cloud Platform account

### 2. Environment Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd krishisaarthi

# Install dependencies
npm install

# Copy environment template
cp .env.local.template .env.local
```

### 3. Firebase Configuration
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Google and Phone)
3. Enable Firestore Database
4. Enable Storage
5. Copy your config values to `.env.local`

### 4. Google Cloud Setup
1. Enable the following APIs in Google Cloud Console:
   - Speech-to-Text API
   - Text-to-Speech API
   - Vertex AI API
2. Create a service account and download the JSON key
3. Set the GOOGLE_APPLICATION_CREDENTIALS path in `.env.local`

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Firebase Hosting
```bash
# Build and deploy
./deploy.sh
```

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```

## Project Structure

### Key Files
- `src/app/` - Next.js App Router pages
- `src/components/` - Reusable React components
- `src/contexts/` - React Context providers
- `src/lib/` - Utility functions and configurations
- `src/types/` - TypeScript type definitions

### Features
- 🔐 Authentication (Google OAuth + Phone OTP)
- 👤 Farmer Profile Management
- 📸 Image Upload for Crop Analysis
- 🎤 Voice Input in Kannada
- 🌤️ Weather Forecasting
- 📈 Market Price Trends
- 🏛️ Government Scheme Suggestions
- 📊 Dashboard Analytics

## API Integration Status

### Mock Implementations (Ready for real APIs)
- [x] Speech-to-Text (Google Cloud)
- [x] Text-to-Speech (Google Cloud)
- [x] Image Analysis (Vertex AI Gemini)
- [x] Weather Data (IMD API)
- [x] Market Prices (Agmarknet)

### Firebase Integration
- [x] Authentication
- [x] Firestore Database
- [x] Storage
- [ ] Cloud Functions (for AI processing)

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Firebase
firebase serve       # Serve locally with Firebase
firebase deploy      # Deploy to Firebase Hosting
```

## Troubleshooting

### Common Issues
1. **Firebase Auth not working**: Check if domain is authorized in Firebase console
2. **Build errors**: Ensure all environment variables are set
3. **Permission denied**: Check Firestore security rules

### Support
For issues, check the main README.md or create an issue in the repository.
