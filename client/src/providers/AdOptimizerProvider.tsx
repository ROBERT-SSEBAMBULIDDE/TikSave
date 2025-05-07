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

// Context state type
interface AdOptimizerContextState {
  deviceType: DeviceType;
  userJourney: UserJourney;
  contentContext: ContentContext;
  timeOnPage: number;
  scrollDepth: number;
  isAdBlockerDetected: boolean;
  adsViewed: number;
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
  optimizeAd: () => ({ format: 'auto', slot: '6862860274', show: true }),
  recordAdImpression: () => {}
});

// Provider props
interface AdOptimizerProviderProps {
  children: ReactNode;
}

// Ad Optimizer Provider component
export function AdOptimizerProvider({ children }: AdOptimizerProviderProps) {
  const [location] = useLocation();
  const [deviceType, setDeviceType] = useState<DeviceType>(detectDeviceType());
  const [userJourney, setUserJourney] = useState<UserJourney>(determineUserJourney());
  const [contentContext, setContentContext] = useState<ContentContext>(determineContentContext());
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [scrollDepth, setScrollDepth] = useState(0);
  const [isAdBlockerDetected, setIsAdBlockerDetected] = useState(false);
  const [adsViewed, setAdsViewed] = useState(0);
  
  // Record page entry time
  useEffect(() => {
    resetPageEntryTime();
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
  
  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      const depth = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollDepth(Math.min(depth, 100));
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Track time on page
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnPage(prev => prev + 1);
    }, 1000);
    
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
  
  // Update user journey based on session data
  useEffect(() => {
    const intervalId = setInterval(() => {
      setUserJourney(determineUserJourney());
    }, 5000); // Check every 5 seconds for changes
    
    return () => clearInterval(intervalId);
  }, []);
  
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
  
  // Context value
  const value = {
    deviceType,
    userJourney,
    contentContext,
    timeOnPage,
    scrollDepth,
    isAdBlockerDetected,
    adsViewed,
    optimizeAd,
    recordAdImpression
  };
  
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