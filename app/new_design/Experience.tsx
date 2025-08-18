"use client";

import { useDarkMode } from "./DarkModeContext";

interface ExperienceProps {
  experiences: any[];
}

export default function Experience({ experiences }: ExperienceProps) {
  const { isDarkMode } = useDarkMode();

  // Use the actual experiences data passed as props

  const education = {
    degree: "Bachelor of Engineering (B.E.)",
    field: "Electronics and Telecommunication Engineering", 
    institution: "Sir M Visvesvaraya Institute of Technology",
    location: "Bengaluru, India",
    period: "",
    cgpa: ""
  };

  const certifications = [
    {
      name: "Cisco Certified DevNet Associate (DEVASC)",
      issuer: "Cisco",
      year: "",
      status: "Certified"
    },
    {
      name: "Cisco Certified Network Associate (CCNA)",
      issuer: "Cisco", 
      year: "",
      status: "Certified"
    },
    {
      name: "Cisco Certified Cybersecurity Associate (CCCA)",
      issuer: "Cisco",
      year: "",
      status: "Certified"
    }
  ];

  return (
    <section id="experience" className={`py-20 px-6 lg:px-8 transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className={`text-4xl md:text-6xl font-light tracking-wider uppercase transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            experience
          </h2>
          <div className={`w-16 h-1 mx-auto mt-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-white' : 'bg-black'
          }`}></div>
        </div>

        {/* Professional Experience */}
        <div className="mb-20">
          <h3 className={`text-2xl font-light mb-12 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            Professional Experience
          </h3>

          <div className="relative">
            {experiences.length > 0 ? experiences.map((exp, index) => (
              <div key={exp._id || index} className="relative flex">
                {/* Timeline line */}
                {index < experiences.length - 1 && (
                  <div className={`absolute left-6 top-12 w-0.5 h-full transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                  }`}></div>
                )}

                {/* Timeline dot */}
                <div className={`relative z-10 w-12 h-12 rounded-full border-4 flex-shrink-0 transition-colors duration-300 ${
                  isDarkMode ? 'bg-black border-white' : 'bg-white border-black'
                }`}></div>

                {/* Content */}
                <div className="ml-8 pb-12 flex-1">
                  <h4 className={`text-xl font-light mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}>
                    {exp.title}
                  </h4>
                  <p className={`text-lg font-medium mb-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {exp.company}
                  </p>
                  <p className={`text-sm mb-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {exp.location}
                  </p>
                  <p className={`text-sm mb-6 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>

                  {exp.description && (
                    <div className="mb-6">
                      <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {exp.description}
                      </p>
                    </div>
                  )}

                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="mb-6">
                      <h5 className={`text-lg font-light mb-3 transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-black'
                      }`}>
                        Key Responsibilities
                      </h5>
                      <ul className="space-y-3">
                        {exp.responsibilities.map((item, idx) => (
                          <li key={idx} className={`text-sm leading-relaxed transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mb-6">
                      <h5 className={`text-lg font-light mb-3 transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-black'
                      }`}>
                        Key Achievements
                      </h5>
                      <ul className="space-y-3">
                        {exp.achievements.map((item, idx) => (
                          <li key={idx} className={`text-sm leading-relaxed transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            ○ {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`px-3 py-1 text-xs rounded transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-center py-16">
                <p className={`text-lg transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No experience data available.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Education */}
          <div>
            <h3 className={`text-2xl font-light mb-8 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              Education
            </h3>
            <div className={`p-6 border transition-colors duration-300 ${
              isDarkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
            }`}>
              <h4 className={`text-lg font-light mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                {education.degree}
              </h4>
              <p className={`text-sm mb-1 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {education.field}
              </p>
              <p className={`text-sm mb-1 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {education.institution}
              </p>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {education.location}
              </p>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className={`text-2xl font-light mb-8 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              Certifications
            </h3>
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div 
                  key={index}
                  className={`p-6 border transition-colors duration-300 ${
                    isDarkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <h4 className={`text-lg font-light mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}>
                    {cert.name}
                  </h4>
                  <p className={`text-sm mb-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {cert.issuer} • {cert.year}
                  </p>
                  <span className={`inline-block px-3 py-1 text-xs rounded transition-colors duration-300 ${
                    isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                  }`}>
                    {cert.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
