import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from '@/lib/queryClient';
import { formatBytes } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowDown, Clock, Film, Music } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface RecentDownload {
  id: number;
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

export function RecentDownloads() {
  const [recentDownloads, setRecentDownloads] = useState<RecentDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchRecentDownloads = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('GET', '/api/downloads/recent');
        
        if (!response.ok) {
          throw new Error('Failed to fetch recent downloads');
        }
        
        const data = await response.json();
        setRecentDownloads(data);
      } catch (err) {
        console.error('Error fetching recent downloads:', err);
        setError('Failed to load recent downloads');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentDownloads();
  }, []);

  const handleRedownload = (download: RecentDownload) => {
    // Create download link
    const downloadUrl = `/api/tiktok/download?videoId=${download.videoId}&format=${download.format}&quality=${download.quality}&videoUrl=${encodeURIComponent(download.videoUrl)}&thumbnailUrl=${encodeURIComponent(download.thumbnailUrl)}&title=${encodeURIComponent(download.title)}&author=${encodeURIComponent(download.author)}`;
    
    // Open in new tab to initiate download
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

  if (error) {
    return (
      <Card className="mt-6 w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Recent Downloads</CardTitle>
          <CardDescription className="text-red-500">
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (recentDownloads.length === 0) {
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
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Clock size={24} className="text-primary" />
          Recent Downloads
        </CardTitle>
        <CardDescription>
          Your recently downloaded TikTok videos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentDownloads.map((download) => (
            <Card key={download.id} className="overflow-hidden h-full flex flex-col">
              <div className="relative h-40 bg-gray-100 overflow-hidden">
                <img 
                  src={download.thumbnailUrl} 
                  alt={download.title}
                  className="w-full h-full object-cover"
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
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-sm line-clamp-2 mb-1" title={download.title}>
                  {download.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">@{download.author}</p>
                
                <div className="mt-auto space-y-2 text-xs text-muted-foreground">
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
                      {new Date(download.downloadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <Button 
                  variant="default" 
                  className="w-full mt-3"
                  onClick={() => handleRedownload(download)}
                >
                  <ArrowDown size={16} className="mr-2" />
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
