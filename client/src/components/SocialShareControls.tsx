import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FAIcon } from '@/components/ui/fa-icon';
import { VideoData } from '@/lib/types';

interface SocialShareControlsProps {
  videoData: VideoData;
  downloadUrl?: string;
}

export function SocialShareControls({ videoData, downloadUrl }: SocialShareControlsProps) {
  const [customMessage, setCustomMessage] = useState('');

  const shareUrl = window.location.href;
  const defaultMessage = `Check out this awesome TikTok video: "${videoData.title}" by @${videoData.author}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copied to clipboard!');
    } catch (err) {
      alert('Failed to copy to clipboard');
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

  return (
    <div className="bg-slate-50 rounded-lg p-4 space-y-4">
      <h4 className="font-medium text-slate-700 flex items-center gap-2">
        <FAIcon icon="share" className="text-blue-600" />
        Share Video
      </h4>

      {/* Custom Message */}
      <textarea
        placeholder={defaultMessage}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        value={customMessage}
        onChange={(e) => setCustomMessage(e.target.value)}
      />

      {/* Share Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={shareToFacebook}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <FAIcon icon="facebook" />
          Facebook
        </Button>
        
        <Button
          onClick={shareToTwitter}
          className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white"
        >
          <FAIcon icon="twitter" />
          Twitter
        </Button>
        
        <Button
          onClick={shareToLinkedIn}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white"
        >
          <FAIcon icon="linkedin" />
          LinkedIn
        </Button>
        
        <Button
          onClick={() => copyToClipboard(shareUrl)}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white"
        >
          <FAIcon icon="copy" />
          Copy Link
        </Button>
      </div>
    </div>
  );
}