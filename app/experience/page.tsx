'use client';

import { useState, useEffect } from 'react';

interface ExperienceItem {
  _id?: string;
  company?: string;
  position?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  order?: number;
  createdAt?: string;
  description?: string[];
  crossFunctional?: string[];
  technologies?: string[];
}

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        console.log('Fetching experiences for main site...');
        // Use public endpoint
        const response = await fetch('/api/experience');

        if (response.ok) {
          const payload = await response.json();
          const data: ExperienceItem[] = Array.isArray(payload?.data) ? payload.data : [];
          console.log('Main site experiences loaded:', data);

          const sortedExperiences = data
            .slice()
            .sort((a, b) => {
              const orderA = a.order ?? 0;
              const orderB = b.order ?? 0;
              if (orderA !== orderB) return orderA - orderB;
              const dateA = Number(new Date(a.createdAt || a.startDate || 0));
              const dateB = Number(new Date(b.createdAt || b.startDate || 0));
              return dateB - dateA; // most recent first
            });

          setExperiences(sortedExperiences);
        } else {
          console.error('Failed to fetch experiences:', response.status);
          setError('Failed to load experiences');
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
        setError('Error loading experiences');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white py-24 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-light tracking-[0.2em] text-gray-400">Loading Experience...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white py-24 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-light tracking-[0.2em] text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-white mb-4">Professional Experience</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
            My journey in software engineering, from mainframe systems to modern cloud-native applications.
          </p>
        </div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div key={exp._id || index} className="bg-gray-950 border border-gray-800 rounded-lg p-8 hover:border-gray-700 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-light tracking-[0.1em] text-gray-300 mb-2">{exp.position}</h2>
                  <h3 className="text-xl font-light text-gray-400 mb-2">{exp.company}</h3>
                  <p className="text-gray-500 font-light">{exp.location}</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <span className="inline-block bg-gray-900 text-gray-400 px-3 py-1 rounded border border-gray-800 text-sm font-light">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-light tracking-[0.1em] text-gray-400 mb-3">Key Responsibilities:</h4>
                <ul className="space-y-2">
                  {(exp.description || []).map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-gray-600 mr-2 mt-1">•</span>
                      <span className="text-gray-400 font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {exp.crossFunctional && exp.crossFunctional.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-light tracking-[0.1em] text-gray-400 mb-3">Cross-Functional Experience:</h4>
                  <ul className="space-y-2">
                    {exp.crossFunctional.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-gray-600 mr-2 mt-1">○</span>
                        <span className="text-gray-400 font-light">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-light tracking-[0.1em] text-gray-400 mb-3">Technologies Used:</h4>
                <div className="flex flex-wrap gap-2">
                  {(exp.technologies || []).map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-900 text-gray-400 px-3 py-1 rounded border border-gray-800 text-sm font-light"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Education Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-light tracking-[0.2em] text-center mb-12 text-white">Education</h2>
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-8">
            <div className="text-center">
              <h3 className="text-xl font-light tracking-[0.1em] text-gray-300 mb-2">
                Bachelor of Engineering (B.E.) – Electronics and Telecommunication Engineering
              </h3>
              <p className="text-lg text-gray-400 mb-2 font-light">Sir M Visvesvaraya Institute of Technology</p>
              <p className="text-gray-500 font-light">Bengaluru, India</p>
            </div>
          </div>
        </div>

        {/* Certifications Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-light tracking-[0.2em] text-center mb-12 text-white">Certifications</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 text-center hover:border-gray-700 transition-colors">
              <h3 className="font-light text-lg text-gray-300 mb-2">Cisco Certified DevNet Associate</h3>
              <p className="text-gray-400 font-light">DEVASC</p>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 text-center hover:border-gray-700 transition-colors">
              <h3 className="font-light text-lg text-gray-300 mb-2">Cisco Certified Network Associate</h3>
              <p className="text-gray-400 font-light">CCNA</p>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 text-center hover:border-gray-700 transition-colors">
              <h3 className="font-light text-lg text-gray-300 mb-2">Cisco Certified Cybersecurity Associate</h3>
              <p className="text-gray-400 font-light">CCCA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
