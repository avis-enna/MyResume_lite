import { getProjects } from '@/app/lib/projects-mongo';

// Force dynamic rendering to ensure fresh data from MongoDB
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Projects() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-white mb-4">Projects</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
            A showcase of my technical projects, from IoT applications to full-stack web development.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl text-gray-400 mb-2">No Projects Yet</h3>
            <p className="text-gray-500">Projects will appear here once they are added through the admin panel.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {projects.map((project, index) => (
              <div key={project._id || index} className={`bg-gray-950 border border-gray-800 rounded-lg p-8 hover:border-gray-700 transition-colors ${project.featured ? 'border-gray-700' : ''}`}>
                {project.featured && (
                  <div className="mb-4">
                    <span className="inline-block bg-gray-900 text-gray-400 px-3 py-1 rounded border border-gray-800 text-sm font-light">
                      Featured Project
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-2xl font-light tracking-[0.1em] text-gray-300 mb-4">{project.title}</h2>
                  <p className="text-lg text-gray-400 leading-relaxed font-light">{project.description}</p>
                </div>

                {project.features && project.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-light tracking-[0.1em] text-gray-400 mb-3">Key Features:</h3>
                    <ul className="space-y-2">
                      {project.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-gray-600 mr-2 mt-1">•</span>
                      <span className="text-gray-400 font-light">{feature}</span>
                    </li>
                  ))}
                    </ul>
                  </div>
                )}

                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-light tracking-[0.1em] text-gray-400 mb-3">Technologies Used:</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-900 text-gray-400 px-3 py-1 rounded border border-gray-800 text-sm font-light"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conditional Links - Only show if URLs are provided */}
                {(project.githubUrl || project.liveUrl) && (
                  <div className="flex flex-wrap gap-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-light tracking-[0.1em] uppercase text-sm border border-gray-700 hover:border-gray-600"
                      >
                        <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        View Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-light tracking-[0.1em] uppercase text-sm"
                      >
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Live Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-light tracking-[0.1em] text-gray-300 mb-4">Interested in Collaboration?</h2>
            <p className="text-gray-400 mb-6 font-light">
              I'm always open to discussing new projects, innovative ideas, or opportunities to contribute to your team.
            </p>
            <a href="/contact" className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-light tracking-[0.1em] uppercase text-sm">
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
