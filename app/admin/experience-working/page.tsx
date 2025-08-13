import Link from 'next/link';
import connectDB from '@/app/lib/mongodb';
import Experience from '@/app/models/Experience';
import DeleteButton from './DeleteButton';

// Server-side data fetching (like the main site)
async function getExperiences() {
  try {
    await connectDB();
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(experiences)); // Serialize for Next.js
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
}

export default async function WorkingExperience() {
  const experiences = await getExperiences();

  return (
    <div className="min-h-screen bg-black text-white font-serif">
      {/* Header */}
      <header className="bg-amber-950/20 border-b border-amber-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6">
              <Link href="/admin/dashboard" className="text-amber-300/70 hover:text-amber-200 font-light tracking-[0.1em] transition-colors">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-light tracking-[0.3em] text-amber-100 uppercase">Working Experience Manager</h1>
            </div>
            <div className="flex gap-4">
              <Link href="/admin/experience/new" className="bg-amber-900/30 border border-amber-700/50 text-amber-100 px-6 py-3 rounded font-light tracking-[0.2em] uppercase text-sm hover:bg-amber-800/40 hover:border-amber-600 transition-all duration-500">
                Add Experience
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="py-6">
          {/* Debug Info */}
          <div className="mb-8 p-4 bg-gray-800 rounded">
            <h3 className="text-amber-200 mb-4">Debug Info:</h3>
            <p className="text-green-400">✅ Server-side rendering working</p>
            <p className="text-green-400">✅ Database connection working</p>
            <p className="text-green-400">✅ Found {experiences.length} experiences</p>
          </div>

          {experiences.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-amber-400/60 mb-8">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                </svg>
              </div>
              <h3 className="text-2xl font-light tracking-[0.2em] text-amber-200 mb-4 uppercase">No Experience Entries</h3>
              <p className="text-amber-300/60 font-light mb-8 italic">Get started by adding your first work experience.</p>
              <Link href="/admin/experience/new" className="bg-amber-900/30 border border-amber-700/50 text-amber-100 px-8 py-4 rounded font-light tracking-[0.2em] uppercase text-sm hover:bg-amber-800/40 hover:border-amber-600 transition-all duration-500">
                Add Experience
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {experiences.map((experience) => (
                <div key={experience._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {experience.title || experience.position || 'No Title'}
                      </h3>
                      <p className="text-blue-600 font-medium">{experience.company}</p>
                      <p className="text-gray-600 text-sm">{experience.location}</p>
                      <span className="text-gray-500 text-sm">
                        {experience.startDate} - {experience.current ? 'Present' : (experience.endDate || 'N/A')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/experience/${experience._id}/edit`}
                        className="text-blue-600 hover:text-blue-700 text-sm px-3 py-1 border border-blue-300 rounded hover:bg-blue-50"
                      >
                        Edit
                      </Link>
                      <DeleteButton experienceId={experience._id} />
                    </div>
                  </div>
                  
                  {/* Description */}
                  {experience.description && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Description:</h4>
                      {Array.isArray(experience.description) ? (
                        <ul className="list-disc list-inside space-y-1">
                          {experience.description.map((desc, idx) => (
                            <li key={idx} className="text-gray-700 text-sm">{desc}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 text-sm">{experience.description}</p>
                      )}
                    </div>
                  )}

                  {/* Responsibilities */}
                  {experience.responsibilities && experience.responsibilities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Responsibilities:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {experience.responsibilities.map((resp, idx) => (
                          <li key={idx} className="text-gray-700 text-sm">{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Achievements */}
                  {experience.achievements && experience.achievements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Achievements:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {experience.achievements.map((ach, idx) => (
                          <li key={idx} className="text-gray-700 text-sm">{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technologies */}
                  {experience.technologies && experience.technologies.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Raw Data for Debugging */}
                  <details className="mt-4">
                    <summary className="text-xs text-gray-500 cursor-pointer">Show Raw Data</summary>
                    <pre className="bg-gray-100 p-2 rounded text-xs mt-2 overflow-auto">
                      {JSON.stringify(experience, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
