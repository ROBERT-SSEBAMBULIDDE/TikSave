import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformSelector } from "./PlatformSelector";
import { UniversalDownloaderForm } from "./UniversalDownloaderForm";
import { useTikTokDownloader } from "@/hooks/use-tiktok-downloader";
// import { useYouTubeDownloader } from "@/hooks/use-youtube-downloader";
import { ProcessingState } from "./ProcessingState";
import { ResultsState } from "./ResultsState";
import { ErrorState } from "./ErrorState";

export function UniversalDownloaderCard() {
  const [selectedPlatform, setSelectedPlatform] = useState<"tiktok" | "youtube">("tiktok");
  
  // TikTok downloader hook
  const tikTokDownloader = useTikTokDownloader();
  
  // YouTube downloader state
  const [youtubeUrl, setYoutubeUrl] = useState("");
  
  const youTubeDownloader = {
    url: youtubeUrl,
    setUrl: setYoutubeUrl,
    selectedFormat: "mp4" as const,
    selectedQuality: "high" as const,
    handleFormatSelect: () => {},
    handleQualitySelect: () => {},
    handleSubmit: async () => {
      alert("YouTube downloads coming soon! For now, please use TikTok downloads which are working perfectly.");
    },
    state: "initial" as const,
    processing: { progress: 0, message: "" },
    videoData: null,
    error: null,
    handleDownload: async () => {},
    handleReset: () => {
      setYoutubeUrl("");
    }
  };

  // Use the appropriate downloader based on selected platform
  const currentDownloader = selectedPlatform === "tiktok" ? tikTokDownloader : youTubeDownloader;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    
    // Auto-detect platform based on URL
    if (newUrl.includes('tiktok.com') || newUrl.includes('vm.tiktok.com')) {
      setSelectedPlatform("tiktok");
    } else if (newUrl.includes('youtube.com') || newUrl.includes('youtu.be')) {
      setSelectedPlatform("youtube");
    }
    
    // Update the appropriate downloader based on current platform
    if (selectedPlatform === "tiktok") {
      tikTokDownloader.handleUrlChange(e);
    } else {
      setYoutubeUrl(newUrl);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Universal Video Downloader
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Download videos from TikTok and YouTube - Fast, Free, No Watermarks!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Platform Selection */}
          <PlatformSelector 
            selectedPlatform={selectedPlatform}
            onPlatformChange={setSelectedPlatform}
          />

          {/* Downloader Interface */}
          {currentDownloader.state === "initial" && (
            <UniversalDownloaderForm
              platform={selectedPlatform}
              url={selectedPlatform === "tiktok" ? tikTokDownloader.url : youTubeDownloader.url}
              onUrlChange={handleUrlChange}
              onSubmit={selectedPlatform === "tiktok" ? tikTokDownloader.processUrl : youTubeDownloader.handleSubmit}
              selectedFormat={selectedPlatform === "tiktok" ? tikTokDownloader.selectedFormat : youTubeDownloader.selectedFormat}
              selectedQuality={selectedPlatform === "tiktok" ? tikTokDownloader.selectedQuality : youTubeDownloader.selectedQuality}
              onFormatSelect={selectedPlatform === "tiktok" ? tikTokDownloader.handleFormatSelect : youTubeDownloader.handleFormatSelect}
              onQualitySelect={selectedPlatform === "tiktok" ? tikTokDownloader.handleQualitySelect : youTubeDownloader.handleQualitySelect}
            />
          )}

          {currentDownloader.state === "processing" && (
            <ProcessingState 
              processing={selectedPlatform === "tiktok" ? tikTokDownloader.processingStatus : currentDownloader.processing}
              onReset={selectedPlatform === "tiktok" ? tikTokDownloader.handleReset : currentDownloader.handleReset}
            />
          )}

          {currentDownloader.state === "results" && currentDownloader.videoData && (
            <ResultsState
              videoData={currentDownloader.videoData}
              selectedFormat={selectedPlatform === "tiktok" ? tikTokDownloader.selectedFormat : currentDownloader.selectedFormat}
              selectedQuality={selectedPlatform === "tiktok" ? tikTokDownloader.selectedQuality : currentDownloader.selectedQuality}
              onFormatSelect={selectedPlatform === "tiktok" ? tikTokDownloader.handleFormatSelect : currentDownloader.handleFormatSelect}
              onQualitySelect={selectedPlatform === "tiktok" ? tikTokDownloader.handleQualitySelect : currentDownloader.handleQualitySelect}
              onDownload={selectedPlatform === "tiktok" ? tikTokDownloader.handleDownload : currentDownloader.handleDownload}
            />
          )}

          {currentDownloader.state === "error" && currentDownloader.error && (
            <ErrorState 
              error={currentDownloader.error}
              onReset={selectedPlatform === "tiktok" ? tikTokDownloader.handleReset : currentDownloader.handleReset}
            />
          )}

          {/* Platform Info */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
            {selectedPlatform === "tiktok" ? (
              <p>✨ Download TikTok videos without watermarks in high quality</p>
            ) : (
              <p>🎬 Download YouTube videos and audio in multiple formats and qualities</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}