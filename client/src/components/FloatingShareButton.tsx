import React, { useState, useEffect } from 'react';
import { Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export function FloatingShareButton() {
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [initiallyHidden, setInitiallyHidden] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Show the button after user has scrolled a bit
    const timer = setTimeout(() => {
      setInitiallyHidden(false);
    }, 5000); // Show after 5 seconds
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);
  
  // Control visibility based on scroll
  useEffect(() => {
    if (initiallyHidden) return;
    
    if (scrollY > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [scrollY, initiallyHidden]);
  
  // Sharing functionality
  const shareUrl = window.location.origin;
  const shareTitle = "TikSave - Download TikTok Videos Without Watermark";
  const shareText = "I just found this amazing free tool to download TikTok videos without watermarks. Check it out:";
  
  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
    recordShare();
  };
  
  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
    recordShare();
  };
  
  const handleShareEmail = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.location.href = mailtoUrl;
    recordShare();
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard."
      });
      recordShare();
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleShareNative = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        recordShare();
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };
  
  const recordShare = () => {
    setShowDialog(false);
    
    // Save to localStorage that user has shared
    localStorage.setItem('has_shared_floating', 'true');
    
    // Optional: increment a counter
    const shareCount = parseInt(localStorage.getItem('share_count') || '0', 10);
    localStorage.setItem('share_count', (shareCount + 1).toString());
  };
  
  if (!visible) return null;
  
  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button 
            className="fixed bottom-20 right-4 z-30 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center"
            onClick={() => setShowDialog(true)}
          >
            <Share2 className="h-5 w-5 text-white" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share TikSave</DialogTitle>
            <DialogDescription>
              Help others discover this free TikTok downloader
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button onClick={handleShareNative} className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Share via Device
              </Button>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                onClick={handleShareTwitter}
                className="flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1DA1F2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                </svg>
                Twitter
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleShareFacebook}
                className="flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleShareEmail}
                className="flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#EA4335" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.372 0 0 5.372 0 12c0 6.627 5.372 12 12 12s12-5.372 12-12c0-6.627-5.372-12-12-12zm6.99 6.98L12 12.94c-2.65-2.6-5.255-4.285-6.99-5.96 1.565-1.68 3.95-2.765 6.99-2.765 3.04 0 5.424 1.084 6.99 2.765zm-13.973.015c1.75 1.697 4.354 3.382 6.983 5.96l-6.983 6.983c-1.67-1.54-2.717-3.736-2.717-6.178 0-2.647 1.16-5.025 2.717-6.765zm.011 13.974L12 13.985l6.978 6.985c-1.6 1.655-3.978 2.715-6.978 2.715-3 0-5.377-1.06-6.978-2.715zm13.965-.016c-1.557 1.745-3.825 2.722-6.988 2.722-3.163 0-5.43-.977-6.988-2.722L12 13.965l6.993 6.988z" />
                </svg>
                Email
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                </svg>
                Copy Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}