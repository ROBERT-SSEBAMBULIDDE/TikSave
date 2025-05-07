import React, { useState, useEffect } from 'react';
import { X, Share2, Award, Twitter, Facebook, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function SharePromptBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  // Check if we've recently shown the banner (within last 24 hours)
  useEffect(() => {
    const lastShown = localStorage.getItem('share_banner_dismissed');
    const lastShownTime = lastShown ? parseInt(lastShown, 10) : 0;
    const now = Date.now();
    
    // If not shown in last 24 hours, show it again
    if (now - lastShownTime > 24 * 60 * 60 * 1000) {
      // Show the banner after a slight delay (let user see the content first)
      const timer = setTimeout(() => {
        setVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    // Remember that we dismissed the banner
    localStorage.setItem('share_banner_dismissed', Date.now().toString());
  };
  
  const shareUrl = window.location.origin;
  const shareText = "I just found TikSave - an amazing tool to download TikTok videos without watermarks! Check it out:";
  
  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
    handleDismiss();
  };
  
  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
    handleDismiss();
  };
  
  const handleShareNative = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: "TikSave - Download TikTok Videos Without Watermark",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
    handleDismiss();
  };
  
  if (!visible || dismissed) return null;
  
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-4 flex justify-center items-center">
      <Card className="relative w-full max-w-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-xl overflow-hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 text-white hover:bg-white/10 rounded-full"
          onClick={handleDismiss}
        >
          <X size={18} />
        </Button>
        
        <div className="p-4 sm:p-6">
          <div className="flex items-center mb-3">
            <Award className="mr-2 h-6 w-6 text-yellow-300" />
            <h3 className="font-bold text-lg">Help Others Discover TikSave!</h3>
          </div>
          
          <p className="mb-4 text-white/90 text-sm sm:text-base">
            Enjoying TikSave? Share it with friends who download TikTok videos! More shares mean we can keep improving the app for free.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button
                variant="secondary"
                className="bg-white text-blue-700 hover:bg-blue-50 w-full"
                onClick={handleShareNative}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Now
              </Button>
            )}
            
            <Button
              variant="secondary"
              className="bg-[#1DA1F2] hover:bg-[#1a94e1] text-white border-none w-full"
              onClick={handleShareTwitter}
            >
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
            
            <Button
              variant="secondary"
              className="bg-[#1877F2] hover:bg-[#166fe0] text-white border-none w-full"
              onClick={handleShareFacebook}
            >
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
          </div>
          
          <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center text-xs text-white/70">
            <span>Thanks for your support!</span>
            <button 
              className="flex items-center text-white/90 hover:text-white"
              onClick={handleDismiss}
            >
              Maybe later <ChevronRight className="ml-1 h-3 w-3" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}