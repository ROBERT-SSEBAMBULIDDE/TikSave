import React from 'react';
import { AdUnit } from './AdUnit';

type AdPlacementLocation = 'header' | 'footer' | 'sidebar' | 'inline' | 'content-top' | 'content-bottom';

interface AdPlacementProps {
  location: AdPlacementLocation;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Component that handles ad placement in different parts of the application
 * Each location has its own optimized ad slot and format
 */
export function AdPlacement({ location, className = '', style = {} }: AdPlacementProps) {
  // Define ad configurations based on placement location
  const getAdConfig = (location: AdPlacementLocation) => {
    // These are placeholder ad slots - you'll need to replace them with actual ad slots
    // from your Google AdSense account once they're created
    switch (location) {
      case 'header':
        return {
          adSlot: '1111111111', 
          adFormat: 'horizontal' as const,
          className: 'w-full py-2',
          responsive: true
        };
      case 'footer':
        return {
          adSlot: '2222222222',
          adFormat: 'horizontal' as const,
          className: 'w-full py-2',
          responsive: true
        };
      case 'sidebar':
        return {
          adSlot: '3333333333',
          adFormat: 'vertical' as const,
          className: 'h-full',
          responsive: false
        };
      case 'inline':
        return {
          adSlot: '4444444444',
          adFormat: 'rectangle' as const,
          className: 'my-4',
          responsive: true
        };
      case 'content-top':
        return {
          adSlot: '5555555555',
          adFormat: 'horizontal' as const,
          className: 'mb-6',
          responsive: true
        };
      case 'content-bottom':
        return {
          adSlot: '6666666666',
          adFormat: 'horizontal' as const,
          className: 'mt-6',
          responsive: true
        };
      default:
        return {
          adSlot: '7777777777',
          adFormat: 'auto' as const,
          className: '',
          responsive: true
        };
    }
  };
  
  const config = getAdConfig(location);
  
  return (
    <div className={`ad-placement ad-placement-${location} ${className}`} style={style}>
      <AdUnit
        adSlot={config.adSlot}
        adFormat={config.adFormat}
        className={config.className}
        responsive={config.responsive}
        // Enable ad testing in development mode
        adTest={process.env.NODE_ENV === 'development'}
      />
    </div>
  );
}