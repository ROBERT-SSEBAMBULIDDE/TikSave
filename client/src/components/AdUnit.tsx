import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AdUnitProps {
  adSlot: string;
  adFormat?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
  adTest?: boolean; // For testing ads in development
}

export function AdUnit({
  adSlot,
  adFormat = 'auto',
  className = '',
  style = {},
  responsive = true,
  adTest = false
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    try {
      const pushAd = () => {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      };
      
      // Initialize ads when AdSense script is loaded
      if ((window as any).adsbygoogle) {
        pushAd();
      } else {
        // AdSense script hasn't loaded yet, wait for it
        const checkAdSenseLoaded = setInterval(() => {
          if ((window as any).adsbygoogle) {
            pushAd();
            clearInterval(checkAdSenseLoaded);
          }
        }, 500);
        
        // Clear the interval after 10 seconds if AdSense doesn't load
        setTimeout(() => clearInterval(checkAdSenseLoaded), 10000);
      }
    } catch (error) {
      console.error('Error loading AdSense ad:', error);
    }
  }, [adSlot, adFormat]);
  
  return (
    <div className={cn('ad-unit-wrapper my-4', className)} style={style} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          minHeight: '100px',
          backgroundColor: 'transparent',
          ...style
        }}
        data-ad-client="ca-pub-6859477325721314"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        {...(adTest ? { 'data-adtest': 'on' } : {})}
      />
      <div className="text-xs text-gray-400 text-center mt-1">Advertisement</div>
    </div>
  );
}