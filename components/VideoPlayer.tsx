
import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-700">
      <video
        key={videoUrl}
        src={videoUrl}
        controls
        autoPlay
        loop
        className="w-full h-auto"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
