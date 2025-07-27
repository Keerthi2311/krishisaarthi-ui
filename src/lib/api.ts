// KrishiSaarthi API integration

import { FarmerProfile, CropAdvice, WeatherData, MarketData } from '@/types';

// API Base URL
const API_BASE_URL = 'https://us-central1-krishisaarathi.cloudfunctions.net/api';

// API Response Types
interface APIResponse<T> {
  success?: boolean;
  error?: string;
  message?: string;
  data?: T;
}

interface QueryResponse {
  answer: {
    text: string;
    audioUrl: string;
    intent: string;
    priority: 'low' | 'medium' | 'high';
    additionalData?: {
      treatment?: string[];
      cost?: string;
      waterSchedule?: string[];
      soilMoisture?: string;
      recommendation?: 'sell' | 'hold' | 'wait';
      priceData?: any[];
      eligibleSchemes?: any[];
    };
    timestamp: string;
  };
  recommendations: {
    contextual: {
      weatherAlerts: string[];
      cropCare: string[];
      marketTips: string[];
      schemes: string[];
      relatedActions: string[];
    };
    profileBased: {
      crops: string[];
      location: string;
      farmSize: string;
    };
    recentActivityCount: number;
    generatedAt: string;
  };
}

// Main query handler - replaces speechToText and getAIAdvice
export const queryAPI = async (
  uid: string,
  options: {
    audioData?: string; // base64 encoded audio
    imageUrl?: string;
    queryText?: string;
  }
): Promise<CropAdvice[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        ...options,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data: QueryResponse = await response.json();
    
    // Convert API response to CropAdvice format
    const advice: CropAdvice[] = [{
      title: `${data.answer.intent.charAt(0).toUpperCase() + data.answer.intent.slice(1)} Advice`,
      text: data.answer.text,
      englishSummary: data.answer.text,
      audioUrl: data.answer.audioUrl,
      priority: data.answer.priority,
      category: data.answer.intent as any,
      timestamp: new Date(data.answer.timestamp),
      // Pass through additional data and contextual recommendations
      additionalData: data.answer.additionalData,
      contextualRecommendations: data.recommendations?.contextual,
    } as any];

    return advice;
  } catch (error) {
    console.error('Query API error:', error);
    throw new Error('Failed to get AI advice');
  }
};

// Speech to text using query API
export const speechToText = async (audioBlob: Blob, uid: string): Promise<string> => {
  try {
    // Convert the blob to base64
    const buffer = await audioBlob.arrayBuffer();
    const base64Audio = Buffer.from(buffer).toString('base64');

    const advice = await queryAPI(uid, { audioData: base64Audio });
    
    // Extract the transcribed text from the advice
    return advice[0]?.text || '';
  } catch (error) {
    console.error('Speech-to-text error:', error);
    throw new Error('Failed to convert speech to text');
  }
};

// Text to speech - audio URL is returned from the API
export const textToSpeech = async (text: string, language: string = 'en-IN'): Promise<string> => {
  // The API already returns audio URLs, so this might not be needed separately
  // For now, return a placeholder
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('/mock-audio/tts-output.mp3');
    }, 1000);
  });
};

// Image analysis using query API
export const analyzeImage = async (imageUrl: string, uid: string, query: string = ''): Promise<CropAdvice[]> => {
  try {
    return await queryAPI(uid, { imageUrl, queryText: query });
  } catch (error) {
    console.error('Image analysis error:', error);
    throw new Error('Failed to analyze image');
  }
};

// Get AI advice using query API
export const getAIAdvice = async (uid: string, query: string): Promise<CropAdvice[]> => {
  try {
    return await queryAPI(uid, { queryText: query });
  } catch (error) {
    console.error('AI advice error:', error);
    throw new Error('Failed to get AI advice');
  }
};

// Get user recommendations
export const getRecommendations = async (uid: string): Promise<{
  weatherAlerts: string[];
  cropCare: string[];
  marketTips: string[];
  schemes: string[];
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommendations/${uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get recommendations: ${response.statusText}`);
    }

    const data = await response.json();
    return data.recommendations;
  } catch (error) {
    console.error('Recommendations error:', error);
    throw new Error('Failed to get recommendations');
  }
};

// Create or update user profile
export const createUser = async (uid: string, profileData: Partial<FarmerProfile>): Promise<FarmerProfile> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        profileData: {
          name: profileData.fullName,
          phone: profileData.phoneNumber,
          location: profileData.district,
          farmSize: profileData.landSize,
          soilType: profileData.soilType,
          crops: profileData.cropsGrown,
          experience: profileData.farmingExperience?.toString(),
          irrigationType: profileData.irrigationType,
          preferredLanguage: 'en',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error('Create user error:', error);
    throw new Error('Failed to create user profile');
  }
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<FarmerProfile | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return null; // User not found
    }

    if (!response.ok) {
      throw new Error(`Failed to get user profile: ${response.statusText}`);
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw new Error('Failed to get user profile');
  }
};

// Weather forecast (keeping mock for now as API doesn't specify weather endpoint)
export const getWeatherForecast = async (district: string): Promise<WeatherData[]> => {
  // Mock implementation - the API documentation doesn't specify a weather endpoint
  // You may need to integrate with IMD API or other weather service directly
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockWeather: WeatherData[] = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: { 
          min: 18 + Math.floor(Math.random() * 5), 
          max: 28 + Math.floor(Math.random() * 8) 
        },
        humidity: 60 + Math.floor(Math.random() * 20),
        rainfall: Math.random() > 0.7 ? Math.floor(Math.random() * 20) : 0,
        windSpeed: 8 + Math.floor(Math.random() * 10),
        description: Math.random() > 0.5 ? 'Partly Cloudy' : 'Sunny',
        actionTip: 'Good day for farming activities'
      }));
      resolve(mockWeather);
    }, 1500);
  });
};

// Market prices using the market agent endpoint
export const getMarketPrices = async (crops: string[], district: string, uid: string): Promise<MarketData[]> => {
  try {
    const query = `What are the current market prices for ${crops.join(', ')} in ${district}?`;
    const advice = await queryAPI(uid, { queryText: query });
    
    // Extract market data from API response additional data
    const additionalData = advice[0]?.category === 'market' ? advice[0] : null;
    
    if (additionalData) {
      // Convert API response to MarketData format
      return crops.map(crop => ({
        cropName: crop,
        currentPrice: Math.floor(Math.random() * 100) + 50, // This should come from API
        priceHistory: Array.from({ length: 21 }, (_, i) => ({
          date: new Date(Date.now() - (20 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          price: Math.floor(Math.random() * 20) + 40 + (Math.random() > 0.5 ? 10 : -10)
        })),
        recommendation: 'sell', // This should come from API
        explanation: additionalData.text || 'Based on current market trends and weather forecast'
      }));
    }
    
    // Fallback to mock data
    return crops.map(crop => ({
      cropName: crop,
      currentPrice: Math.floor(Math.random() * 100) + 50,
      priceHistory: Array.from({ length: 21 }, (_, i) => ({
        date: new Date(Date.now() - (20 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: Math.floor(Math.random() * 20) + 40 + (Math.random() > 0.5 ? 10 : -10)
      })),
      recommendation: Math.random() > 0.5 ? 'sell' : 'hold',
      explanation: 'Based on current market trends and weather forecast'
    }));
  } catch (error) {
    console.error('Market prices error:', error);
    throw new Error('Failed to get market prices');
  }
};

export const generateDailyPlan = async (
  _farmerProfile: FarmerProfile, 
  _weather: WeatherData[], 
  _market: MarketData[]
): Promise<CropAdvice> => {
  // Mock implementation - replace with Vertex AI
  return new Promise((resolve) => {
    setTimeout(() => {
      const plan: CropAdvice = {
        category: 'daily',
        title: 'Today\'s Action Plan',
        englishSummary: 'Focus on irrigation and check for pests. Weather is favorable for fieldwork.',
        text: 'Focus on irrigation and check for pests. Weather is favorable for fieldwork.',
        priority: 'medium',
        timestamp: new Date(),
      };
      resolve(plan);
    }, 2500);
  });
};

// Voice recording utilities
export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
    } catch (error) {
      throw new Error('Failed to start recording: ' + error);
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }
}

// Image processing utilities
export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const compressedFile = new File([blob!], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        resolve(compressedFile);
      }, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

// Format helpers
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatTemperature = (temp: number): string => {
  return `${temp}°C`;
};
