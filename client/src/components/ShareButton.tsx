import { Button } from "@/components/ui/button";
import { FAIcon } from "@/components/ui/fa-icon";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function ShareButton({ className = "" }: { className?: string }) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    // Don\t allow multiple shares at once
    if (isSharing) return;

    // Set sharing state
    setIsSharing(true);

    try {
      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: "TikSave - Download TikTok Videos Without Watermark",
          text: "Download TikTok videos without watermark using this amazing tool!",
          url: window.location.origin
        });
        toast({
          title: "Thanks for sharing!",
          description: "You\re awesome for spreading the word about TikSave!",
        });
      } else {
        // Fallback for browsers that don\t support Web Share API
        // Copy to clipboard
        await navigator.clipboard.writeText(window.location.origin);
        toast({
          title: "Link copied!",
          description: "Share with your friends to help them download TikTok videos without watermark!",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        variant: "destructive",
        title: "Couldn\t share",
        description: "Please try copying the URL manually",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={`flex items-center text-sm font-medium transition-colors ${className}`}
      onClick={handleShare}
      disabled={isSharing}
    >
      <FAIcon icon="share-alt" className="mr-2" />
      {isSharing ? "Sharing..." : "Share App"}
    </Button>
  );
}
