import { Card, CardContent } from "@/components/ui/card";
import { DownloaderForm } from "@/components/DownloaderForm";
import { ProcessingState } from "@/components/ProcessingState";
import { ResultsState } from "@/components/ResultsState";
import { ErrorState } from "@/components/ErrorState";
import { ToastNotification } from "@/components/ToastNotification";
import { useTikTokDownloader } from "@/hooks/use-tiktok-downloader";

export function DownloaderCard() {
  const {
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
    handleDownload
  } = useTikTokDownloader();

  return (
    <section className="px-4 py-6 -mt-6 sm:-mt-8">
      <Card className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-center">Enter TikTok Video URL</h3>
          
          <DownloaderForm 
            url={url} 
            onUrlChange={handleUrlChange} 
            onSubmit={processUrl} 
          />
          
          {state === 'processing' && (
            <ProcessingState processing={processingStatus} />
          )}
          
          {state === 'results' && videoData && (
            <ResultsState 
              videoData={videoData}
              selectedFormat={selectedFormat}
              selectedQuality={selectedQuality}
              onFormatSelect={handleFormatSelect}
              onQualitySelect={handleQualitySelect}
              onDownload={handleDownload}
            />
          )}
          
          {state === 'error' && error && (
            <ErrorState 
              error={error}
              onReset={reset}
            />
          )}
        </CardContent>
      </Card>
      
      <ToastNotification toast={toast} />
    </section>
  );
}
