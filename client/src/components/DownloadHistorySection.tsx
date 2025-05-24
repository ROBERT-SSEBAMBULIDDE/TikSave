import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBytes } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowDown, Clock, Film, Music, RefreshCw, Trash2, Share2 } from 'lucide-react';

// Define interface for download records
interface DownloadRecord {
  id: string;
  videoId: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  author: string;
  format: string;
  quality: string;
  fileSize: number | null;
  downloadedAt: string;
}

// Constants
const SESSION_STORAGE_KEY = 'tiktok_downloader_history';

// Helper to save download history
export function saveToSessionHistory(download: Omit<DownloadRecord, 'id' | 'downloadedAt'>) {
  try {
    // Get current downloads
    const existingJSON = sessionStorage.getItem(SESSION_STORAGE_KEY);
    const existing: DownloadRecord[] = existingJSON ? JSON.parse(existingJSON) : [];
    
    // Create new record
    const newDownload: DownloadRecord = {
      ...download,
      id: Date.now().toString(),
      downloadedAt: new Date().toISOString()
    };
    
    // Save to session storage
    const updated = [newDownload, ...existing];
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    
    // Notify components
    window.dispatchEvent(new CustomEvent('download_history_updated'));
    
    return newDownload;
  } catch (err) {
    console.error('Error saving to session storage:', err);
    return null;
  }
}

export function DownloadHistorySection() {
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Load downloads from session storage
  const loadDownloads = () => {
    setLoading(true);
    try {
      const storedData = sessionStorage.getItem(SESSION_STORAGE_KEY);
      const sessionDownloads: DownloadRecord[] = storedData ? JSON.parse(storedData) : [];
      setDownloads(sessionDownloads);
    } catch (err) {
      console.error('Error loading download history:', err);
      setDownloads([]);
    } finally {
      setLoading(false);
    }
  };

  // Clear all downloads
  const handleClearDownloads = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setDownloads([]);
    window.dispatchEvent(new CustomEvent('download_history_updated'));
  };

  useEffect(() => {
    // Initial load
    loadDownloads();
    
    // Listen for updates from other components
    const handleHistoryUpdate = () => {
      loadDownloads();
    };
    
    window.addEventListener('download_history_updated', handleHistoryUpdate);
    
    return () => {
      window.removeEventListener('download_history_updated', handleHistoryUpdate);
    };
  }, []);

  const handleRedownload = (download: DownloadRecord) => {
    const downloadUrl = `/api/tiktok/download?videoId=${download.videoId}&format=${download.format}&quality=${download.quality}&videoUrl=${encodeURIComponent(download.videoUrl)}&thumbnailUrl=${encodeURIComponent(download.thumbnailUrl)}&title=${encodeURIComponent(download.title)}&author=${encodeURIComponent(download.author)}`;
    window.open(downloadUrl, '_blank');
  };

  const handleSaveToDevice = (download: DownloadRecord) => {
    const userConfirmed = confirm(`💾 Save Video to Device\n\nTitle: ${download.title}\nFormat: ${download.format.toUpperCase()}\nQuality: ${download.quality}\n\nThis will re-download the video so you can save it to your device. Continue?`);
    
    if (userConfirmed) {
      handleRedownload(download);
    }
  };

  if (loading) {
    return (
      <Card className="mt-6 w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Recent Downloads</CardTitle>
          <CardDescription>
            Loading recent downloads...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (downloads.length === 0) {
    return (
      <Card className="mt-6 w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Recent Downloads</CardTitle>
          <CardDescription>
            No recent downloads found. Download your first TikTok video above!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mt-6 w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            Recent Downloads
          </CardTitle>
          <CardDescription className="text-sm">
            Browser session only - cleared on refresh
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={loadDownloads}
            title="Refresh downloads"
            className="h-8 w-8 p-0"
          >
            <RefreshCw size={16} />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleClearDownloads}
            title="Clear all downloads"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {downloads.map((download) => (
            <Card key={download.id} className="overflow-hidden h-full flex flex-col">
              <div className="relative h-32 sm:h-40 bg-gray-100 overflow-hidden">
                <img 
                  src={download.thumbnailUrl} 
                  alt={download.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  {download.format === 'mp3' ? (
                    <div className="flex items-center gap-1">
                      <Music size={12} />
                      <span>Audio</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Film size={12} />
                      <span>Video</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-3 sm:p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 mb-1" title={download.title}>
                  {download.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">@{download.author}</p>
                
                <div className="mt-auto space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-medium">{download.format.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality:</span>
                    <span className="font-medium capitalize">{download.quality}</span>
                  </div>
                  {download.fileSize && (
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span className="font-medium">{formatBytes(download.fileSize)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">
                      {new Date(download.downloadedAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 text-xs py-1 h-8"
                    onClick={() => {
                      // Play video in app player - create in-app modal
                      if (download.videoUrl.includes('youtube.com') || download.videoUrl.includes('youtu.be')) {
                        // Create in-app video player modal
                        const modal = document.createElement('div');
                        modal.style.cssText = `
                          position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                          background: rgba(0,0,0,0.9); z-index: 10000; display: flex; 
                          align-items: center; justify-content: center;
                        `;
                        
                        const playerContainer = document.createElement('div');
                        playerContainer.style.cssText = `
                          width: 90%; max-width: 800px; height: 70%; background: #000; 
                          border-radius: 8px; position: relative;
                        `;
                        
                        const closeBtn = document.createElement('button');
                        closeBtn.innerHTML = '✕';
                        closeBtn.style.cssText = `
                          position: absolute; top: -40px; right: 0; background: #fff; 
                          border: none; width: 30px; height: 30px; border-radius: 50%; 
                          cursor: pointer; font-size: 16px; z-index: 10001;
                        `;
                        closeBtn.onclick = () => document.body.removeChild(modal);
                        
                        const iframe = document.createElement('iframe');
                        iframe.src = `https://www.youtube.com/embed/${download.videoId}?autoplay=1&controls=1&rel=0`;
                        iframe.style.cssText = 'width: 100%; height: 100%; border: none; border-radius: 8px;';
                        iframe.allowFullscreen = true;
                        
                        playerContainer.appendChild(closeBtn);
                        playerContainer.appendChild(iframe);
                        modal.appendChild(playerContainer);
                        document.body.appendChild(modal);
                        
                        // Close on click outside
                        modal.onclick = (e) => {
                          if (e.target === modal) document.body.removeChild(modal);
                        };
                      } else {
                        window.open(download.videoUrl, '_blank');
                      }
                    }}
                    title="Play video in app"
                  >
                    ▶️ Play
                  </Button>
                  <Button 
                    variant="default" 
                    className="flex-1 text-xs py-1 h-8"
                    onClick={() => handleSaveToDevice(download)}
                    title="Save video to device"
                  >
                    💾 Save
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
