import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { DownloadFormat, VideoQuality } from "@/lib/types";

interface UniversalDownloaderFormProps {
  platform: "tiktok" | "youtube";
  url: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  selectedFormat: DownloadFormat;
  selectedQuality: VideoQuality;
  onFormatSelect: (format: DownloadFormat) => void;
  onQualitySelect: (quality: VideoQuality) => void;
}

export function UniversalDownloaderForm({ 
  platform,
  url, 
  onUrlChange, 
  onSubmit,
  selectedFormat,
  selectedQuality,
  onFormatSelect,
  onQualitySelect
}: UniversalDownloaderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatButtonClass = (format: DownloadFormat) => {
    const baseClass = "px-4 py-2 rounded-lg font-medium transition-all duration-200 border-2";
    const platformColor = platform === "tiktok" ? "pink" : "red";
    
    if (selectedFormat === format) {
      return `${baseClass} bg-${platformColor}-500 text-white border-${platformColor}-500 shadow-lg transform scale-105`;
    }
    return `${baseClass} bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-${platformColor}-300 hover:bg-${platformColor}-50 dark:hover:bg-${platformColor}-950/20`;
  };

  const qualityButtonClass = (quality: VideoQuality) => {
    const baseClass = "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border-2";
    const platformColor = platform === "tiktok" ? "pink" : "red";
    
    if (selectedQuality === quality) {
      return `${baseClass} bg-${platformColor}-500 text-white border-${platformColor}-500 shadow-md`;
    }
    return `${baseClass} bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-${platformColor}-300 hover:bg-${platformColor}-50 dark:hover:bg-${platformColor}-950/20`;
  };

  const platformConfig = {
    tiktok: {
      placeholder: "Paste TikTok video URL here... (e.g., https://www.tiktok.com/@username/video/...)",
      example: "https://www.tiktok.com/@user/video/123456789",
      color: "pink",
      name: "TikTok"
    },
    youtube: {
      placeholder: "Paste YouTube video URL here... (e.g., https://www.youtube.com/watch?v=...)",
      example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      color: "red",
      name: "YouTube"
    }
  };

  const config = platformConfig[platform];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* URL Input */}
      <div className="space-y-3">
        <div className="relative">
          <Input
            type="url"
            value={url}
            onChange={onUrlChange}
            placeholder={config.placeholder}
            className={`w-full py-4 px-4 text-lg border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-${config.color}-100 dark:focus:ring-${config.color}-950/20 border-gray-200 dark:border-gray-700 focus:border-${config.color}-500`}
            required
          />
          <ExternalLink className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-${config.color}-500`} />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Example: <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{config.example}</span>
        </p>
      </div>

      {/* Format Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Choose Format</h3>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onFormatSelect("mp4")}
            className={formatButtonClass("mp4")}
          >
            📹 MP4 Video
          </button>
          <button
            type="button"
            onClick={() => onFormatSelect("mp3")}
            className={formatButtonClass("mp3")}
          >
            🎵 MP3 Audio
          </button>
          {platform === "youtube" && (
            <button
              type="button"
              onClick={() => onFormatSelect("webm")}
              className={formatButtonClass("webm")}
            >
              🎬 WebM Video
            </button>
          )}
        </div>
      </div>

      {/* Quality Selection */}
      {selectedFormat !== "mp3" && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Video Quality</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onQualitySelect("high")}
              className={qualityButtonClass("high")}
            >
              HD Quality
            </button>
            <button
              type="button"
              onClick={() => onQualitySelect("medium")}
              className={qualityButtonClass("medium")}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => onQualitySelect("low")}
              className={qualityButtonClass("low")}
            >
              Low Quality
            </button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!url.trim() || isSubmitting}
        className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-200 bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 hover:from-${config.color}-600 hover:to-${config.color}-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing {config.name} Video...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Download {config.name} Video</span>
          </div>
        )}
      </Button>
    </form>
  );
}