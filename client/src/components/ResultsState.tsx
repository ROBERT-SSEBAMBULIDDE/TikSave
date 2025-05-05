import { Button } from "@/components/ui/button";
import { FAIcon } from "@/components/ui/fa-icon";
import { VideoData, DownloadFormat, VideoQuality } from "@/lib/types";
import { useState, useRef, useEffect } from "react";

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
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
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
        
        <div className="aspect-w-9 aspect-h-16 max-w-xs mx-auto rounded-lg overflow-hidden shadow-lg">
          <div className="bg-slate-800 rounded-md flex items-center justify-center relative">
            {!isPlaying ? (
              <>
                <img
                  src={videoData.thumbnailUrl}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    onClick={handlePreviewToggle}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md"
                  >
                    <FAIcon icon="play" className="text-xl ml-1" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="w-full h-full relative">
                <Button
                  onClick={handlePreviewToggle}
                  className="absolute top-2 right-2 z-10 bg-black bg-opacity-60 hover:bg-opacity-70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
                >
                  <FAIcon icon="pause" />
                </Button>
                
                {/* HTML5 Video Player */}
                {!videoLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  </div>
                )}
                
                <video
                  ref={videoRef}
                  src={`/api/tiktok/download?videoId=${videoData.id}&format=mp4&quality=${selectedQuality}`}
                  className={`w-full h-full rounded-md ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                  controls={false}
                  playsInline
                  onLoadedData={() => setVideoLoaded(true)}
                  onError={() => {
                    // Fallback to iframe if direct video fails
                    setVideoLoaded(true);
                  }}
                />
                
                {/* Fallback to iframe if HTML5 video fails */}
                {!videoLoaded && (
                  <iframe
                    src={`https://www.tiktok.com/embed/v2/${videoData.id}`}
                    className="w-full h-full rounded-md"
                    allowFullScreen
                    style={{ display: 'none' }}
                    onLoad={() => {
                      if (!videoLoaded) {
                        setVideoLoaded(true);
                      }
                    }}
                  />
                )}
              </div>
            )}
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
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-4 rounded-md font-medium transition-colors flex items-center justify-center text-lg shadow-md"
          onClick={onDownload}
        >
          <FAIcon icon="download" className="mr-2 text-xl" /> Download Now
        </Button>
        
        <p className="text-xs text-center text-slate-500 mt-3">
          Fast download, no watermark, high quality
        </p>
      </div>
    </div>
  );
}
