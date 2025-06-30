'use client';
import React, { useState, useEffect } from 'react';

const Notification = ({ message, type = 'success', show, onClose, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show && !isVisible) return null;

  const typeStyles = {
    success: {
      bg: 'from-green-500 to-emerald-500',
      icon: '✅',
      border: 'border-green-200'
    },
    error: {
      bg: 'from-red-500 to-pink-500',
      icon: '❌',
      border: 'border-red-200'
    },
    warning: {
      bg: 'from-yellow-500 to-orange-500',
      icon: '⚠️',
      border: 'border-yellow-200'
    },
    info: {
      bg: 'from-blue-500 to-cyan-500',
      icon: 'ℹ️',
      border: 'border-blue-200'
    }
  };

  const style = typeStyles[type] || typeStyles.success;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className={`notification rounded-2xl p-6 shadow-2xl transform transition-all duration-300 ease-in-out border-2 ${style.border} ${
          isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          maxWidth: '400px',
          minWidth: '300px'
        }}
      >
        <div className="flex items-start space-x-4">
          {/* Icon with gradient background */}
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${style.bg} flex items-center justify-center text-white text-xl font-bold shadow-lg glow-animation`}>
            {style.icon}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 font-medium text-base leading-relaxed">
              {message}
            </p>
          </div>
          
          {/* Close button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:scale-110 transform"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${style.bg} rounded-full transition-all duration-[${duration}ms] ease-linear ${
              isVisible ? 'w-0' : 'w-full'
            }`}
            style={{
              animation: isVisible ? `shrink ${duration}ms linear` : 'none'
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Notification;
