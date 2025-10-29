
import React from 'react';

interface LoadingIndicatorProps {
  message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 rounded-lg">
      <div className="w-16 h-16 border-4 border-t-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
      <h3 className="text-2xl font-semibold text-white mb-2">Generating Your Masterpiece...</h3>
      <p className="text-lg text-gray-300">{message}</p>
    </div>
  );
};

export default LoadingIndicator;
