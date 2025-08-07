"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  skillsGrid: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  experienceSummary: {
    experienced: {
      title: string;
      items: string[];
    };
    years: {
      title: string;
      items: string[];
    };
    current: {
      title: string;
      items: string[];
    };
  };
}

export default function AdminAboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/admin/about');
      if (response.status === 401) {
        router.push('/admin');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setAboutData(data);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!aboutData) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutData),
      });

      if (response.ok) {
        alert('About data updated successfully!');
      } else {
        alert('Failed to update about data');
      }
    } catch (error) {
      console.error('Error saving about data:', error);
      alert('Error saving about data');
    } finally {
      setSaving(false);
    }
  };

  const updatePersonal = (field: string, value: string) => {
    if (!aboutData) return;
    setAboutData({
      ...aboutData,
      personal: {
        ...aboutData.personal,
        [field]: value
      }
    });
  };

  const updateSocialLink = (platform: string, url: string) => {
    if (!aboutData) return;
    setAboutData({
      ...aboutData,
      personal: {
        ...aboutData.personal,
        socialLinks: {
          ...aboutData.personal.socialLinks,
          [platform]: url
        }
      }
    });
  };

  const updateBio = (field: string, value: string) => {
    if (!aboutData) return;
    setAboutData({
      ...aboutData,
      bio: {
        ...aboutData.bio,
        [field]: value
      }
    });
  };

  const updateSkill = (index: number, field: string, value: string) => {
    if (!aboutData) return;
    const newSkills = [...aboutData.skillsGrid];
    newSkills[index] = {
      ...newSkills[index],
      [field]: value
    };
    setAboutData({
      ...aboutData,
      skillsGrid: newSkills
    });
  };

  const updateExperienceItems = (category: string, items: string[]) => {
    if (!aboutData) return;
    setAboutData({
      ...aboutData,
      experienceSummary: {
        ...aboutData.experienceSummary,
        [category]: {
          ...aboutData.experienceSummary[category as keyof typeof aboutData.experienceSummary],
          items
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading about data...</p>
        </div>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load about data</p>
          <button 
            onClick={fetchAboutData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Edit About Section</h1>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Back to Dashboard
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Personal Information */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={aboutData.personal.name}
                    onChange={(e) => updatePersonal('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={aboutData.personal.title}
                    onChange={(e) => updatePersonal('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
                  <input
                    type="text"
                    value={aboutData.personal.profileImage}
                    onChange={(e) => updatePersonal('profileImage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <h3 className="text-lg font-medium mt-6 mb-4">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={aboutData.personal.socialLinks.linkedin}
                    onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                  <input
                    type="url"
                    value={aboutData.personal.socialLinks.github}
                    onChange={(e) => updateSocialLink('github', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={aboutData.personal.socialLinks.email}
                    onChange={(e) => updateSocialLink('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Bio</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Paragraph</label>
                  <textarea
                    value={aboutData.bio.paragraph1}
                    onChange={(e) => updateBio('paragraph1', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Second Paragraph</label>
                  <textarea
                    value={aboutData.bio.paragraph2}
                    onChange={(e) => updateBio('paragraph2', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Skills Grid</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aboutData.skillsGrid.map((skill, index) => (
                  <div key={skill.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={skill.title}
                          onChange={(e) => updateSkill(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={skill.description}
                          onChange={(e) => updateSkill(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                        <select
                          value={skill.icon}
                          onChange={(e) => updateSkill(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="shield">Shield</option>
                          <option value="star">Star</option>
                          <option value="desktop">Desktop</option>
                          <option value="check">Check</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Summary */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Experience Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(aboutData.experienceSummary).map(([key, section]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => {
                            const newSummary = { ...aboutData.experienceSummary };
                            newSummary[key as keyof typeof newSummary].title = e.target.value;
                            setAboutData({ ...aboutData, experienceSummary: newSummary });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Items (one per line)</label>
                        <textarea
                          value={section.items.join('\n')}
                          onChange={(e) => updateExperienceItems(key, e.target.value.split('\n').filter(item => item.trim()))}
                          rows={8}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter each item on a new line"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
