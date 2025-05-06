import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Download, Heart } from "lucide-react";

// Define the BeforeInstallPromptEvent interface for window.deferredPrompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Extend Window interface to include our deferredPrompt property
declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}

export function ShareAppCTA() {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSInstallGuide, setShowIOSInstallGuide] = useState(false);
  
  useEffect(() => {
    // Check if we're already in standalone/installed mode
    const isInStandaloneMode = () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
    
    setIsStandalone(isInStandaloneMode());
    
    // Detect mobile platforms
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));
  }, []);
  
  const shareUrl = window.location.origin;
  const shareTitle = "TikSave - Download TikTok Videos Without Watermark";
  const shareText = "I'm using TikSave to download TikTok videos without watermarks. It's fast and free. Check it out!";

  const shareViaWebShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      }).catch(err => console.error('Error sharing:', err));
    }
  };

  const shareViaTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareViaFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };
  
  const handleInstallClick = () => {
    // Show more comprehensive instructions regardless of detected platform
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      // iOS-specific instructions
      setShowIOSInstallGuide(true);
    } else if (/android/.test(userAgent)) {
      // Android-specific instructions
      alert("Install on Android:\n\n1. Tap the menu button (⋮) in Chrome\n2. Select 'Add to Home screen'\n3. Confirm by tapping 'Add'");
    } else if (/chrome/.test(userAgent)) {
      // Chrome desktop instructions
      alert("Install on Chrome:\n\n1. Look for the install icon (+) in the address bar\n2. Click 'Install'\n\nIf you don't see the icon, click the three dots menu (⋮) and select 'Install TikSave...'");
    } else if (/firefox/.test(userAgent)) {
      // Firefox instructions
      alert("Install on Firefox:\n\n1. Click the three lines menu (≡)\n2. Select 'Add to Home Screen' or 'Install'");
    } else if (/safari/.test(userAgent)) {
      // Safari desktop instructions
      alert("Install on Safari:\n\n1. Click the Share button\n2. Select 'Add to Home Screen'");
    } else {
      // Generic instructions for all other browsers
      alert("To install this app:\n\n• Mobile: Look for 'Add to Home Screen' option in your browser menu\n• Desktop: Look for install icon in address bar or browser menu\n\nIf you need help, check your browser's instructions for installing web apps.");
    }
  };

  return (
    <>
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-6">
        <CardContent className="pt-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-blue-800 mb-2">Love TikSave?</h3>
            <p className="text-slate-600">
              Help us grow by sharing this tool with your friends and followers!
            </p>
          </div>
          
          {/* Direct Install Button using beforeinstallprompt event if available */}
          <Button 
            variant="default" 
            className="w-full mb-4 bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              // First try to use the deferredPrompt if available
              if (window.deferredPrompt) {
                window.deferredPrompt.prompt();
                window.deferredPrompt.userChoice.then(choiceResult => {
                  if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                  }
                  // Clear the prompt
                  window.deferredPrompt = null;
                });
              } else {
                // Otherwise use the fallback instructions
                handleInstallClick();
              }
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Install TikSave App
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {/* Web Share API (Mobile-friendly) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 border-blue-400 text-blue-700 hover:bg-blue-50"
                onClick={shareViaWebShare}
              >
                <Share2 size={18} />
                Share This App
              </Button>
            )}

            {/* Social Media Share Buttons */}
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 border-blue-400 text-blue-600 hover:bg-blue-50"
              onClick={shareViaTwitter}
            >
              <Twitter size={18} />
              Share on Twitter
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 border-blue-400 text-blue-800 hover:bg-blue-50"
              onClick={shareViaFacebook}
            >
              <Facebook size={18} />
              Share on Facebook
            </Button>
          </div>

          <p className="text-xs text-center text-slate-500 mt-4">
            SamaBrains is a Uganda-based company providing innovative digital solutions.
            <br />
            Contact us: info@samabrains.com | +256759910596
          </p>
        </CardContent>
      </Card>
      
      {/* iOS Installation Guide Modal */}
      {showIOSInstallGuide && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-3">Install TikSave on iOS</h3>
            
            <ol className="space-y-3 mb-5">
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <p className="font-medium">Tap the Share button</p>
                  <div className="flex items-center mt-1">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <p className="font-medium">Select "Add to Home Screen"</p>
                  <p className="text-sm text-gray-500 mt-1">Scroll down to find this option</p>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <p className="font-medium">Tap "Add" in the top right corner</p>
              </li>
            </ol>
            
            <Button 
              className="w-full" 
              onClick={() => setShowIOSInstallGuide(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
