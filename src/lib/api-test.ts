// API Integration Test Utility
// This file demonstrates the integration with the Krishisaarthi Agents API

import { 
  checkApiHealth, 
  queryAI, 
  getDailyRecommendations,
  createOrUpdateUser 
} from '@/lib/api';

// Test API Health Check
export const testApiHealth = async () => {
  console.log('🔍 Testing API Health...');
  try {
    const health = await checkApiHealth();
    console.log('✅ API Health Check Result:', health);
    return health;
  } catch (error) {
    console.error('❌ API Health Check Failed:', error);
    throw error;
  }
};

// Test AI Query Function
export const testAIQuery = async () => {
  console.log('🤖 Testing AI Query...');
  const testUserId = 'test-user-123';
  const testDistrict = 'Bengaluru Urban';
  const testQuery = 'What should I do if my tomato plants have yellow leaves?';
  
  try {
    const advice = await queryAI(testQuery, undefined, testUserId, testDistrict);
    console.log('✅ AI Query Result:', advice);
    return advice;
  } catch (error) {
    console.error('❌ AI Query Failed:', error);
    throw error;
  }
};

// Test Daily Recommendations
export const testDailyRecommendations = async () => {
  console.log('📊 Testing Daily Recommendations...');
  const testUserId = 'test-user-123';
  
  try {
    const recommendations = await getDailyRecommendations(testUserId);
    console.log('✅ Daily Recommendations Result:', recommendations);
    return recommendations;
  } catch (error) {
    console.error('❌ Daily Recommendations Failed:', error);
    throw error;
  }
};

// Test User Profile Creation
export const testUserProfileCreation = async () => {
  console.log('👤 Testing User Profile Creation...');
  const testUserId = 'test-user-123';
  const testProfile = {
    fullName: 'Test Farmer',
    district: 'Bengaluru Urban' as const,
    soilType: 'Red' as const,
    farmingExperience: 10,
    cropsGrown: ['Rice (Paddy)', 'Tomato', 'Onion'],
    landSize: 2.5,
    landUnit: 'acres' as const,
    irrigationType: 'Borewell' as const,
    phoneNumber: '+919876543210'
  };
  
  try {
    const result = await createOrUpdateUser(testUserId, testProfile);
    console.log('✅ User Profile Creation Result:', result);
    return result;
  } catch (error) {
    console.error('❌ User Profile Creation Failed:', error);
    throw error;
  }
};

// Run All Tests
export const runAllApiTests = async () => {
  console.log('🚀 Starting API Integration Tests...\n');
  
  const results = {
    health: null as unknown,
    aiQuery: null as unknown,
    dailyRecommendations: null as unknown,
    userProfile: null as unknown,
    errors: [] as string[]
  };
  
  // Test 1: API Health
  try {
    results.health = await testApiHealth();
  } catch (error) {
    results.errors.push(`Health Check: ${error.message}`);
  }
  
  console.log('\n');
  
  // Test 2: User Profile (create user first)
  try {
    results.userProfile = await testUserProfileCreation();
  } catch (error) {
    results.errors.push(`User Profile: ${error.message}`);
  }
  
  console.log('\n');
  
  // Test 3: AI Query
  try {
    results.aiQuery = await testAIQuery();
  } catch (error) {
    results.errors.push(`AI Query: ${error.message}`);
  }
  
  console.log('\n');
  
  // Test 4: Daily Recommendations
  try {
    results.dailyRecommendations = await testDailyRecommendations();
  } catch (error) {
    results.errors.push(`Daily Recommendations: ${error.message}`);
  }
  
  console.log('\n📋 Test Summary:');
  console.log(`✅ Successful tests: ${4 - results.errors.length}/4`);
  console.log(`❌ Failed tests: ${results.errors.length}/4`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
  
  return results;
};

// Browser-compatible test runner (for client-side testing)
export const runBrowserApiTests = async () => {
  if (typeof window === 'undefined') {
    console.log('This function is for browser testing only');
    return;
  }
  
  console.log('🌐 Running API tests in browser...');
  
  // Add to window for easy access in dev tools
  (window as Record<string, unknown>).apiTests = {
    testApiHealth,
    testAIQuery,
    testDailyRecommendations,
    testUserProfileCreation,
    runAllApiTests
  };
  
  console.log('💡 API tests are now available in browser console:');
  console.log('- window.apiTests.testApiHealth()');
  console.log('- window.apiTests.testAIQuery()');
  console.log('- window.apiTests.testDailyRecommendations()');
  console.log('- window.apiTests.testUserProfileCreation()');
  console.log('- window.apiTests.runAllApiTests()');
  
  return runAllApiTests();
};