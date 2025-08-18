"use client";

import { useState } from "react";
import { useDarkMode } from "./DarkModeContext";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  image: string;
  demoUrl?: string;
  githubUrl?: string;
}

interface ProjectsProps {
  projects: any[];
}

export default function Projects({ projects }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const { isDarkMode } = useDarkMode();

  // Use the actual projects data passed as props

  return (
    <section id="projects" className={`py-20 px-6 lg:px-8 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className={`text-4xl md:text-6xl font-light tracking-wider uppercase transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            portfolio
          </h2>
          <div className={`w-16 h-1 mx-auto mt-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-white' : 'bg-black'
          }`}></div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {projects.length > 0 ? projects.map((project, index) => (
            <div
              key={project._id || index}
              className={`border transition-all duration-300 hover:shadow-lg ${
                isDarkMode ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800' : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              {/* Project Image Placeholder */}
              <div className={`h-48 flex items-center justify-center transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div className={`text-4xl transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {project.featured ? '⭐' : '📁'}
                </div>
              </div>

              <div className="p-6">
                <h3 className={`text-xl font-light mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                  {project.title}
                </h3>
                <p className={`text-sm mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {project.subtitle}
                </p>
                <p className={`text-sm leading-relaxed mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className={`px-2 py-1 text-xs rounded transition-colors duration-300 ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className={`px-2 py-1 text-xs rounded transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-600'
                      }`}>
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className={`text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
                      isDarkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
                    }`}
                  >
                    see project
                  </button>
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl}
                      className={`text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      github
                    </a>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-2 text-center py-16">
              <p className={`text-lg transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No projects available.
              </p>
            </div>
          )}
        </div>

        {/* Show More Button */}
        <div className="text-center">
          <button
            type="button"
            className={`px-10 py-4 border-2 font-light tracking-wider text-sm uppercase transition-all duration-500 hover:scale-[1.02] ${
              isDarkMode 
                ? 'border-white text-white hover:bg-white hover:text-black' 
                : 'border-black text-black hover:bg-black hover:text-white'
            }`}
          >
            show more projects
          </button>
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-light transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                  {selectedProject.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className={`text-2xl transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  ×
                </button>
              </div>

              {/* Project Image Placeholder */}
              <div className={`h-64 mb-6 flex items-center justify-center transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                {selectedProject.id === 'log-analysis' && (
                  <div className={`text-6xl transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>📊</div>
                )}
                {selectedProject.id === 'iot-monitoring' && (
                  <div className={`text-6xl transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>🌡️</div>
                )}
                {selectedProject.id === 'microservices-ecommerce' && (
                  <div className={`text-6xl transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>🛒</div>
                )}
                {selectedProject.id === 'library-management' && (
                  <div className={`text-6xl transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>📚</div>
                )}
              </div>

              <h4 className={`text-xl font-light mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                {selectedProject.title}
              </h4>

              <h5 className={`text-lg font-light mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Description
              </h5>
              <p className={`text-sm leading-relaxed mb-6 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {selectedProject.longDescription}
              </p>

              <h5 className={`text-lg font-light mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Technologies
              </h5>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.technologies.map((tech) => (
                  <span 
                    key={tech}
                    className={`px-3 py-1 text-sm rounded transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <h5 className={`text-lg font-light mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Category
              </h5>
              <p className={`text-sm mb-6 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {selectedProject.category}
              </p>

              <div className="flex space-x-4">
                {selectedProject.demoUrl && (
                  <a 
                    href={selectedProject.demoUrl}
                    className={`px-6 py-3 border-2 font-light tracking-wider text-sm uppercase transition-all duration-500 hover:scale-[1.02] ${
                      isDarkMode 
                        ? 'border-white text-white hover:bg-white hover:text-black' 
                        : 'border-black text-black hover:bg-black hover:text-white'
                    }`}
                  >
                    Live Demo
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a 
                    href={selectedProject.githubUrl}
                    className={`px-6 py-3 font-light tracking-wider text-sm uppercase transition-all duration-500 hover:scale-[1.02] ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-white border-b border-transparent hover:border-white' 
                        : 'text-gray-600 hover:text-black border-b border-transparent hover:border-black'
                    }`}
                  >
                    View Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
