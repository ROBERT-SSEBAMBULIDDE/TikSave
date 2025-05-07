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
  const { 
    optimizeAd, 
    recordAdImpression, 
    isAdBlockerDetected, 
    isInPWAMode 
  } = useAdOptimizer();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Optimize ad based on context
  const { format, slot, show } = optimizeAd(placementId);
  
  // Use optimized values or fallback to props
  const finalFormat = format || initialFormat;
  const finalSlot = slot || initialSlot;
  
  // Observer to check if ad is in viewport - with optimized observation
  useEffect(() => {
    if (!adRef.current || !show) return;
    
    // Use lower threshold and optimize the observer to reduce jitter
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Only update visibility state if it's a significant change
        const newIsVisible = entry.isIntersecting;
        
        if (isVisible !== newIsVisible) {
          setIsVisible(newIsVisible);
          
          // Record an impression only once it's visible and loaded
          if (newIsVisible && isLoaded) {
            // Use a slight delay to ensure stability
            setTimeout(() => {
              recordAdImpression();
            }, 200);
          }
        }
      },
      { 
        threshold: 0.1, // Lower threshold for better performance
        rootMargin: '50px' // Preload a bit before coming into view
      }
    );
    
    observer.observe(adRef.current);
    
    return () => {
      if (adRef.current) {
        observer.unobserve(adRef.current);
      }
    };
  }, [isLoaded, recordAdImpression, show, isVisible]);
  
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
          
          // Add PWA-specific attribute if in PWA mode
          if (isInPWAMode) {
            ins.setAttribute('data-pwa-version', 'true');
            
            // In PWA mode, force more aggressive ad refreshing
            ins.setAttribute('data-adtest', 'on');
            
            // Add timestamp to prevent potential caching issues in PWA
            const timestamp = new Date().getTime();
            ins.setAttribute('data-pwa-timestamp', timestamp.toString());
          }
          
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
            } else if (isInPWAMode) {
              // In PWA mode, if adsbygoogle isn't available, try to reload the ad script
              const script = document.createElement('script');
              script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6859477325721314';
              script.async = true;
              script.crossOrigin = 'anonymous';
              document.head.appendChild(script);
              
              // Try again after script loads
              script.onload = () => {
                if ((window as any).adsbygoogle) {
                  (window as any).adsbygoogle.push({});
                  setIsLoaded(true);
                }
              };
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
    
    // Handle resize events to ensure ads are responsive - with improved performance
    let previousWidth = window.innerWidth;
    const handleResize = () => {
      // Only reload if width changed significantly (by at least 100px)
      // This prevents reloads on small adjustments like scrollbar appearance
      const currentWidth = window.innerWidth;
      if (Math.abs(currentWidth - previousWidth) > 100 && adRef.current) {
        previousWidth = currentWidth;
        loadAd();
      }
    };
    
    // Add debounced resize listener with a longer delay
    let resizeTimer: ReturnType<typeof setTimeout>;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      // Wait longer before reacting to resize to reduce jitter
      resizeTimer = setTimeout(handleResize, 500);
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
  }, [finalFormat, finalSlot, isVisible, recordAdImpression, show, isInPWAMode]);
  
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
      data-pwa-mode={isInPWAMode ? 'true' : 'false'}
    >
      <div className="text-center text-xs text-gray-500 mb-1">
        Advertisement {isInPWAMode && import.meta.env.DEV && ' (PWA Mode)'}
      </div>
      <div 
        ref={adRef} 
        className="w-full flex justify-center items-center min-h-[100px]"
        data-ad-status="waiting"
        data-format={finalFormat}
      ></div>
    </div>
  );
}