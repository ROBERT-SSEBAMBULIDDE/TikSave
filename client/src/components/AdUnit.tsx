import React, { useEffect, useRef, useState } from 'react';
import { useAdOptimizer } from '@/providers/AdOptimizerProvider';
import { AdFormat } from '@/lib/adOptimizer';

interface AdUnitProps {
  className?: string;
  placementId: string;
  format?: AdFormat;
  slot?: string;
  fallbackContent?: React.ReactNode;
}

export function AdUnit({ 
  className = '', 
  placementId,
  format: initialFormat = 'fluid',
  slot: initialSlot = '6862860274',
  fallbackContent
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const { optimizeAd, recordAdImpression, isAdBlockerDetected } = useAdOptimizer();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Optimize ad based on context
  const { format, slot, show } = optimizeAd(placementId);
  
  // Use optimized values or fallback to props
  const finalFormat = format || initialFormat;
  const finalSlot = slot || initialSlot;
  
  // Observer to check if ad is in viewport
  useEffect(() => {
    if (!adRef.current || !show) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
        
        // Record an impression once it's visible
        if (entry.isIntersecting && isLoaded) {
          recordAdImpression();
        }
      },
      { threshold: 0.5 }
    );
    
    observer.observe(adRef.current);
    
    return () => {
      if (adRef.current) {
        observer.unobserve(adRef.current);
      }
    };
  }, [isLoaded, recordAdImpression, show]);
  
  useEffect(() => {
    if (!show) return;
    
    // This effect runs after render when the component mounts
    const loadAd = () => {
      try {
        // Add the ad code when the component mounts
        if (adRef.current && typeof window !== 'undefined') {
          // Clear any existing content
          adRef.current.innerHTML = '';
          
          // Create the ins element
          const ins = document.createElement('ins');
          ins.className = 'adsbygoogle';
          ins.style.display = 'block';
          ins.style.textAlign = 'center';
          ins.style.width = '100%';
          ins.style.height = finalFormat === 'auto' ? '250px' : 'auto';
          ins.style.overflow = 'hidden';
          
          // Data attributes based on format
          if (finalFormat === 'fluid') {
            ins.setAttribute('data-ad-layout', 'in-article');
            ins.setAttribute('data-ad-format', 'fluid');
          } else if (finalFormat === 'rectangle') {
            ins.setAttribute('data-ad-format', 'auto');
          } else if (finalFormat === 'horizontal') {
            ins.setAttribute('data-ad-format', 'horizontal');
          } else {
            ins.setAttribute('data-ad-format', 'auto');
          }
          
          ins.setAttribute('data-ad-client', 'ca-pub-6859477325721314');
          ins.setAttribute('data-ad-slot', finalSlot);
          ins.setAttribute('data-full-width-responsive', 'true');
          
          // Add the ins element to our ref
          adRef.current.appendChild(ins);
          
          // Push the ad
          try {
            const adsbygoogle = (window as any).adsbygoogle;
            if (adsbygoogle) {
              adsbygoogle.push({});
              setIsLoaded(true);
              
              // Record impression if already visible
              if (isVisible) {
                recordAdImpression();
              }
            }
          } catch (error) {
            console.error('AdSense push error:', error);
            setIsLoaded(false);
          }
        }
      } catch (error) {
        console.error('Error setting up AdSense:', error);
        setIsLoaded(false);
      }
    };
    
    // Load the ad after a small delay to ensure the DOM is fully ready
    const timer = setTimeout(() => {
      loadAd();
    }, 100);
    
    // Handle resize events to ensure ads are responsive
    const handleResize = () => {
      // Reload ad on significant size changes
      if (adRef.current) {
        loadAd();
      }
    };
    
    // Add debounced resize listener
    let resizeTimer: ReturnType<typeof setTimeout>;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 300);
    });
    
    // Cleanup on unmount
    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [finalFormat, finalSlot, isVisible, recordAdImpression, show]);
  
  // If optimizer decides not to show the ad or if ad blocker is detected
  if (!show || isAdBlockerDetected) {
    // Return fallback content or nothing
    return fallbackContent ? (
      <div className={`fallback-ad-container my-4 ${className}`}>
        {fallbackContent}
      </div>
    ) : null;
  }
  
  return (
    <div 
      className={`ad-container my-6 py-3 w-full max-w-full overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}
      data-placement-id={placementId}
    >
      <div className="text-center text-xs text-gray-500 mb-1">Advertisement</div>
      <div 
        ref={adRef} 
        className="w-full flex justify-center items-center min-h-[100px]"
        data-ad-status="waiting"
        data-format={finalFormat}
      ></div>
    </div>
  );
}