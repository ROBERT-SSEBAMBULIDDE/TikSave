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
  DownloadOptions,
  WatermarkOptions,
  CaptionOptions
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
  const [watermarkOptions, setWatermarkOptions] = useState<WatermarkOptions>({
    enabled: false,
    text: '',
    position: 'bottom-right'
  });
  const [captionOptions, setCaptionOptions] = useState<CaptionOptions>({
    enabled: false,
    text: '',
    duration: 5
  });
  const [toast, setToast] = useState<ToastData>({ type: 'success', title: '', message: '', visible: false });

  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  // Process URL to get video data
  const processUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use current state values instead of trying to access form elements
    // The format and quality are already managed by state
    
    if (!isValidTikTokUrl(url)) {
      setState('error');
      setError({ message: 'Invalid URL provided', details: 'Please check the URL and try again. Make sure it\'s a valid TikTok video link.' });
      return;
    }

    try {
      setState('processing');
      
      // Simulate progress intervals for better UX - faster progress for perceived speed
      let progress = 0;
      const progressInterval = setInterval(() => {
        // Faster initial progress for better perceived speed
        const increment = progress < 30 ? 8 : progress < 60 ? 5 : progress < 85 ? 3 : 1;
        progress += increment;
        
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
      }, 100);

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
        quality: selectedQuality,
        watermark: watermarkOptions.enabled ? watermarkOptions : undefined,
        caption: captionOptions.enabled ? captionOptions : undefined
      };
      
      // Set processing state to show progress
      setState('processing');
      setProcessingStatus({ progress: 0, message: 'Starting download...' });
      
      // Show toast notification
      showToast('info', 'Download Started', 'Please wait while we prepare your file.');
      
      // Create XHR request to track download progress
      const xhr = new XMLHttpRequest();
      const urlParams = new URLSearchParams({
        videoId: downloadOptions.videoId,
        format: downloadOptions.format,
        quality: downloadOptions.quality,
        videoUrl: videoData.url,
        thumbnailUrl: videoData.thumbnailUrl,
        title: videoData.title,
        author: videoData.author
      });

      // Add watermark parameters if enabled
      if (downloadOptions.watermark?.enabled) {
        urlParams.append('watermark', 'true');
        if (downloadOptions.watermark.text) {
          urlParams.append('watermarkText', downloadOptions.watermark.text);
        }
        if (downloadOptions.watermark.position) {
          urlParams.append('watermarkPosition', downloadOptions.watermark.position);
        }
      }

      // Add caption parameters if enabled
      if (downloadOptions.caption?.enabled) {
        urlParams.append('caption', 'true');
        if (downloadOptions.caption.text) {
          urlParams.append('captionText', downloadOptions.caption.text);
        }
        if (downloadOptions.caption.duration) {
          urlParams.append('captionDuration', downloadOptions.caption.duration.toString());
        }
      }

      const url = `/api/tiktok/download?${urlParams.toString()}`;
      
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      
      // Initialize the progress with loading message
      setProcessingStatus({ progress: 0, message: 'Connecting to server...' });
      
      // Updates every 250ms to prevent UI flickering
      let lastUpdate = Date.now();
      let lastProgress = 0;
      
      // Set up progress tracking
      xhr.onprogress = (event) => {
        // Only update if progress is computable (Content-Length header is set)
        if (event.lengthComputable) {
          // Calculate current progress percentage
          const progress = Math.round((event.loaded / event.total) * 100);
          
          // Only update UI if progress has changed significantly or 250ms passed since last update
          // This prevents excessive re-renders while ensuring smooth progress
          const now = Date.now();
          if (progress > lastProgress + 1 || now - lastUpdate > 250) {
            lastUpdate = now;
            lastProgress = progress;
            
            // Update progress messages based on phase
            let message = 'Downloading...';
            if (progress < 20) {
              message = 'Starting download...';
            } else if (progress < 40) {
              message = 'Downloading... keep going!';
            } else if (progress < 60) {
              message = 'Halfway there...';
            } else if (progress < 80) {
              message = 'Almost there...';
            } else if (progress < 95) {
              message = 'Just a moment longer...';
            } else {
              message = 'Finalizing download...';
            }
            
            setProcessingStatus({ progress, message });
          }
        } else {
          // If progress is not computable, show indeterminate progress
          const now = Date.now();
          if (now - lastUpdate > 1000) {
            lastUpdate = now;
            const fakeProgress = Math.min(lastProgress + 5, 90); // Don't go beyond 90%
            lastProgress = fakeProgress;
            setProcessingStatus({ 
              progress: fakeProgress, 
              message: 'Downloading... size unknown' 
            });
          }
        }
      };
      
      // Handle completion
      xhr.onload = async () => {
        if (xhr.status === 200) {
          // Update final progress state
          setProcessingStatus({ progress: 100, message: 'Download complete!' });
          
          // Create download link
          const blob = xhr.response;
          const downloadUrl = window.URL.createObjectURL(blob);
          
          // Get filename from response headers if available
          let filename = '';
          const contentDisposition = xhr.getResponseHeader('Content-Disposition');
          
          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch) {
              filename = filenameMatch[1];
            }
          }
          
          // Fallback filename
          if (!filename) {
            const extension = getFileExtensionFromFormat(selectedFormat);
            filename = `tiktok_${videoData.id}${extension}`;
          }
          
          // Create and trigger download
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = downloadUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          
          // Cleanup
          window.URL.revokeObjectURL(downloadUrl);
          document.body.removeChild(a);
          
          // Add download to session history
          try {
            // Get saveToSessionHistory function
            const { saveToSessionHistory } = await import('@/components/DownloadHistorySection');
            
            // Save download to session history
            saveToSessionHistory({
              videoId: downloadOptions.videoId,
              videoUrl: videoData.url,
              thumbnailUrl: videoData.thumbnailUrl,
              title: videoData.title,
              author: videoData.author,
              format: downloadOptions.format,
              quality: downloadOptions.quality,
              fileSize: blob.size || null,
            });
          } catch (err) {
            console.error('Failed to save download to history:', err);
          }
          
          // Show success notification with message to download another video
          showToast('success', 'Download Complete', 'Your file has been saved. Ready for another download!');
          
          // Return to initial state after a short delay so user can download another video
          setTimeout(() => {
            setState('initial');
            setUrl(''); // Clear the URL input
          }, 1500);
        } else {
          throw new Error('Download failed');
        }
      };
      
      // Handle errors
      xhr.onerror = () => {
        setState('error');
        setError({ message: 'Download failed', details: 'Network error occurred during download.' });
        showToast('error', 'Download Failed', 'Network error occurred during download.');
      };
      
      // Start the request
      xhr.send();
    } catch (err) {
      setState('error');
      let errorMessage = 'An unknown error occurred';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError({ message: 'Download failed', details: errorMessage });
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
    watermarkOptions,
    captionOptions,
    toast,
    handleUrlChange,
    processUrl,
    reset,
    handleFormatSelect,
    handleQualitySelect,
    setWatermarkOptions,
    setCaptionOptions,
    handleDownload,
    showToast
  };
}
