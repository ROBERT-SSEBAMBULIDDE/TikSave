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
  
  // Note: You'll need to replace these with your actual ad unit IDs from AdSense dashboard
  switch (position) {
    case 'top':
      adSlot = "1111111111"; // Header banner ad slot
      format = "horizontal";
      containerClass = "w-full py-2 bg-gray-50 border-b border-gray-200";
      break;
    case 'bottom':
      adSlot = "2222222222"; // Footer banner ad slot
      format = "horizontal";
      containerClass = "w-full py-2 bg-gray-50 border-t border-gray-200";
      break;
    case 'inline':
      adSlot = "3333333333"; // In-content rectangle ad slot
      format = "rectangle";
      containerClass = "my-4 py-2";
      break;
    case 'sidebar':
      adSlot = "4444444444"; // Sidebar vertical ad slot
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