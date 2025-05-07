import { Button } from "@/components/ui/button";
import { FAIcon } from "@/components/ui/fa-icon";
import { VideoData, DownloadFormat, VideoQuality } from "@/lib/types";
import { useState, useRef, useEffect } from "react";
import { ShareApp } from "./ShareApp";

interface ResultsStateProps {
  videoData: VideoData;
  selectedFormat: DownloadFormat;
  selectedQuality: VideoQuality;
  onFormatSelect: (format: DownloadFormat) => void;
  onQualitySelect: (quality: VideoQuality) => void;
  onDownload: () => Promise<void>;
}

export function ResultsState({ 
  videoData, 
  selectedFormat, 
  selectedQuality, 
  onFormatSelect, 
  onQualitySelect, 
  onDownload 
}: ResultsStateProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Handle play/pause
  const handlePreviewToggle = () => {
    if (isPlaying) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // When setting to playing, the video will load with autoPlay
    }
  };

  // Handle when video ends
  useEffect(() => {
    const videoElement = videoRef.current;
    
    const handleVideoEnd = () => {
      setIsPlaying(false);
    };
    
    if (videoElement) {
      videoElement.addEventListener('ended', handleVideoEnd);
      
      return () => {
        videoElement.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, []);

  // Custom styled buttons for format and quality selection
  const formatButtonClass = (format: DownloadFormat) => {
    return `transition-colors text-sm px-3 py-1.5 rounded-full ${
      selectedFormat === format
        ? "bg-blue-600 text-white"
        : "bg-slate-100 hover:bg-slate-200 text-slate-800"
    }`;
  };

  const qualityButtonClass = (quality: VideoQuality) => {
    return `transition-colors text-sm px-3 py-1.5 rounded-full ${
      selectedQuality === quality
        ? "bg-blue-600 text-white"
        : "bg-slate-100 hover:bg-slate-200 text-slate-800"
    }`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Video Preview Card */}
      <div className="relative bg-gradient-to-b from-blue-50 to-slate-50 rounded-t-lg p-4">
        <h3 className="text-slate-700 font-medium text-lg mb-4 text-center">Preview & Download</h3>
        
        <div className="max-w-xs mx-auto rounded-lg overflow-hidden shadow-lg">
          <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-black">
            {/* Video Thumbnail & Play Button (shown before playing) */}
            {!isPlaying && (
              <div className="absolute inset-0 z-10">
                <img
                  src={videoData.thumbnailUrl}
                  alt={videoData.title}
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <Button
                    onClick={handlePreviewToggle}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg"
                  >
                    <FAIcon icon="play" className="text-xl ml-1" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Video Element with Controls */}
            <div className={`w-full h-full ${isPlaying ? 'block' : 'hidden'}`}>
              {/* Custom Video Controls */}
              {isPlaying && (
                <div className="absolute top-2 right-2 z-20">
                  <Button
                    onClick={handlePreviewToggle}
                    className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
                  >
                    <FAIcon icon="pause" />
                  </Button>
                </div>
              )}
              
              {/* Video Element */}
              {isPlaying && (
                <>
                  {!videoLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                  )}
                  <video
                    ref={videoRef}
                    src={`/api/tiktok/download?videoId=${videoData.id}&format=mp4&quality=${selectedQuality}&videoUrl=${encodeURIComponent(videoData.url)}&thumbnailUrl=${encodeURIComponent(videoData.thumbnailUrl)}&title=${encodeURIComponent(videoData.title)}&author=${encodeURIComponent(videoData.author)}`}
                    className="w-full h-full object-contain rounded-md"
                    controls
                    playsInline
                    autoPlay
                    onLoadedData={() => setVideoLoaded(true)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selection Controls */}
      <div className="p-5 border-t border-slate-100">
        {/* Format Selection */}
        <div className="mb-5">
          <h4 className="text-sm font-medium text-slate-700 mb-2">Choose Format</h4>
          <div className="flex flex-wrap gap-2">
            <Button 
              className={formatButtonClass("mp4")}
              onClick={() => onFormatSelect("mp4")}
              variant="ghost"
            >
              <FAIcon icon="video" className="mr-1.5" /> MP4 Video
            </Button>
            <Button 
              className={formatButtonClass("mp3")}
              onClick={() => onFormatSelect("mp3")}
              variant="ghost"
            >
              <FAIcon icon="music" className="mr-1.5" /> MP3 Audio
            </Button>
            <Button
              className={formatButtonClass("webm")}
              onClick={() => onFormatSelect("webm")}
              variant="ghost"
            >
              <FAIcon icon="file-video" className="mr-1.5" /> WebM
            </Button>
          </div>
        </div>

        {/* Quality Selection (for video formats) */}
        {selectedFormat !== "mp3" && (
          <div className="mb-5">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Select Quality</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                className={qualityButtonClass("high")}
                onClick={() => onQualitySelect("high")}
                variant="ghost"
              >
                <FAIcon icon="tachometer-alt" className="mr-1.5" /> High Quality
              </Button>
              <Button
                className={qualityButtonClass("medium")}
                onClick={() => onQualitySelect("medium")}
                variant="ghost"
              >
                <FAIcon icon="balance-scale" className="mr-1.5" /> Medium
              </Button>
              <Button
                className={qualityButtonClass("low")}
                onClick={() => onQualitySelect("low")}
                variant="ghost"
              >
                <FAIcon icon="bolt" className="mr-1.5" /> Low (Faster)
              </Button>
            </div>
          </div>
        )}

        {/* Download Button */}
        <div className="mb-4">
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-4 rounded-md font-medium transition-colors flex items-center justify-center text-lg shadow-md"
            onClick={onDownload}
          >
            <FAIcon icon="download" className="mr-2 text-xl" /> Download Now
          </Button>
        </div>
        
        <p className="text-xs text-center text-slate-500 mt-3">
          Fast download, no watermark, high quality
        </p>
        
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-center mb-3">Loved this tool?</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <ShareApp />
          </div>
        </div>
      </div>
    </div>
  );
}
