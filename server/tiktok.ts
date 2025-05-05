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

// RapidAPI configuration
const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST = 'tiktok-video-no-watermark2.p.rapidapi.com';

// RapidAPI Response interface
interface RapidAPIResponse {
  code: number;
  msg: string;
  processed_time: number;
  data: {
    aweme_id: string;
    id: string;
    region: string;
    title: string;
    cover: string;
    origin_cover: string;
    duration: number;
    play: string;
    wmplay: string;
    hdplay: string;
    size: number;
    wm_size: number;
    hd_size: number;
    music: string;
    music_info: {
      id: string;
      title: string;
      play: string;
      cover: string;
      author: string;
      original: boolean;
      duration: number;
      album: string;
    };
    play_count: number;
    digg_count: number;
    comment_count: number;
    share_count: number;
    download_count: number;
    create_time: number;
    author: {
      id: string;
      unique_id: string;
      nickname: string;
      avatar: string;
    };
  };
}

export async function getTikTokVideoInfo(url: string): Promise<VideoData> {
  try {
    console.log('Fetching TikTok video info from RapidAPI...');
    
    // Use RapidAPI to get video info without watermark
    const response = await fetch(`https://${RAPID_API_HOST}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-rapidapi-host': RAPID_API_HOST,
        'x-rapidapi-key': RAPID_API_KEY || ''
      },
      body: new URLSearchParams({
        url,
        hd: '1'
      }).toString()
    });

    if (!response.ok) {
      throw new Error(`RapidAPI request failed: ${response.statusText}`);
    }

    const data = await response.json() as RapidAPIResponse;
    
    if (data.code !== 0 || !data.data) {
      throw new Error(`API Error: ${data.msg || 'Unknown error'}`);
    }

    console.log('Successfully fetched TikTok video info');
    
    return {
      id: data.data.id,
      url: url,
      title: data.data.title || 'TikTok Video',
      author: data.data.author.unique_id,
      thumbnailUrl: data.data.cover,
      duration: data.data.duration
    };
  } catch (error) {
    console.error('Error fetching TikTok video:', error);
    
    // If RapidAPI fails, fallback to extracting the ID and using basic info
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error('Could not extract video ID from URL');
    }
    
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

async function downloadTikTokVideo(url: string, videoId: string): Promise<string> {
  console.log('Downloading TikTok video without watermark...');
  
  try {
    // Get video info with download links from RapidAPI
    const response = await fetch(`https://${RAPID_API_HOST}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-rapidapi-host': RAPID_API_HOST,
        'x-rapidapi-key': RAPID_API_KEY || ''
      },
      body: new URLSearchParams({
        url,
        hd: '1'
      }).toString()
    });

    if (!response.ok) {
      throw new Error(`RapidAPI request failed: ${response.statusText}`);
    }

    const data = await response.json() as RapidAPIResponse;
    
    if (data.code !== 0 || !data.data) {
      throw new Error(`API Error: ${data.msg || 'Unknown error'}`);
    }
    
    // Use the no-watermark video URL (play instead of wmplay)
    const videoUrl = data.data.play;
    const tempFilePath = path.join(TMP_DIR, `${videoId}_original.mp4`);
    
    // Download the video
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }
    
    const fileStream = createWriteStream(tempFilePath);
    await pipeline(videoResponse.body!, fileStream);
    
    console.log('Successfully downloaded TikTok video without watermark');
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
  try {
    // Use the videoId to form a URL, but note this may not be perfect for all TikTok videos
    // If we had the original URL, that would be better
    // For now, we'll use a generic URL that should work with the API
    const url = `https://www.tiktok.com/video/${videoId}`;
    
    // Download the video without watermark
    const originalVideoPath = await downloadTikTokVideo(url, videoId);
    
    // Define output path
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
    
    console.log(`Processing video to ${format} format with ${quality} quality...`);
    
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
          console.log(`Processing complete: ${fileName}`);
          resolve({ filePath: outputFilePath, fileName });
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`));
        }
      });
      
      ffmpeg.on('error', (err) => {
        reject(new Error(`Failed to start FFmpeg process: ${err.message}`));
      });
    });
  } catch (error) {
    console.error('Error processing TikTok video:', error);
    throw error;
  }
}

// Clean up temporary files older than 1 hour
export function cleanupTempFiles() {
  // Implementation omitted for brevity
  // In a real implementation, this would delete files in TMP_DIR that are older than a certain time
}
