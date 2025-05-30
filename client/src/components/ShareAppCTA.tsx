import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FAIcon } from "@/components/ui/fa-icon";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function ShareAppCTA() {
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
    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 mb-10 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row items-center justify-between p-6">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">
              Enjoying TikSave?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-md">
              Help your friends download TikTok videos without watermarks by sharing this tool!
            </p>
          </div>
          
          <Button
            size="lg"
            onClick={handleShare}
            disabled={isSharing}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full font-semibold shadow-md flex items-center space-x-2 min-w-[180px] justify-center"
          >
            <FAIcon icon="share-alt" className="mr-2" />
            <span>{isSharing ? "Sharing..." : "Share TikSave"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
