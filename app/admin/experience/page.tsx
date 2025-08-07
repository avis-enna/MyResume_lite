"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  technologies: string[];
}

interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  cgpa: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: string;
  status: string;
}

interface ExperienceData {
  experiences: Experience[];
  education: Education;
  certifications: Certification[];
}

export default function AdminExperience() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [experienceData, setExperienceData] = useState<ExperienceData | null>(null);
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
        await loadExperienceData();
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

  const loadExperienceData = async () => {
    try {
      const response = await fetch('/api/admin/experience');
      if (response.ok) {
        const data = await response.json();
        setExperienceData(data);
      }
    } catch (error) {
      console.error('Error loading experience data:', error);
    }
  };

  const handleSave = async () => {
    if (!experienceData) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/experience', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experienceData),
      });

      if (response.ok) {
        alert('Experience data updated successfully!');
      } else {
        alert('Failed to update experience data');
      }
    } catch (error) {
      console.error('Error saving experience data:', error);
      alert('Error saving experience data');
    } finally {
      setSaving(false);
    }
  };

  const updateExperience = (expId: number, field: keyof Experience, value: any) => {
    if (!experienceData) return;
    
    const updatedExperiences = experienceData.experiences.map(exp => 
      exp.id === expId ? { ...exp, [field]: value } : exp
    );
    
    setExperienceData({ ...experienceData, experiences: updatedExperiences });
  };

  const updateExperienceDescription = (expId: number, descriptionText: string) => {
    const descriptionArray = descriptionText.split('\n').filter(desc => desc.trim());
    updateExperience(expId, 'description', descriptionArray);
  };

  const updateExperienceTechnologies = (expId: number, technologiesText: string) => {
    const technologiesArray = technologiesText.split('\n').filter(tech => tech.trim());
    updateExperience(expId, 'technologies', technologiesArray);
  };

  const updateEducation = (field: keyof Education, value: string) => {
    if (!experienceData) return;
    
    setExperienceData({
      ...experienceData,
      education: { ...experienceData.education, [field]: value }
    });
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    if (!experienceData) return;
    
    const updatedCertifications = experienceData.certifications.map((cert, i) => 
      i === index ? { ...cert, [field]: value } : cert
    );
    
    setExperienceData({ ...experienceData, certifications: updatedCertifications });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !experienceData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-light">Edit Experience Section</h1>
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
            {/* Professional Experience */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Professional Experience</h2>
              <div className="space-y-6">
                {experienceData.experiences.map((experience) => (
                  <div key={experience.id} className="bg-slate-800 p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={experience.title}
                          onChange={(e) => updateExperience(experience.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                        <input
                          type="text"
                          value={experience.company}
                          onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                        <input
                          type="text"
                          value={experience.location}
                          onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Period</label>
                        <input
                          type="text"
                          value={experience.period}
                          onChange={(e) => updateExperience(experience.id, 'period', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description (one per line)</label>
                        <textarea
                          value={experience.description.join('\n')}
                          onChange={(e) => updateExperienceDescription(experience.id, e.target.value)}
                          rows={8}
                          className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter each responsibility on a new line"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Technologies (one per line)</label>
                        <textarea
                          value={experience.technologies.join('\n')}
                          onChange={(e) => updateExperienceTechnologies(experience.id, e.target.value)}
                          rows={8}
                          className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter each technology on a new line"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              <div className="bg-slate-800 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Degree</label>
                    <input
                      type="text"
                      value={experienceData.education.degree}
                      onChange={(e) => updateEducation('degree', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Field of Study</label>
                    <input
                      type="text"
                      value={experienceData.education.field}
                      onChange={(e) => updateEducation('field', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Institution</label>
                    <input
                      type="text"
                      value={experienceData.education.institution}
                      onChange={(e) => updateEducation('institution', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={experienceData.education.location}
                      onChange={(e) => updateEducation('location', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Period</label>
                    <input
                      type="text"
                      value={experienceData.education.period}
                      onChange={(e) => updateEducation('period', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">CGPA</label>
                    <input
                      type="text"
                      value={experienceData.education.cgpa}
                      onChange={(e) => updateEducation('cgpa', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Certifications</h2>
              <div className="space-y-4">
                {experienceData.certifications.map((certification, index) => (
                  <div key={index} className="bg-slate-800 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Certification Name</label>
                        <input
                          type="text"
                          value={certification.name}
                          onChange={(e) => updateCertification(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Issuer</label>
                        <input
                          type="text"
                          value={certification.issuer}
                          onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Year</label>
                        <input
                          type="text"
                          value={certification.year}
                          onChange={(e) => updateCertification(index, 'year', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                        <input
                          type="text"
                          value={certification.status}
                          onChange={(e) => updateCertification(index, 'status', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
