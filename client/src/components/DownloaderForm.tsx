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
    <form onSubmit={onSubmit} className="mb-4">
      <div className="mb-4">
        <div className="flex rounded-md shadow-sm">
          <Input
            type="url"
            placeholder="https://www.tiktok.com/@username/video/1234567890123456789"
            className="flex-grow border border-slate-300 rounded-l-md focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base rounded-r-none"
            value={url}
            onChange={onUrlChange}
            required
          />
          <Button 
            type="submit" 
            className="bg-primary hover:bg-blue-700 text-white px-4 py-3 rounded-r-md font-medium transition-colors text-sm sm:text-base flex items-center"
          >
            <FAIcon icon="search" className="mr-2" /> Process
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Paste a TikTok video link from the app or website
        </p>
      </div>
    </form>
  );
}
