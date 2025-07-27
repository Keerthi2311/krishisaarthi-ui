'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, 
  FileText, 
  ArrowLeft, 
  Sun, 
  CloudRain, 
  DollarSign,
  Award,
  Cloud
} from 'lucide-react';
import { WeatherData, MarketData, GovernmentScheme } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';

const DashboardPage = () => {
  const { user, farmerProfile, signOut } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'weather' | 'market' | 'schemes'>('weather');
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    if (!user || !farmerProfile) return;
    
    try {
      setLoading(true);
      
      // Try to fetch real data from API
      try {
        const { getDailyRecommendations } = await import('@/lib/api');
        const recommendations = await getDailyRecommendations(user.uid);
        
        setWeatherData(recommendations.weather);
        setMarketData(recommendations.market);
        setSchemes(recommendations.schemes);
        
      } catch (apiError) {
        console.warn('API fetch failed, using fallback data:', apiError);
        
        // Fallback to mock data if API fails
        const mockWeather: WeatherData[] = [
          {
            date: '2025-01-26',
            temperature: { min: 18, max: 28 },
            humidity: 65,
            rainfall: 0,
            windSpeed: 12,
            description: 'Partly Cloudy',
            actionTip: 'Good day for irrigation and pesticide application'
          },
          {
            date: '2025-01-27',
            temperature: { min: 20, max: 30 },
            humidity: 70,
            rainfall: 5,
            windSpeed: 8,
            description: 'Light Rain',
            actionTip: 'Avoid irrigation, check drainage systems'
          },
          {
            date: '2025-01-28',
            temperature: { min: 19, max: 29 },
            humidity: 60,
            rainfall: 0,
            windSpeed: 10,
            description: 'Sunny',
            actionTip: 'Perfect for harvesting mature crops'
          },
          {
            date: '2025-01-29',
            temperature: { min: 21, max: 31 },
            humidity: 55,
            rainfall: 0,
            windSpeed: 15,
            description: 'Clear Sky',
            actionTip: 'Ideal for field preparation and sowing'
          },
          {
            date: '2025-01-30',
            temperature: { min: 22, max: 32 },
            humidity: 58,
            rainfall: 2,
            windSpeed: 12,
            description: 'Partly Cloudy',
            actionTip: 'Light rain expected. Good for transplanting'
          },
          {
            date: '2025-01-31',
            temperature: { min: 20, max: 28 },
            humidity: 72,
            rainfall: 15,
            windSpeed: 18,
            description: 'Moderate Rain',
            actionTip: 'Heavy rain expected. Ensure proper drainage'
          },
          {
            date: '2025-02-01',
            temperature: { min: 19, max: 27 },
            humidity: 68,
            rainfall: 8,
            windSpeed: 14,
            description: 'Light Rain',
            actionTip: 'Post-rain activities. Check for water logging'
          }
        ];

        const mockMarket: MarketData[] = farmerProfile.cropsGrown.slice(0, 3).map(crop => ({
          cropName: crop,
          currentPrice: Math.floor(Math.random() * 100) + 50,
          priceHistory: Array.from({ length: 21 }, (_, i) => ({
            date: new Date(Date.now() - (20 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            price: Math.floor(Math.random() * 20) + 40 + (Math.random() > 0.5 ? 10 : -10)
          })),
          recommendation: Math.random() > 0.5 ? 'sell' : 'hold',
          explanation: 'Based on current market trends and weather forecast'
        }));

        const mockSchemes: GovernmentScheme[] = [
          {
            id: '1',
            name: 'PM-KISAN',
            description: 'Income support scheme for small and marginal farmers',
            benefit: '₹6,000 per year',
            eligibilityCriteria: {
              landSize: { min: 0, max: 2, unit: 'hectares' }
            },
            applicationLink: 'https://pmkisan.gov.in',
            documents: ['Aadhaar Card', 'Land Records', 'Bank Details'],
          },
          {
            id: '2',
            name: 'Raitha Bandhu',
            description: 'Karnataka state investment support scheme',
            benefit: '₹10,000 per hectare',
            eligibilityCriteria: {
              landSize: { min: 0, max: 10, unit: 'hectares' }
            },
            applicationLink: 'https://raitamitra.karnataka.gov.in',
            documents: ['Land Records', 'Aadhaar Card', 'Bank Passbook'],
          },
        ];

        setWeatherData(mockWeather);
        setMarketData(mockMarket);
        setSchemes(mockSchemes);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && farmerProfile) {
      loadDashboardData();
    }
  }, [user, farmerProfile, loadDashboardData]);

  if (!farmerProfile) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute requireProfile={true}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/home')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard
                  </h1>
                  <p className="text-gray-600">{farmerProfile.fullName} • {farmerProfile.district}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today&apos;s Weather</p>
                <p className="text-2xl font-bold text-gray-900">
                  {weatherData[0]?.temperature.max || 28}°C
                </p>
                <p className="text-sm text-gray-500">
                  {weatherData[0]?.description || "Partly Cloudy"}
                </p>
              </div>
              <Sun className="w-12 h-12 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Crops</p>
                <p className="text-2xl font-bold text-gray-900">
                  {farmerProfile.cropsGrown.length}
                </p>
                <p className="text-sm text-gray-500">
                  {farmerProfile.cropsGrown.slice(0, 2).join(', ')}
                  {farmerProfile.cropsGrown.length > 2 && "..."}
                </p>
              </div>
              <div className="text-4xl">🌾</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Market Alert</p>
                <p className="text-2xl font-bold text-green-600">
                  ↗️ Rising
                </p>
                <p className="text-sm text-gray-500">
                  Tomato prices up 15%
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('weather')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'weather'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Cloud className="w-5 h-5" />
                  <span>Weather Forecast</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('market')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'market'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Market Trends</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('schemes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'schemes'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Scheme Suggestions</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'weather' && (
          <div className="space-y-6">
            {/* Weather Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                7-Day Weather Forecast for {farmerProfile.district}
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-gray-800 font-kannada text-lg">
                  ಮುಂದಿನ ವಾರ ಮಧ್ಯಮ ಮಳೆ ನಿರೀಕ್ಷೆ. ನೀರುಹಾಕುವುದನ್ನು ಕಡಿಮೆ ಮಾಡಿ ಮತ್ತು ಒಳಚರಂಡಿ ವ್ಯವಸ್ಥೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.
                </p>
                <audio controls className="w-full mt-3">
                  <source src="/mock-audio/weather-summary.mp3" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>

            {/* Weather Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weather
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Temperature
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rainfall
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action Tip
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {weatherData.map((day, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(day.date).toLocaleDateString('en-IN', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            {day.description.includes('Rain') ? (
                              <CloudRain className="w-5 h-5 text-blue-500" />
                            ) : (
                              <Sun className="w-5 h-5 text-yellow-500" />
                            )}
                            <span>{day.description}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.temperature.min}°C - {day.temperature.max}°C
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.rainfall}mm
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {day.actionTip}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-6">
            {/* Market Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Market Trends for Your Crops
              </h2>
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-gray-800 font-kannada text-lg">
                  ಈ ವಾರ ಟೊಮೇಟೊ ಮತ್ತು ಈರುಳ್ಳಿ ಬೆಲೆಗಳು ಏರಿಕೆಯಾಗಿವೆ. ಮಾರಾಟಕ್ಕೆ ಉತ್ತಮ ಸಮಯ.
                </p>
                <audio controls className="w-full mt-3">
                  <source src="/mock-audio/market-summary.mp3" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>

            {/* Market Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketData.map((crop, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{crop.cropName}</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      crop.recommendation === 'sell' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {crop.recommendation === 'sell' ? 'Sell Now' : 'Hold'}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{crop.currentPrice}/quintal
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{crop.explanation}</p>
                  </div>

                  {/* Simple price trend */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Last 3 weeks</span>
                      <span>Current</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          crop.recommendation === 'sell' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schemes' && (
          <div className="space-y-6">
            {/* Schemes Header */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Government Schemes for You
              </h2>
              <p className="text-gray-600">
                Based on your profile, you are eligible for the following schemes:
              </p>
            </div>

            {/* Scheme Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {schemes.map((scheme) => (
                <div key={scheme.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{scheme.name}</h3>
                      <p className="text-gray-800 font-medium font-kannada text-lg">
                        {scheme.name}
                      </p>
                    </div>
                    <Award className="w-6 h-6 text-yellow-500" />
                  </div>

                  <p className="text-gray-600 mb-4">{scheme.description}</p>

                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Benefit: {scheme.benefit}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Required Documents:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {scheme.documents.map((doc, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <audio controls className="w-full">
                      <source src={`/mock-audio/${scheme.id}-summary.mp3`} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>

                  <a
                    href={scheme.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Apply Online
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
