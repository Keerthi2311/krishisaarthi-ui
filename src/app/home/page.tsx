'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Send } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { CropAdvice } from '@/types';
import { 
  ProtectedRoute, 
  PageLayout, 
  Button, 
  ImageUpload, 
  VoiceInput, 
  AdviceResults 
} from '@/components';
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
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      setIsLoading(true);
      const storageRef = ref(storage, `crop-images/${user?.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setImageUrl(downloadURL);
      setImageFile(file);
      toast.success('Image uploaded successfully!');
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
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          await processAudio(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        toast.success('Recording started');
      } catch (error) {
        console.error('Error starting recording:', error);
        toast.error('Failed to start recording');
      }
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        toast.success('Recording stopped');
      }
    }
  };

  // Process audio (mock implementation - would use Google Speech-to-Text in real app)
  const processAudio = async (_audioBlob: Blob) => {
    try {
      setIsLoading(true);
      // Mock transcription - in real app, send to Google Speech-to-Text API
      const mockTranscript = "ನನ್ನ ಸಸ್ಯದಲ್ಲಿ ಹಳದಿ ಎಲೆಗಳು ಕಾಣಿಸುತ್ತಿವೆ";
      setQueryText(mockTranscript);
      toast.success('Voice transcribed successfully!');
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Failed to process voice');
    } finally {
      setIsLoading(false);
    }
  };

  // Get farming advice (mock implementation)
  const getSmartAdvice = async () => {
    if (!imageUrl && !queryText.trim()) {
      toast.error('Please upload an image or provide a voice query');
      return;
    }

    try {
      setIsLoading(true);
      
      // Mock API call - in real app, call Firebase Cloud Function
      const mockAdvice: CropAdvice[] = [
        {
          category: 'disease',
          title: 'Disease Diagnosis',
          englishSummary: 'Your crop shows signs of nutrient deficiency. Apply nitrogen-rich fertilizer.',
          kannadaText: 'ನಿಮ್ಮ ಬೆಳೆಯಲ್ಲಿ ಪೋಷಕಾಂಶಗಳ ಕೊರತೆ ಕಾಣಿಸುತ್ತಿದೆ. ಸಾರಜನಕ ಭರಿತ ಗೊಬ್ಬರವನ್ನು ಅನ್ವಯಿಸಿ.',
          priority: 'high',
          timestamp: new Date(),
        },
        {
          category: 'weather',
          title: 'Weather & Irrigation',
          englishSummary: 'Light rain expected tomorrow. Reduce watering and ensure proper drainage.',
          kannadaText: 'ನಾಳೆ ಸಲ್ಪ ಮಳೆ ನಿರೀಕ್ಷೆ. ನೀರುಹಾಕುವುದನ್ನು ಕಡಿಮೆ ಮಾಡಿ ಮತ್ತು ಸರಿಯಾದ ಒಳಚರಂಡಿ ಖಚಿತಪಡಿಸಿ.',
          priority: 'medium',
          timestamp: new Date(),
        },
        {
          category: 'market',
          title: 'Market Tips',
          englishSummary: 'Tomato prices are expected to rise next week. Consider harvesting soon.',
          kannadaText: 'ಮುಂದಿನ ವಾರ ಟೊಮೇಟೊ ಬೆಲೆಗಳು ಏರಿಕೆಯಾಗುವ ನಿರೀಕ್ಷೆ. ಬೇಗ ಕೊಯ್ಲು ಮಾಡುವುದನ್ನು ಪರಿಗಣಿಸಿ.',
          priority: 'medium',
          timestamp: new Date(),
        },
        {
          category: 'scheme',
          title: 'Scheme Suggestions',
          englishSummary: 'You are eligible for PM-KISAN scheme. Apply for ₹6000 annual benefit.',
          kannadaText: 'ನೀವು PM-KISAN ಯೋಜನೆಗೆ ಅರ್ಹರಾಗಿದ್ದೀರಿ. ವಾರ್ಷಿಕ ₹೬೦೦೦ ಪ್ರಯೋಜನಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.',
          priority: 'low',
          timestamp: new Date(),
        },
      ];

      setAdvice(mockAdvice);
      toast.success('Advice generated successfully!');
    } catch (error) {
      console.error('Error getting advice:', error);
      toast.error('Failed to get farming advice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome, {farmerProfile?.fullName}
                </h1>
                <p className="text-gray-600">
                  {farmerProfile?.district} • {farmerProfile?.landSize} {farmerProfile?.landUnit}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">📱 Ask AI Assistant</h3>
              <p className="text-blue-100 text-sm">Upload crop photos or record voice questions in Kannada</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">🌤️ Weather Updates</h3>
              <p className="text-green-100 text-sm">Get 7-day weather forecasts for {farmerProfile?.district}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">💰 Market Prices</h3>
              <p className="text-purple-100 text-sm">Track prices for your crops and get sell recommendations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Sections */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Upload Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-blue-600" />
                  Upload Crop Image
                </h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imageFile ? (
                    <div className="space-y-4">
                      <Image
                        src={URL.createObjectURL(imageFile)}
                        alt="Uploaded crop"
                        width={300}
                        height={200}
                        className="mx-auto max-h-48 rounded-lg object-contain"
                      />
                      <p className="text-sm text-gray-600">{imageFile.name}</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Choose Image
                        </button>
                        <p className="text-sm text-gray-500 mt-2">
                          Upload a clear photo of your crop or affected area
                        </p>
                      </div>
                    </div>
                  )}
                  
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
                </div>
              </div>

              {/* Voice Input Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Mic className="w-5 h-5 mr-2 text-green-600" />
                  Speak Your Query (Kannada)
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <button
                      onClick={toggleRecording}
                      disabled={isLoading}
                      className={`p-4 rounded-full ${
                        isRecording 
                          ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white disabled:opacity-50`}
                    >
                      {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </button>
                  </div>
                  
                  <p className="text-center text-sm text-gray-600">
                    {isRecording ? 'Recording... Click to stop' : 'Click to start recording your query'}
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or type your query:
                    </label>
                    <textarea
                      value={queryText}
                      onChange={(e) => setQueryText(e.target.value)}
                      placeholder="Describe your farming question in Kannada..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  onClick={getSmartAdvice}
                  disabled={isLoading || (!imageUrl && !queryText.trim())}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Getting Advice...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Get Farming Advice</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  AI Recommendations
                </h2>
                
                {advice.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-lg mb-2">🤖</div>
                    <p className="text-gray-600">
                      Upload an image or record your query to get personalized farming advice
                    </p>
                  </div>
                ) : (
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
                        <p className="text-sm text-gray-700 mb-2">
                          {item.englishSummary}
                        </p>
                        <p className="text-sm text-gray-800 font-medium mb-3 font-kannada">
                          {item.kannadaText}
                        </p>
                        
                        {item.audioUrl && (
                          <audio controls className="w-full">
                            <source src={item.audioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Quick Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">📷 Better Photos</h4>
                <p className="text-sm text-gray-600">Take clear, well-lit photos of affected plant parts for accurate diagnosis.</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">🎤 Voice Commands</h4>
                <p className="text-sm text-gray-600 font-kannada">ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ - ನಮ್ಮ AI ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತದೆ!</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">📊 Dashboard</h4>
                <p className="text-sm text-gray-600">Check weather, market prices, and government schemes daily.</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">🚀 Best Time</h4>
                <p className="text-sm text-gray-600">Upload photos in good lighting (morning or late afternoon).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SmartAdvisorPage;
