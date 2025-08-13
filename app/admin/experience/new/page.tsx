'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewExperience() {
  const [formData, setFormData] = useState({
    company: '',
    title: '', // Changed from 'position' to 'title'
    startDate: '',
    endDate: '',
    current: false,
    description: [''],
    responsibilities: [''],
    achievements: [''],
    technologies: [''],
    location: '',
    order: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleArrayChange = (index: number, value: string, field: 'description' | 'technologies') => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const addArrayItem = (field: 'description' | 'technologies') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayItem = (index: number, field: 'description' | 'technologies') => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Submitting experience data:', formData);

      const response = await fetch('/api/test/add-experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          description: formData.description.filter(item => item.trim() !== '').join('\n'),
          technologies: formData.technologies.filter(item => item.trim() !== '')
        }),
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok && result.success) {
        alert('Experience added successfully!');
        router.push('/admin/experience');
      } else {
        setError(result.error || 'Failed to create experience');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-serif">
      {/* Header */}
      <header className="bg-amber-950/20 border-b border-amber-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6">
              <Link href="/admin/experience" className="text-amber-300/70 hover:text-amber-200 font-light tracking-[0.1em] transition-colors">
                ← Back to Experience
              </Link>
              <h1 className="text-2xl font-light tracking-[0.3em] text-amber-100 uppercase">Add Experience</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-amber-950/20 border border-amber-800/30 rounded p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-amber-200/80 text-sm font-light tracking-[0.1em] uppercase mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50"
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="block text-amber-200/80 text-sm font-light tracking-[0.1em] uppercase mb-2">
                  Position
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50"
                  placeholder="Job title"
                />
              </div>

              <div>
                <label className="block text-amber-200/80 text-sm font-light tracking-[0.1em] uppercase mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-amber-200/80 text-sm font-light tracking-[0.1em] uppercase mb-2">
                  Start Date
                </label>
                <input
                  type="text"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50"
                  placeholder="e.g., January 2024"
                />
              </div>

              <div>
                <label className="block text-amber-200/80 text-sm font-light tracking-[0.1em] uppercase mb-2">
                  End Date
                </label>
                <input
                  type="text"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={formData.current}
                  className="w-full px-4 py-3 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50 disabled:opacity-50"
                  placeholder="e.g., December 2024"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="current"
                  checked={formData.current}
                  onChange={handleChange}
                  className="mr-3"
                />
                <label className="text-amber-200/80 text-sm font-light tracking-[0.1em] uppercase">
                  Current Position
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-amber-200/80 text-sm font-light tracking-[0.1em] uppercase mb-2">
                Description (Key Responsibilities)
              </label>
              {formData.description.map((desc, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <textarea
                    value={desc}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'description')}
                    className="flex-1 px-4 py-3 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50"
                    placeholder="Describe a key responsibility or achievement"
                    rows={2}
                  />
                  {formData.description.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'description')}
                      className="px-3 py-2 bg-red-900/30 border border-red-700/50 text-red-300 rounded hover:bg-red-800/40"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('description')}
                className="mt-2 px-4 py-2 bg-amber-900/30 border border-amber-700/50 text-amber-200 rounded hover:bg-amber-800/40"
              >
                Add Description
              </button>
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-amber-200/80 text-sm font-light tracking-[0.1em] uppercase mb-2">
                Technologies & Skills
              </label>
              {formData.technologies.map((tech, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tech}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'technologies')}
                    className="flex-1 px-4 py-3 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50"
                    placeholder="Technology or skill"
                  />
                  {formData.technologies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'technologies')}
                      className="px-3 py-2 bg-red-900/30 border border-red-700/50 text-red-300 rounded hover:bg-red-800/40"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('technologies')}
                className="mt-2 px-4 py-2 bg-amber-900/30 border border-amber-700/50 text-amber-200 rounded hover:bg-amber-800/40"
              >
                Add Technology
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-950/20 border border-red-800/30 rounded p-4">
                <p className="text-red-400/80 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/experience"
                className="px-6 py-3 bg-gray-900/30 border border-gray-700/50 text-gray-300 rounded font-light tracking-[0.2em] uppercase text-sm hover:bg-gray-800/40"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-amber-900/30 border border-amber-700/50 text-amber-100 rounded font-light tracking-[0.2em] uppercase text-sm hover:bg-amber-800/40 hover:border-amber-600 transition-all duration-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Experience'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
