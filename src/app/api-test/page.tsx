'use client';

import { useState } from 'react';
import { runBrowserApiTests, testApiHealth, testAIQuery } from '@/lib/api-test';

const ApiTestPage = () => {
  const [testResults, setTestResults] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const runHealthTest = async () => {
    setLoading(true);
    setTestResults('Running API health check...\n');
    
    try {
      const result = await testApiHealth();
      setTestResults(prev => prev + '\n✅ Health Check Success:\n' + JSON.stringify(result, null, 2));
    } catch (error) {
      setTestResults(prev => prev + '\n❌ Health Check Failed:\n' + (error as Error).message);
    }
    
    setLoading(false);
  };

  const runAITest = async () => {
    setLoading(true);
    setTestResults('Running AI query test...\n');
    
    try {
      const result = await testAIQuery();
      setTestResults(prev => prev + '\n✅ AI Query Success:\n' + JSON.stringify(result, null, 2));
    } catch (error) {
      setTestResults(prev => prev + '\n❌ AI Query Failed:\n' + (error as Error).message);
    }
    
    setLoading(false);
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults('Running all API integration tests...\n\n');
    
    try {
      const results = await runBrowserApiTests();
      setTestResults(prev => prev + '\n✅ All Tests Completed:\n' + JSON.stringify(results, null, 2));
    } catch (error) {
      setTestResults(prev => prev + '\n❌ Tests Failed:\n' + (error as Error).message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            API Integration Test Page
          </h1>
          
          <p className="text-gray-600 mb-6">
            This page demonstrates the integration with the Krishisaarthi Agents API.
            Test various endpoints to verify the integration is working correctly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={runHealthTest}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Test API Health
            </button>
            
            <button
              onClick={runAITest}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Test AI Query
            </button>
            
            <button
              onClick={runAllTests}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Run All Tests
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-gray-600">Running tests...</span>
            </div>
          )}

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
            <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {testResults || 'Click a test button to see results...'}
            </pre>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              API Integration Summary
            </h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>✅ API service functions created for all endpoints</li>
              <li>✅ TypeScript interfaces defined for request/response types</li>
              <li>✅ Error handling and loading states implemented</li>
              <li>✅ User profile sync between Firebase and agents API</li>
              <li>✅ Real API integration in home page and dashboard</li>
              <li>✅ Fallback to mock data when API is unavailable</li>
            </ul>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p><strong>API Base URL:</strong> https://us-central1-krishisaarathi.cloudfunctions.net/api</p>
            <p><strong>Available Endpoints:</strong> /health, /query, /users, /users/:uid, /recommendations/:uid</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;