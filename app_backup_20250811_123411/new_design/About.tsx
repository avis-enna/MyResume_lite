"use client";

import { useState, useEffect } from 'react';
import { useDarkMode } from "./DarkModeContext";

interface AboutData {
  personal: {
    name: string;
    title: string;
    profileImage: string;
    socialLinks: {
      linkedin: string;
      github: string;
      email: string;
    };
  };
  bio: {
    paragraph1: string;
    paragraph2: string;
  };
  skillsGrid: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  experienceSummary: {
    experienced: {
      title: string;
      items: string[];
    };
    years: {
      title: string;
      items: string[];
    };
    current: {
      title: string;
      items: string[];
    };
  };
}


export default function About() {
  const { isDarkMode } = useDarkMode();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/about');
      if (response.ok) {
        const data = await response.json();
        setAboutData(data);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconSvg = (iconType: string) => {
    switch (iconType) {
      case 'shield':
        return <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>;
      case 'star':
        return <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>;
      case 'desktop':
        return <path d="M21 16V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM5 4h14v12H5V4z"/>;
      case 'check':
        return <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>;
      default:
        return <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>;
    }
  };

  if (loading) {
    return (
      <section id="about" className={`min-h-screen py-20 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-stone-50'}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading about section...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!aboutData) {
    return (
      <section id="about" className={`min-h-screen py-20 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-stone-50'}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <p className={`transition-colors duration-300 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>Failed to load about section</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className={`min-h-screen py-20 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-stone-50'}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-light tracking-[0.1em] uppercase mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>about</h2>
            <div className={`w-24 h-px mx-auto transition-colors duration-300 ${isDarkMode ? 'bg-white' : 'bg-stone-400'}`}></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-16 items-start">
            {/* Profile Section */}
            <div className="lg:col-span-1 text-center">
              <div className={`w-60 h-60 rounded-2xl mx-auto mb-8 flex items-center justify-center relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/10 border border-gray-800/30' : 'bg-gray-50 border border-gray-200'}`}>
                <img
                  src={aboutData.personal.profileImage}
                  alt={aboutData.personal.name}
                  width={240}
                  height={240}
                  className="object-cover transition-transform duration-300 hover:scale-105"

                />
              </div>
              <h3 className={`text-2xl font-light mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>{aboutData.personal.name}</h3>
              <p className={`text-sm mb-6 font-light tracking-wide transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-stone-600'}`}>
                {aboutData.personal.title}
              </p>
              <div className="flex justify-center space-x-8 mb-8">
                <a href={aboutData.personal.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={`text-xs font-light tracking-[0.15em] transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-white border-b border-transparent hover:border-white' : 'text-stone-600 hover:text-stone-800 border-b border-transparent hover:border-stone-700'}`}>
                  LINKEDIN
                </a>
                <a href={aboutData.personal.socialLinks.github} target="_blank" rel="noopener noreferrer" className={`text-xs font-light tracking-[0.15em] transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-white border-b border-transparent hover:border-white' : 'text-stone-600 hover:text-stone-800 border-b border-transparent hover:border-stone-700'}`}>
                  GITHUB
                </a>
                <a href={`mailto:${aboutData.personal.socialLinks.email}`} className={`text-xs font-light tracking-[0.15em] transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-white border-b border-transparent hover:border-white' : 'text-stone-600 hover:text-stone-800 border-b border-transparent hover:border-stone-700'}`}>
                  EMAIL
                </a>
              </div>
            </div>

            {/* About Content */}
            <div className="lg:col-span-2">
              <div className="mb-12">
                <p className={`text-lg leading-relaxed mb-6 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-stone-700'}`}>
                  {aboutData.bio.paragraph1}
                </p>
                <p className={`leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-stone-600'}`}>
                  {aboutData.bio.paragraph2}
                </p>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-2 gap-6">
                {aboutData.skillsGrid.map((skill) => (
                  <div key={skill.id} className={`p-6 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/10 border-gray-800/30' : 'bg-gray-50 border-gray-200'}`}>
                    <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100'}`}>
                      <svg className={`w-6 h-6 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                        {getIconSvg(skill.icon)}
                      </svg>
                    </div>
                    <h4 className={`text-base font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>{skill.title}</h4>
                    <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{skill.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Experience Summary */}
          <div className="mt-20">
            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(aboutData.experienceSummary).map(([key, section]) => (
                <div key={key} className="text-center">
                  <h4 className={`text-lg font-medium mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>{section.title}</h4>
                  <ul className={`space-y-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {section.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
