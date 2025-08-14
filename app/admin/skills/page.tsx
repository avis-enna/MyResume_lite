'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

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
  const [skillsData, setSkillsData] = useState<SkillsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const router = useRouter();

  const checkAuthAndLoadData = async () => {
    try {
      const response = await fetch('/api/admin/session-check');
      const data = await response.json();

      if (data.authenticated) {
        await loadSkillsData();
      } else {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin');
    }
  };

  const loadSkillsData = async () => {
    try {
      const response = await fetch('/api/admin/skills');
      if (response.ok) {
        const data = await response.json();
        setSkillsData(data);
      } else {
        setMessage({ type: 'error', text: 'Failed to load skills data' });
      }
    } catch (error) {
      console.error('Failed to load skills:', error);
      setMessage({ type: 'error', text: 'Failed to load skills data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const saveSkillsData = async (updatedData: SkillsData) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setSkillsData(updatedData);
        setMessage({ type: 'success', text: 'Skills updated successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to update skills' });
      }
    } catch (error) {
      console.error('Failed to save skills:', error);
      setMessage({ type: 'error', text: 'Failed to update skills' });
    } finally {
      setSaving(false);
    }
  };

  const addSkillToCategory = (categoryId: string) => {
    if (!skillsData || !newSkill.trim()) return;

    const updatedData = {
      ...skillsData,
      skillCategories: skillsData.skillCategories.map(cat =>
        cat.id === categoryId
          ? { ...cat, skills: [...cat.skills, newSkill.trim()] }
          : cat
      ),
    };

    saveSkillsData(updatedData);
    setNewSkill('');
    setEditingCategory(null);
  };

  const removeSkillFromCategory = (categoryId: string, skillIndex: number) => {
    if (!skillsData) return;

    const updatedData = {
      ...skillsData,
      skillCategories: skillsData.skillCategories.map(cat =>
        cat.id === categoryId
          ? { ...cat, skills: cat.skills.filter((_, index) => index !== skillIndex) }
          : cat
      ),
    };

    saveSkillsData(updatedData);
  };

  const addCertification = () => {
    if (!skillsData || !newCertification.trim()) return;

    const updatedData = {
      ...skillsData,
      certifications: [...skillsData.certifications, newCertification.trim()],
    };

    saveSkillsData(updatedData);
    setNewCertification('');
  };

  const removeCertification = (index: number) => {
    if (!skillsData) return;

    const updatedData = {
      ...skillsData,
      certifications: skillsData.certifications.filter((_, i) => i !== index),
    };

    saveSkillsData(updatedData);
  };

  const updateTechnicalExpertise = (field: 'title' | 'description', value: string) => {
    if (!skillsData) return;

    const updatedData = {
      ...skillsData,
      technicalExpertise: {
        ...skillsData.technicalExpertise,
        [field]: value,
      },
    };

    saveSkillsData(updatedData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading skills data...</p>
        </div>
      </div>
    );
  }

  if (!skillsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load skills data</p>
          <button
            onClick={loadSkillsData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="skills-page">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Skills Management</h1>
          <p className="text-gray-600 mt-2">Manage your technical skills, certifications, and expertise</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`} data-testid={message.type === 'success' ? 'success-alert' : 'error-alert'}>
            {message.text}
          </div>
        )}

        <div className="space-y-8" data-testid="skills-container">
          {/* Technical Expertise Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical Expertise</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={skillsData.technicalExpertise.title}
                  onChange={(e) => updateTechnicalExpertise('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={skillsData.technicalExpertise.description}
                  onChange={(e) => updateTechnicalExpertise('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Skill Categories Section */}
          <div className="bg-white rounded-lg shadow p-6" data-testid="skill-categories-section">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skill Categories</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {skillsData.skillCategories.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">{category.title}</h3>
                  <div className="space-y-2">
                    {category.skills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                        <span className="text-sm text-gray-700">{skill}</span>
                        <button
                          onClick={() => removeSkillFromCategory(category.id, index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          disabled={saving}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {editingCategory === category.id ? (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Enter new skill"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && addSkillToCategory(category.id)}
                      />
                      <button
                        onClick={() => addSkillToCategory(category.id)}
                        disabled={saving || !newSkill.trim()}
                        className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setEditingCategory(null);
                          setNewSkill('');
                        }}
                        className="px-3 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingCategory(category.id)}
                      className="mt-3 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Skill
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Section */}
          <div className="bg-white rounded-lg shadow p-6" data-testid="certifications-section">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h2>
            <div className="space-y-3">
              {skillsData.certifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded">
                  <span className="text-gray-700">{cert}</span>
                  <button
                    onClick={() => removeCertification(index)}
                    className="text-red-600 hover:text-red-800"
                    disabled={saving}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="Enter new certification"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addCertification()}
              />
              <button
                onClick={addCertification}
                disabled={saving || !newCertification.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Add Certification
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Back to Dashboard
          </button>
          
          {saving && (
            <div className="flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Saving...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
