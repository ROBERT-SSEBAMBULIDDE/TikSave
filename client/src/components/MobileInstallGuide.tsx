import { useState, useEffect } from "react";
import { Heart, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileInstallGuide() {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  
  useEffect(() => {
    // Check if already running in standalone mode
    const isInStandaloneMode = () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
      
    setIsStandalone(isInStandaloneMode());
    
    if (isInStandaloneMode()) {
      return; // Already installed, don't show guide
    }
    
    // Check if on iOS
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);
    
    // Only show on mobile devices
    const isMobileDevice = isIOSDevice || /android/.test(userAgent) || /mobi/.test(userAgent);
    
    if (isMobileDevice) {
      // Check if user has previously dismissed
      const dismissed = localStorage.getItem('installGuideDismissed');
      if (!dismissed) {
        setTimeout(() => {
          setIsVisible(true);
        }, 3000); // Show after 3 seconds
      }
    }
  }, []);
  
  const handleDismiss = () => {
    setIsVisible(false);
    // Remember dismissal for 1 day
    localStorage.setItem('installGuideDismissed', Date.now().toString());
    // Clear after 24 hours
    setTimeout(() => {
      localStorage.removeItem('installGuideDismissed');
    }, 24 * 60 * 60 * 1000);
  };
  
  if (!isVisible || isStandalone) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 z-50 shadow-lg">
      <div className="relative max-w-lg mx-auto">
        <button 
          onClick={handleDismiss}
          className="absolute top-0 right-0 p-1 text-white"
          aria-label="Dismiss"
        >
          <X size={20} />
        </button>
        
        <h3 className="text-lg font-semibold mb-2">Install TikSave on your device</h3>
        
        {isIOS ? (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed">
              Tap <Heart className="inline h-4 w-4" /> and then "Add to Home Screen" to install TikSave for faster access
            </p>
            <div className="flex items-center space-x-1 text-xs font-medium py-1">
              <span className="flex items-center justify-center bg-white text-blue-600 rounded-full w-6 h-6">1</span>
              <ArrowRight className="h-4 w-4" />
              <span className="flex items-center justify-center bg-white text-blue-600 rounded-full w-6 h-6">2</span>
              <ArrowRight className="h-4 w-4" />
              <span className="flex items-center justify-center bg-white text-blue-600 rounded-full w-6 h-6">3</span>
              <span className="ml-2">Save to your home screen!</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed">
              Tap the menu button and select "Add to Home screen" to install TikSave as an app
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDismiss}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Got it
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}