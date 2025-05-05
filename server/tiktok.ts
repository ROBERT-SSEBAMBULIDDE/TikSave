import fetch from 'node-fetch';
import { spawn } from 'child_process';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import { VideoData, DownloadFormat, VideoQuality } from '../client/src/lib/types';

// Ensure tmp directory exists
const TMP_DIR = path.join(process.cwd(), 'tmp');
if (!existsSync(TMP_DIR)) {
  mkdirSync(TMP_DIR, { recursive: true });
}

interface TikTokAPIResponse {
  aweme_id: string;
  desc: string;
  author: {
    nickname: string;
    unique_id: string;
  };
  video: {
    cover: {
      url_list: string[];
    };
    play_addr: {
      url_list: string[];
    };
    download_addr: {
      url_list: string[];
    };
    duration: number;
  };
}

export async function getTikTokVideoInfo(url: string): Promise<VideoData> {
  try {
    // Use TikTok API to get video info
    // For this implementation, we'll use a simplified approach

    // Extract video ID from URL
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error('Could not extract video ID from URL');
    }

    // Fetch TikTok video data using TikTok Web API
    const apiUrl = `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${videoId}`;
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch TikTok video data: ${response.statusText}`);
    }

    const data = await response.json() as { aweme_list: TikTokAPIResponse[] };
    
    if (!data.aweme_list || data.aweme_list.length === 0) {
      throw new Error('No video data found');
    }

    const videoData = data.aweme_list[0];
    
    return {
      id: videoData.aweme_id,
      url: url,
      title: videoData.desc,
      author: videoData.author.unique_id,
      thumbnailUrl: videoData.video.cover.url_list[0],
      duration: videoData.video.duration / 1000 // Convert milliseconds to seconds
    };
  } catch (error) {
    // If the API approach fails, fallback to a more basic approach
    console.error('Error fetching TikTok video:', error);
    
    // Extract video ID from URL
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error('Could not extract video ID from URL');
    }
    
    // Use basic info with the video ID
    return {
      id: videoId,
      url: url,
      title: 'TikTok Video',
      author: 'TikTok User',
      thumbnailUrl: `https://www.tiktok.com/api/img/?itemId=${videoId}&Location=0`,
    };
  }
}

function extractVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    
    // Handle format: /username/video/1234567890123456789
    const videoIdMatch = parsedUrl.pathname.match(/\/video\/(\d+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      return videoIdMatch[1];
    }
    
    // Handle shortened format
    if (parsedUrl.pathname.includes('/v/')) {
      const shortMatch = parsedUrl.pathname.match(/\/v\/(\w+)/);
      return shortMatch ? shortMatch[1] : null;
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

async function downloadTikTokVideo(videoId: string): Promise<string> {
  // Use TikTok video ID to get video without watermark
  const tempFilePath = path.join(TMP_DIR, `${videoId}_original.mp4`);
  
  // First, get the video URL without watermark
  try {
    const apiUrl = `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${videoId}`;
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch TikTok video data: ${response.statusText}`);
    }

    const data = await response.json() as { aweme_list: TikTokAPIResponse[] };
    
    if (!data.aweme_list || data.aweme_list.length === 0) {
      throw new Error('No video data found');
    }

    const videoData = data.aweme_list[0];
    const videoUrl = videoData.video.play_addr.url_list[0];
    
    // Download the video
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }
    
    const fileStream = createWriteStream(tempFilePath);
    await pipeline(videoResponse.body!, fileStream);
    
    return tempFilePath;
  } catch (error) {
    console.error('Error downloading TikTok video:', error);
    throw error;
  }
}

export async function processTikTokVideo(
  videoId: string, 
  format: DownloadFormat, 
  quality: VideoQuality
): Promise<{ filePath: string, fileName: string }> {
  // First download the original video
  const originalVideoPath = await downloadTikTokVideo(videoId);
  
  // Define output path and quality settings
  const outputFilePath = path.join(TMP_DIR, `${videoId}_${format}_${quality}.${format}`);
  
  // Set quality parameters based on selected quality
  let qualityParams: string[] = [];
  if (format === 'mp4') {
    switch (quality) {
      case 'high':
        qualityParams = ['-crf', '18', '-preset', 'slow'];
        break;
      case 'medium':
        qualityParams = ['-crf', '23', '-preset', 'medium'];
        break;
      case 'low':
        qualityParams = ['-crf', '28', '-preset', 'fast'];
        break;
    }
  } else if (format === 'webm') {
    switch (quality) {
      case 'high':
        qualityParams = ['-crf', '20', '-b:v', '1M'];
        break;
      case 'medium':
        qualityParams = ['-crf', '30', '-b:v', '500k'];
        break;
      case 'low':
        qualityParams = ['-crf', '40', '-b:v', '200k'];
        break;
    }
  } else if (format === 'mp3') {
    switch (quality) {
      case 'high':
        qualityParams = ['-b:a', '192k'];
        break;
      case 'medium':
        qualityParams = ['-b:a', '128k'];
        break;
      case 'low':
        qualityParams = ['-b:a', '96k'];
        break;
    }
  }
  
  // Build FFmpeg command
  let ffmpegArgs: string[] = ['-i', originalVideoPath];
  
  // Add format-specific arguments
  if (format === 'mp3') {
    ffmpegArgs = [
      ...ffmpegArgs,
      '-vn',  // No video
      ...qualityParams,
      outputFilePath
    ];
  } else {
    ffmpegArgs = [
      ...ffmpegArgs,
      ...qualityParams,
      outputFilePath
    ];
  }
  
  // Process video with FFmpeg
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', ffmpegArgs);
    
    ffmpeg.stderr.on('data', (data) => {
      console.log(`ffmpeg: ${data}`);
    });
    
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        // Generate a user-friendly filename
        const fileName = `tiktok_${videoId}.${format}`;
        resolve({ filePath: outputFilePath, fileName });
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });
    
    ffmpeg.on('error', (err) => {
      reject(new Error(`Failed to start FFmpeg process: ${err.message}`));
    });
  });
}

// Clean up temporary files older than 1 hour
export function cleanupTempFiles() {
  // Implementation omitted for brevity
  // In a real implementation, this would delete files in TMP_DIR that are older than a certain time
}
