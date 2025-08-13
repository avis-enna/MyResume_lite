'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Experience {
  _id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  order: number;
}

export default function EditExperience() {
  const router = useRouter();
  const params = useParams();
  const id = params ? (Array.isArray(params.id) ? params.id[0] : params.id) : '';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    responsibilities: [''],
    achievements: [''],
    technologies: [''],
    order: 0,
  });

  useEffect(() => {
    fetchExperience();
  }, [id]);

  const fetchExperience = async () => {
    try {
      console.log('Fetching experience with ID:', id);
      const response = await fetch(`/api/admin/experience/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch experience: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched experience data:', data);
      
      setExperience(data);
      setFormData({
        title: data.title || '',
        company: data.company || '',
        location: data.location || '',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        current: data.current || false,
        description: data.description || '',
        responsibilities: data.responsibilities?.length > 0 ? data.responsibilities : [''],
        achievements: data.achievements?.length > 0 ? data.achievements : [''],
        technologies: data.technologies?.length > 0 ? data.technologies : [''],
        order: data.order || 0,
      });
    } catch (error) {
      console.error('Error fetching experience:', error);
      alert('Failed to load experience data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleArrayChange = (field: 'responsibilities' | 'achievements' | 'technologies', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'responsibilities' | 'achievements' | 'technologies') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'responsibilities' | 'achievements' | 'technologies', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        responsibilities: formData.responsibilities.filter(item => item.trim() !== ''),
        achievements: formData.achievements.filter(item => item.trim() !== ''),
        technologies: formData.technologies.filter(item => item.trim() !== ''),
      };

      console.log('Updating experience with data:', cleanedData);

      const response = await fetch(`/api/admin/experience/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update experience: ${response.status}`);
      }

      const updatedExperience = await response.json();
      console.log('Experience updated successfully:', updatedExperience);

      alert('Experience updated successfully!');
      router.push('/admin/experience');
    } catch (error) {
      console.error('Error updating experience:', error);
      alert('Failed to update experience');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-serif flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-amber-600/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-amber-200/70 font-light tracking-[0.2em] uppercase">Loading Experience...</div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-black text-white font-serif flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-red-400 mb-4">Experience Not Found</h1>
          <Link href="/admin/experience" className="text-amber-400 hover:text-amber-300">
            Back to Experience List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-serif">
      <header className="border-b border-amber-900/20 bg-black/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/admin/experience" className="text-amber-400/70 hover:text-amber-300 transition-colors">
                ← Back
              </Link>
              <h1 className="text-2xl font-light tracking-[0.3em] text-amber-100 uppercase">Edit Experience</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-light text-amber-200/80 mb-3 tracking-[0.1em] uppercase">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-6 py-4 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50 transition-colors font-light"
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-amber-200/80 mb-3 tracking-[0.1em] uppercase">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                className="w-full px-6 py-4 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50 transition-colors font-light"
                placeholder="e.g., Cisco Systems"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-light text-amber-200/80 mb-3 tracking-[0.1em] uppercase">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-6 py-4 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50 transition-colors font-light"
              placeholder="e.g., Bengaluru, India"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-light text-amber-200/80 mb-3 tracking-[0.1em] uppercase">
                Start Date
              </label>
              <input
                type="text"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full px-6 py-4 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50 transition-colors font-light"
                placeholder="e.g., August 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-amber-200/80 mb-3 tracking-[0.1em] uppercase">
                End Date
              </label>
              <input
                type="text"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                disabled={formData.current}
                className="w-full px-6 py-4 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50 transition-colors font-light disabled:opacity-50"
                placeholder="e.g., December 2024"
              />
              <div className="mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="current"
                    checked={formData.current}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-amber-300/70">Currently working here</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-light text-amber-200/80 mb-3 tracking-[0.1em] uppercase">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-6 py-4 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50 transition-colors resize-none font-light"
              placeholder="Brief description of your role and impact..."
            />
          </div>

          {/* Responsibilities Section */}
          <div>
            <label className="block text-sm font-light text-amber-200/80 mb-3 tracking-[0.1em] uppercase">
              Key Responsibilities
            </label>
            {formData.responsibilities.map((responsibility, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={responsibility}
                  onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50 transition-colors font-light"
                  placeholder="Enter a key responsibility..."
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('responsibilities', index)}
                    className="px-3 py-2 bg-red-900/30 border border-red-700/50 text-red-300 rounded hover:bg-red-800/40 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('responsibilities')}
              className="mt-2 px-4 py-2 bg-amber-900/30 border border-amber-700/50 text-amber-200 rounded hover:bg-amber-800/40 transition-colors text-sm"
            >
              Add Responsibility
            </button>
          </div>

          {/* Achievements Section */}
          <div>
            <label className="block text-sm font-light text-amber-200/80 mb-3 tracking-[0.1em] uppercase">
              Key Achievements
            </label>
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={achievement}
                  onChange={(e) => handleArrayChange('achievements', index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50 transition-colors font-light"
                  placeholder="Enter a key achievement..."
                />
                {formData.achievements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('achievements', index)}
                    className="px-3 py-2 bg-red-900/30 border border-red-700/50 text-red-300 rounded hover:bg-red-800/40 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('achievements')}
              className="mt-2 px-4 py-2 bg-amber-900/30 border border-amber-700/50 text-amber-200 rounded hover:bg-amber-800/40 transition-colors text-sm"
            >
              Add Achievement
            </button>
          </div>

          {/* Technologies Section */}
          <div>
            <label className="block text-sm font-light text-amber-200/80 mb-3 tracking-[0.1em] uppercase">
              Technologies Used
            </label>
            {formData.technologies.map((tech, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50 transition-colors font-light"
                  placeholder="e.g., React, Node.js, MongoDB"
                />
                {formData.technologies.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('technologies', index)}
                    className="px-3 py-2 bg-red-900/30 border border-red-700/50 text-red-300 rounded hover:bg-red-800/40 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('technologies')}
              className="mt-2 px-4 py-2 bg-amber-900/30 border border-amber-700/50 text-amber-200 rounded hover:bg-amber-800/40 transition-colors text-sm"
            >
              Add Technology
            </button>
          </div>

          <div>
            <label className="block text-sm font-light text-amber-200/80 mb-3 tracking-[0.1em] uppercase">
              Display Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              className="w-32 px-4 py-2 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50 transition-colors font-light"
              placeholder="0"
            />
            <p className="text-xs text-amber-400/60 mt-1">Lower numbers appear first</p>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-4 bg-amber-900/30 border border-amber-700/50 text-amber-100 font-light tracking-[0.2em] uppercase text-sm hover:bg-amber-800/40 hover:border-amber-600 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating...' : 'Update Experience'}
            </button>
            
            <Link
              href="/admin/experience"
              className="px-8 py-4 border border-amber-800/30 text-amber-300/70 font-light tracking-[0.2em] uppercase text-sm hover:border-amber-600/50 hover:text-amber-200 transition-all duration-500"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
