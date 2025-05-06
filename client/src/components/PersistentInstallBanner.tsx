import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PersistentInstallBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  
  useEffect(() => {
    // Check if already in standalone mode
    const isInStandaloneMode = () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
    
    setIsStandalone(isInStandaloneMode());
    
    // Only show banner if not already in standalone mode
    if (!isInStandaloneMode()) {
      // Check if user has previously dismissed banner within 24 hours
      const dismissedTime = localStorage.getItem('installBannerDismissed');
      const showBanner = !dismissedTime || 
                        (Date.now() - parseInt(dismissedTime)) > 24 * 60 * 60 * 1000;
      
      if (showBanner) {
        // Delay showing banner by 5 seconds
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);
  
  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('installBannerDismissed', Date.now().toString());
  };
  
  const handleInstallClick = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      alert("To install on iOS:\n\n1. Tap the share icon (square with arrow)\n2. Scroll down and tap 'Add to Home Screen'\n3. Tap 'Add' in the top right");
    } else if (/android/.test(userAgent)) {
      alert("To install on Android:\n\n1. Tap the menu button (three dots)\n2. Tap 'Add to Home screen'\n3. Follow the on-screen instructions");
    } else {
      alert("To install this app:\n\n• Look for the install icon in your browser's address bar\n• Or find 'Install' or 'Add to Home Screen' in your browser menu");
    }
    
    // Keep the banner visible since user might need instructions
  };
  
  if (!isVisible || isStandalone) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Download className="mr-2 h-5 w-5" />
          <div>
            <h3 className="text-sm font-medium">Install TikSave</h3>
            <p className="text-xs text-blue-100">Add to home screen for easy access</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleInstallClick}
            className="bg-white text-blue-600 hover:bg-blue-50 text-xs px-3"
          >
            Install
          </Button>
          
          <button 
            className="text-white p-1"
            onClick={handleDismiss}
            aria-label="Dismiss"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}