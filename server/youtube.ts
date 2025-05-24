import { VideoData, DownloadFormat, VideoQuality } from "../client/src/lib/types";

interface YouTubeAPIResponse {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
  formats: Array<{
    format: string;
    quality: string;
    url: string;
    filesize?: number;
  }>;
}

interface YouTubeProgressResponse {
  id: string;
  status: 'processing' | 'completed' | 'error';
  progress: number;
  downloadUrl?: string;
  error?: string;
}

// Cache for YouTube job tracking
const youtubeJobs = new Map<string, any>();

export async function getYouTubeVideoInfo(url: string): Promise<VideoData> {
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  
  if (!rapidApiKey) {
    throw new Error('YouTube service is not configured.');
  }

  try {
    // Extract video ID from YouTube URL
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL. Please check the URL and try again.');
    }

    // Get authentic video information from YouTube API
    const response = await fetch(`https://youtube-mp4-mp3-downloader.p.rapidapi.com/api/v1/info?id=${videoId}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'youtube-mp4-mp3-downloader.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to get video information from YouTube');
    }

    return {
      id: videoId,
      url: url,
      title: data.title || `YouTube Video ${videoId}`,
      author: data.channel || 'YouTube Channel',
      thumbnailUrl: data.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: data.duration ? parseDuration(data.duration) : undefined
    };

  } catch (error) {
    console.error('YouTube info error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to get YouTube video information. Please try again.');
  }
}

export async function processYouTubeVideo(
  url: string,
  videoId: string,
  format: DownloadFormat,
  quality: VideoQuality
): Promise<{ jobId: string }> {
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  
  if (!rapidApiKey) {
    throw new Error('YouTube download service is not configured.');
  }

  try {
    // Map our format/quality to YouTube API format
    let apiFormat = '720'; // Default to 720p
    let audioQuality = '128';

    if (format === 'mp3') {
      apiFormat = 'mp3';
      audioQuality = quality === 'high' ? '320' : quality === 'medium' ? '192' : '128';
    } else {
      // Video formats
      apiFormat = quality === 'high' ? '1080' : quality === 'medium' ? '720' : '480';
    }

    // Start YouTube download using the correct API endpoint
    const response = await fetch(`https://youtube-mp4-mp3-downloader.p.rapidapi.com/api/v1/download?format=${apiFormat}&id=${videoId}&audioQuality=${audioQuality}&addInfo=false`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'youtube-mp4-mp3-downloader.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`YouTube download failed: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error('YouTube download request failed');
    }

    const jobId = result.progressId;

    // Store job info for tracking
    youtubeJobs.set(jobId, {
      videoId,
      url,
      format,
      quality,
      title: result.title,
      startTime: Date.now(),
      status: 'processing'
    });

    return { jobId };

  } catch (error) {
    console.error('YouTube download error:', error);
    throw new Error('Failed to start YouTube download. Please try again.');
  }
}

export async function getYouTubeProgress(jobId: string): Promise<YouTubeProgressResponse> {
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  
  if (!rapidApiKey) {
    throw new Error('YouTube service not configured.');
  }

  try {
    const response = await fetch(`https://youtube-mp4-mp3-downloader.p.rapidapi.com/api/v1/progress?id=${jobId}`, {
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'youtube-mp4-mp3-downloader.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`Progress check failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Convert the actual API response to our expected format
    const progress: YouTubeProgressResponse = {
      id: jobId,
      status: data.finished ? 'completed' : 'processing',
      progress: data.progress || 0,
      downloadUrl: data.downloadUrl || data.url || data.download_url || data.link || undefined,
      error: data.error || undefined
    };
    
    // Update local job status
    const jobInfo = youtubeJobs.get(jobId);
    if (jobInfo) {
      jobInfo.status = progress.status;
      jobInfo.progress = progress.progress;
      if (progress.downloadUrl) {
        jobInfo.downloadUrl = progress.downloadUrl;
      }
    }

    return progress;

  } catch (error) {
    console.error('YouTube progress error:', error);
    throw new Error('Failed to check download progress.');
  }
}

function extractYouTubeVideoId(url: string): string | null {
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

function parseDuration(duration: string): number | undefined {
  if (!duration) return undefined;
  
  // Convert YouTube duration format to seconds
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (match) {
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  return undefined;
}

export function cleanupYouTubeJobs() {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  youtubeJobs.forEach((job, jobId) => {
    if (now - job.startTime > maxAge) {
      youtubeJobs.delete(jobId);
    }
  });
}