"use client";

import { useState } from "react";
import { useDarkMode } from "./DarkModeContext";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isDarkMode ? 'bg-black/80' : 'bg-white/80'
    } backdrop-blur-md border-b ${
      isDarkMode ? 'border-gray-800' : 'border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className={`text-xl font-light tracking-wider transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            V.V.S.R
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className={`text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}>
              home
            </a>
            <a href="#about" className={`text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}>
              about
            </a>
            <a href="#skills" className={`text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}>
              expertise
            </a>
            <a href="#experience" className={`text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}>
              experience
            </a>
            <a href="#projects" className={`text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}>
              portfolio
            </a>
            <a href="#contact" className={`text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}>
              contact
            </a>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-100'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden border-t ${
            isDarkMode ? 'border-gray-800 bg-black/90' : 'border-gray-200 bg-white/90'
          } backdrop-blur-md`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className={`block px-3 py-2 text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}>
                home
              </a>
              <a href="#about" className={`block px-3 py-2 text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}>
                about me
              </a>
              <a href="#skills" className={`block px-3 py-2 text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}>
                skills
              </a>
              <a href="#experience" className={`block px-3 py-2 text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}>
                experience
              </a>
              <a href="#projects" className={`block px-3 py-2 text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}>
                projects
              </a>
              <a href="#contact" className={`block px-3 py-2 text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}>
                contact
              </a>
              
              <div className="px-3 py-2">
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className={`flex items-center space-x-2 text-sm font-light tracking-wider uppercase transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <span>{isDarkMode ? 'light mode' : 'dark mode'}</span>
                  {isDarkMode ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
