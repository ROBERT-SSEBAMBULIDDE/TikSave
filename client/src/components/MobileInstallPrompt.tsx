import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, X, ArrowRight, Share2 } from "lucide-react";

export function MobileInstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlatformIOS, setIsPlatformIOS] = useState(false);
  const [isPlatformAndroid, setIsPlatformAndroid] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    // Check if this is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Check specific platform
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    setIsPlatformIOS(isIOS);
    setIsPlatformAndroid(isAndroid);
    
    // Only show on mobile
    if (isMobile) {
      // Check if already installed
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone;
      
      // Only show if not already installed
      if (!isStandalone) {
        setIsVisible(true);
      }
    }
  }, []);
  
  if (!isVisible) return null;
  
  const handleClose = () => {
    setIsVisible(false);
  };
  
  const handleInstall = () => {
    setShowDetails(true);
  };
  
  return (
    <>
      {!showDetails ? (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-3 z-50">
          <button 
            onClick={handleClose} 
            className="absolute top-2 right-2 text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          
          <div className="flex flex-col items-center">
            <h3 className="text-base font-semibold mb-2">Install TikSave App</h3>
            <p className="text-sm text-blue-100 mb-3 text-center">
              Install our app for faster downloads without browser limitations
            </p>
            
            <Button 
              onClick={handleInstall}
              className="w-full bg-white text-blue-600 hover:bg-blue-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Install Now
            </Button>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-blue-600 text-white z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-blue-500">
            <h2 className="text-lg font-bold">Install TikSave App</h2>
            <button onClick={() => setIsVisible(false)} className="text-white p-1">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {isPlatformIOS && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-center">iOS Installation</h3>
                
                <div className="bg-blue-700 rounded-lg p-4 mb-4">
                  <div className="flex items-start mb-4">
                    <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">1</div>
                    <div>
                      <p className="font-medium text-white">Tap the Share button</p>
                      <div className="mt-2 bg-gray-100 p-2 rounded inline-block">
                        <Share2 className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">2</div>
                    <div>
                      <p className="font-medium text-white">Scroll and tap "Add to Home Screen"</p>
                      <p className="text-blue-200 text-sm mt-1">You'll need to scroll down to find this option</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">3</div>
                    <div>
                      <p className="font-medium text-white">Tap "Add" in the top right</p>
                      <p className="text-blue-200 text-sm mt-1">TikSave will be added to your home screen</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <img 
                    src="https://i.ibb.co/MfQLtjY/ios-add-to-homescreen.png" 
                    alt="iOS Add to Homescreen Flow" 
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            )}
            
            {isPlatformAndroid && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-center">Android Installation</h3>
                
                <div className="bg-blue-700 rounded-lg p-4 mb-4">
                  <div className="flex items-start mb-4">
                    <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">1</div>
                    <div>
                      <p className="font-medium text-white">Tap the menu button (⋮)</p>
                      <p className="text-blue-200 text-sm mt-1">Look for three dots in the top-right</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">2</div>
                    <div>
                      <p className="font-medium text-white">Tap "Add to Home screen"</p>
                      <p className="text-blue-200 text-sm mt-1">Or "Install app" if available</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">3</div>
                    <div>
                      <p className="font-medium text-white">Tap "Add" on the prompt</p>
                      <p className="text-blue-200 text-sm mt-1">TikSave will be added to your home screen</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <img 
                    src="https://i.ibb.co/X7VPQNS/android-add-to-homescreen.png" 
                    alt="Android Add to Homescreen Flow" 
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            )}
            
            {!isPlatformIOS && !isPlatformAndroid && (
              <div className="text-center py-8">
                <p className="text-lg mb-4">
                  Add TikSave to your home screen for faster access
                </p>
                <p>
                  Look for "Add to Home Screen" or "Install" option in your browser menu
                </p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-blue-500">
            <Button 
              onClick={() => setShowDetails(false)}
              className="w-full bg-white text-blue-600 hover:bg-blue-50"
            >
              Back
            </Button>
          </div>
        </div>
      )}
    </>
  );
}