import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook } from "lucide-react";

export function ShareAppCTA() {
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

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-6">
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-2">Love TikSave?</h3>
          <p className="text-slate-600">
            Help us grow by sharing this tool with your friends and followers!
          </p>
        </div>

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
  );
}
