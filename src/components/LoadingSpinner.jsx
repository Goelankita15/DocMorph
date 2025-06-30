'use client';
import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'indigo', message = 'Loading...', overlay = false }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const colorClasses = {
    indigo: 'border-indigo-500',
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    green: 'border-green-500',
    red: 'border-red-500',
    gray: 'border-gray-500'
  };

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Professional spinner */}
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full animate-spin`}>
          <div className={`absolute inset-0 border-4 border-transparent ${colorClasses[color]} border-t-4 rounded-full animate-spin`}></div>
        </div>
      </div>
      
      {/* Message */}
      {message && (
        <div className="text-center space-y-2">
          <p className={`text-${color}-600 font-medium text-lg`}>
            {message}
          </p>
          <div className="flex justify-center space-x-1">
            <div className={`w-2 h-2 bg-${color}-400 rounded-full animate-bounce`} style={{animationDelay: '0s'}}></div>
            <div className={`w-2 h-2 bg-${color}-400 rounded-full animate-bounce`} style={{animationDelay: '0.1s'}}></div>
            <div className={`w-2 h-2 bg-${color}-400 rounded-full animate-bounce`} style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-xl">
          <LoadingContent />
        </div>
      </div>
    );
  }

  return <LoadingContent />;
};

export default LoadingSpinner;
