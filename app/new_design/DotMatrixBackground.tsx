"use client";

import { useDarkMode } from "./DarkModeContext";

export default function DotMatrixBackground() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Main dot matrix pattern */}
      <div 
        className={`absolute inset-0 opacity-30 transition-opacity duration-300 ${
          isDarkMode ? 'opacity-20' : 'opacity-30'
        }`}
        style={{
          backgroundImage: `radial-gradient(circle, ${
            isDarkMode ? '#ffffff' : '#000000'
          } 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px'
        }}
      />
      
      {/* Secondary smaller dots */}
      <div 
        className={`absolute inset-0 opacity-20 transition-opacity duration-300 ${
          isDarkMode ? 'opacity-10' : 'opacity-20'
        }`}
        style={{
          backgroundImage: `radial-gradient(circle, ${
            isDarkMode ? '#ffffff' : '#000000'
          } 0.5px, transparent 0.5px)`,
          backgroundSize: '15px 15px',
          backgroundPosition: '7.5px 7.5px'
        }}
      />
      
      {/* Animated gradient overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-black via-gray-900 to-black opacity-80' 
          : 'bg-gradient-to-br from-white via-gray-50 to-white opacity-80'
      }`} />
      
      {/* Subtle moving dots */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full transition-colors duration-300 ${
              isDarkMode ? 'bg-white' : 'bg-black'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
              animation: `float ${Math.random() * 10 + 10}s infinite linear`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(0px) translateX(-10px); }
          75% { transform: translateY(20px) translateX(5px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
      `}</style>
    </div>
  );
}
