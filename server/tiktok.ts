import fetch from 'node-fetch';
import { spawn } from 'child_process';
import { createWriteStream, existsSync, mkdirSync, statSync } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import { VideoData, DownloadFormat, VideoQuality } from '../client/src/lib/types';

// Ensure tmp directory exists
const TMP_DIR = path.join(process.cwd(), 'tmp');
if (!existsSync(TMP_DIR)) {
  mkdirSync(TMP_DIR, { recursive: true });
}

// Simple cache to track processed videos and avoid redundant processing
interface ProcessedVideo {
  filePath: string;
  fileName: string;
  timestamp: number;
  fileSize?: number; // File size in bytes
}

// In-memory cache for processed videos
const videoCache: Map<string, Map<string, ProcessedVideo>> = new Map();

// Cache helper functions
function getCacheKey(videoId: string, format: DownloadFormat, quality: VideoQuality): string {
  return `${videoId}_${format}_${quality}`;
}

function getFromCache(videoId: string, format: DownloadFormat, quality: VideoQuality): ProcessedVideo | null {
  const formatCache = videoCache.get(videoId);
  if (!formatCache) return null;
  
  const cacheKey = getCacheKey(videoId, format, quality);
  const cachedVideo = formatCache.get(cacheKey);
  
  if (!cachedVideo) return null;
  
  // Verify the file still exists
  if (!existsSync(cachedVideo.filePath)) {
    formatCache.delete(cacheKey);
    return null;
  }
  
  return cachedVideo;
}

function addToCache(videoId: string, format: DownloadFormat, quality: VideoQuality, processedVideo: ProcessedVideo): void {
  if (!videoCache.has(videoId)) {
    videoCache.set(videoId, new Map());
  }
  
  const formatCache = videoCache.get(videoId)!;
  const cacheKey = getCacheKey(videoId, format, quality);
  formatCache.set(cacheKey, processedVideo);
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
): Promise<{ filePath: string, fileName: string, fileSize?: number }> {
  try {
    // Check cache first to avoid reprocessing
    const cachedVideo = getFromCache(videoId, format, quality);
    if (cachedVideo) {
      console.log(`Cache hit: Using previously processed video for ${videoId} in ${format}/${quality} format`);
      
      // Get file size if not already in cache
      let fileSize = cachedVideo.fileSize;
      if (!fileSize && existsSync(cachedVideo.filePath)) {
        try {
          const stats = statSync(cachedVideo.filePath);
          fileSize = stats.size;
          
          // Update cache with file size
          cachedVideo.fileSize = fileSize;
        } catch (err) {
          console.error(`Failed to get file size for cached video:`, err);
        }
      }
      
      return {
        filePath: cachedVideo.filePath,
        fileName: cachedVideo.fileName,
        fileSize
      };
    }
    
    console.log(`Cache miss: Processing video ${videoId} in ${format}/${quality} format`);
    
    // Use the videoId to form a URL, but note this may not be perfect for all TikTok videos
    // If we had the original URL, that would be better
    // For now, we'll use a generic URL that should work with the API
    const url = `https://www.tiktok.com/video/${videoId}`;
    
    // Download the video without watermark
    const originalVideoPath = await downloadTikTokVideo(url, videoId);
    
    // Define output path
    const outputFilePath = path.join(TMP_DIR, `${videoId}_${format}_${quality}.${format}`);
    
    // Set quality parameters based on selected quality
    // Use faster presets across the board for better speed while maintaining quality
    let qualityParams: string[] = [];
    if (format === 'mp4') {
      switch (quality) {
        case 'high':
          qualityParams = ['-crf', '20', '-preset', 'faster', '-tune', 'zerolatency'];
          break;
        case 'medium':
          qualityParams = ['-crf', '23', '-preset', 'veryfast', '-tune', 'zerolatency'];
          break;
        case 'low':
          qualityParams = ['-crf', '28', '-preset', 'ultrafast', '-tune', 'zerolatency'];
          break;
      }
    } else if (format === 'webm') {
      switch (quality) {
        case 'high':
          qualityParams = ['-crf', '22', '-b:v', '1M', '-deadline', 'good', '-cpu-used', '2'];
          break;
        case 'medium':
          qualityParams = ['-crf', '30', '-b:v', '500k', '-deadline', 'realtime', '-cpu-used', '4'];
          break;
        case 'low':
          qualityParams = ['-crf', '40', '-b:v', '200k', '-deadline', 'realtime', '-cpu-used', '8'];
          break;
      }
    } else if (format === 'mp3') {
      switch (quality) {
        case 'high':
          qualityParams = ['-b:a', '192k', '-compression_level', '0'];
          break;
        case 'medium':
          qualityParams = ['-b:a', '128k', '-compression_level', '0'];
          break;
        case 'low':
          qualityParams = ['-b:a', '96k', '-compression_level', '0'];
          break;
      }
    }
    
    console.log(`Processing video to ${format} format with ${quality} quality...`);
    
    // Build optimized FFmpeg command
    // Add threads for parallel processing and other optimizations
    let ffmpegArgs: string[] = [
      '-i', originalVideoPath,
      '-threads', '4',  // Use parallel processing
      '-y'  // Overwrite output files without asking
    ];
    
    // Add format-specific arguments
    if (format === 'mp3') {
      ffmpegArgs = [
        ...ffmpegArgs,
        '-vn',  // No video
        '-ar', '44100',  // Audio sampling rate
        '-ac', '2',  // Audio channels
        ...qualityParams,
        '-f', 'mp3',  // Force mp3 format
        outputFilePath
      ];
    } else if (format === 'webm') {
      ffmpegArgs = [
        ...ffmpegArgs,
        '-c:v', 'libvpx',  // Video codec for WebM
        '-c:a', 'libvorbis',  // Audio codec for WebM
        ...qualityParams,
        '-f', 'webm',  // Force webm format
        outputFilePath
      ];
    } else {
      // mp4 format (default)
      ffmpegArgs = [
        ...ffmpegArgs,
        '-c:v', 'libx264',  // Video codec for MP4
        '-c:a', 'aac',  // Audio codec for MP4
        '-movflags', '+faststart',  // Optimize for web streaming
        ...qualityParams,
        '-f', 'mp4',  // Force mp4 format
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
          
          // Get the file size
          let fileSize: number | undefined;
          try {
            const stats = statSync(outputFilePath);
            fileSize = stats.size;
            console.log(`File size: ${fileSize} bytes`);
          } catch (err) {
            console.error(`Failed to get file size:`, err);
          }
          
          // Add to cache
          const processedVideo: ProcessedVideo = {
            filePath: outputFilePath,
            fileName,
            timestamp: Date.now(),
            fileSize
          };
          addToCache(videoId, format, quality, processedVideo);
          
          resolve({ filePath: outputFilePath, fileName, fileSize });
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

// Use fs import at the top level
import * as fs from 'fs';

// Clean up temporary files older than 6 hours
export function cleanupTempFiles() {
  console.log('Cleaning up temporary files...');
  try {
    const files = fs.readdirSync(TMP_DIR);
    const now = Date.now();
    const sixHoursInMs = 6 * 60 * 60 * 1000;
    
    let deletedCount = 0;
    
    files.forEach((file: string) => {
      try {
        const filePath = path.join(TMP_DIR, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtimeMs;
        
        // Delete files older than 6 hours
        if (fileAge > sixHoursInMs) {
          fs.unlinkSync(filePath);
          deletedCount++;
          
          // Also remove from cache if it was there
          const videoIdMatch = file.match(/^([^_]+)_/);
          if (videoIdMatch) {
            const videoId = videoIdMatch[1];
            if (videoCache.has(videoId)) {
              const formatCache = videoCache.get(videoId)!;
              // Find and remove any cache entries for this file
              formatCache.forEach((value, key) => {
                if (value.filePath === filePath) {
                  formatCache.delete(key);
                }
              });
              
              // Remove the entire video entry if no formats are left
              if (formatCache.size === 0) {
                videoCache.delete(videoId);
              }
            }
          }
        }
      } catch (err) {
        console.error(`Error cleaning up file ${file}:`, err);
      }
    });
    
    console.log(`Cleanup complete. Deleted ${deletedCount} old files.`);
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
}
