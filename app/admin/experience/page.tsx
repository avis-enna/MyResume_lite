import Link from 'next/link';
import connectDB from '@/app/lib/mongodb';
import Experience from '@/app/models/Experience';
import { redirect } from 'next/navigation';

// Server action for deleting experience
async function deleteExperience(formData: FormData) {
  'use server';

  const experienceId = formData.get('experienceId') as string;

  try {
    await connectDB();
    await Experience.findByIdAndDelete(experienceId);
    console.log('Experience deleted successfully:', experienceId);
  } catch (error) {
    console.error('Error deleting experience:', error);
    throw error;
  }

  // Redirect to refresh the page
  redirect('/admin/experience');
}

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

export default async function AdminExperience() {
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
              <h1 className="text-2xl font-light tracking-[0.3em] text-amber-100 uppercase">Manage Experience</h1>
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
          {/* Success Message */}
          <div className="mb-8 p-4 bg-green-900/20 border border-green-700/50 rounded">
            <h3 className="text-green-400 mb-2">✅ Admin Panel Working!</h3>
            <p className="text-green-300 text-sm">Server-side rendering • Database connected • Found {experiences.length} experiences</p>
          </div>

          {experiences.length === 0 ? (
            <div className="text-center py-20" data-testid="experience-empty">
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
              {experiences.map((experience: any) => (
                <div key={experience._id} className="bg-amber-950/10 border border-amber-800/30 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-light text-amber-100 mb-2">
                        {experience.title || experience.position || 'No Title'}
                      </h3>
                      <p className="text-amber-300 font-medium">{experience.company}</p>
                      <p className="text-amber-400/70 text-sm">{experience.location}</p>
                      <span className="text-amber-500/70 text-sm">
                        {experience.startDate} - {experience.current ? 'Present' : (experience.endDate || 'N/A')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/experience/${experience._id}/edit`}
                        className="bg-blue-900/30 border border-blue-700/50 text-blue-200 px-4 py-2 rounded text-sm hover:bg-blue-800/40 transition-colors"
                      >
                        Edit
                      </Link>
                      <form action={deleteExperience} className="inline">
                        <input type="hidden" name="experienceId" value={experience._id} />
                        <button
                          type="submit"
                          className="bg-red-900/30 border border-red-700/50 text-red-200 px-4 py-2 rounded text-sm hover:bg-red-800/40 transition-colors"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Description */}
                  {experience.description && (
                    <div className="mb-4">
                      <h4 className="font-medium text-amber-200 mb-2">Description:</h4>
                      {Array.isArray(experience.description) ? (
                        <ul className="list-disc list-inside space-y-1 text-amber-300/80">
                          {experience.description.map((desc: any, idx: number) => (
                            <li key={idx} className="text-sm">{desc}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-amber-300/80 text-sm">{experience.description}</p>
                      )}
                    </div>
                  )}

                  {/* Responsibilities */}
                  {experience.responsibilities && experience.responsibilities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-amber-200 mb-2">Responsibilities:</h4>
                      <ul className="list-disc list-inside space-y-1 text-amber-300/80">
                        {experience.responsibilities.map((resp: any, idx: number) => (
                          <li key={idx} className="text-sm">{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Achievements */}
                  {experience.achievements && experience.achievements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-amber-200 mb-2">Achievements:</h4>
                      <ul className="list-disc list-inside space-y-1 text-amber-300/80">
                        {experience.achievements.map((ach: any, idx: number) => (
                          <li key={idx} className="text-sm">{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technologies */}
                  {experience.technologies && experience.technologies.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-amber-200 mb-2">Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech, idx) => (
                          <span key={idx} className="bg-amber-900/30 border border-amber-700/50 text-amber-200 px-3 py-1 rounded text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}