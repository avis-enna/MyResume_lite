'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '../../components/ThemeProvider';
import EnhancedMetricsDashboard from '../../components/EnhancedMetricsDashboard';
import SimpleIcon from '../../components/SimpleIcon';

// MetricsSummary interface removed - now handled by EnhancedMetricsDashboard

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/session-check');
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.authenticated) {
        router.push('/admin');
      }
    } catch (_err) {
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // loadMetrics function removed - now handled by EnhancedMetricsDashboard

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // useEffect for loadMetrics removed - now handled by EnhancedMetricsDashboard

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="admin-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-layout min-h-screen" data-testid="dashboard-root">
      {/* Header */}
      <header className="admin-header shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold admin-title">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/" className="admin-nav-link flex items-center space-x-2">
                <SimpleIcon type="eye" size={16} />
                <span>View Site</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="admin-nav-link flex items-center space-x-2"
              >
                <SimpleIcon type="logout" size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Profile Welcome Section */}
          <div className="mb-8 admin-card p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src="/profile-photo.png"
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold admin-title mb-1">Welcome back, Venna!</h2>
                <p className="admin-loading">Manage your portfolio content from here.</p>
                <p className="text-sm admin-loading mt-1">Last login: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Enhanced Metrics Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold admin-title mb-4">Activity Metrics</h3>

            {/* Enhanced Metrics Dashboard with Pagination */}
            <EnhancedMetricsDashboard />
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* About Management */}
            <Link href="/admin/about" className="admin-card p-6 rounded-lg hover:shadow-lg transition-all duration-300 block">
              <div className="flex items-center mb-4">
                <div className="metrics-icon p-3 rounded-lg mr-4">
                  <SimpleIcon type="user" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold admin-title">About</h3>
                  <p className="admin-loading text-sm">Manage personal information</p>
                </div>
              </div>
            </Link>

            {/* Contact Management */}
            <Link href="/admin/contact" className="admin-card p-6 rounded-lg hover:shadow-lg transition-all duration-300 block">
              <div className="flex items-center mb-4">
                <div className="metrics-icon p-3 rounded-lg mr-4">
                  <SimpleIcon type="phone" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold admin-title">Contact</h3>
                  <p className="admin-loading text-sm">Manage contact information</p>
                </div>
              </div>
            </Link>

            {/* Skills Management */}
            <Link href="/admin/skills" className="admin-card p-6 rounded-lg hover:shadow-lg transition-all duration-300 block">
              <div className="flex items-center mb-4">
                <div className="metrics-icon p-3 rounded-lg mr-4">
                  <SimpleIcon type="lightbulb" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold admin-title">Skills</h3>
                  <p className="admin-loading text-sm">Manage skills and expertise</p>
                </div>
              </div>
            </Link>

            {/* Experience Management */}
            <Link href="/admin/experience" className="admin-card p-6 rounded-lg hover:shadow-lg transition-all duration-300 block">
              <div className="flex items-center mb-4">
                <div className="metrics-icon p-3 rounded-lg mr-4">
                  <SimpleIcon type="briefcase" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold admin-title">Experience</h3>
                  <p className="admin-loading text-sm">Manage work experience</p>
                </div>
              </div>
            </Link>

            {/* Project Management */}
            <Link href="/admin/projects" className="admin-card p-6 rounded-lg hover:shadow-lg transition-all duration-300 block">
              <div className="flex items-center mb-4">
                <div className="metrics-icon p-3 rounded-lg mr-4">
                  <SimpleIcon type="folder" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold admin-title">Projects</h3>
                  <p className="admin-loading text-sm">Manage portfolio projects</p>
                </div>
              </div>
            </Link>

            {/* Blog Management */}
            <Link href="/admin/blog" className="admin-card p-6 rounded-lg hover:shadow-lg transition-all duration-300 block">
              <div className="flex items-center mb-4">
                <div className="metrics-icon p-3 rounded-lg mr-4">
                  <SimpleIcon type="edit" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold admin-title">Blog Posts</h3>
                  <p className="admin-loading text-sm">Create and manage blog content</p>
                </div>
              </div>
            </Link>

            {/* Contact Messages */}
            <Link href="/admin/contacts" className="admin-card p-6 rounded-lg hover:shadow-lg transition-all duration-300 block">
              <div className="flex items-center mb-4">
                <div className="metrics-icon p-3 rounded-lg mr-4">
                  <SimpleIcon type="message" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold admin-title">Messages</h3>
                  <p className="admin-loading text-sm">View contact form submissions</p>
                </div>
              </div>
            </Link>

          </div>

          {/* Quick Actions */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold admin-title mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin/experience/new" className="btn-primary flex items-center space-x-2">
                <SimpleIcon type="plus" size={16} />
                <span>Add Experience</span>
              </Link>
              <Link href="/admin/projects/new" className="btn-primary flex items-center space-x-2">
                <SimpleIcon type="plus" size={16} />
                <span>Add Project</span>
              </Link>
              <Link href="/admin/blog/new" className="btn-primary flex items-center space-x-2">
                <SimpleIcon type="plus" size={16} />
                <span>Write Blog Post</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
