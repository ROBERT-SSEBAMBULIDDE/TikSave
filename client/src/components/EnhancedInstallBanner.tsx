import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone, Star, Zap, Shield } from "lucide-react";

export function EnhancedInstallBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBenefits, setShowBenefits] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');
    
    if (isStandalone) return;

    // Check if user dismissed banner recently
    const dismissed = localStorage.getItem('install_banner_dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
    
    if (hoursSinceDismissed < 24) return; // Don't show for 24 hours after dismissal

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    const isMobile = isIOSDevice || isAndroidDevice || /mobi/i.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    if (isMobile) {
      // Show banner after 5 seconds to let user see the app first
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);

      return () => clearTimeout(timer);
    }

    // Listen for install prompt on desktop
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowBenefits(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('install_banner_dismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <>
      {!showBenefits ? (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 z-50 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-2 rounded-full">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Install TikSave App</h3>
                <p className="text-blue-100 text-sm">
                  Faster downloads, offline access, no browser limits!
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                onClick={handleInstall}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                size="sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Install Now
              </Button>
              <Button 
                onClick={handleDismiss}
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Install TikSave App
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Get the best TikTok downloading experience
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                  <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Lightning Fast</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">No browser overhead</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Works Offline</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Access your downloads anywhere</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                  <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Native Experience</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Feels like a real app</p>
                </div>
              </div>
            </div>

            {isIOS && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">
                  📱 For iOS: Tap Share → "Add to Home Screen"
                </p>
              </div>
            )}

            {isAndroid && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl mb-4">
                <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-2">
                  📱 For Android: Tap menu (⋮) → "Add to Home screen"
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <Button 
                onClick={() => setShowBenefits(false)}
                variant="outline" 
                className="flex-1"
              >
                Maybe Later
              </Button>
              <Button 
                onClick={handleInstall}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                Install Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}