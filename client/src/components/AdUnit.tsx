import React, { useEffect, useRef } from 'react';

export function AdUnit() {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // This effect runs after render when the component mounts
    try {
      // Add the ad code when the component mounts
      if (adRef.current && typeof window !== 'undefined') {
        // Create the ins element
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.style.textAlign = 'center';
        ins.setAttribute('data-ad-layout', 'in-article');
        ins.setAttribute('data-ad-format', 'fluid');
        ins.setAttribute('data-ad-client', 'ca-pub-6859477325721314');
        ins.setAttribute('data-ad-slot', '6862860274');
        
        // Add the ins element to our ref
        adRef.current.appendChild(ins);
        
        // Push the ad
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (error) {
          console.error('AdSense error:', error);
        }
      }
    } catch (error) {
      console.error('Error setting up AdSense:', error);
    }
    
    // Cleanup on unmount
    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, []);
  
  return (
    <div className="ad-container my-6 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div ref={adRef} className="text-center text-xs text-gray-500">
        Advertisement
      </div>
    </div>
  );
}