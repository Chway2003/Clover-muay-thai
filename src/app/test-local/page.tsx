'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function TestLocalPage() {
  const { user, isLoading, login, logout } = useAuth();
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testLocalAuth = async () => {
    setLoading(true);
    try {
      // Test login
      await login('admin@clovermuaythai.com', 'password');
    } catch (error) {
      console.error('Login test failed:', error);
    }
    setLoading(false);
  };

  const testAdminAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/classes');
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      console.error('Admin API test failed:', error);
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
    setLoading(false);
  };

  const testDebugAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug-production');
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      console.error('Debug API test failed:', error);
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
    setLoading(false);
  };

  const createTestBooking = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/create-test-booking', {
        method: 'POST'
      });
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      console.error('Create test booking failed:', error);
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Local Development Test Page</h1>
        
        {/* Auth Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>User:</strong> {user ? `${user.name} (${user.email})` : 'Not logged in'}</p>
          <p><strong>Is Admin:</strong> {user?.isAdmin ? 'Yes' : 'No'}</p>
          
          <div className="mt-4 space-x-4">
            <button
              onClick={testLocalAuth}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Test Login
            </button>
            <button
              onClick={logout}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* API Tests */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Tests</h2>
          
          <div className="space-y-4">
            <button
              onClick={testAdminAPI}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 mr-4"
            >
              Test Admin API
            </button>
            <button
              onClick={testDebugAPI}
              disabled={loading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 mr-4"
            >
              Test Debug API
            </button>
            <button
              onClick={createTestBooking}
              disabled={loading}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              Create Test Booking
            </button>
          </div>
        </div>

        {/* Results */}
        {testResults && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Test Login" to test local authentication</li>
            <li>Click "Test Admin API" to test if admin endpoints work</li>
            <li>Click "Test Debug API" to see data storage status</li>
            <li>Click "Create Test Booking" to add test data</li>
            <li>Check the results below to see what's working</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
