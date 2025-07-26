'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface SetupCompleteProps {
  farmerName: string;
  onContinue: () => void;
}

const SetupComplete = ({ farmerName, onContinue }: SetupCompleteProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md w-full text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Profile Setup Complete! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Welcome aboard, <span className="font-semibold text-green-600">{farmerName}</span>! 
            Your farming profile has been successfully created.
          </p>
          
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-green-800 font-medium text-lg">
              ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!
            </p>
            <p className="text-green-700 text-sm mt-2">
              Now you can access personalized farming advice, weather updates, and market insights.
            </p>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Get AI-powered crop advice</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Receive weather forecasts</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Track market prices</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Discover government schemes</span>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="w-full mt-6 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            <span>Start Your Farming Journey</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Need help? Contact our support team anytime.
        </p>
      </div>
    </div>
  );
};

export default SetupComplete;
