import React, { useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Mail } from "lucide-react";
import { AdUnit } from "@/components/AdUnit";
import { toast } from "@/hooks/use-toast";

export default function HowItWorks() {
  const [isCopied, setIsCopied] = useState(false);
  
  // Sharing functionality
  const shareUrl = window.location.origin;
  const shareTitle = "TikSave - Download TikTok Videos Without Watermark";
  const shareText = "I just found this amazing guide on how to download TikTok videos without watermarks. It's super easy! Check it out:";
  
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-slate-50 dark:bg-gray-900">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-800 dark:text-blue-400">How It Works</h1>
          
          {/* Rectangle ad format for top of page */}
          <AdUnit format="rectangle" className="mb-8" />
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-400">Using TikSave</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                TikSave is a simple, fast, and reliable tool by SamaBrains for downloading
                TikTok videos without watermarks. Here is how to use it in a few easy steps:
              </p>
              
              <div className="space-y-8">
                {/* Step 1 */}
                <div className="flex">
                  <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mr-4 dark:bg-blue-900 dark:text-blue-300">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Find and Copy the TikTok URL</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Open the TikTok app or website and find the video you want to download. Tap on the "Share" button 
                      and select "Copy Link" to copy the video URL to your clipboard.
                    </p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex">
                  <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mr-4 dark:bg-blue-900 dark:text-blue-300">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Paste the URL into TikSave</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Come back to TikSave and paste the copied URL into the input field. 
                      Our system will automatically validate the URL and process the video information.
                    </p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex">
                  <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mr-4 dark:bg-blue-900 dark:text-blue-300">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Choose Your Preferred Format</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Select your desired download format (MP4, MP3, WebM) and quality level (High, Medium, Low). 
                      MP4 is best for video with audio, MP3 for audio only, and WebM offers good compression.
                    </p>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="flex">
                  <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mr-4 dark:bg-blue-900 dark:text-blue-300">
                    <span className="text-xl font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Preview and Download</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      After processing, you will see a preview of the video. Click the "Download Now" button to save the 
                      watermark-free video directly to your device. The file will be saved in your downloads folder.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-400">Behind the Scenes</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3 dark:bg-blue-900 dark:text-blue-300">
                    <span className="text-lg">🖥️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 dark:text-white">Processing Technology</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Our system uses advanced video processing technology to retrieve the original video from TikTok servers,
                      remove any watermarks, and convert it to your preferred format. The entire process happens in seconds.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3 dark:bg-blue-900 dark:text-blue-300">
                    <span className="text-lg">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 dark:text-white">Privacy and Security</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      We prioritize your privacy. We do not store the videos on our servers longer than necessary for
                      processing, and we do not collect any personal information. Your download history is stored locally in your browser.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3 dark:bg-blue-900 dark:text-blue-300">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 dark:text-white">Speed and Quality</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Our service is optimized for fast processing and high-quality downloads. We maintain the original video 
                      quality while ensuring the file size remains optimal for sharing and storage.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-400">Tips for Best Results</h2>
              
              <ul className="list-disc pl-6 space-y-3 text-slate-700 dark:text-slate-300">
                <li>
                  <strong>Use Direct Links:</strong> Always use the direct TikTok video link for best results. Links from other platforms or shortened URLs might not work correctly.
                </li>
                <li>
                  <strong>Choose the Right Format:</strong> Select MP4 for video with audio, MP3 for audio only, and WebM if you want better compression.
                </li>
                <li>
                  <strong>Quality Selection:</strong> "High" quality provides the best resolution but larger file size. "Medium" and "Low" are good for sharing or saving storage space.
                </li>
                <li>
                  <strong>Browser Compatibility:</strong> Our downloader works best with modern browsers like Chrome, Firefox, Safari, and Edge.
                </li>
                <li>
                  <strong>Download History:</strong> Your recent downloads are saved in your browser session storage and will be cleared when you close the browser or refresh the page.
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Horizontal ad format for bottom of page */}
          {/* Share Section */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800/50">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700 dark:text-blue-400">
                Share This Guide With Friends
              </h2>
              
              <p className="text-center mb-6 text-slate-700 dark:text-slate-300">
                Know someone who struggles with TikTok downloads? Help them out by sharing this guide!
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <Button onClick={handleShareNative} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Guide
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
                      <span className="mr-2">✓</span>
                      Copied!
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🔗</span>
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <AdUnit format="horizontal" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
