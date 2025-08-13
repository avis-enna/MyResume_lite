'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (_err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #444',
          borderRadius: '8px',
          padding: '40px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '10px'
            }}>
              Portfolio Admin
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#cccccc'
            }}>
              Sign in to manage your portfolio content
            </p>
          </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-light text-amber-200/80 mb-3 tracking-[0.1em] uppercase">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50 transition-colors font-light"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-light text-amber-200/80 mb-3 tracking-[0.1em] uppercase">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50 transition-colors font-light"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-950/20 border border-red-800/30 rounded p-4">
              <p className="text-red-400/80 text-sm font-light italic">{error}</p>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => {
                setFormData({ email: 'admin@admin.com', password: 'admin@admin.com' });
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              Fill Demo Credentials
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Please wait...' : 'Sign In'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{
              fontSize: '14px',
              color: '#888',
              backgroundColor: '#333',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #555'
            }}>
              <strong>Demo Credentials:</strong><br/>
              Username: admin@admin.com<br/>
              Password: admin@admin.com
            </p>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
