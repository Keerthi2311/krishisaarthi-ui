// Mock data for development and testing

import { GovernmentScheme, WeatherData, MarketData } from '@/types';

export const mockSchemes: GovernmentScheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    description: 'Income support scheme providing financial assistance to small and marginal farmers',
    benefit: '₹6,000 per year in three installments',
    eligibilityCriteria: {
      landSize: { min: 0, max: 2, unit: 'hectares' },
      income: { max: 200000 }
    },
    applicationLink: 'https://pmkisan.gov.in',
    documents: ['Aadhaar Card', 'Land Records', 'Bank Account Details', 'Passport Size Photo'],
    deadline: new Date('2025-03-31'),
  },
  {
    id: 'raitha-bandhu',
    name: 'Raitha Bandhu',
    description: 'Karnataka state investment support scheme for farmers',
    benefit: '₹10,000 per hectare per season',
    eligibilityCriteria: {
      landSize: { min: 0, max: 10, unit: 'hectares' }
    },
    applicationLink: 'https://raitamitra.karnataka.gov.in',
    documents: ['Land Records', 'Aadhaar Card', 'Bank Passbook', 'Caste Certificate (if applicable)'],
  },
  {
    id: 'krishi-sinchai',
    name: 'Pradhan Mantri Krishi Sinchai Yojana',
    description: 'Scheme to expand cultivated area with assured irrigation',
    benefit: 'Up to 90% subsidy on drip irrigation systems',
    eligibilityCriteria: {
      landSize: { min: 0.5, max: 50, unit: 'hectares' }
    },
    applicationLink: 'https://pmksy.gov.in',
    documents: ['Land Documents', 'Aadhaar Card', 'Bank Details', 'Water Source Certificate'],
  },
  {
    id: 'soil-health',
    name: 'Soil Health Card Scheme',
    description: 'Free soil testing and nutrient recommendations',
    benefit: 'Free soil testing worth ₹500-1000',
    eligibilityCriteria: {},
    applicationLink: 'https://soilhealth.dac.gov.in',
    documents: ['Land Records', 'Aadhaar Card'],
  },
  {
    id: 'kisan-credit',
    name: 'Kisan Credit Card',
    description: 'Short-term credit support for farming expenses',
    benefit: 'Credit up to ₹3 lakhs at 4% interest',
    eligibilityCriteria: {
      landSize: { min: 0.1, max: 100, unit: 'hectares' }
    },
    applicationLink: 'https://www.nabard.org/kcc.aspx',
    documents: ['Land Records', 'Aadhaar Card', 'PAN Card', 'Bank Statements'],
  }
];

export const mockWeatherData: WeatherData[] = [
  {
    date: '2025-01-26',
    temperature: { min: 18, max: 28 },
    humidity: 65,
    rainfall: 0,
    windSpeed: 12,
    description: 'Partly Cloudy',
    actionTip: 'Good day for irrigation and pesticide application. Monitor soil moisture levels.'
  },
  {
    date: '2025-01-27',
    temperature: { min: 20, max: 30 },
    humidity: 70,
    rainfall: 5,
    windSpeed: 8,
    description: 'Light Rain',
    actionTip: 'Avoid irrigation today. Check drainage systems and cover harvested crops.'
  },
  {
    date: '2025-01-28',
    temperature: { min: 19, max: 29 },
    humidity: 60,
    rainfall: 0,
    windSpeed: 10,
    description: 'Sunny',
    actionTip: 'Perfect for harvesting mature crops. Apply post-harvest treatments.'
  },
  {
    date: '2025-01-29',
    temperature: { min: 21, max: 31 },
    humidity: 55,
    rainfall: 0,
    windSpeed: 15,
    description: 'Clear Sky',
    actionTip: 'Ideal for field preparation and sowing. Ensure adequate water supply.'
  },
  {
    date: '2025-01-30',
    temperature: { min: 22, max: 32 },
    humidity: 58,
    rainfall: 2,
    windSpeed: 12,
    description: 'Partly Cloudy',
    actionTip: 'Light rain expected. Good for transplanting seedlings.'
  },
  {
    date: '2025-01-31',
    temperature: { min: 20, max: 28 },
    humidity: 72,
    rainfall: 15,
    windSpeed: 18,
    description: 'Moderate Rain',
    actionTip: 'Heavy rain expected. Ensure proper drainage and avoid field work.'
  },
  {
    date: '2025-02-01',
    temperature: { min: 19, max: 27 },
    humidity: 68,
    rainfall: 8,
    windSpeed: 14,
    description: 'Light Rain',
    actionTip: 'Post-rain activities. Check for water logging and pest issues.'
  }
];

export const generateMockMarketData = (crops: string[]): MarketData[] => {
  return crops.map(crop => {
    const basePrice = getCropBasePrice(crop);
    const currentVariation = (Math.random() - 0.5) * 20; // ±10 variation
    const currentPrice = Math.round(basePrice + currentVariation);
    
    return {
      cropName: crop,
      currentPrice,
      priceHistory: Array.from({ length: 21 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (20 - i));
        const variation = (Math.random() - 0.5) * 30; // ±15 variation
        return {
          date: date.toISOString().split('T')[0],
          price: Math.round(basePrice + variation)
        };
      }),
      recommendation: currentPrice > basePrice ? 'sell' : 'hold',
      explanation: `Current price is ${currentPrice > basePrice ? 'above' : 'below'} average. ${
        currentPrice > basePrice 
          ? 'Good time to sell if quality is good.' 
          : 'Consider waiting for better prices or explore value addition.'
      }`
    };
  });
};

const getCropBasePrice = (crop: string): number => {
  const basePrices: { [key: string]: number } = {
    'Rice (Paddy)': 2500,
    'Maize': 2000,
    'Jowar': 2800,
    'Bajra': 2600,
    'Ragi': 3500,
    'Cotton': 6000,
    'Sugarcane': 350,
    'Groundnut': 5500,
    'Sunflower': 6200,
    'Safflower': 5800,
    'Sesame': 8000,
    'Castor': 4500,
    'Red Chili': 12000,
    'Turmeric': 8500,
    'Coriander': 9500,
    'Tomato': 2500,
    'Onion': 2200,
    'Potato': 2000,
    'Brinjal': 3000,
    'Okra': 4000,
    'Mango': 3500,
    'Banana': 2800,
    'Grapes': 5000,
    'Pomegranate': 8000,
    'Orange': 3000,
    'Coconut': 2500,
    'Areca nut': 35000
  };
  
  return basePrices[crop] || 3000; // Default price if crop not found
};

export const phrases = {
  welcome: 'Welcome to KrishiSaarthi!',
  weatherAdvice: 'Moderate rain expected next week. Reduce irrigation.',
  marketAdvice: 'Tomato prices are increasing this week. Good time to sell.',
  diseaseDetected: 'Your crop shows signs of nutrient deficiency.',
  goodMorning: 'Good morning! Let\'s start today\'s farming activities.',
  schemeEligible: 'You are eligible for government schemes.',
  thankYou: 'Thank you! Best wishes for successful farming.'
};

export const commonDiseases = [
  {
    name: 'Leaf Spot',
    symptoms: 'Brown or black spots on leaves',
    treatment: 'Apply copper-based fungicide'
  },
  {
    name: 'Powdery Mildew',
    symptoms: 'White powdery growth on leaves',
    treatment: 'Use sulfur-based spray'
  },
  {
    name: 'Nutrient Deficiency',
    symptoms: 'Yellowing of leaves, stunted growth',
    treatment: 'Apply balanced NPK fertilizer'
  }
];
