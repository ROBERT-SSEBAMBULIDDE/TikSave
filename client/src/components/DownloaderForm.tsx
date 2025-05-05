import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FAIcon } from "@/components/ui/fa-icon";
import { useState } from "react";
import { DownloadFormat, VideoQuality } from "@/lib/types";

interface DownloaderFormProps {
  url: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function DownloaderForm({ url, onUrlChange, onSubmit }: DownloaderFormProps) {
  const [showFormatOptions, setShowFormatOptions] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>("mp4");
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>("high");
  
  // Toggle format options
  const handleUrlFocus = () => {
    if (url.length > 0) {
      setShowFormatOptions(true);
    }
  };
  
  // Format selection buttons style
  const formatButtonClass = (format: DownloadFormat) => {
    return `transition-colors text-xs px-3 py-1.5 rounded-full ${
      selectedFormat === format
        ? "bg-blue-600 text-white"
        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
    }`;
  };

  // Quality selection buttons style
  const qualityButtonClass = (quality: VideoQuality) => {
    return `transition-colors text-xs px-3 py-1.5 rounded-full ${
      selectedQuality === quality
        ? "bg-blue-600 text-white"
        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
    }`;
  };
  
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="tiktok-url" className="block text-sm font-medium text-slate-700 mb-2">
          Enter TikTok Video URL
        </label>
        
        <div className="flex rounded-md shadow-lg">
          <div className="flex items-center pl-3 pr-1 bg-slate-50 border border-r-0 border-slate-200 rounded-l-md">
            <FAIcon icon="link" className="text-slate-400" />
          </div>
          <Input
            id="tiktok-url"
            type="url"
            placeholder="https://www.tiktok.com/@username/video/1234567890123456789"
            className="flex-grow border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base rounded-none"
            value={url}
            onChange={onUrlChange}
            onFocus={handleUrlFocus}
            required
            autoFocus
          />
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-r-md font-medium transition-all text-sm sm:text-base flex items-center"
          >
            <FAIcon icon="bolt" className="mr-2" /> Process
          </Button>
        </div>
        
        {/* Format Selection (appears after user inputs a URL) */}
        {showFormatOptions && (
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-md">
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-2 text-slate-700">Select Format</h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  type="button"
                  className={formatButtonClass("mp4")}
                  onClick={() => setSelectedFormat("mp4")}
                  variant="ghost"
                >
                  <FAIcon icon="video" className="mr-1.5" /> MP4 Video
                </Button>
                <Button 
                  type="button"
                  className={formatButtonClass("mp3")}
                  onClick={() => setSelectedFormat("mp3")}
                  variant="ghost"
                >
                  <FAIcon icon="music" className="mr-1.5" /> MP3 Audio
                </Button>
                <Button
                  type="button"
                  className={formatButtonClass("webm")}
                  onClick={() => setSelectedFormat("webm")}
                  variant="ghost"
                >
                  <FAIcon icon="file-video" className="mr-1.5" /> WebM
                </Button>
                <input type="hidden" name="format" value={selectedFormat} />
              </div>
            </div>

            {/* Quality options (not shown for MP3) */}
            {selectedFormat !== "mp3" && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-slate-700">Select Quality</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    className={qualityButtonClass("high")}
                    onClick={() => setSelectedQuality("high")}
                    variant="ghost"
                  >
                    <FAIcon icon="tachometer-alt" className="mr-1.5" /> High Quality
                  </Button>
                  <Button
                    type="button"
                    className={qualityButtonClass("medium")}
                    onClick={() => setSelectedQuality("medium")}
                    variant="ghost"
                  >
                    <FAIcon icon="balance-scale" className="mr-1.5" /> Medium
                  </Button>
                  <Button
                    type="button"
                    className={qualityButtonClass("low")}
                    onClick={() => setSelectedQuality("low")}
                    variant="ghost"
                  >
                    <FAIcon icon="bolt" className="mr-1.5" /> Low (Faster)
                  </Button>
                  <input type="hidden" name="quality" value={selectedQuality} />
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-3 flex flex-wrap gap-2">
          <div className="flex items-center text-xs text-slate-500">
            <FAIcon icon="check-circle" className="text-green-500 mr-1" />
            <span>No watermark</span>
          </div>
          <div className="flex items-center text-xs text-slate-500">
            <FAIcon icon="check-circle" className="text-green-500 mr-1" />
            <span>High quality MP4/MP3</span>
          </div>
          <div className="flex items-center text-xs text-slate-500">
            <FAIcon icon="check-circle" className="text-green-500 mr-1" />
            <span>Fast download</span>
          </div>
          <div className="flex items-center text-xs text-slate-500">
            <FAIcon icon="check-circle" className="text-green-500 mr-1" />
            <span>No registration required</span>
          </div>
        </div>
      </div>
    </form>
  );
}
