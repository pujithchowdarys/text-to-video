
import React from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // Assume success and notify the parent component to re-render the main UI
      onKeySelected();
    } catch (e) {
      console.error("Error opening API key selection dialog:", e);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-4 text-cyan-400">API Key Required</h2>
        <p className="text-gray-300 mb-6">
          To use the video generation features, you need to select a project with an enabled API key. Your API key is used for billing and authentication.
        </p>
        <button
          onClick={handleSelectKey}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Select Project API Key
        </button>
        <p className="text-gray-400 mt-6 text-sm">
          For more information on billing, please visit the{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline"
          >
            official documentation
          </a>.
        </p>
      </div>
    </div>
  );
};

export default ApiKeySelector;
