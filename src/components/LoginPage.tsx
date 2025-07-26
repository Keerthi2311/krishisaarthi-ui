'use client';

import { useState } from 'react';
import { ConfirmationResult } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';
import { Phone, Mail } from 'lucide-react';
import Image from 'next/image';

const LoginPage = () => {
  const { signInWithGoogle, signInWithPhone, verifyOTP } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOTP] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    if (!phoneNumber.trim()) return;
    
    setLoading(true);
    try {
      const confirmation = await signInWithPhone(phoneNumber);
      setConfirmationResult(confirmation);
      setStep('otp');
    } catch (error) {
      console.error('Phone sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!confirmationResult || !otp.trim()) return;
    
    setLoading(true);
    try {
      await verifyOTP(confirmationResult, otp);
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <Image
              src="/farmer-icon.svg"
              alt="Farmer Icon"
              width={40}
              height={40}
              className="text-white"
              onError={(e) => {
                // Fallback if image doesn't exist
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-white text-2xl font-bold">🌾</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-kannada">
            ನಮ್ಮ ಕೃಷಿಸಾಥಿಗೆ ಸ್ವಾಗತ!
          </h2>
          <p className="text-base text-gray-600">
            Google AI-powered agriculture assistant for Kannada farmers
          </p>
        </div>

        {/* Lottie Animation Placeholder */}
        <div className="flex justify-center">
          <div className="w-72 h-48 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
            <div className="text-6xl">🧑‍🌾</div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {step === 'phone' ? (
            <>
              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="w-5 h-5 mr-3 text-red-500" />
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              {/* Phone Number Input */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 9876543210"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePhoneSignIn}
                  disabled={loading || !phoneNumber.trim()}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* OTP Verification */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Verify Your Phone Number
                </h3>
                <p className="text-sm text-gray-600">
                  Enter the 6-digit code sent to {phoneNumber}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOTP(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg tracking-widest focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <button
                  onClick={handleOTPVerification}
                  disabled={loading || otp.length !== 6}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Verify & Continue'
                  )}
                </button>

                <button
                  onClick={() => {
                    setStep('phone');
                    setOTP('');
                    setConfirmationResult(null);
                  }}
                  className="w-full text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Back to phone number
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
