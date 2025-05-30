import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidTikTokUrl(url: string): boolean {
  // Basic TikTok URL validation
  const tiktokRegex = /^https?:\/\/(www\.|vm\.|vt\.)?(tiktok\.com)\/.+/i;
  return tiktokRegex.test(url);
}

export function extractTikTokId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Handle formats like: /username/video/1234567890123456789
    const videoIdMatch = pathname.match(/\/video\/(\d+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      return videoIdMatch[1];
    }
    
    // Handle shortened formats
    if (pathname.includes("/v/")) {
      const shortMatch = pathname.match(/\/v\/(\w+)/);
      return shortMatch ? shortMatch[1] : null;
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getFileExtensionFromFormat(format: string): string {
  switch (format) {
    case 'mp4':
      return '.mp4';
    case 'mp3':
      return '.mp3';
    case 'webm':
      return '.webm';
    default:
      return '.mp4';
  }
}
