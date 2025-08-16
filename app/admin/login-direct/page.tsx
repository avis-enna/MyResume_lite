'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DirectAdminLogin() {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('$iva@V3nna21');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const clearCookies = async () => {
    try {
      await fetch('/api/admin/clear-cookies', { method: 'POST' });
      console.log('Cookies cleared');
    } catch (error) {
      console.error('Failed to clear cookies:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First clear any corrupted cookies
      await clearCookies();

      // Then attempt login
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        // Force a hard redirect to avoid any client-side auth loops
        window.location.href = '/admin/dashboard';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Direct Admin Login
        </h1>
        
        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700/50 rounded">
          <p className="text-blue-300 text-sm">
            This is a direct login page that bypasses authentication loops.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-700/50 rounded">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 space-y-2">
          <button
            onClick={clearCookies}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 text-sm"
          >
            Clear Corrupted Cookies
          </button>
          
          <a
            href="/admin"
            className="block text-center text-blue-400 hover:text-blue-300 text-sm"
          >
            Back to Regular Login
          </a>
        </div>
      </div>
    </div>
  );
}
