export interface VideoData {
  id: string;
  url: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  duration?: number;
}

export type DownloadFormat = "mp4" | "mp3" | "webm";
export type VideoQuality = "high" | "medium" | "low";

export type DownloaderState = "initial" | "processing" | "results" | "error";

export interface ProcessingStatus {
  progress: number;
  message: string;
}

export interface ErrorData {
  message: string;
  details?: string;
}

export interface ToastData {
  type: "success" | "error" | "info";
  title: string;
  message: string;
  visible: boolean;
}

export interface DownloadOptions {
  format: DownloadFormat;
  quality: VideoQuality;
  videoId: string;
}
