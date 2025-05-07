import { Progress } from "@/components/ui/progress";
import { ProcessingStatus } from "@/lib/types";
import { FAIcon } from "@/components/ui/fa-icon";

interface ProcessingStateProps {
  processing: ProcessingStatus;
  onReset?: () => void; // Optional reset callback
}

export function ProcessingState({ processing, onReset }: ProcessingStateProps) {
  // Determine icon based on message
  const getIcon = () => {
    const message = processing.message.toLowerCase();
    if (message.includes('fetching')) return 'search';
    if (message.includes('watermark')) return 'magic';
    if (message.includes('preparing')) return 'cog';
    return 'bolt';
  };
  
  return (
    <div className="max-w-md mx-auto py-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
          <FAIcon icon={getIcon()} className="text-2xl animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Processing Your Video</h3>
        <p className="text-sm text-slate-600">This will only take a few seconds</p>
      </div>
      
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-6">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white mr-3">
            <FAIcon icon="spinner" className="animate-spin" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-slate-700">{processing.message}</span>
              <span className="text-sm font-medium text-blue-600">{processing.progress}%</span>
            </div>
            <Progress 
              value={processing.progress} 
              className="h-2 w-full bg-slate-200 rounded-full overflow-hidden" 
            />
          </div>
        </div>
        
        <div className="text-xs text-slate-500 ml-11">
          <div className="flex items-center">
            <FAIcon icon="check-circle" className={`mr-1.5 ${processing.progress > 30 ? 'text-green-500' : 'text-slate-300'}`} />
            <span className={processing.progress > 30 ? 'text-slate-700' : 'text-slate-400'}>Downloading video information</span>
          </div>
          <div className="flex items-center mt-1">
            <FAIcon icon="check-circle" className={`mr-1.5 ${processing.progress > 60 ? 'text-green-500' : 'text-slate-300'}`} />
            <span className={processing.progress > 60 ? 'text-slate-700' : 'text-slate-400'}>Removing watermark</span>
          </div>
          <div className="flex items-center mt-1">
            <FAIcon icon="check-circle" className={`mr-1.5 ${processing.progress > 90 ? 'text-green-500' : 'text-slate-300'}`} />
            <span className={processing.progress > 90 ? 'text-slate-700' : 'text-slate-400'}>Preparing download</span>
          </div>
        </div>
      </div>
      
      {/* Download Another Video button - only show when complete */}
      {processing.progress === 100 && onReset && (
        <div className="mb-6 text-center">
          <button
            onClick={onReset}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-md hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center mx-auto"
          >
            <FAIcon icon="arrow-left" className="mr-2" />
            Download Another Video
          </button>
        </div>
      )}

      <div className="text-center text-xs text-slate-500 mb-6">
        <p>SamaBrains uses advanced technology to process TikTok videos quickly and efficiently.</p>
      </div>
    </div>
  );
}
