"use client";

import { useState, useEffect } from "react";
import { useDarkMode } from "./DarkModeContext";

interface HeroProps {
  aboutData: any;
  contactData: any;
}

export default function Hero({ aboutData, contactData }: HeroProps) {
  const [currentTitle, setCurrentTitle] = useState(0);
  const { isDarkMode } = useDarkMode();

  console.log('Hero component received data:', { aboutData, contactData });

  const titles = [
    "software engineer",
    "cloud architect", 
    "systems developer",
    "technology consultant"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle((prev) => (prev + 1) % titles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <div className="space-y-8">
          {/* Name */}
          <div>
            <h1 className={`text-6xl md:text-8xl lg:text-9xl font-light tracking-wider leading-none transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              {(aboutData.name || 'VENNA VENKATA SIVA REDDY').toUpperCase()}
            </h1>
          </div>

          {/* Animated Title */}
          <div className="h-16 flex items-center justify-center">
            <h2 className={`text-2xl md:text-3xl font-light tracking-widest uppercase transition-all duration-500 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {titles[currentTitle]}
            </h2>
          </div>

          {/* Description */}
          <p className={`text-lg md:text-xl font-light leading-relaxed max-w-4xl mx-auto transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {aboutData.bio?.paragraph1 || 'Distinguished software engineer specializing in cloud-native architectures and enterprise systems. Currently architecting scalable solutions at Cisco Systems with expertise in Kubernetes and modern development practices.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 pt-8">
            <button
              type="button"
              onClick={() => scrollToSection('projects')}
              className={`px-10 py-4 border-2 font-light tracking-wider text-sm uppercase transition-all duration-500 hover:scale-[1.02] ${
                isDarkMode 
                  ? 'border-white text-white hover:bg-white hover:text-black' 
                  : 'border-stone-700 text-stone-700 hover:bg-stone-700 hover:text-stone-50'
              }`}
            >
              portfolio
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className={`px-10 py-4 font-light tracking-wider text-sm uppercase transition-all duration-500 hover:scale-[1.02] ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white border-b border-transparent hover:border-white' 
                  : 'text-stone-600 hover:text-stone-800 border-b border-transparent hover:border-stone-700'
              }`}
            >
              contact
            </button>
          </div>
        </div>
      </div>

      {/* Side Service Label */}
      <div className="absolute bottom-12 right-12 text-right hidden lg:block">
        <div className={`text-sm font-light tracking-widest uppercase transition-colors duration-300 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          PORTFOLIO
        </div>
        <div className={`text-xs font-light tracking-widest mt-2 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-600' : 'text-gray-500'
        }`}>
          MMXXIV
        </div>
      </div>
    </section>
  );
}
