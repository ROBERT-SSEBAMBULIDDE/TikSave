import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share, Smartphone, Info } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installStatus, setInstallStatus] = useState<string>("waiting");
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const isDev = import.meta.env.DEV || window.location.hostname === "localhost";

  useEffect(() => {
    // Check if already installed as standalone
    const isInStandaloneMode = () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
    
    setIsStandalone(isInStandaloneMode());
    
    if (isInStandaloneMode()) {
      console.log('App is running in standalone mode');
      setInstallStatus("already-installed");
      return; // Don't show install button if already installed
    }

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    const isAndroidDevice = /android/.test(userAgent);
    const isMobileDevice = isIOSDevice || isAndroidDevice || /mobi/i.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    setIsMobile(isMobileDevice);
    
    if (isIOSDevice) {
      setInstallStatus("ios-detected");
    } else if (isAndroidDevice) {
      setInstallStatus("android-detected");
    }

    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        if (registrations.length > 0) {
          console.log('Service Worker is registered:', registrations);
          setInstallStatus(prev => prev + ";service-worker-registered");
        } else {
          console.log('No Service Worker registrations found');
          setInstallStatus(prev => prev + ";no-service-worker");
        }
      });
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Update UI to show the install button
      setIsInstallable(true);
      setInstallStatus(prev => prev + ";installable");
      console.log("App is installable! The beforeinstallprompt event fired.");
    };

    // Check if app is already installed
    const handleAppInstalled = () => {
      // Hide the install button when installed
      setIsInstallable(false);
      setDeferredPrompt(null);
      setInstallStatus("installed");
      console.log("TikSave app was installed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // For Android/Chrome
      try {
        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        // We've used the prompt, and can't use it again, discard it
        setDeferredPrompt(null);
        
        if (outcome === "accepted") {
          console.log("User accepted the install prompt");
          setIsInstallable(false);
          setInstallStatus("installing");
        } else {
          console.log("User dismissed the install prompt");
          setInstallStatus("dismissed");
        }
      } catch (error) {
        console.error("Error during installation:", error);
        setInstallStatus("error-installing");
      }
    } else if (isIOS) {
      // For iOS, show detailed instructions
      setShowIOSInstructions(true);
    } else if (isAndroid) {
      // Fallback for Android if beforeinstallprompt didn't fire
      alert("To install this app, open it in Chrome and tap the menu button, then tap 'Add to Home screen'");
    }
  };

  // Show installation UI if:
  // - Browser supports installation (isInstallable)
  // - OR we're on iOS 
  // - OR we're in dev mode
  // - AND NOT already installed
  const shouldShow = (isInstallable || isIOS || isAndroid || isDev) && !isStandalone;
  
  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isInstallable && (
        <Button 
          onClick={handleInstallClick} 
          className="bg-blue-700 hover:bg-blue-800 text-white shadow-lg flex items-center"
          size="lg"
        >
          <Download className="mr-2 h-5 w-5" />
          Install App
        </Button>
      )}
      
      {!isInstallable && (isMobile || isDev) && (
        <Button 
          onClick={handleInstallClick} 
          className="bg-blue-700 hover:bg-blue-800 text-white shadow-lg flex items-center"
          size="lg"
        >
          <Smartphone className="mr-2 h-5 w-5" />
          Install TikSave
        </Button>
      )}
      
      {isDev && (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 max-w-xs mt-3">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                PWA Status: {installStatus}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Mobile: {isMobile ? "Yes" : "No"}, 
                iOS: {isIOS ? "Yes" : "No"}, 
                Android: {isAndroid ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {showIOSInstructions && isIOS && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-2xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Install TikSave on iOS</h3>
            
            <ol className="space-y-4 mb-4">
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <p className="text-slate-700 dark:text-slate-300">Tap the Share button in Safari</p>
                  <div className="mt-1">
                    <Share className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                  </div>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <p className="text-slate-700 dark:text-slate-300">Scroll down and tap "Add to Home Screen"</p>
                  <div className="mt-1 p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-sm">
                    Add to Home Screen
                  </div>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <p className="text-slate-700 dark:text-slate-300">Tap "Add" in the top-right corner</p>
              </li>
            </ol>
            
            <div className="flex justify-end">
              <Button 
                onClick={() => setShowIOSInstructions(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
