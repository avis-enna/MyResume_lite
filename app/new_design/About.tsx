"use client";

import { useDarkMode } from "./DarkModeContext";

interface AboutProps {
  aboutData: any;
  contactData: any;
}

export default function About({ aboutData, contactData }: AboutProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <section id="about" className={`py-20 px-6 lg:px-8 transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className={`text-4xl md:text-6xl font-light tracking-wider uppercase transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            about
          </h2>
          <div className={`w-16 h-1 mx-auto mt-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-white' : 'bg-black'
          }`}></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Profile Section */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <img
                src="/profile-photo.png"
                alt="Venna Venkata Siva Reddy"
                className="w-64 h-64 object-cover rounded-lg mx-auto lg:mx-0 shadow-2xl"
              />
            </div>
            
            <h3 className={`text-2xl font-light mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              {aboutData.name || 'Venna Venkata Siva Reddy'}
            </h3>
            <p className={`text-lg mb-6 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {aboutData.title || 'Software Engineer'} · Cisco Systems
            </p>

            {/* Social Links */}
            <div className="flex justify-center lg:justify-start space-x-6 mb-8">
              <a
                href={contactData.linkedin || "https://linkedin.com/in/sivavenna"}
                className={`text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                LINKEDIN
              </a>
              <a
                href={contactData.github || "https://github.com/avis-enna"}
                className={`text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                GITHUB
              </a>
              <a
                href={`mailto:${contactData.email || 'vsivareddy.venna@gmail.com'}`}
                className={`text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                EMAIL
              </a>
            </div>
          </div>

          {/* About Content */}
          <div className="space-y-8">
            <div>
              <p className={`text-lg leading-relaxed mb-6 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {aboutData.bio?.paragraph1 || 'A results-driven Software Engineer with hands-on experience in migrating legacy systems to modern, cloud-native environments. Proven expertise in the full software development lifecycle, from backend development with Java/Spring Boot to frontend implementation with React.'}
              </p>
              <p className={`text-lg leading-relaxed transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {aboutData.bio?.paragraph2 || 'Specialized in Kubernetes, Docker, and GitOps workflows using Helm and FluxCD. A proactive problem-solver with unique cross-functional experience in network engineering (CCNA) and data analytics, passionate about building scalable, mission-critical software.'}
              </p>
            </div>

            {/* Skills Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`p-6 border transition-colors duration-300 ${
                isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
              }`}>
                <h4 className={`text-lg font-light mb-3 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                  Network & Security
                </h4>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  CCNA, CCCA certified with expertise in TCP/IP, routing, switching
                </p>
              </div>

              <div className={`p-6 border transition-colors duration-300 ${
                isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
              }`}>
                <h4 className={`text-lg font-light mb-3 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                  Full Stack Development
                </h4>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Java Spring Boot, React, REST APIs, database design
                </p>
              </div>

              <div className={`p-6 border transition-colors duration-300 ${
                isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
              }`}>
                <h4 className={`text-lg font-light mb-3 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                  System Administration
                </h4>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Linux, Windows Server, automation scripting
                </p>
              </div>

              <div className={`p-6 border transition-colors duration-300 ${
                isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
              }`}>
                <h4 className={`text-lg font-light mb-3 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                  DevOps & Cloud
                </h4>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Docker, CI/CD, monitoring, infrastructure automation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
