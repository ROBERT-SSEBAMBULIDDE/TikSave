import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Copy, 
  Download 
} from 'lucide-react';
import { VideoData } from '@/lib/types';

interface SocialShareControlsProps {
  videoData: VideoData;
  downloadUrl?: string;
}

export function SocialShareControls({ videoData, downloadUrl }: SocialShareControlsProps) {
  const [customMessage, setCustomMessage] = useState('');
  const { toast } = useToast();

  const shareUrl = window.location.href;
  const defaultMessage = `Check out this awesome TikTok video: "${videoData.title}" by @${videoData.author}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const shareToFacebook = () => {
    const message = customMessage || defaultMessage;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const message = customMessage || defaultMessage;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const message = customMessage || defaultMessage;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TikTok Video Download',
          text: customMessage || defaultMessage,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Native share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      await copyToClipboard(shareUrl);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Custom Message */}
        <div className="space-y-2">
          <Label htmlFor="custom-message">Custom Message (optional)</Label>
          <Textarea
            id="custom-message"
            placeholder={defaultMessage}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={3}
          />
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={shareToFacebook}
            className="flex items-center gap-2"
          >
            <Facebook className="h-4 w-4 text-blue-600" />
            Facebook
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareToTwitter}
            className="flex items-center gap-2"
          >
            <Twitter className="h-4 w-4 text-blue-400" />
            Twitter
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareToLinkedIn}
            className="flex items-center gap-2"
          >
            <Linkedin className="h-4 w-4 text-blue-700" />
            LinkedIn
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareNative}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Copy Link */}
        <div className="flex gap-2">
          <Input
            value={shareUrl}
            readOnly
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(shareUrl)}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </div>

        {/* Download Link Sharing */}
        {downloadUrl && (
          <div className="pt-2 border-t">
            <Label className="text-sm font-medium">Direct Download Link</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={downloadUrl}
                readOnly
                className="flex-1 text-xs"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(downloadUrl)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}