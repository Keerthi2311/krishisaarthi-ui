// Utility functions for KrishiSaarthi API calls

import { 
  FarmerProfile, 
  CropAdvice, 
  WeatherData, 
  MarketData,
  GovernmentScheme,
  QueryRequest,
  QueryResponse,
  CreateUserRequest,
  CreateUserResponse,
  GetUserResponse,
  RecommendationsResponse,
  HealthCheckResponse
} from '@/types';

// API Configuration
const API_BASE_URL = 'https://us-central1-krishisaarathi.cloudfunctions.net/api';

// Utility function to handle API requests
const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// API Health Check
export const checkApiHealth = async (): Promise<HealthCheckResponse> => {
  try {
    return await apiRequest<HealthCheckResponse>('/health');
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};

// User Management Functions
export const createOrUpdateUser = async (
  uid: string, 
  profile: Omit<FarmerProfile, 'uid' | 'createdAt' | 'updatedAt'>
): Promise<CreateUserResponse> => {
  try {
    const request: CreateUserRequest = { uid, profile };
    return await apiRequest<CreateUserResponse>('/users', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<GetUserResponse> => {
  try {
    return await apiRequest<GetUserResponse>(`/users/${uid}`);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Main AI Query Function
export const queryAI = async (
  text: string | undefined,
  imageUrl: string | undefined,
  userId: string,
  district: string
): Promise<CropAdvice[]> => {
  try {
    let imageBase64: string | undefined;
    
    // Convert image URL to base64 if provided
    if (imageUrl) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      imageBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Remove data URL prefix
        };
        reader.readAsDataURL(blob);
      });
    }

    const request: QueryRequest = {
      text,
      image: imageBase64,
      userId,
      location: { district },
      language: 'en-IN',
    };

    const response = await apiRequest<QueryResponse>('/query', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (!response.success) {
      throw new Error(response.error || 'AI query failed');
    }

    // Convert response to CropAdvice format
    const advice: CropAdvice[] = [];
    
    if (response.data.response) {
      advice.push({
        category: response.data.category,
        title: getCategoryTitle(response.data.category),
        englishSummary: response.data.response,
        text: response.data.response,
        audioUrl: response.data.audioUrl,
        priority: getPriorityFromCategory(response.data.category),
        timestamp: new Date(),
      });
    }

    // Add additional recommendations if provided
    if (response.data.recommendations) {
      advice.push(...response.data.recommendations);
    }

    return advice;
  } catch (error) {
    console.error('Error querying AI:', error);
    throw error;
  }
};

// Get Daily Recommendations
export const getDailyRecommendations = async (uid: string): Promise<{
  weather: WeatherData[];
  market: MarketData[];
  schemes: GovernmentScheme[];
  dailyPlan: CropAdvice;
}> => {
  try {
    const response = await apiRequest<RecommendationsResponse>(`/recommendations/${uid}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch recommendations');
    }

    return response.data!;
  } catch (error) {
    console.error('Error fetching daily recommendations:', error);
    throw error;
  }
};

// Helper functions
const getCategoryTitle = (category: CropAdvice['category']): string => {
  const titles = {
    weather: 'Weather & Irrigation',
    disease: 'Disease Diagnosis',
    scheme: 'Scheme Suggestions',
    market: 'Market Insights',
    daily: 'Daily Action Plan',
  };
  return titles[category] || 'AI Recommendation';
};

const getPriorityFromCategory = (category: CropAdvice['category']): 'high' | 'medium' | 'low' => {
  const priorities = {
    disease: 'high' as const,
    weather: 'medium' as const,
    market: 'medium' as const,
    scheme: 'low' as const,
    daily: 'medium' as const,
  };
  return priorities[category] || 'medium';
};

// Keep existing speech to text functionality (local API route)
export const speechToText = async (audioBlob: Blob): Promise<string> => {
  try {
    // Convert the blob to base64
    const buffer = await audioBlob.arrayBuffer();
    const base64Audio = Buffer.from(buffer).toString('base64');

    // Prepare the request to Google Cloud Speech-to-Text API
    const response = await fetch('/api/speech-to-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio: {
          content: base64Audio
        },
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 48000,
          languageCode: 'en-IN', // English (India) language
          model: 'default',
          audioChannelCount: 1,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Speech recognition failed');
    }

    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Speech-to-text error:', error);
    throw new Error('Failed to convert speech to text');
  }
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

// Legacy mock functions for fallback (kept for compatibility during transition)
export const analyzeImage = async (imageUrl: string, query: string): Promise<CropAdvice[]> => {
  console.warn('Using legacy analyzeImage function. Use queryAI instead.');
  // Mock implementation fallback
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockAdvice: CropAdvice[] = [
        {
          category: 'disease',
          title: 'Disease Diagnosis',
          englishSummary: 'Your crop shows signs of nutrient deficiency. Apply nitrogen-rich fertilizer.',
          text: 'Your crop shows signs of nutrient deficiency. Apply nitrogen-rich fertilizer.',
          priority: 'high',
          timestamp: new Date(),
        }
      ];
      resolve(mockAdvice);
    }, 3000);
  });
};

export const getWeatherForecast = async (district: string): Promise<WeatherData[]> => {
  console.warn('Using legacy getWeatherForecast function. Use getDailyRecommendations instead.');
  // Mock implementation fallback
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

export const getMarketPrices = async (crops: string[], district: string): Promise<MarketData[]> => {
  console.warn('Using legacy getMarketPrices function. Use getDailyRecommendations instead.');
  // Mock implementation fallback
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockMarket: MarketData[] = crops.map(crop => ({
        cropName: crop,
        currentPrice: Math.floor(Math.random() * 100) + 50,
        priceHistory: Array.from({ length: 21 }, (_, i) => ({
          date: new Date(Date.now() - (20 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          price: Math.floor(Math.random() * 20) + 40 + (Math.random() > 0.5 ? 10 : -10)
        })),
        recommendation: Math.random() > 0.5 ? 'sell' : 'hold',
        explanation: 'Based on current market trends and weather forecast'
      }));
      resolve(mockMarket);
    }, 2000);
  });
};

export const generateDailyPlan = async (
  farmerProfile: FarmerProfile, 
  weather: WeatherData[], 
  market: MarketData[]
): Promise<CropAdvice> => {
  console.warn('Using legacy generateDailyPlan function. Use getDailyRecommendations instead.');
  // Mock implementation fallback
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

export const textToSpeech = async (text: string, language: string = 'en-IN'): Promise<string> => {
  // Mock implementation - replace with Google Cloud Text-to-Speech
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('/mock-audio/tts-output.mp3');
    }, 1000);
  });
};