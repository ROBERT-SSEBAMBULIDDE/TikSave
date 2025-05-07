import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FAIcon } from "@/components/ui/fa-icon";
import { cn } from "@/lib/utils";

interface ContextualTooltipProps {
  id: string;          // Unique ID for the tooltip to track if it's been seen
  content: string;     // The tooltip content
  side?: "top" | "right" | "bottom" | "left"; // Position of the tooltip
  children: React.ReactNode; // The element that triggers the tooltip
  className?: string;  // Optional additional classes
  forceShow?: boolean; // Force the tooltip to display regardless of seen status
  withIcon?: boolean;  // Whether to wrap children with a help icon
}

export function ContextualTooltip({
  id,
  content,
  side = "top",
  children,
  className,
  forceShow = false,
  withIcon = false,
}: ContextualTooltipProps) {
  // Track if the tooltip should be shown
  const [shouldShow, setShouldShow] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if this tooltip has been seen before
    const seenTooltips = localStorage.getItem('seen_tooltips');
    const seenArray = seenTooltips ? JSON.parse(seenTooltips) : [];
    
    // Show tooltip if it hasn't been seen before or force show is enabled
    setShouldShow(forceShow || !seenArray.includes(id));
  }, [id, forceShow]);
  
  // Mark tooltip as seen when it's clicked
  const markAsSeen = () => {
    if (!forceShow) {
      const seenTooltips = localStorage.getItem('seen_tooltips');
      const seenArray = seenTooltips ? JSON.parse(seenTooltips) : [];
      
      if (!seenArray.includes(id)) {
        seenArray.push(id);
        localStorage.setItem('seen_tooltips', JSON.stringify(seenArray));
      }
      
      setShouldShow(false);
    }
  };
  
  if (!shouldShow && !forceShow) {
    return <>{children}</>;
  }
  
  return (
    <TooltipProvider>
      <Tooltip defaultOpen={shouldShow} delayDuration={0}>
        <TooltipTrigger onClick={markAsSeen} className={className}>
          {withIcon ? (
            <div className="group relative inline-flex items-center">
              {children}
              <span className="ml-1 text-blue-500 flex items-center">
                <FAIcon icon="question-circle" className="text-xs" />
              </span>
            </div>
          ) : (
            children
          )}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className={cn(
            "bg-blue-50 text-slate-800 border border-blue-200 p-3 max-w-xs shadow-lg rounded-lg",
            "animate-fade-in duration-200"
          )}
        >
          <div className="text-sm">{content}</div>
          <div className="mt-2 text-xs text-blue-700 text-right">Click to dismiss</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}