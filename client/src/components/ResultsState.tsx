import { Button } from "@/components/ui/button";
import { FAIcon } from "@/components/ui/fa-icon";
import { VideoData, DownloadFormat, VideoQuality } from "@/lib/types";
import { useState } from "react";

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

  const handlePreviewToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const formatButtonClass = (format: DownloadFormat) => {
    return `transition-colors text-sm px-3 py-1.5 rounded-full ${
      selectedFormat === format
        ? "bg-blue-100 text-primary"
        : "bg-slate-100 hover:bg-slate-200"
    }`;
  };

  const qualityButtonClass = (quality: VideoQuality) => {
    return `transition-colors text-sm px-3 py-1.5 rounded-full ${
      selectedQuality === quality
        ? "bg-blue-100 text-primary"
        : "bg-slate-100 hover:bg-slate-200"
    }`;
  };

  return (
    <div>
      {/* Video Preview */}
      <div className="mb-6 bg-slate-100 rounded-lg p-4">
        <div className="aspect-w-9 aspect-h-16 max-w-[250px] mx-auto">
          <div className="bg-slate-200 rounded-md flex items-center justify-center relative">
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
                    className="bg-black bg-opacity-60 hover:bg-opacity-70 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all"
                  >
                    <FAIcon icon="play" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="w-full h-full">
                <Button
                  onClick={handlePreviewToggle}
                  className="absolute top-2 right-2 z-10 bg-black bg-opacity-60 hover:bg-opacity-70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all"
                >
                  <FAIcon icon="pause" />
                </Button>
                <iframe
                  src={`https://www.tiktok.com/embed/v2/${videoData.id}`}
                  className="w-full h-full rounded-md"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Video Metadata */}
        <div className="mt-4">
          <h4 className="font-medium text-sm truncate">
            {videoData.title || `TikTok video by ${videoData.author}`}
          </h4>
          <p className="text-xs text-slate-500">
            @{videoData.author}
          </p>
        </div>
      </div>

      {/* Format Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Download Format</h4>
        <div className="flex flex-wrap gap-2">
          <Button 
            className={formatButtonClass("mp4")}
            onClick={() => onFormatSelect("mp4")}
            variant="ghost"
          >
            MP4
          </Button>
          <Button 
            className={formatButtonClass("mp3")}
            onClick={() => onFormatSelect("mp3")}
            variant="ghost"
          >
            MP3 (Audio Only)
          </Button>
          <Button
            className={formatButtonClass("webm")}
            onClick={() => onFormatSelect("webm")}
            variant="ghost"
          >
            WebM
          </Button>
        </div>
      </div>

      {/* Resolution Selection (for video formats) */}
      {selectedFormat !== "mp3" && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Quality</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              className={qualityButtonClass("high")}
              onClick={() => onQualitySelect("high")}
              variant="ghost"
            >
              High Quality
            </Button>
            <Button
              className={qualityButtonClass("medium")}
              onClick={() => onQualitySelect("medium")}
              variant="ghost"
            >
              Medium
            </Button>
            <Button
              className={qualityButtonClass("low")}
              onClick={() => onQualitySelect("low")}
              variant="ghost"
            >
              Low (Faster)
            </Button>
          </div>
        </div>
      )}

      {/* Download Button */}
      <Button 
        className="w-full bg-accent hover:bg-orange-600 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
        onClick={onDownload}
      >
        <FAIcon icon="download" className="mr-2" /> Download Now
      </Button>
    </div>
  );
}
