import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  className?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  slot?: string;
}

export function AdUnit({ 
  className = '', 
  format = 'fluid',
  slot = '6862860274' 
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
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
          ins.style.height = format === 'auto' ? '250px' : 'auto';
          ins.style.overflow = 'hidden';
          
          // Data attributes based on format
          if (format === 'fluid') {
            ins.setAttribute('data-ad-layout', 'in-article');
            ins.setAttribute('data-ad-format', 'fluid');
          } else if (format === 'rectangle') {
            ins.setAttribute('data-ad-format', 'auto');
          } else if (format === 'horizontal') {
            ins.setAttribute('data-ad-format', 'horizontal');
          } else {
            ins.setAttribute('data-ad-format', 'auto');
          }
          
          ins.setAttribute('data-ad-client', 'ca-pub-6859477325721314');
          ins.setAttribute('data-ad-slot', slot);
          ins.setAttribute('data-full-width-responsive', 'true');
          
          // Add the ins element to our ref
          adRef.current.appendChild(ins);
          
          // Push the ad
          try {
            const adsbygoogle = (window as any).adsbygoogle;
            if (adsbygoogle) {
              adsbygoogle.push({});
            }
          } catch (error) {
            console.error('AdSense push error:', error);
          }
        }
      } catch (error) {
        console.error('Error setting up AdSense:', error);
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
  }, [format, slot]);
  
  return (
    <div className={`ad-container my-6 py-3 w-full max-w-full overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}>
      <div className="text-center text-xs text-gray-500 mb-1">Advertisement</div>
      <div 
        ref={adRef} 
        className="w-full flex justify-center items-center min-h-[100px]"
        data-ad-status="waiting"
      ></div>
    </div>
  );
}