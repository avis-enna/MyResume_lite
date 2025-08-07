"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface ContactContent {
  title: string;
  subtitle: string;
  description: string;
  orderOfService: {
    title: string;
    description: string;
  };
}

interface ContactData {
  contactInfo: ContactInfo;
  socialLinks: SocialLink[];
  content: ContactContent;
}

export default function AdminContact() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const response = await fetch('/api/admin/verify');
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
      const response = await fetch('/api/admin/contact');
      if (response.ok) {
        const data = await response.json();
        setContactData(data);
      }
    } catch (error) {
      console.error('Error loading contact data:', error);
    }
  };

  const handleSave = async () => {
    if (!contactData) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        alert('Contact data updated successfully!');
      } else {
        alert('Failed to update contact data');
      }
    } catch (error) {
      console.error('Error saving contact data:', error);
      alert('Error saving contact data');
    } finally {
      setSaving(false);
    }
  };

  const updateContactInfo = (field: keyof ContactInfo, value: string) => {
    if (!contactData) return;
    
    setContactData({
      ...contactData,
      contactInfo: { ...contactData.contactInfo, [field]: value }
    });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    if (!contactData) return;
    
    const updatedSocialLinks = contactData.socialLinks.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    );
    
    setContactData({ ...contactData, socialLinks: updatedSocialLinks });
  };

  const updateContent = (field: keyof ContactContent, value: string) => {
    if (!contactData) return;
    
    setContactData({
      ...contactData,
      content: { ...contactData.content, [field]: value }
    });
  };

  const updateOrderOfService = (field: keyof ContactContent['orderOfService'], value: string) => {
    if (!contactData) return;
    
    setContactData({
      ...contactData,
      content: {
        ...contactData.content,
        orderOfService: { ...contactData.content.orderOfService, [field]: value }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !contactData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-light">Edit Contact Section</h1>
            <div className="space-x-4">
              <Link
                href="/admin/dashboard"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="bg-slate-800 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={contactData.contactInfo.email}
                      onChange={(e) => updateContactInfo('email', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={contactData.contactInfo.phone}
                      onChange={(e) => updateContactInfo('phone', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={contactData.contactInfo.location}
                      onChange={(e) => updateContactInfo('location', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Social Links</h2>
              <div className="space-y-4">
                {contactData.socialLinks.map((link, index) => (
                  <div key={index} className="bg-slate-800 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                        <input
                          type="text"
                          value={link.name}
                          onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Icon</label>
                        <select
                          value={link.icon}
                          onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="linkedin">LinkedIn</option>
                          <option value="github">GitHub</option>
                          <option value="email">Email</option>
                          <option value="twitter">Twitter</option>
                          <option value="instagram">Instagram</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Content</h2>
              <div className="bg-slate-800 p-6 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={contactData.content.title}
                    onChange={(e) => updateContent('title', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={contactData.content.subtitle}
                    onChange={(e) => updateContent('subtitle', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    value={contactData.content.description}
                    onChange={(e) => updateContent('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Order of Service Title</label>
                  <input
                    type="text"
                    value={contactData.content.orderOfService.title}
                    onChange={(e) => updateOrderOfService('title', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Order of Service Description</label>
                  <textarea
                    value={contactData.content.orderOfService.description}
                    onChange={(e) => updateOrderOfService('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
