'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { KARNATAKA_DISTRICTS, COMMON_CROPS, KarnatakaDistrict } from '@/types';
import { User, MapPin, Droplets, Calendar, Wheat, Ruler, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const FarmerSetupPage = () => {
  const { user, updateFarmerProfile, loading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: '',
    district: '' as KarnatakaDistrict | '',
    soilType: '' as 'Red' | 'Black' | 'Loamy' | 'Laterite' | 'Sandy' | '',
    farmingExperience: '',
    cropsGrown: [] as string[],
    landSize: '',
    landUnit: 'acres' as 'acres' | 'hectares',
    irrigationType: '' as 'Borewell' | 'Canal' | 'Rain-fed' | 'Drip' | '',
    phoneNumber: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.district) {
      newErrors.district = 'Please select your district';
    }
    if (!formData.soilType) {
      newErrors.soilType = 'Please select your soil type';
    }
    if (!formData.farmingExperience.trim()) {
      newErrors.farmingExperience = 'Farming experience is required';
    }
    if (formData.cropsGrown.length === 0) {
      newErrors.cropsGrown = 'Please select at least one crop';
    }
    if (!formData.landSize.trim()) {
      newErrors.landSize = 'Land size is required';
    }
    if (!formData.irrigationType) {
      newErrors.irrigationType = 'Please select irrigation type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCropToggle = (crop: string) => {
    setFormData(prev => ({
      ...prev,
      cropsGrown: prev.cropsGrown.includes(crop)
        ? prev.cropsGrown.filter(c => c !== crop)
        : [...prev.cropsGrown, crop]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Submitting form with data:', formData);
    e.preventDefault();
    
    if (!formData.fullName || !formData.district || !formData.soilType || 
        !formData.farmingExperience || !formData.landSize || !formData.irrigationType ||
        formData.cropsGrown.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await updateFarmerProfile({
        fullName: formData.fullName,
        district: formData.district as KarnatakaDistrict,
        soilType: formData.soilType as 'Red' | 'Black' | 'Loamy' | 'Laterite' | 'Sandy',
        farmingExperience: parseInt(formData.farmingExperience),
        cropsGrown: formData.cropsGrown,
        landSize: parseFloat(formData.landSize),
        landUnit: formData.landUnit,
        irrigationType: formData.irrigationType as 'Borewell' | 'Canal' | 'Rain-fed' | 'Drip',
        phoneNumber: formData.phoneNumber || undefined,
      });
      
      toast.success('Profile setup completed successfully!');
      router.push('/home');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Farmer Profile Setup
          </h1>
          <p className="text-gray-600">
            Help us understand your farming needs better
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="md:col-span-1">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* District */}
            <div className="md:col-span-1">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                District *
              </label>
              <select
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select District</option>
                {KARNATAKA_DISTRICTS.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {/* Soil Type */}
            <div className="md:col-span-1">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Droplets className="w-4 h-4 mr-2" />
                Soil Type *
              </label>
              <select
                value={formData.soilType}
                onChange={(e) => handleInputChange('soilType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select Soil Type</option>
                <option value="Red">Red Soil</option>
                <option value="Black">Black Soil</option>
                <option value="Loamy">Loamy Soil</option>
                <option value="Laterite">Laterite Soil</option>
                <option value="Sandy">Sandy Soil</option>
              </select>
            </div>

            {/* Farming Experience */}
            <div className="md:col-span-1">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Farming Experience (Years) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.farmingExperience}
                onChange={(e) => handleInputChange('farmingExperience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter years of experience"
                required
              />
            </div>

            {/* Land Size */}
            <div className="md:col-span-1">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Ruler className="w-4 h-4 mr-2" />
                Land Size *
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.landSize}
                  onChange={(e) => handleInputChange('landSize', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter land size"
                  required
                />
                <select
                  value={formData.landUnit}
                  onChange={(e) => handleInputChange('landUnit', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                </select>
              </div>
            </div>

            {/* Irrigation Type */}
            <div className="md:col-span-1">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Droplets className="w-4 h-4 mr-2" />
                Irrigation Type *
              </label>
              <select
                value={formData.irrigationType}
                onChange={(e) => handleInputChange('irrigationType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select Irrigation Type</option>
                <option value="Borewell">Borewell</option>
                <option value="Canal">Canal</option>
                <option value="Rain-fed">Rain-fed</option>
                <option value="Drip">Drip Irrigation</option>
              </select>
            </div>

            {/* Phone Number */}
            <div className="md:col-span-1">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 mr-2" />
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="+91 9876543210"
              />
            </div>

            {/* Crops Grown */}
            <div className="md:col-span-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-4">
                <Wheat className="w-4 h-4 mr-2" />
                Crops Grown *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {COMMON_CROPS.map(crop => (
                  <label
                    key={crop}
                    className={`flex items-center space-x-2 p-2 rounded-md border cursor-pointer transition-colors ${
                      formData.cropsGrown.includes(crop)
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.cropsGrown.includes(crop)}
                      onChange={() => handleCropToggle(crop)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">{crop}</span>
                  </label>
                ))}
              </div>
              {formData.cropsGrown.length === 0 && (
                <p className="text-red-500 text-sm mt-2">Please select at least one crop</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Complete Setup</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerSetupPage;
