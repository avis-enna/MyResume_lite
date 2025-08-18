"use client";

import { useDarkMode } from "./DarkModeContext";

interface FooterProps {
  aboutData: any;
  contactData: any;
}

export default function Footer({ aboutData, contactData }: FooterProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <footer className={`py-12 px-6 lg:px-8 border-t transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-white border-gray-800' : 'bg-white text-black border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className={`text-xl font-light tracking-wider mb-4 md:mb-0 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            SVR.
          </div>
          
          <div className={`text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            design & coding by me
          </div>
        </div>
        
        <div className={`mt-8 pt-8 border-t text-center transition-colors duration-300 ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <p className={`text-xs transition-colors duration-300 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            © {new Date().getFullYear()} {aboutData.name || 'Venna Venkata Siva Reddy'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
