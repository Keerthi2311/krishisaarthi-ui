'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Mic, MicOff, Send, LogOut, BarChart3 as BarChart } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { CropAdvice } from '@/types';
import { queryAPI, analyzeImage, getAIAdvice, compressImage, VoiceRecorder } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';

const SmartAdvisorPage = () => {
  const { user, farmerProfile, signOut } = useAuth();
  const router = useRouter();
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [queryText, setQueryText] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<CropAdvice[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [voiceRecorder] = useState(() => new VoiceRecorder());

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      setIsLoading(true);
      
      // Compress image before upload
      const compressedFile = await compressImage(file);
      
      const storageRef = ref(storage, `crop-images/${user?.uid}/${Date.now()}_${compressedFile.name}`);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setImageUrl(downloadURL);
      setImageFile(compressedFile);
      
      // Automatically analyze the image
      if (user) {
        await handleImageAnalysis(downloadURL);
      }
      
      toast.success('Image uploaded and analyzed successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  // Start/Stop voice recording
  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        await voiceRecorder.startRecording();
        setIsRecording(true);
        toast.success('Start speaking...');
      } catch (error) {
        console.error('Error starting recording:', error);
        toast.error('Failed to start recording');
      }
    } else {
      try {
        const audioBlob = await voiceRecorder.stopRecording();
        setIsRecording(false);
        toast.success('Recording complete');
        await processAudio(audioBlob);
      } catch (error) {
        console.error('Error stopping recording:', error);
        toast.error('Failed to process recording');
        setIsRecording(false);
      }
    }
  };

  // Process audio using the query API
  const processAudio = async (audioBlob: Blob) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Convert audio to base64
      const buffer = await audioBlob.arrayBuffer();
      const base64Audio = Buffer.from(buffer).toString('base64');
      
      // Use the query API to process audio
      const result = await queryAPI(user.uid, { audioData: base64Audio });
      setAdvice(result);
      
      // Extract transcribed text if available
      if (result[0]?.text) {
        setQueryText(result[0].text);
      }
      
      toast.success('Voice query processed successfully!');
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Failed to process voice input');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image analysis
  const handleImageAnalysis = async (imageUrl: string) => {
    if (!user) return;

    try {
      const result = await analyzeImage(imageUrl, user.uid, queryText || 'Analyze this crop image');
      setAdvice(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image');
    }
  };

  // Handle text query
  const handleTextQuery = async () => {
    if (!user || !queryText.trim()) return;

    try {
      setIsLoading(true);
      const result = await getAIAdvice(user.uid, queryText);
      setAdvice(result);
      toast.success('Query processed successfully!');
    } catch (error) {
      console.error('Error processing query:', error);
      toast.error('Failed to process query');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <ProtectedRoute requireProfile={true}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    KrishiSaarthi
                  </h1>
                  <p className="text-gray-600">Welcome, {farmerProfile?.fullName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <BarChart className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Get AI-Powered Farming Advice
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                />
                
                {imageUrl ? (
                  <div className="space-y-4">
                    <img
                      src={imageUrl}
                      alt="Uploaded crop"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Upload Different Image
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer"
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Upload Crop Image
                    </p>
                    <p className="text-gray-600">
                      Click to upload an image of your crop for disease diagnosis
                    </p>
                  </div>
                )}
              </div>

              {/* Voice Input */}
              <div className="border-2 border-gray-300 rounded-lg p-6 text-center">
                <div className="mb-4">
                  <button
                    onClick={toggleRecording}
                    disabled={isLoading}
                    className={`mx-auto p-4 rounded-full transition-colors ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isRecording ? (
                      <MicOff className="h-8 w-8" />
                    ) : (
                      <Mic className="h-8 w-8" />
                    )}
                  </button>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {isRecording ? 'Recording...' : 'Voice Query'}
                </p>
                <p className="text-gray-600">
                  {isRecording 
                    ? 'Speak your farming question and click to stop'
                    : 'Click to record your farming question'
                  }
                </p>
              </div>
            </div>

            {/* Text Input */}
            <div className="mt-6">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Or type your farming question here..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleTextQuery();
                    }
                  }}
                />
                <button
                  onClick={handleTextQuery}
                  disabled={isLoading || !queryText.trim()}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Ask</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {advice.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                AI Recommendations
              </h2>
              
              <div className="space-y-4">
                {advice.map((item, index) => (
                  <div
                    key={index}
                    className={`border-l-4 p-4 rounded-r-lg ${
                      item.priority === 'high' 
                        ? 'border-red-500 bg-red-50' 
                        : item.priority === 'medium'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-green-500 bg-green-50'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    
                    {/* Main advice text - only show if it's not an error message */}
                    {item.text && !item.text.toLowerCase().includes('unable to generate') ? (
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 mb-2">
                          {item.englishSummary || item.text}
                        </p>
                        <p className="text-sm text-gray-800 font-medium">
                          {item.text}
                        </p>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <p className="text-sm text-orange-700 mb-2">
                          Main advice generation is being processed, but here's what we can provide:
                        </p>
                      </div>
                    )}
                    
                    {/* Additional data sections */}
                    {(item as any).additionalData && (
                      <div className="mt-4 space-y-3">
                        {/* Water Schedule */}
                        {(item as any).additionalData.waterSchedule && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">💧 Irrigation Schedule</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                              {(item as any).additionalData.waterSchedule.map((schedule: string, idx: number) => (
                                <li key={idx} className="flex items-center">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                  {schedule}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Soil Moisture */}
                        {(item as any).additionalData.soilMoisture && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h4 className="font-medium text-green-900 mb-2">🌱 Soil Moisture Status</h4>
                            <p className="text-sm text-green-800">{(item as any).additionalData.soilMoisture}</p>
                          </div>
                        )}
                        
                        {/* Treatment recommendations */}
                        {(item as any).additionalData.treatment && (
                          <div className="bg-red-50 p-3 rounded-lg">
                            <h4 className="font-medium text-red-900 mb-2">🏥 Treatment Recommendations</h4>
                            <ul className="text-sm text-red-800 space-y-1">
                              {(item as any).additionalData.treatment.map((treatment: string, idx: number) => (
                                <li key={idx} className="flex items-center">
                                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                  {treatment}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Cost information */}
                        {(item as any).additionalData.cost && (
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <h4 className="font-medium text-yellow-900 mb-2">💰 Estimated Cost</h4>
                            <p className="text-sm text-yellow-800">{(item as any).additionalData.cost}</p>
                          </div>
                        )}
                        
                        {/* Market recommendation */}
                        {(item as any).additionalData.recommendation && (
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <h4 className="font-medium text-purple-900 mb-2">📈 Market Recommendation</h4>
                            <p className="text-sm text-purple-800 capitalize">
                              {(item as any).additionalData.recommendation}
                            </p>
                          </div>
                        )}
                        
                        {/* Price data */}
                        {(item as any).additionalData.priceData && (item as any).additionalData.priceData.length > 0 && (
                          <div className="bg-indigo-50 p-3 rounded-lg">
                            <h4 className="font-medium text-indigo-900 mb-2">💹 Price Information</h4>
                            <div className="text-sm text-indigo-800">
                              {(item as any).additionalData.priceData.map((price: any, idx: number) => (
                                <div key={idx} className="mb-1">
                                  {price.crop}: ₹{price.currentPrice}/quintal
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Eligible schemes */}
                        {(item as any).additionalData.eligibleSchemes && (item as any).additionalData.eligibleSchemes.length > 0 && (
                          <div className="bg-teal-50 p-3 rounded-lg">
                            <h4 className="font-medium text-teal-900 mb-2">🏛️ Eligible Schemes</h4>
                            <div className="text-sm text-teal-800 space-y-1">
                              {(item as any).additionalData.eligibleSchemes.map((scheme: any, idx: number) => (
                                <div key={idx} className="border-l-2 border-teal-300 pl-2">
                                  <div className="font-medium">{scheme.name}</div>
                                  <div className="text-xs">{scheme.description}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Contextual recommendations */}
                    {(item as any).contextualRecommendations && (
                      <div className="mt-4 space-y-3">
                        {(item as any).contextualRecommendations.weatherAlerts && (item as any).contextualRecommendations.weatherAlerts.length > 0 && (
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <h4 className="font-medium text-orange-900 mb-2">🌤️ Weather Alerts</h4>
                            <ul className="text-sm text-orange-800 space-y-1">
                              {(item as any).contextualRecommendations.weatherAlerts.map((alert: string, idx: number) => (
                                <li key={idx} className="flex items-start">
                                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                  {alert}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {(item as any).contextualRecommendations.cropCare && (item as any).contextualRecommendations.cropCare.length > 0 && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h4 className="font-medium text-green-900 mb-2">🌾 Crop Care Tips</h4>
                            <ul className="text-sm text-green-800 space-y-1">
                              {(item as any).contextualRecommendations.cropCare.map((tip: string, idx: number) => (
                                <li key={idx} className="flex items-start">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {(item as any).contextualRecommendations.marketTips && (item as any).contextualRecommendations.marketTips.length > 0 && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">💰 Market Tips</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                              {(item as any).contextualRecommendations.marketTips.map((tip: string, idx: number) => (
                                <li key={idx} className="flex items-start">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {(item as any).contextualRecommendations.schemes && (item as any).contextualRecommendations.schemes.length > 0 && (
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <h4 className="font-medium text-purple-900 mb-2">🏛️ Government Schemes</h4>
                            <ul className="text-sm text-purple-800 space-y-1">
                              {(item as any).contextualRecommendations.schemes.map((scheme: string, idx: number) => (
                                <li key={idx} className="flex items-start">
                                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                  {scheme}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Audio URL */}
                    {item.audioUrl && (
                      <div className="mt-4">
                        <audio controls className="w-full">
                          <source src={item.audioUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && advice.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing your query...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && advice.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-gray-400 text-4xl mb-4">🤖</div>
              <p className="text-gray-600">
                Upload an image or record your query to get personalized farming advice
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SmartAdvisorPage;
