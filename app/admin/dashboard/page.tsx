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
      const response = await fetch('/api/admin/verify');
      const data = await response.json();
      
      if (data.authenticated) {
        setIsAuthenticated(true);
      } else {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
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
    return null;
  }

  const menuItems = [
    {
      title: 'Projects',
      description: 'Manage portfolio projects',
      href: '/admin/projects',
      icon: '🚀',
      color: 'from-blue-600 to-purple-600'
    },
    {
      title: 'Experience',
      description: 'Edit work experience',
      href: '/admin/experience',
      icon: '💼',
      color: 'from-green-600 to-blue-600'
    },
    {
      title: 'About',
      description: 'Update personal information',
      href: '/admin/about',
      icon: '👤',
      color: 'from-purple-600 to-pink-600'
    },
    {
      title: 'Skills',
      description: 'Manage technical skills',
      href: '/admin/skills',
      icon: '⚡',
      color: 'from-orange-600 to-red-600'
    },
    {
      title: 'Contact',
      description: 'Update contact information',
      href: '/admin/contact',
      icon: '📧',
      color: 'from-teal-600 to-green-600'
    },
    {
      title: 'Blog',
      description: 'Manage blog posts and content',
      href: '/admin/blog',
      icon: '📝',
      color: 'from-indigo-600 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-light text-white">Portfolio Admin</h1>
              <p className="text-gray-300">Content Management Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 text-red-200 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-white mb-4">Dashboard</h2>
          <p className="text-gray-300">Manage your portfolio content from here</p>
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group block"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-4 text-2xl`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-medium text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
                <div className="mt-4 flex items-center text-purple-300 text-sm">
                  <span>Manage</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-medium text-white mb-2">Portfolio Status</h3>
            <p className="text-green-300">✅ Live and Active</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-medium text-white mb-2">Last Updated</h3>
            <p className="text-gray-300">Today</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-medium text-white mb-2">Content Sections</h3>
            <p className="text-blue-300">5 Sections Available</p>
          </div>
        </div>
      </main>
    </div>
  );
}
