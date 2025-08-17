'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MetricsSummary {
  totalOperations: number;
  operationStats: Array<{ _id: string; count: number }>;
  sectionStats: Array<{ _id: string; count: number }>;
  dailyStats: Array<{ _id: { year: number; month: number; day: number }; count: number }>;
  recentActivity: Array<{
    operation: string;
    section: string;
    details: string;
    timestamp: string;
    recordId?: string;
  }>;
  period: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/session-check');
      const data = await response.json().catch(() => ({}));
      if (response.ok && data?.authenticated) {
        setUser(data.user ?? null);
      } else {
        router.push('/admin');
      }
    } catch (_err) {
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const loadMetrics = useCallback(async () => {
    try {
      setMetricsLoading(true);
      console.log('Loading metrics...');
      const response = await fetch('/api/admin/metrics?type=summary&days=7');
      console.log('Metrics response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Metrics data:', data);
        setMetrics(data);
      } else {
        console.error('Failed to load metrics:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!loading) {
      loadMetrics();
    }
  }, [loading, loadMetrics]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="dashboard-root">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-700">
                View Site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
            <p className="text-gray-600">Manage your portfolio content from here.</p>
          </div>

          {/* Metrics Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Metrics (Last 7 Days)</h3>
            {metricsLoading ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ) : metrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total Operations */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">📊</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Operations</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.totalOperations}</p>
                    </div>
                  </div>
                </div>

                {/* Most Active Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">🎯</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Most Active</p>
                      <p className="text-lg font-bold text-gray-900 capitalize">
                        {metrics.sectionStats[0]?._id || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {metrics.sectionStats[0]?.count || 0} operations
                      </p>
                    </div>
                  </div>
                </div>

                {/* Most Common Operation */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">⚡</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Top Operation</p>
                      <p className="text-lg font-bold text-gray-900">
                        {metrics.operationStats[0]?._id || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {metrics.operationStats[0]?.count || 0} times
                      </p>
                    </div>
                  </div>
                </div>

                {/* Data Retention */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">🗂️</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Data Retention</p>
                      <p className="text-lg font-bold text-gray-900">7 Days</p>
                      <p className="text-sm text-gray-500">Auto-cleanup</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">No metrics data available</p>
              </div>
            )}

            {/* Recent Activity */}
            {metrics && metrics.recentActivity.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900">Recent Activity</h4>
                </div>
                <div className="divide-y divide-gray-200">
                  {metrics.recentActivity.slice(0, 10).map((activity, index) => (
                    <div key={index} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.operation === 'CREATE' ? 'bg-green-500' :
                          activity.operation === 'UPDATE' ? 'bg-blue-500' :
                          activity.operation === 'DELETE' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.operation} - {activity.section}
                          </p>
                          <p className="text-sm text-gray-500">{activity.details}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* About Management */}
            <Link href="/admin/about" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">About</h3>
                  <p className="text-gray-600 text-sm">Manage personal information</p>
                </div>
              </div>
            </Link>

            {/* Contact Management */}
            <Link href="/admin/contact" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-teal-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
                  <p className="text-gray-600 text-sm">Manage contact information</p>
                </div>
              </div>
            </Link>

            {/* Skills Management */}
            <Link href="/admin/skills" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                  <p className="text-gray-600 text-sm">Manage skills and expertise</p>
                </div>
              </div>
            </Link>

            {/* Experience Management */}
            <Link href="/admin/experience" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
                  <p className="text-gray-600 text-sm">Manage work experience</p>
                </div>
              </div>
            </Link>

            {/* Project Management */}
            <Link href="/admin/projects" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
                  <p className="text-gray-600 text-sm">Manage portfolio projects</p>
                </div>
              </div>
            </Link>

            {/* Blog Management */}
            <Link href="/admin/blog" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Blog Posts</h3>
                  <p className="text-gray-600 text-sm">Create and manage blog content</p>
                </div>
              </div>
            </Link>

            {/* Contact Messages */}
            <Link href="/admin/contacts" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                  <p className="text-gray-600 text-sm">View contact form submissions</p>
                </div>
              </div>
            </Link>

          </div>

          {/* Quick Actions */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin/experience/new" className="btn-primary">
                Add Experience
              </Link>
              <Link href="/admin/projects/new" className="btn-primary">
                Add Project
              </Link>
              <Link href="/admin/blog/new" className="btn-primary">
                Write Blog Post
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
