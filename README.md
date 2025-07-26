# KrishiSaarthi - ನಮ್ಮ ಕೃಷಿಸಾಥಿ

**Google AI-powered agriculture assistant for Kannada farmers**

KrishiSaarthi is an advanced agricultural assistant built with Google's AI technologies to help Kannada farmers make informed decisions about their crops, weather, market trends, and government schemes.

## 🌟 Features

### 🔐 Page 1: Login Page (/)
- **Kannada Welcome**: "ನಮ್ಮ ಕೃಷಿಸಾಥಿಗೆ ಸ್ವಾಗತ!"
- **Google Sign-In**: Firebase Authentication with Google OAuth
- **Phone Authentication**: OTP-based phone number verification
- **Farmer Animation**: Beautiful UI with farmer-themed graphics

### 📝 Page 2: Farmer Profile Setup (/setup)
- **Comprehensive Profile**: Full name, district, soil type, farming experience
- **Crop Selection**: Multi-select interface for crops grown
- **Land Details**: Size and irrigation type configuration
- **Firestore Integration**: All data stored securely in Firebase

### 🧠 Page 3: Smart Interaction Page (/home)
- **Image Upload**: Crop disease diagnosis through image analysis
- **Voice Input**: Kannada speech-to-text integration
- **AI Recommendations**: Multi-category advice system
  - Weather & Irrigation
  - Disease Diagnosis
  - Market Tips
  - Government Schemes
  - Daily Action Plans
- **Audio Output**: Text-to-speech in Kannada

### 📊 Page 4: Personalized Dashboard (/dashboard)
- **Weather Forecast**: 7-day weather predictions with farming tips
- **Market Trends**: Real-time crop price analysis and sell/hold recommendations
- **Government Schemes**: Personalized scheme suggestions with eligibility matching

## 🏗️ Technology Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend & AI
- **Firebase Authentication** (Google & Phone OTP)
- **Firebase Firestore** for data storage
- **Firebase Storage** for file uploads
- **Firebase Cloud Functions** (planned)
- **Google Cloud Speech-to-Text** (integration ready)
- **Google Cloud Text-to-Speech** (integration ready)
- **Google Vertex AI** (Gemini Pro Vision for image analysis)

### Data Structure
```
Firestore Collections:
├── users/{userId}
│   ├── profile data
│   └── communityTips (subcollection)
├── schemes/{schemeId}
└── communityTips/{tipId}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project with enabled services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/krishisaarthi.git
   cd krishisaarthi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Google Cloud Configuration
   GOOGLE_CLOUD_PROJECT_ID=your_project_id
   GOOGLE_CLOUD_PRIVATE_KEY=your_private_key
   GOOGLE_CLOUD_CLIENT_EMAIL=your_client_email

   # API Keys
   VERTEX_AI_API_KEY=your_vertex_ai_key
   SPEECH_TO_TEXT_API_KEY=your_stt_key
   TEXT_TO_SPEECH_API_KEY=your_tts_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication, Firestore, and Storage

2. **Configure Authentication**
   - Enable Google Sign-In
   - Enable Phone Number Sign-In
   - Configure authorized domains

3. **Set up Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /schemes/{document=**} {
         allow read: if request.auth != null;
       }
     }
   }
   ```

## 🎯 Agentic AI Architecture

KrishiSaarthi operates as a multi-agent system:

```
User Input (Voice + Image)
       |
       V
Orchestrator (Cloud Function)
       |
       |-----> KhetGPT Agent (Disease Diagnosis)
       |-----> KrishiVaani Agent (Weather Planning)
       |-----> BechnaYaRokna Agent (Market Advice)
       |-----> KrishiGPT Agent (Scheme Assistant)
       |-----> Daily Notification Agent (Scheduled Updates)
       |
       V
Synthesized Response (Kannada Voice + UI)
```

## 📱 Usage

1. **Sign In**: Use Google or phone number authentication
2. **Setup Profile**: Complete farmer profile with crop and land details
3. **Get Advice**: Upload crop images or record voice queries
4. **View Dashboard**: Monitor weather, market trends, and schemes
5. **Apply for Schemes**: Direct links to government scheme applications

## 🌾 Supported Crops

The system supports major Karnataka crops including:
- Rice (Paddy), Maize, Jowar, Bajra, Ragi
- Cotton, Sugarcane, Groundnut, Sunflower
- Vegetables: Tomato, Onion, Potato, Brinjal
- Fruits: Mango, Banana, Grapes, Pomegranate
- Spices: Red Chili, Turmeric, Coriander

## 🗺️ Karnataka Districts

Covers all 30 districts of Karnataka from Bagalkot to Yadgir.

## 🔮 Future Enhancements

- Real-time integration with IMD weather API
- Agmarknet market price integration
- Community tips and voting system
- Offline voice processing
- Multi-language support beyond Kannada
- WhatsApp bot integration
- SMS-based advice for feature phone users

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Cloud Platform for AI services
- Firebase for backend infrastructure
- Karnataka government for agricultural data
- Indian farmers for inspiration

## 📞 Support

For support and queries:
- Email: support@krishisaarthi.com
- Phone: +91-XXXX-XXXXXX

---

**Built with ❤️ for Indian farmers using Google's AI technologies**
