
import React, { useState, useEffect, useCallback } from 'react';
import { generateVideo } from './services/geminiService';
import type { AspectRatio, Resolution, LoadingState } from './types';
import ApiKeySelector from './components/ApiKeySelector';
import LoadingIndicator from './components/LoadingIndicator';
import VideoPlayer from './components/VideoPlayer';
import OptionSelector from './components/OptionSelector';

const LOADING_MESSAGES = [
  "Warming up the digital director's chair...",
  "This can take a few minutes, please be patient.",
  "Teaching the AI about cinematography...",
  "Brewing pixels into a cinematic experience...",
  "Compositing scenes, this is the final stretch!",
  "Rendering audio and visuals together...",
];

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({ isLoading: false, message: '' });
  const [error, setError] = useState<string | null>(null);
  const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [resolution, setResolution] = useState<Resolution>('720p');

  useEffect(() => {
    const checkApiKey = async () => {
      // @ts-ignore
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        setApiKeySelected(true);
      }
    };
    checkApiKey();
  }, []);

  useEffect(() => {
    // FIX: In a browser environment, setInterval returns a number, not a NodeJS.Timeout.
    let intervalId: number;
    if (loadingState.isLoading) {
      setLoadingState({ isLoading: true, message: LOADING_MESSAGES[0] });
      let messageIndex = 1;
      intervalId = setInterval(() => {
        setLoadingState(prevState => ({ ...prevState, message: LOADING_MESSAGES[messageIndex % LOADING_MESSAGES.length] }));
        messageIndex++;
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [loadingState.isLoading]);

  const handleGenerateVideo = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setError(null);
    setVideoUrl(null);
    setLoadingState({ isLoading: true, message: LOADING_MESSAGES[0] });

    try {
      const url = await generateVideo(prompt, aspectRatio, resolution);
      setVideoUrl(url);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || 'An unknown error occurred.';
      setError(`Failed to generate video: ${errorMessage}`);
      if (errorMessage.includes("Requested entity was not found")) {
        setError("API Key validation failed. Please re-select your project API key.");
        setApiKeySelected(false);
      }
    } finally {
      setLoadingState({ isLoading: false, message: '' });
    }
  }, [prompt, aspectRatio, resolution]);

  const resetState = () => {
    setPrompt('');
    setVideoUrl(null);
    setError(null);
  }

  if (!apiKeySelected) {
    return <ApiKeySelector onKeySelected={() => setApiKeySelected(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Text-to-Video Generator
          </h1>
          <p className="mt-2 text-lg text-gray-400">Bring your ideas to life with AI-powered video creation.</p>
        </header>

        <main>
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {loadingState.isLoading ? (
            <LoadingIndicator message={loadingState.message} />
          ) : videoUrl ? (
             <div className="flex flex-col items-center space-y-6">
                <VideoPlayer videoUrl={videoUrl} />
                 <button 
                  onClick={resetState}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Create Another Video
                </button>
             </div>
          ) : (
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 space-y-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A neon hologram of a cat driving a sports car at top speed"
                className="w-full h-32 p-4 bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 resize-none text-lg"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* FIX: Explicitly set generic type and wrap state setter in a lambda to match prop type. */}
                <OptionSelector<AspectRatio>
                  label="Aspect Ratio"
                  options={['16:9', '9:16']}
                  selectedValue={aspectRatio}
                  onChange={(value) => setAspectRatio(value)}
                />
                {/* FIX: Explicitly set generic type and wrap state setter in a lambda to match prop type. */}
                <OptionSelector<Resolution>
                  label="Resolution"
                  options={['720p', '1080p']}
                  selectedValue={resolution}
                  onChange={(value) => setResolution(value)}
                />
              </div>
              <button
                onClick={handleGenerateVideo}
                disabled={loadingState.isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-4 rounded-lg text-xl transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Video
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
