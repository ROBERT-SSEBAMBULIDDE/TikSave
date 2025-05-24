import { Card, CardContent } from "@/components/ui/card";
import { DownloaderForm } from "@/components/DownloaderForm";
import { ProcessingState } from "@/components/ProcessingState";
import { ResultsState } from "@/components/ResultsState";
import { ErrorState } from "@/components/ErrorState";
import { ToastNotification } from "@/components/ToastNotification";
import { useTikTokDownloader } from "@/hooks/use-tiktok-downloader";
import { FAIcon } from "@/components/ui/fa-icon";

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
    <section className="px-4 py-8 -mt-8 sm:-mt-10 mb-8">
      <Card className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
          <h3 className="text-xl sm:text-2xl font-bold mb-2 text-center">
            Download TikTok Videos Without Watermark
          </h3>
          <p className="text-blue-100 text-center text-sm">
            Fast, free, and easy to use
          </p>
        </div>
        
        <CardContent className="p-6">
          {state === 'initial' && (
            <div className="max-w-xl mx-auto">
              <div className="mb-6">
                <DownloaderForm 
                  url={url} 
                  onUrlChange={handleUrlChange} 
                  onSubmit={processUrl} 
                />
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold text-center mb-6">How It Works</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="flex justify-center mb-2">
                      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600">
                        <FAIcon icon="paste" className="text-xl" />
                      </div>
                    </div>
                    <h4 className="font-medium text-slate-700 mb-1">Paste URL</h4>
                    <p className="text-sm text-slate-500">Paste any TikTok video link</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="flex justify-center mb-2">
                      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600">
                        <FAIcon icon="sliders-h" className="text-xl" />
                      </div>
                    </div>
                    <h4 className="font-medium text-slate-700 mb-1">Choose Format</h4>
                    <p className="text-sm text-slate-500">Select MP4, MP3 or WebM format</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="flex justify-center mb-2">
                      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600">
                        <FAIcon icon="download" className="text-xl" />
                      </div>
                    </div>
                    <h4 className="font-medium text-slate-700 mb-1">Download</h4>
                    <p className="text-sm text-slate-500">Save directly to your device</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {state === 'processing' && (
            <ProcessingState 
              processing={processingStatus} 
              onReset={reset} 
            />
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
