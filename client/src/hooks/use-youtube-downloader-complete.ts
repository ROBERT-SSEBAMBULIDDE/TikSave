import { useState } from "react";
import { DownloadFormat, VideoQuality, DownloaderState, VideoData, ProcessingStatus, ErrorData } from "@/lib/types";
import { isValidYouTubeUrl, extractYouTubeId } from "@/lib/utils";
import { saveToSessionHistory } from "@/components/DownloadHistorySection";

export function useYouTubeDownloaderComplete() {
  const [url, setUrl] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>("mp4");
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>("high");
  const [state, setState] = useState<DownloaderState>("initial");
  const [processing, setProcessing] = useState<ProcessingStatus>({ progress: 0, message: "" });
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState<ErrorData | null>(null);
  const [downloadJobId, setDownloadJobId] = useState<string | null>(null);

  const handleFormatSelect = (format: DownloadFormat) => {
    setSelectedFormat(format);
  };

  const handleQualitySelect = (quality: VideoQuality) => {
    setSelectedQuality(quality);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError({ message: "Please enter a YouTube URL" });
      setState("error");
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError({ message: "Please enter a valid YouTube URL" });
      setState("error");
      return;
    }

    const videoId = extractYouTubeId(url);
    if (!videoId) {
      setError({ message: "Could not extract video ID from URL" });
      setState("error");
      return;
    }

    setState("processing");
    setProcessing({ progress: 10, message: "Getting YouTube video information..." });

    try {
      // Get video info
      const response = await fetch("/api/youtube/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to get video information");
      }

      setVideoData(result);
      setState("results");  // Go directly to results for preview
      setProcessing({ progress: 0, message: "" }); // Reset processing

    } catch (err) {
      console.error("YouTube info error:", err);
      setError({
        message: err instanceof Error ? err.message : "Failed to get YouTube video information",
        details: "Please check the URL and try again"
      });
      setState("error");
    }
  };

  const handleDownload = async () => {
    if (!videoData) return;

    setState("processing");
    setProcessing({ progress: 20, message: "Starting YouTube download..." });

    try {
      // Start download
      const response = await fetch("/api/youtube/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          videoId: videoData.id,
          format: selectedFormat,
          quality: selectedQuality
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to start download");
      }

      const jobId = result.jobId;
      setDownloadJobId(jobId);
      
      // Poll for progress
      pollDownloadProgress(jobId);

    } catch (err) {
      console.error("YouTube download error:", err);
      setError({
        message: err instanceof Error ? err.message : "Failed to start download",
        details: "Please try again"
      });
      setState("error");
    }
  };

  const pollDownloadProgress = async (jobId: string) => {
    const maxAttempts = 120; // 10 minutes max (faster polling)
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/youtube/progress/${jobId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Progress check failed");
        }

        // More accurate progress tracking
        const baseProgress = 20; // Already started
        const apiProgress = result.progress || 0;
        // Handle progress values that might be 1000 (100%) or normal percentage
        const normalizedProgress = apiProgress > 100 ? 100 : apiProgress;
        const progressPercent = result.status === 'completed' ? 100 : Math.min(baseProgress + (normalizedProgress * 0.75), 95);
        
        setProcessing({ 
          progress: progressPercent, 
          message: result.status === 'completed' ? "Download ready! Starting download..." : `Processing video... ${Math.round(apiProgress)}%`
        });

        if (result.status === 'completed') {
          // Download completed - check for downloadUrl or create direct download
          setProcessing({ progress: 100, message: "Download ready!" });
          
          // Save to history
          if (videoData) {
            saveToSessionHistory({
              videoId: videoData.id,
              videoUrl: url,
              thumbnailUrl: videoData.thumbnailUrl,
              title: videoData.title,
              author: videoData.author,
              format: selectedFormat,
              quality: selectedQuality,
              fileSize: result.fileSize || null
            });
          }

          // Get the actual download URL from the API response
          const downloadUrl = result.downloadUrl || result.url || result.download_url || result.link;
          
          if (downloadUrl) {
            // Trigger immediate download
            window.open(downloadUrl, '_blank');
            
            // Also try with download attribute as fallback
            setTimeout(() => {
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = `${videoData?.title?.replace(/[^a-zA-Z0-9\s]/g, '') || 'youtube-video'}.${selectedFormat}`;
              link.target = '_blank';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }, 1000);
          } else {
            // Create a direct download using YouTube to MP4 conversion
            const fallbackUrl = `https://www.y2mate.com/youtube/${videoData.id}`;
            window.open(fallbackUrl, '_blank');
          }

          // Reset after successful download
          setTimeout(() => {
            setState("initial");
            setUrl("");
            setVideoData(null);
            setDownloadJobId(null);
          }, 2000);

        } else if (result.status === 'error') {
          throw new Error(result.error || "Download failed");
        } else if (attempts < maxAttempts) {
          // Continue polling - faster intervals for quicker response
          attempts++;
          const pollInterval = attempts < 20 ? 2000 : attempts < 40 ? 3000 : 4000; // Start fast, then slow down
          setTimeout(poll, pollInterval);
        } else {
          throw new Error("Download took too long - please try again with a shorter video");
        }

      } catch (err) {
        console.error("Progress polling error:", err);
        setError({
          message: err instanceof Error ? err.message : "Download failed",
          details: "Please try again"
        });
        setState("error");
      }
    };

    poll();
  };

  const handleReset = () => {
    setState("initial");
    setUrl("");
    setVideoData(null);
    setError(null);
    setProcessing({ progress: 0, message: "" });
    setDownloadJobId(null);
  };

  return {
    url,
    setUrl,
    selectedFormat,
    selectedQuality,
    handleFormatSelect,
    handleQualitySelect,
    handleSubmit,
    state,
    processing,
    videoData,
    error,
    handleDownload,
    handleReset
  };
}