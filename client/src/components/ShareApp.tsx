import React from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Link, Mail } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export function ShareApp() {
  const shareUrl = window.location.origin;
  const shareTitle = "TikSave - Download TikTok Videos Without Watermark";
  const shareText = "I'm using TikSave to download TikTok videos without watermarks. It's fast and free. Check it out!";

  // Native Web Share API
  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast({
          title: "Shared successfully!",
          description: "Thanks for sharing TikSave with others."
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };
  
  // Social media shares
  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };
  
  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };
  
  const handleShareEmail = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.location.href = mailtoUrl;
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard."
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const isWebShareSupported = typeof navigator !== 'undefined' && navigator.share;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2 border-blue-400 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30"
        >
          <Share2 size={18} />
          Share App
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share TikSave</DialogTitle>
          <DialogDescription>
            Help others discover TikSave by sharing it with your friends and followers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {isWebShareSupported && (
            <Button 
              onClick={handleShareNative}
              className="w-full flex items-center justify-center gap-2"
            >
              <Share2 size={18} />
              Share via Device
            </Button>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              onClick={handleShareTwitter}
              className="flex items-center justify-center gap-2"
            >
              <Twitter size={18} className="text-blue-500" />
              Twitter
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleShareFacebook}
              className="flex items-center justify-center gap-2"
            >
              <Facebook size={18} className="text-blue-800" />
              Facebook
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleShareEmail}
              className="flex items-center justify-center gap-2"
            >
              <Mail size={18} className="text-gray-600" />
              Email
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2"
            >
              <Link size={18} className="text-gray-600" />
              Copy Link
            </Button>
          </div>
          
          <div className="text-sm text-gray-500 mt-2 text-center">
            Thank you for helping us grow TikSave!
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}