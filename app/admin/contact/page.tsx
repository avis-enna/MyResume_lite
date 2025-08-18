"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../styles/themes.css';

// MongoDB contact data structure
interface ContactData {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

export default function AdminContact() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState<ContactData>({
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const response = await fetch('/api/admin/session-check');
      const data = await response.json();
      
      if (data.authenticated) {
        setIsAuthenticated(true);
        await loadContactData();
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

  const loadContactData = async () => {
    try {
      // Add cache-busting headers to prevent stale data
      const response = await fetch('/api/admin/contact', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setContactData(data);
      }
    } catch (error) {
      console.error('Error loading contact data:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Contact information updated successfully' });
        setTimeout(() => setMessage(null), 3000);
        // Reload data to reflect changes and clear any cache
        await loadContactData();
      } else {
        setMessage({ type: 'error', text: 'Failed to update contact information' });
      }
    } catch (error) {
      console.error('Error saving contact data:', error);
      setMessage({ type: 'error', text: 'Failed to update contact information' });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof ContactData, value: string) => {
    setContactData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contact data...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-layout min-h-screen">
      {/* Header */}
      <header className="admin-header shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="admin-nav-link mr-4">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold admin-title">Edit Contact Section</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Success/Error Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success'
              ? 'admin-alert-success bg-green-50'
              : 'admin-alert-error bg-red-50'
          }`}>
            {message.text}
          </div>
        )}

        {/* Contact Information Form */}
        <div className="admin-card shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6 admin-title">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                data-testid="contact-email-input"
                value={contactData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="admin-input w-full px-3 py-2 rounded-md"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="admin-label block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={contactData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="admin-input w-full px-3 py-2 rounded-md"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="admin-label block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={contactData.location}
                onChange={(e) => updateField('location', e.target.value)}
                className="admin-input w-full px-3 py-2 rounded-md"
                placeholder="Enter your location"
              />
            </div>

            <div>
              <label className="admin-label block text-sm font-medium mb-2">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={contactData.linkedin}
                onChange={(e) => updateField('linkedin', e.target.value)}
                className="admin-input w-full px-3 py-2 rounded-md"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <label className="admin-label block text-sm font-medium mb-2">GitHub URL</label>
              <input
                type="url"
                name="github"
                value={contactData.github}
                onChange={(e) => updateField('github', e.target.value)}
                className="admin-input w-full px-3 py-2 rounded-md"
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div>
              <label className="admin-label block text-sm font-medium mb-2">Website URL</label>
              <input
                type="url"
                name="website"
                value={contactData.website}
                onChange={(e) => updateField('website', e.target.value)}
                className="admin-input w-full px-3 py-2 rounded-md"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              onClick={handleSave}
              disabled={saving}
              className="admin-btn-primary px-6 py-2 rounded-md disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
