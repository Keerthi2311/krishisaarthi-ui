// Utility functions for KrishiSaarthi API calls

import { FarmerProfile, CropAdvice, WeatherData, MarketData } from '@/types';

// Mock functions for API calls - replace with actual implementations

export const speechToText = async (_audioBlob: Blob): Promise<string> => {
  // Mock implementation - replace with Google Cloud Speech-to-Text
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("ನನ್ನ ಸಸ್ಯದಲ್ಲಿ ಹಳದಿ ಎಲೆಗಳು ಕಾಣಿಸುತ್ತಿವೆ");
    }, 2000);
  });
};

export const textToSpeech = async (text: string, _language: string = 'kn-IN'): Promise<string> => {
  // Mock implementation - replace with Google Cloud Text-to-Speech
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('/mock-audio/tts-output.mp3');
    }, 1000);
  });
};

export const analyzeImage = async (_imageUrl: string, _query: string): Promise<CropAdvice[]> => {
  // Mock implementation - replace with Vertex AI Gemini Pro Vision
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockAdvice: CropAdvice[] = [
        {
          category: 'disease',
          title: 'Disease Diagnosis',
          englishSummary: 'Your crop shows signs of nutrient deficiency. Apply nitrogen-rich fertilizer.',
          kannadaText: 'ನಿಮ್ಮ ಬೆಳೆಯಲ್ಲಿ ಪೋಷಕಾಂಶಗಳ ಕೊರತೆ ಕಾಣಿಸುತ್ತಿದೆ. ಸಾರಜನಕ ಭರಿತ ಗೊಬ್ಬರವನ್ನು ಅನ್ವಯಿಸಿ.',
          priority: 'high',
          timestamp: new Date(),
        }
      ];
      resolve(mockAdvice);
    }, 3000);
  });
};

export const getWeatherForecast = async (_district: string): Promise<WeatherData[]> => {
  // Mock implementation - replace with IMD API or other weather service
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

export const getMarketPrices = async (crops: string[], _district: string): Promise<MarketData[]> => {
  // Mock implementation - replace with Agmarknet API or other market data service
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
        kannadaText: 'ನೀರುಹಾಕುವುದರ ಮೇಲೆ ಗಮನ ಕೇಂದ್ರೀಕರಿಸಿ ಮತ್ತು ಕೀಟಗಳನ್ನು ಪರಿಶೀಲಿಸಿ. ಹೊಲದ ಕೆಲಸಕ್ಕೆ ಹವಾಮಾನ ಅನುಕೂಲಕರವಾಗಿದೆ.',
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
