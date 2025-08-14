"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AboutData {
  personal: {
    name: string;
    title: string;
    profileImage: string;
    socialLinks: {
      linkedin: string;
      github: string;
      email: string;
    };
  };
  bio: {
    paragraph1: string;
    paragraph2: string;
  };
}

export default function AdminAbout() {
  const [data, setData] = useState<AboutData>({
    personal: {
      name: '',
      title: '',
      profileImage: '',
      socialLinks: {
        linkedin: '',
        github: '',
        email: ''
      }
    },
    bio: {
      paragraph1: '',
      paragraph2: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/api/admin/about');
      if (response.ok) {
        const aboutData = await response.json();
        setData(aboutData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.personal.name,
          title: data.personal.title,
          profileImage: data.personal.profileImage,
          linkedin: data.personal.socialLinks.linkedin,
          github: data.personal.socialLinks.github,
          email: data.personal.socialLinks.email,
          bio1: data.bio.paragraph1,
          bio2: data.bio.paragraph2
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Data saved successfully!' });
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to save data' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save data' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
      </div>

      <div className="relative z-10">
        <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <h1 className="text-xl font-light tracking-[0.2em] text-white">EDIT ABOUT</h1>
              </div>
              <button
                type="button"
                data-testid="about-save-button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-white text-black font-light tracking-[0.1em] uppercase text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </header>

        {/* Success/Error Messages */}
        {message && (
          <div className={`mx-auto max-w-2xl px-6 py-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`} data-testid={message.type === 'success' ? 'success-alert' : 'error-alert'}>
            {message.text}
          </div>
        )}

        <main className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8" data-testid="about-form-container">
              {loading && <div data-testid="about-form-loading">Loading...</div>}
              {!loading && (
                <form data-testid="about-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                  <div data-testid="about-form-ready" className="hidden">Ready</div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-light tracking-[0.15em] uppercase text-gray-400 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        data-testid="name-input"
                        value={data.personal.name}
                        onChange={(e) => setData({
                          ...data,
                          personal: { ...data.personal, name: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>

                <div>
                  <label className="block text-xs font-light tracking-[0.15em] uppercase text-gray-400 mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    data-testid="title-input"
                    value={data.personal.title}
                    onChange={(e) => setData({
                      ...data,
                      personal: { ...data.personal, title: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                    placeholder="e.g. Software Engineer · Cisco Systems"
                  />
                </div>

                <div>
                  <label className="block text-xs font-light tracking-[0.15em] uppercase text-gray-400 mb-2">
                    Bio - First Paragraph
                  </label>
                  <textarea
                    name="bio-paragraph1"
                    data-testid="bio-paragraph1-input"
                    value={data.bio.paragraph1}
                    onChange={(e) => setData({
                      ...data,
                      bio: { ...data.bio, paragraph1: e.target.value }
                    })}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors resize-none"
                    placeholder="First paragraph of your bio..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-light tracking-[0.15em] uppercase text-gray-400 mb-2">
                    Bio - Second Paragraph
                  </label>
                  <textarea
                    name="bio-paragraph2"
                    data-testid="bio-paragraph2-input"
                    value={data.bio.paragraph2}
                    onChange={(e) => setData({
                      ...data,
                      bio: { ...data.bio, paragraph2: e.target.value }
                    })}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors resize-none"
                    placeholder="Second paragraph of your bio..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-light tracking-[0.15em] uppercase text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.personal.socialLinks.email}
                    onChange={(e) => setData({
                      ...data,
                      personal: {
                        ...data.personal,
                        socialLinks: { ...data.personal.socialLinks, email: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-light tracking-[0.15em] uppercase text-gray-400 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={data.personal.socialLinks.linkedin}
                    onChange={(e) => setData({
                      ...data,
                      personal: {
                        ...data.personal,
                        socialLinks: { ...data.personal.socialLinks, linkedin: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-xs font-light tracking-[0.15em] uppercase text-gray-400 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={data.personal.socialLinks.github}
                    onChange={(e) => setData({
                      ...data,
                      personal: {
                        ...data.personal,
                        socialLinks: { ...data.personal.socialLinks, github: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>

                {/* Form Submit Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    data-testid="about-submit-button"
                    disabled={saving}
                    className="px-6 py-2 bg-white text-black font-light tracking-[0.1em] uppercase text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
