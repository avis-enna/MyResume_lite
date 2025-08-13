'use client';

import { useState, useEffect } from 'react';

interface ExperienceItem {
  _id?: string;
  company?: string;
  title?: string;
  position?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  technologies?: string[];
  responsibilities?: string[];
  [key: string]: unknown;
}

export default function SimpleExperience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('SIMPLE: Loading experiences...');
      const response = await fetch('/api/admin/experience');
      console.log('SIMPLE: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('SIMPLE: Data received:', data);
        console.log('SIMPLE: Data type:', typeof data);
        console.log('SIMPLE: Is array:', Array.isArray(data));
        console.log('SIMPLE: Length:', data.length);
        
        setExperiences(Array.isArray(data) ? data : []);
      } else {
        setError(`Failed: ${response.status}`);
      }
    } catch (err: unknown) {
      console.error('SIMPLE: Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl mb-8">Simple Experience Test</h1>
      
      <div className="mb-8">
        <button 
          onClick={loadData}
          className="bg-blue-600 text-white px-6 py-3 rounded mr-4"
        >
          Reload Data
        </button>
        
        <div className="mt-4 text-lg">
          <p>Loading: <span className="text-yellow-400">{loading.toString()}</span></p>
          <p>Error: <span className="text-red-400">{error || 'None'}</span></p>
          <p>Experiences Count: <span className="text-green-400">{experiences.length}</span></p>
        </div>
      </div>

      {experiences.length > 0 && (
        <div>
          <h2 className="text-2xl mb-4">Experience Data:</h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={exp._id || index} className="bg-gray-800 p-6 rounded">
                <h3 className="text-xl text-yellow-400 mb-2">
                  Experience #{index + 1}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>ID:</strong> {exp._id as string}
                  </div>
                  <div>
                    <strong>Company:</strong> {(exp.company as string) || 'N/A'}
                  </div>
                  <div>
                    <strong>Title:</strong> {(exp.title as string) || (exp.position as string) || 'N/A'}
                  </div>
                  <div>
                    <strong>Location:</strong> {(exp.location as string) || 'N/A'}
                  </div>
                  <div>
                    <strong>Start:</strong> {(exp.startDate as string) || 'N/A'}
                  </div>
                  <div>
                    <strong>End:</strong> {(exp.endDate as string) || ((exp.current as boolean) ? 'Present' : 'N/A')}
                  </div>
                  <div>
                    <strong>Technologies:</strong> {Array.isArray(exp.technologies) ? exp.technologies.length : 0} items
                  </div>
                  <div>
                    <strong>Responsibilities:</strong> {Array.isArray(exp.responsibilities) ? exp.responsibilities.length : 0} items
                  </div>
                </div>
                
                <div className="mt-4">
                  <strong>Raw JSON:</strong>
                  <pre className="bg-gray-900 p-2 rounded text-xs mt-2 overflow-auto">
                    {JSON.stringify(exp, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && experiences.length === 0 && !error && (
        <div className="text-center py-16">
          <h2 className="text-2xl text-red-400">No Experiences Found</h2>
          <p className="text-gray-400 mt-4">The API returned an empty array</p>
        </div>
      )}
    </div>
  );
}
