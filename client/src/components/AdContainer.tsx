import React from 'react';
import { AdBanner } from './AdBanner';

interface AdContainerProps {
  position: 'top' | 'bottom' | 'inline' | 'sidebar';
  className?: string;
}

export function AdContainer({ position, className = "" }: AdContainerProps) {
  // Define different ad slot IDs and formats based on position
  let adSlot = "";
  let format: "auto" | "rectangle" | "horizontal" | "vertical" = "auto";
  let containerClass = "";
  
  switch (position) {
    case 'top':
      adSlot = "1234567890"; // Replace with actual top banner ad slot
      format = "horizontal";
      containerClass = "w-full py-2 bg-gray-50 border-b border-gray-200";
      break;
    case 'bottom':
      adSlot = "2345678901"; // Replace with actual bottom banner ad slot
      format = "horizontal";
      containerClass = "w-full py-2 bg-gray-50 border-t border-gray-200";
      break;
    case 'inline':
      adSlot = "3456789012"; // Replace with actual inline ad slot
      format = "rectangle";
      containerClass = "my-4 py-2";
      break;
    case 'sidebar':
      adSlot = "4567890123"; // Replace with actual sidebar ad slot
      format = "vertical";
      containerClass = "h-full";
      break;
  }
  
  return (
    <div className={`ad-container-${position} ${containerClass} ${className}`}>
      <AdBanner 
        adSlot={adSlot} 
        format={format} 
      />
    </div>
  );
}