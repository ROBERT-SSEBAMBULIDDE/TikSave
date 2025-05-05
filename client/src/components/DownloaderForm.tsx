import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FAIcon } from "@/components/ui/fa-icon";

interface DownloaderFormProps {
  url: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function DownloaderForm({ url, onUrlChange, onSubmit }: DownloaderFormProps) {
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
