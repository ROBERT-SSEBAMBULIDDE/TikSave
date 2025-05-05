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
    
    // Access the form directly to get selected format and quality
    const form = e.target as HTMLFormElement;
    const formElements = form.elements;
    
    // Get selected format and quality from form if they exist
    const formatElement = formElements.namedItem('format') as HTMLInputElement;
    const qualityElement = formElements.namedItem('quality') as HTMLInputElement;
    
    // Set format and quality if they exist in the form
    if (formatElement && formatElement.value) {
      setSelectedFormat(formatElement.value as DownloadFormat);
    }
    
    if (qualityElement && qualityElement.value) {
      setSelectedQuality(qualityElement.value as VideoQuality);
    }
    
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
        quality: selectedQuality
      };
      
      // Set processing state to show progress
      setState('processing');
      setProcessingStatus({ progress: 0, message: 'Starting download...' });
      
      // Show toast notification
      showToast('info', 'Download Started', 'Please wait while we prepare your file.');
      
      // Create XHR request to track download progress
      const xhr = new XMLHttpRequest();
      const url = `/api/tiktok/download?videoId=${downloadOptions.videoId}&format=${downloadOptions.format}&quality=${downloadOptions.quality}&videoUrl=${encodeURIComponent(videoData.url)}&thumbnailUrl=${encodeURIComponent(videoData.thumbnailUrl)}&title=${encodeURIComponent(videoData.title)}&author=${encodeURIComponent(videoData.author)}`;
      
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      
      // Set up progress tracking
      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          
          // Update progress messages based on phase
          let message = 'Downloading...';
          if (progress < 30) {
            message = 'Preparing file...';
          } else if (progress < 60) {
            message = 'Downloading...';
          } else if (progress < 90) {
            message = 'Almost there...';
          } else {
            message = 'Completing download...';
          }
          
          setProcessingStatus({ progress, message });
        }
      };
      
      // Handle completion
      xhr.onload = () => {
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
