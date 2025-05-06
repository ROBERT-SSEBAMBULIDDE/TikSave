import React, { useEffect } from 'react';

interface AdBannerProps {
  adClient?: string;
  adSlot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

export function AdBanner({
  adClient = "ca-pub-6859477325721314", // Your AdSense Publisher ID
  adSlot = "xxxxxxxxxx", // Replace with your AdSense Ad Slot ID when available
  format = "auto",
  className = "",
  style = {},
}: AdBannerProps) {
  
  useEffect(() => {
    // Only load ads if window.adsbygoogle exists (AdSense script loaded)
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        // Push the ad to AdSense for display
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
      } catch (error) {
        console.error('Error loading AdSense ad:', error);
      }
    }
  }, []);
  
  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          overflow: 'hidden',
          width: '100%',
          ...style,
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <small className="text-xs text-gray-400 text-center block mt-1">Advertisement</small>
    </div>
  );
}