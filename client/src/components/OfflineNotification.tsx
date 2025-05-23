import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

export function OfflineNotification() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  if (!showOfflineBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-orange-600 text-white p-3 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <WifiOff className="h-5 w-5" />
          <div>
            <p className="font-medium">You're offline</p>
            <p className="text-sm text-orange-100">
              Some features may not work. Check your connection.
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleRetry}
          variant="ghost" 
          size="sm"
          className="text-white hover:bg-orange-700"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    </div>
  );
}