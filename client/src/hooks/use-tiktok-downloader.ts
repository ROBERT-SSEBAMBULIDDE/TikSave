import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { 
  VideoData, 
  DownloaderState, 
  ProcessingStatus, 
  ErrorData, 
  DownloadFormat, 
  VideoQuality, 
  ToastData, 
  DownloadOptions 
} from '@/lib/types';
import { isValidTikTokUrl, getFileExtensionFromFormat } from '@/lib/utils';

export function useTikTokDownloader() {
  const [url, setUrl] = useState<string>('');
  const [state, setState] = useState<DownloaderState>('initial');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({ progress: 0, message: 'Processing...' });
  const [error, setError] = useState<ErrorData | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>('mp4');
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>('high');
  const [toast, setToast] = useState<ToastData>({ type: 'success', title: '', message: '', visible: false });

  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  // Process URL to get video data
  const processUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidTikTokUrl(url)) {
      setState('error');
      setError({ message: 'Invalid URL provided', details: 'Please check the URL and try again. Make sure it\'s a valid TikTok video link.' });
      return;
    }

    try {
      setState('processing');
      
      // Simulate progress intervals for better UX
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        if (progress < 30) {
          setProcessingStatus({ progress, message: 'Fetching video information...' });
        } else if (progress < 60) {
          setProcessingStatus({ progress, message: 'Removing watermark...' });
        } else if (progress < 90) {
          setProcessingStatus({ progress, message: 'Preparing download...' });
        } else {
          setProcessingStatus({ progress, message: 'Almost ready...' });
        }
        
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 150);

      // Make API request to fetch video data
      const response = await apiRequest('POST', '/api/tiktok/info', { url });
      clearInterval(progressInterval);
      
      const data = await response.json();
      setVideoData(data);
      setState('results');
    } catch (err) {
      setState('error');
      
      if (err instanceof Error) {
        setError({ message: 'Failed to process video', details: err.message });
      } else {
        setError({ message: 'Failed to process video', details: 'An unknown error occurred' });
      }
    }
  };

  // Reset to initial state
  const reset = () => {
    setState('initial');
    setVideoData(null);
    setError(null);
    setProcessingStatus({ progress: 0, message: 'Processing...' });
  };

  // Show toast notification
  const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToast({ type, title, message, visible: true });
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Handle format selection
  const handleFormatSelect = (format: DownloadFormat) => {
    setSelectedFormat(format);
  };

  // Handle resolution/quality selection
  const handleQualitySelect = (quality: VideoQuality) => {
    setSelectedQuality(quality);
  };

  // Handle download
  const handleDownload = async () => {
    if (!videoData) return;
    
    try {
      const downloadOptions: DownloadOptions = {
        videoId: videoData.id,
        format: selectedFormat,
        quality: selectedQuality
      };
      
      // Start download
      showToast('info', 'Download Started', 'Your file will be saved to your device shortly.');
      
      // Create a hidden link to trigger the download
      const response = await fetch(`/api/tiktok/download?videoId=${downloadOptions.videoId}&format=${downloadOptions.format}&quality=${downloadOptions.quality}`);
      
      // Handle potential errors in the response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Determine filename from Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = '';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Fallback if filename isn't provided in headers
      if (!filename) {
        const extension = getFileExtensionFromFormat(selectedFormat);
        filename = `tiktok_${videoData.id}${extension}`;
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast('success', 'Download Complete', 'Your file has been saved to your device.');
    } catch (err) {
      let errorMessage = 'An unknown error occurred';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      showToast('error', 'Download Failed', errorMessage);
    }
  };

  return {
    url,
    state,
    videoData,
    processingStatus,
    error,
    selectedFormat,
    selectedQuality,
    toast,
    handleUrlChange,
    processUrl,
    reset,
    handleFormatSelect,
    handleQualitySelect,
    handleDownload,
    showToast
  };
}
