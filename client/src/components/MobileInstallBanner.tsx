import { useState, useEffect } from "react";
import { X, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileInstallBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  
  useEffect(() => {
    // Check if already installed as PWA
    const isInStandaloneMode = () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
    
    setIsStandalone(isInStandaloneMode());
    
    if (isInStandaloneMode()) {
      return; // Don't show banner if already installed
    }

    // Check device type
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    
    // Only show on mobile devices
    if (isIOSDevice || isAndroidDevice) {
      setIsIOS(isIOSDevice);
      setIsAndroid(isAndroidDevice);
      
      // Check if user has previously dismissed the banner
      const bannerDismissed = localStorage.getItem('installBannerDismissed');
      if (!bannerDismissed) {
        // Delay showing the banner for a few seconds
        setTimeout(() => {
          setIsVisible(true);
        }, 2000);
      }
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Remember dismissal for 24 hours
    localStorage.setItem('installBannerDismissed', Date.now().toString());
    
    // Clear the dismissal after 24 hours
    setTimeout(() => {
      localStorage.removeItem('installBannerDismissed');
    }, 24 * 60 * 60 * 1000);
  };

  const handleInstallClick = () => {
    if (isIOS) {
      alert('To install TikSave on your iOS device:\n\n1. Tap the Share button at the bottom of your screen\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top-right corner');
    } else if (isAndroid) {
      alert('To install TikSave on your Android device:\n\n1. Tap the menu button (three dots) in the top-right of your browser\n2. Tap "Add to Home screen"\n3. Follow the on-screen instructions to complete installation');
    }
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-3 z-50 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-2">
          <p className="text-sm font-medium">Install TikSave for easy access!</p>
          {isIOS && (
            <p className="text-xs opacity-90 mt-0.5">
              Tap <Share className="h-3 w-3 inline" /> then "Add to Home Screen"
            </p>
          )}
          {isAndroid && (
            <p className="text-xs opacity-90 mt-0.5">
              Tap the menu button, then "Add to Home screen"
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleInstallClick}
            className="h-8 px-3 py-1 text-xs bg-white text-blue-600 hover:bg-blue-50"
          >
            <Download className="h-3 w-3 mr-1" /> 
            Install
          </Button>
          <button 
            onClick={handleClose}
            className="text-white p-1 rounded-full hover:bg-blue-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}