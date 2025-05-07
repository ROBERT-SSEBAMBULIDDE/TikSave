import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface InArticleAdProps {
  className?: string;
  style?: React.CSSProperties;
}

export function InArticleAd({ className = '', style = {} }: InArticleAdProps) {
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
  }, []);
  
  return (
    <div className={cn('ad-unit-wrapper my-6 mx-auto max-w-4xl', className)} style={style} ref={adRef}>
      {/* This is the exact AdSense code provided by the user */}
      <ins className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
          minHeight: '200px'
        }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-6859477325721314"
        data-ad-slot="6862860274"
      />
      <div className="text-xs text-gray-400 text-center mt-1">Advertisement</div>
    </div>
  );
}