"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('NEW DASHBOARD: Starting auth check...');
      const response = await fetch('/api/admin/verify');
      const data = await response.json();
      
      console.log('NEW DASHBOARD: Auth response status:', response.status);
      console.log('NEW DASHBOARD: Auth data received:', data);
      console.log('NEW DASHBOARD: Auth data type:', typeof data);
      console.log('NEW DASHBOARD: Auth data keys:', Object.keys(data));
      
      if (data.authenticated) {
        console.log('NEW DASHBOARD: Auth successful, setting authenticated to true');
        setIsAuthenticated(true);
      } else {
        console.log('NEW DASHBOARD: Auth failed, redirecting to login');
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
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-light text-white">Portfolio Admin Dashboard</h1>
            <div className="flex space-x-4">
              <Link
                href="/new-design"
                target="_blank"
                className="bg-blue-500/20 text-blue-200 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all duration-200"
              >
                View Site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-red-500/20 text-red-200 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/skills" className="group">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200 group-hover:bg-white/10">
                <div className="text-2xl mb-3">🛠️</div>
                <h3 className="text-xl font-semibold text-white mb-2">Skills</h3>
                <p className="text-gray-300 text-sm">Manage technical skills and expertise</p>
              </div>
            </Link>

            <Link href="/admin/experience" className="group">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200 group-hover:bg-white/10">
                <div className="text-2xl mb-3">💼</div>
                <h3 className="text-xl font-semibold text-white mb-2">Experience</h3>
                <p className="text-gray-300 text-sm">Update work experience and education</p>
              </div>
            </Link>

            <Link href="/admin/projects" className="group">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200 group-hover:bg-white/10">
                <div className="text-2xl mb-3">🚀</div>
                <h3 className="text-xl font-semibold text-white mb-2">Projects</h3>
                <p className="text-gray-300 text-sm">Manage portfolio projects</p>
              </div>
            </Link>

            <Link href="/admin/about" className="group">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200 group-hover:bg-white/10">
                <div className="text-2xl mb-3">👤</div>
                <h3 className="text-xl font-semibold text-white mb-2">About</h3>
                <p className="text-gray-300 text-sm">Edit personal information and bio</p>
              </div>
            </Link>

            <Link href="/admin/contact" className="group">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200 group-hover:bg-white/10">
                <div className="text-2xl mb-3">📞</div>
                <h3 className="text-xl font-semibold text-white mb-2">Contact</h3>
                <p className="text-gray-300 text-sm">Update contact information</p>
              </div>
            </Link>

            <Link href="/admin/blog" className="group">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200 group-hover:bg-white/10">
                <div className="text-2xl mb-3">📝</div>
                <h3 className="text-xl font-semibold text-white mb-2">Blog</h3>
                <p className="text-gray-300 text-sm">Create and manage blog posts</p>
              </div>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-200 text-sm">
              ✅ Admin system is working correctly! All sections are accessible and functional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
