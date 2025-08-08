"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('NEW DASHBOARD: Starting MongoDB auth check...');
      const response = await fetch('/api/admin/verify');
      const data = await response.json();

      console.log('NEW DASHBOARD: Auth response status:', response.status);
      console.log('NEW DASHBOARD: Auth data received:', data);

      if (data.authenticated) {
        console.log('NEW DASHBOARD: MongoDB auth successful!');
        setIsAuthenticated(true);
        setUser(data.user || { username: 'admin' });
      } else {
        console.log('NEW DASHBOARD: MongoDB auth failed, redirecting...');
        router.push('/admin');
      }
    } catch (error) {
      console.error('NEW DASHBOARD: Auth check failed:', error);
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('NEW DASHBOARD: Logging out...');
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin');
    } catch (error) {
      console.error('NEW DASHBOARD: Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-light text-white">🎉 MongoDB Admin Dashboard</h1>
              <p className="text-gray-300">Welcome back, {user?.name || user?.username || 'Admin'} - MongoDB Atlas Connected!</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500/20 text-red-200 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Success Message */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-green-500/20 border border-green-500/30 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🎉</div>
            <div>
              <h3 className="text-lg font-medium text-green-200">MongoDB Authentication Successful!</h3>
              <p className="text-green-300">Your admin console is now using MongoDB Atlas for authentication and data storage.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-medium text-white mb-4">📝 Blog Management</h3>
            <p className="text-gray-300 mb-4">Create and manage blog posts</p>
            <a
              href="/admin/blog"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 inline-block"
            >
              Manage Blogs
            </a>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-medium text-white mb-4">⚡ Skills Management</h3>
            <p className="text-gray-300 mb-4">Update your technical skills</p>
            <a
              href="/admin/skills"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 inline-block"
            >
              Manage Skills
            </a>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-medium text-white mb-4">🏠 View Portfolio</h3>
            <p className="text-gray-300 mb-4">See your live portfolio</p>
            <a
              href="/"
              target="_blank"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 inline-block"
            >
              View Site
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
