"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SkillCategory {
  id: string;
  title: string;
  skills: string[];
}

interface SkillsData {
  skillCategories: SkillCategory[];
  certifications: string[];
  technicalExpertise: {
    title: string;
    description: string;
  };
}

export default function AdminSkills() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [skillsData, setSkillsData] = useState<SkillsData | null>(null);
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
        await loadSkillsData();
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

  const loadSkillsData = async () => {
    try {
      const response = await fetch('/api/admin/skills');
      if (response.ok) {
        const data = await response.json();
        setSkillsData(data);
      }
    } catch (error) {
      console.error('Error loading skills data:', error);
    }
  };

  const handleSave = async () => {
    if (!skillsData) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skillsData),
      });

      if (response.ok) {
        alert('Skills data updated successfully!');
      } else {
        alert('Failed to update skills data');
      }
    } catch (error) {
      console.error('Error saving skills data:', error);
      alert('Error saving skills data');
    } finally {
      setSaving(false);
    }
  };

  const updateSkillCategory = (categoryId: string, field: keyof SkillCategory, value: any) => {
    if (!skillsData) return;
    
    const updatedCategories = skillsData.skillCategories.map(category => 
      category.id === categoryId ? { ...category, [field]: value } : category
    );
    
    setSkillsData({ ...skillsData, skillCategories: updatedCategories });
  };

  const updateSkillsInCategory = (categoryId: string, skillsText: string) => {
    const skillsArray = skillsText.split('\n').filter(skill => skill.trim());
    updateSkillCategory(categoryId, 'skills', skillsArray);
  };

  const updateCertifications = (certificationsText: string) => {
    if (!skillsData) return;
    
    const certificationsArray = certificationsText.split('\n').filter(cert => cert.trim());
    setSkillsData({ ...skillsData, certifications: certificationsArray });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !skillsData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-light">Edit Skills Section</h1>
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
            {/* Technical Expertise */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Technical Expertise</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={skillsData.technicalExpertise.title}
                    onChange={(e) => setSkillsData({
                      ...skillsData,
                      technicalExpertise: { ...skillsData.technicalExpertise, title: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    value={skillsData.technicalExpertise.description}
                    onChange={(e) => setSkillsData({
                      ...skillsData,
                      technicalExpertise: { ...skillsData.technicalExpertise, description: e.target.value }
                    })}
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Skill Categories */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Skill Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skillsData.skillCategories.map((category) => (
                  <div key={category.id} className="bg-slate-800 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Category Title</label>
                        <input
                          type="text"
                          value={category.title}
                          onChange={(e) => updateSkillCategory(category.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Skills (one per line)</label>
                        <textarea
                          value={category.skills.join('\n')}
                          onChange={(e) => updateSkillsInCategory(category.id, e.target.value)}
                          rows={6}
                          className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter each skill on a new line"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Professional Certifications</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Certifications (one per line)</label>
                <textarea
                  value={skillsData.certifications.join('\n')}
                  onChange={(e) => updateCertifications(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter each certification on a new line"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
