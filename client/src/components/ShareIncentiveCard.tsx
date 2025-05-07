import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Gift, Trophy, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function ShareIncentiveCard() {
  const [shared, setShared] = useState(false);
  
  const shareUrl = window.location.origin;
  const shareTitle = "TikSave - Download TikTok Videos Without Watermark";
  const shareText = "I'm using TikSave to download TikTok videos without watermarks. It's fast, free and works great! Check it out:";

  // Native Web Share API
  const handleShareNative = async () => {
    if (navigator.share) {
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
  
  // Social media shares
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
  
  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
    recordShare();
  };
  
  const recordShare = () => {
    setShared(true);
    
    // Show thank you toast
    toast({
      title: "Thank you for sharing!",
      description: "Your support helps us keep TikSave free and add new features.",
    });
    
    // Save to localStorage that user has shared
    localStorage.setItem('has_shared_app', 'true');
    
    // Optional: increment a counter
    const shareCount = parseInt(localStorage.getItem('share_count') || '0', 10);
    localStorage.setItem('share_count', (shareCount + 1).toString());
  };
  
  // Check if user has shared before
  React.useEffect(() => {
    const hasShared = localStorage.getItem('has_shared_app') === 'true';
    if (hasShared) {
      setShared(true);
    }
  }, []);

  const isWebShareSupported = typeof navigator !== 'undefined' && navigator.share;
  
  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-purple-200 dark:from-indigo-900/30 dark:to-purple-900/30 dark:border-purple-800/50">
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
            {shared ? <Trophy className="h-6 w-6" /> : <Gift className="h-6 w-6" />}
          </div>
          <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-2">
            {shared ? "Thanks for sharing!" : "Help us grow!"}
          </h3>
          <p className="text-slate-700 dark:text-slate-300">
            {shared 
              ? "Your support helps us add more features and keep TikSave free."
              : "Share TikSave with friends who download TikTok videos regularly!"
            }
          </p>
        </div>
        
        {!shared ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {isWebShareSupported && (
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 col-span-full"
                onClick={handleShareNative}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share TikSave
              </Button>
            )}
            
            <Button
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/30"
              onClick={handleShareTwitter}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
              </svg>
              Twitter
            </Button>
            
            <Button
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/30"
              onClick={handleShareFacebook}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
            
            <Button
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/30 col-span-full"
              onClick={handleShareWhatsApp}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <Heart className="text-red-500 h-8 w-8" />
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              These upcoming features are possible thanks to your support:
            </p>
            <ul className="mt-3 text-left text-sm space-y-2 text-slate-700 dark:text-slate-300">
              <li className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                Batch video downloading
              </li>
              <li className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                Custom video trimming
              </li>
              <li className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                Additional audio formats
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}