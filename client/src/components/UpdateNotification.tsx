import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

export function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                setShowUpdate(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdate(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">Update Available!</h3>
          <p className="text-sm text-blue-100 mt-1">
            A new version of TikSave is ready with improvements and bug fixes.
          </p>
        </div>
        <Button 
          onClick={handleDismiss}
          variant="ghost" 
          size="sm"
          className="text-white hover:bg-blue-700 p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          onClick={handleUpdate}
          className="bg-white text-blue-600 hover:bg-blue-50 flex-1"
          size="sm"
        >
          <Download className="mr-2 h-4 w-4" />
          Update Now
        </Button>
        <Button 
          onClick={handleDismiss}
          variant="ghost" 
          size="sm"
          className="text-white hover:bg-blue-700"
        >
          Later
        </Button>
      </div>
    </div>
  );
}