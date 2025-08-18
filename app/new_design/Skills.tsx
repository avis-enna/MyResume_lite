"use client";

import { useDarkMode } from "./DarkModeContext";

interface SkillsProps {
  skillsData: any;
}

export default function Skills({ skillsData }: SkillsProps) {
  const { isDarkMode } = useDarkMode();

  const skillCategories = skillsData.skillCategories || [];
  const certifications = skillsData.certifications || [];

  return (
    <section id="skills" className={`py-20 px-6 lg:px-8 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className={`text-4xl md:text-6xl font-light tracking-wider uppercase transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            expertise
          </h2>
          <div className={`w-16 h-1 mx-auto mt-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-white' : 'bg-black'
          }`}></div>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <div 
              key={categoryIndex}
              className={`p-6 border transition-all duration-300 hover:shadow-lg ${
                isDarkMode ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800' : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <h3 className={`text-xl font-light mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                {category.title}
              </h3>
              <div className="space-y-2">
                {category.skills.map((skill, skillIndex) => (
                  <div 
                    key={skillIndex}
                    className={`text-sm py-1 px-3 rounded transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="text-center mb-16">
          <h3 className={`text-2xl font-light mb-8 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            Professional Certifications
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <div 
                key={index}
                className={`p-6 border transition-all duration-300 hover:shadow-lg ${
                  isDarkMode ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800' : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <p className={`text-sm font-light transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {cert}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Expertise Summary */}
        <div className="text-center">
          <h3 className={`text-2xl font-light mb-6 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            Technical Expertise
          </h3>
          <p className={`text-lg leading-relaxed max-w-4xl mx-auto transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {skillsData.technicalExpertise?.description || 'A results-driven Software Engineer with hands-on experience in migrating legacy systems to modern, cloud-native environments. Proven expertise in the full software development lifecycle, from backend development with Java/Spring Boot to frontend implementation with React. Specialized in Kubernetes, Docker, and GitOps workflows using Helm and FluxCD.'}
          </p>
        </div>
      </div>
    </section>
  );
}
