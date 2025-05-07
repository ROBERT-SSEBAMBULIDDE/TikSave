import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { 
  detectDeviceType, 
  determineUserJourney, 
  determineContentContext,
  resetPageEntryTime,
  DeviceType,
  UserJourney,
  ContentContext,
  AdFormat,
  getOptimalAdFormat,
  getOptimalAdSlot,
  shouldShowAd
} from '@/lib/adOptimizer';

// Helper to detect if app is running as PWA
function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || 
    (window.navigator as any).standalone || 
    document.referrer.includes('android-app://');
}

// Context state type
interface AdOptimizerContextState {
  deviceType: DeviceType;
  userJourney: UserJourney;
  contentContext: ContentContext;
  timeOnPage: number;
  scrollDepth: number;
  isAdBlockerDetected: boolean;
  adsViewed: number;
  isInPWAMode: boolean;
  optimizeAd: (placementId: string) => { 
    format: AdFormat; 
    slot: string;
    show: boolean;
  };
  recordAdImpression: () => void;
}

// Create context with default values
const AdOptimizerContext = createContext<AdOptimizerContextState>({
  deviceType: 'desktop',
  userJourney: 'new_visitor',
  contentContext: 'homepage',
  timeOnPage: 0,
  scrollDepth: 0,
  isAdBlockerDetected: false,
  adsViewed: 0,
  isInPWAMode: false,
  optimizeAd: () => ({ format: 'auto', slot: '6862860274', show: true }),
  recordAdImpression: () => {}
});

// Provider props
interface AdOptimizerProviderProps {
  children: ReactNode;
}

// Ad Optimizer Provider component
// Use React.memo for the provider component to prevent unnecessary rerenders
export const AdOptimizerProvider = React.memo(function AdOptimizerProvider({ children }: AdOptimizerProviderProps) {
  const [location] = useLocation();
  // Use useMemo to prevent recalculating these values on every render
  const initialDeviceType = React.useMemo(() => detectDeviceType(), []);
  const initialUserJourney = React.useMemo(() => determineUserJourney(), []);
  const initialContentContext = React.useMemo(() => determineContentContext(), []);
  
  const [deviceType, setDeviceType] = useState<DeviceType>(initialDeviceType);
  const [userJourney, setUserJourney] = useState<UserJourney>(initialUserJourney);
  const [contentContext, setContentContext] = useState<ContentContext>(initialContentContext);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [scrollDepth, setScrollDepth] = useState(0);
  const [isAdBlockerDetected, setIsAdBlockerDetected] = useState(false);
  const [adsViewed, setAdsViewed] = useState(0);
  const [isInPWAMode, setIsInPWAMode] = useState(false);
  
  // Record page entry time
  useEffect(() => {
    resetPageEntryTime();
  }, []);
  
  // Detect if app is running in PWA mode
  useEffect(() => {
    setIsInPWAMode(isPWA());
    
    // Also listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsInPWAMode(e.matches || (window.navigator as any).standalone || false);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Update context when location changes
  useEffect(() => {
    // Reset page entry time when navigating
    resetPageEntryTime();
    
    // Update content context based on new URL
    setContentContext(determineContentContext());
    
    // Reset scroll depth for new page
    setScrollDepth(0);
  }, [location]);
  
  // Update device type on resize
  useEffect(() => {
    const handleResize = () => {
      setDeviceType(detectDeviceType());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Track scroll depth with debouncing to prevent excessive rerenders
  useEffect(() => {
    // Create a debounced version of the scroll handler
    let scrollTimer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        
        const depth = (scrollTop / (scrollHeight - clientHeight)) * 100;
        const newDepth = Math.min(Math.round(depth), 100);
        
        // Only update if the value changed by at least 5 percentage points
        if (Math.abs(newDepth - scrollDepth) >= 5) {
          setScrollDepth(newDepth);
        }
      }, 100); // Debounce time
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(scrollTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollDepth]);
  
  // Track time on page - less frequent updates to prevent jitter
  useEffect(() => {
    // Update every 5 seconds instead of every second to reduce renders
    const timer = setInterval(() => {
      setTimeOnPage(prev => prev + 5);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Detect ad blockers
  useEffect(() => {
    const detectAdBlocker = () => {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      document.body.appendChild(testAd);
      
      setTimeout(() => {
        if (testAd.offsetHeight === 0) {
          setIsAdBlockerDetected(true);
        }
        testAd.remove();
      }, 100);
    };
    
    detectAdBlocker();
  }, []);
  
  // Mark the user as a returning visitor
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('visited', 'true');
    }
  }, []);
  
  // Update user journey based on session data - less frequent to prevent jitter
  useEffect(() => {
    // Initial check
    const currentJourney = determineUserJourney();
    if (userJourney !== currentJourney) {
      setUserJourney(currentJourney);
    }
    
    // Less frequent updates to prevent UI jitter
    const intervalId = setInterval(() => {
      const newJourney = determineUserJourney();
      // Only update if value has actually changed
      if (userJourney !== newJourney) {
        setUserJourney(newJourney);
      }
    }, 30000); // Check every 30 seconds instead of 5
    
    return () => clearInterval(intervalId);
  }, [userJourney]);
  
  // Function to optimize ad placement
  const optimizeAd = (placementId: string) => {
    // Decide whether to show this ad
    const show = shouldShowAd(placementId, deviceType, contentContext, userJourney);
    
    // Get optimal format based on context
    const format = getOptimalAdFormat(deviceType, contentContext, userJourney);
    
    // Get optimal slot
    const { slot } = getOptimalAdSlot(contentContext);
    
    return { format, slot, show };
  };
  
  // Record when an ad impression happens
  const recordAdImpression = () => {
    setAdsViewed(prev => prev + 1);
  };
  
  // Memoize optimizer functions to prevent unnecessary rerenders
  const optimizeAdMemo = React.useCallback((placementId: string) => {
    return optimizeAd(placementId);
  }, [deviceType, contentContext, userJourney]);
  
  const recordAdImpressionMemo = React.useCallback(() => {
    recordAdImpression();
  }, []);
  
  // Memoize the entire context value to prevent cascade rerenders
  const value = React.useMemo(() => ({
    deviceType,
    userJourney,
    contentContext,
    timeOnPage,
    scrollDepth,
    isAdBlockerDetected,
    adsViewed,
    isInPWAMode,
    optimizeAd: optimizeAdMemo,
    recordAdImpression: recordAdImpressionMemo
  }), [
    deviceType, 
    userJourney, 
    contentContext, 
    timeOnPage,
    scrollDepth,
    isAdBlockerDetected,
    adsViewed,
    isInPWAMode,
    optimizeAdMemo,
    recordAdImpressionMemo
  ]);
  
  return (
    <AdOptimizerContext.Provider value={value}>
      {children}
    </AdOptimizerContext.Provider>
  );
}

// Hook to use the ad optimizer context
export function useAdOptimizer() {
  const context = useContext(AdOptimizerContext);
  
  if (context === undefined) {
    throw new Error('useAdOptimizer must be used within an AdOptimizerProvider');
  }
  
  return context;
}