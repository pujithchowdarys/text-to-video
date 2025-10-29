
import { GoogleGenAI } from "@google/genai";
import type { AspectRatio, Resolution } from '../types';

// Delay in milliseconds for polling the operation status
const POLLING_DELAY_MS = 10000; 

export async function generateVideo(
  prompt: string,
  aspectRatio: AspectRatio,
  resolution: Resolution
): Promise<string> {
  // Instantiate GoogleGenAI right before the API call to use the latest selected API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  console.log("Starting video generation process...");
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: resolution,
      aspectRatio: aspectRatio,
    }
  });

  console.log("Polling for operation completion...");
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, POLLING_DELAY_MS));
    operation = await ai.operations.getVideosOperation({ operation: operation });
    console.log("Current operation status:", operation.name, "Done:", operation.done);
  }

  if (!operation.response?.generatedVideos?.[0]?.video?.uri) {
    console.error("Video generation finished but no video URI was found.", operation);
    throw new Error("Video generation failed to produce a valid output.");
  }
  
  const downloadLink = operation.response.generatedVideos[0].video.uri;
  console.log("Fetching video from:", downloadLink);
  
  // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);

  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }

  const videoBlob = await response.blob();
  const videoUrl = URL.createObjectURL(videoBlob);
  
  console.log("Video URL created:", videoUrl);
  return videoUrl;
}
