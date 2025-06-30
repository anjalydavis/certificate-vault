import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

export const BackgroundAnimation: React.FC = () => {
  const { isDark } = useTheme()

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`} />
      
      {/* Animated Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-20 animate-float ${
              isDark ? 'bg-blue-400' : 'bg-blue-300'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 4}s`,
            }}
          />
        ))}
      </div>
      
      {/* Floating Shapes */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 animate-pulse ${
          isDark ? 'bg-purple-400' : 'bg-indigo-300'
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 animate-pulse ${
          isDark ? 'bg-blue-400' : 'bg-blue-300'
        }`} style={{ animationDelay: '1s' }} />
      </div>
    </div>
  )
}