import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Info } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installStatus, setInstallStatus] = useState<string>("waiting");
  const isDev = import.meta.env.DEV || window.location.hostname === "localhost";

  useEffect(() => {
    // Check if on iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        if (registrations.length > 0) {
          console.log('Service Worker is registered:', registrations);
          setInstallStatus("service-worker-registered");
        } else {
          console.log('No Service Worker registrations found');
          setInstallStatus("no-service-worker");
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
      setInstallStatus("installable");
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
    if (!deferredPrompt) return;

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
  };

  // Always show in dev mode for testing purposes
  const shouldShow = isInstallable || isIOS || isDev;
  
  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isInstallable && (
        <Button 
          onClick={handleInstallClick} 
          className="bg-blue-700 hover:bg-blue-800 text-white shadow-lg"
        >
          <Download className="mr-2 h-4 w-4" />
          Install App
        </Button>
      )}
      
      {isDev && !isInstallable && (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 max-w-xs">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                PWA Install Status: {installStatus}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This debug info only appears in development. The install button will appear when all criteria are met.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {isIOS && !isInstallable && (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 max-w-xs">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Install TikSave on your iOS device:
            <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">
              Tap <span className="inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </span> and then "Add to Home Screen"
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
