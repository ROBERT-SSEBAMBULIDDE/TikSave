import { FAIcon } from "@/components/ui/fa-icon";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export function HowItWorksSection() {
  const [isCopied, setIsCopied] = useState(false);
  
  // Sharing functionality
  const shareUrl = window.location.origin;
  const shareTitle = "TikSave - Download TikTok Videos Without Watermark";
  const shareText = "I just found this super simple tool to download TikTok videos without watermarks. It's so easy to use! Just paste, select & download. Check it out:";
  
  const handleShareNative = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };
  
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
      setIsCopied(true);
      toast({
        title: "Link copied!",
        description: "You can now share it with your friends."
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };
  
  return (
    <section id="how-it-works" className="py-12 px-4 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center dark:text-white">How It Works</h2>
        
        <div className="flex items-center justify-center mb-10">
          {/* Simple one-step instruction */}
          <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow-sm dark:bg-blue-900/20">
            <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mr-4 dark:bg-blue-800 dark:text-blue-300">
              <FAIcon icon="magic" className="text-xl" />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold mb-1 dark:text-white">Paste, Select & Download</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Simply paste your TikTok URL, select your format preferences, and download your watermark-free video.
              </p>
            </div>
          </div>
        </div>
        
        {/* Share buttons section */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">
            Help Your Friends Download TikTok Videos Easily
          </h3>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button onClick={handleShareNative} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Share2 className="mr-2 h-4 w-4" />
                Share TikSave
              </Button>
            )}
            
            <Button onClick={handleShareTwitter} variant="outline" className="border-blue-300 text-[#1DA1F2] hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/30">
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
            
            <Button onClick={handleShareFacebook} variant="outline" className="border-blue-300 text-[#1877F2] hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/30">
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
            
            <Button onClick={handleShareEmail} variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            
            <Button onClick={handleCopyLink} variant="outline" className={`border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/30 ${isCopied ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {isCopied ? (
                <>
                  <FAIcon icon="check" className="mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <FAIcon icon="link" className="mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
