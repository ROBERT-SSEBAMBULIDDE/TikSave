import React from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { AdUnit } from "@/components/AdUnit";

export default function HowItWorks() {
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
          <AdUnit format="horizontal" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
