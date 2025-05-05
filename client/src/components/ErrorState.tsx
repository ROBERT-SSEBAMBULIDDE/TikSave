import { Button } from "@/components/ui/button";
import { FAIcon } from "@/components/ui/fa-icon";
import { ErrorData } from "@/lib/types";

interface ErrorStateProps {
  error: ErrorData;
  onReset: () => void;
}

export function ErrorState({ error, onReset }: ErrorStateProps) {
  return (
    <div>
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
        <div className="flex">
          <FAIcon icon="exclamation-circle" className="text-red-500 mt-0.5 mr-3" />
          <div>
            <p className="font-medium">{error.message}</p>
            <p className="text-sm">{error.details || "Please check the URL and try again. Make sure it's a valid TikTok video link."}</p>
          </div>
        </div>
      </div>
      <Button 
        className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 py-2 px-4 rounded-md font-medium transition-colors"
        onClick={onReset}
      >
        Try Again
      </Button>
    </div>
  );
}
