// Type definitions for KrishiSaarthi

export interface User {
  uid: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
}

export interface FarmerProfile {
  uid: string;
  fullName: string;
  district: string;
  soilType: 'Red' | 'Black' | 'Loamy' | 'Laterite' | 'Sandy';
  farmingExperience: number;
  cropsGrown: string[];
  landSize: number;
  landUnit: 'acres' | 'hectares';
  irrigationType: 'Borewell' | 'Canal' | 'Rain-fed' | 'Drip';
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CropAdvice {
  category: 'weather' | 'disease' | 'scheme' | 'market' | 'daily';
  title: string;
  englishSummary: string;
  text: string;
  audioUrl?: string;
  imageUrl?: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
}

export interface WeatherData {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  humidity: number;
  rainfall: number;
  windSpeed: number;
  description: string;
  actionTip: string;
}

export interface MarketData {
  cropName: string;
  currentPrice: number;
  priceHistory: {
    date: string;
    price: number;
  }[];
  recommendation: 'sell' | 'hold' | 'switch';
  explanation: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  description: string;
  benefit: string;
  eligibilityCriteria: {
    age?: { min: number; max: number };
    landSize?: { min: number; max: number; unit: string };
    income?: { max: number };
    caste?: string[];
    crops?: string[];
  };
  applicationLink: string;
  documents: string[];
  deadline?: Date;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  audioUrl?: string;
}

export interface VoiceRecording {
  blob: Blob;
  duration: number;
  timestamp: Date;
}

export interface AIResponse {
  text: string;
  audioUrl?: string;
  confidence: number;
  category: CropAdvice['category'];
}

// API Request/Response Types for Agents API Integration
export interface QueryRequest {
  text?: string;
  image?: string; // base64 encoded image
  userId: string;
  language?: string;
  location?: {
    district: string;
    state?: string;
  };
}

export interface QueryResponse {
  success: boolean;
  data: {
    response: string;
    audioUrl?: string;
    category: CropAdvice['category'];
    confidence: number;
    recommendations?: CropAdvice[];
  };
  error?: string;
}

export interface CreateUserRequest {
  uid: string;
  profile: Omit<FarmerProfile, 'uid' | 'createdAt' | 'updatedAt'>;
}

export interface CreateUserResponse {
  success: boolean;
  data?: {
    user: FarmerProfile;
  };
  error?: string;
}

export interface GetUserResponse {
  success: boolean;
  data?: {
    user: FarmerProfile;
  };
  error?: string;
}

export interface RecommendationsResponse {
  success: boolean;
  data?: {
    weather: WeatherData[];
    market: MarketData[];
    schemes: GovernmentScheme[];
    dailyPlan: CropAdvice;
  };
  error?: string;
}

export interface HealthCheckResponse {
  success: boolean;
  status: string;
  timestamp: string;
}

// Districts in Karnataka (simplified list)
export const KARNATAKA_DISTRICTS = [
  'Bagalkot',
  'Ballari',
  'Belagavi',
  'Bengaluru Rural',
  'Bengaluru Urban',
  'Bidar',
  'Chamarajanagar',
  'Chikballapur',
  'Chikkamagaluru',
  'Chitradurga',
  'Dakshina Kannada',
  'Davanagere',
  'Dharwad',
  'Gadag',
  'Hassan',
  'Haveri',
  'Kalaburagi',
  'Kodagu',
  'Kolar',
  'Koppal',
  'Mandya',
  'Mysuru',
  'Raichur',
  'Ramanagara',
  'Shivamogga',
  'Tumakuru',
  'Udupi',
  'Uttara Kannada',
  'Vijayapura',
  'Yadgir'
] as const;

export type KarnatakaDistrict = typeof KARNATAKA_DISTRICTS[number];

// Common crops in Karnataka
export const COMMON_CROPS = [
  'Rice (Paddy)',
  'Maize',
  'Jowar',
  'Bajra',
  'Ragi',
  'Cotton',
  'Sugarcane',
  'Groundnut',
  'Sunflower',
  'Safflower',
  'Sesame',
  'Castor',
  'Red Chili',
  'Turmeric',
  'Coriander',
  'Tomato',
  'Onion',
  'Potato',
  'Brinjal',
  'Okra',
  'Mango',
  'Banana',
  'Grapes',
  'Pomegranate',
  'Orange',
  'Coconut',
  'Areca nut'
] as const;

export type CommonCrop = typeof COMMON_CROPS[number];
