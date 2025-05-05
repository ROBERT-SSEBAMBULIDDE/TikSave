import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBytes } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowDown, Clock, Film, Music, RefreshCw, Trash2 } from 'lucide-react';

// Define interface for download records stored in session storage
interface DownloadRecord {
  id: string; // Using timestamp as unique ID
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

// Session storage key
const SESSION_STORAGE_KEY = 'tiktok_downloader_history';

// Function to get session downloads
const getSessionDownloads = (): DownloadRecord[] => {
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Error reading from session storage:', err);
    return [];
  }
};

// Function to save downloads to session storage
export const saveDownloadToHistory = (download: Omit<DownloadRecord, 'id' | 'downloadedAt'>) => {
  try {
    // Get existing downloads
    const existing = getSessionDownloads();
    
    // Create new download record with ID and timestamp
    const newDownload: DownloadRecord = {
      ...download,
      id: Date.now().toString(), // Use timestamp as unique ID
      downloadedAt: new Date().toISOString()
    };
    
    // Add new download to the beginning of the array (most recent first)
    const updated = [newDownload, ...existing];
    
    // Save to session storage
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    
    // Dispatch custom event to notify components about the update
    window.dispatchEvent(new CustomEvent('download_history_updated'));
    
    return newDownload;
  } catch (err) {
    console.error('Error saving to session storage:', err);
    return null;
  }
};

export function DownloadHistorySection() {
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Load downloads from session storage
  const loadDownloads = () => {
    setLoading(true);
    const sessionDownloads = getSessionDownloads();
    setDownloads(sessionDownloads);
    setLoading(false);
  };

  // Clear all downloads from session storage
  const clearAllDownloads = () => {
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
            onClick={clearAllDownloads}
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
                
                <Button 
                  variant="default" 
                  className="w-full mt-3 text-xs sm:text-sm py-1 h-8"
                  onClick={() => handleRedownload(download)}
                >
                  <ArrowDown size={14} className="mr-1 sm:mr-2" />
                  Download Again
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
