// Ad placement formats available
export type AdFormat = 'auto' | 'fluid' | 'rectangle' | 'horizontal';

// Ad placement strategies
export type PlacementStrategy = 'content_start' | 'content_middle' | 'content_end' | 'sidebar';

// Device types
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// User behavior or journey stage
export type UserJourney = 'new_visitor' | 'returning_visitor' | 'post_download' | 'multi_download';

// Content type or page context
export type ContentContext = 'homepage' | 'how_it_works' | 'download_section' | 'faq';

// Ad slot specific data
export interface AdSlot {
  id: string;
  name: string;
  slot: string;
}

// Available ad slots
export const AD_SLOTS: Record<string, AdSlot> = {
  // Main ad slots
  HOME_TOP: { id: 'home_top', name: 'Home Page Top', slot: '6862860274' },
  HOME_MIDDLE: { id: 'home_middle', name: 'Home Page Middle', slot: '1234567890' },
  HOME_BOTTOM: { id: 'home_bottom', name: 'Home Page Bottom', slot: '6862860274' },
  HOWITWORKS_TOP: { id: 'howitworks_top', name: 'How It Works Top', slot: '6862860274' },
  HOWITWORKS_BOTTOM: { id: 'howitworks_bottom', name: 'How It Works Bottom', slot: '6862860274' },
};

// Configuration for contextual optimization
export interface AdOptimizationConfig {
  // Weight different factors for ad display decision
  weights: {
    deviceType: number;
    userJourney: number;
    contentContext: number;
    timeOnPage: number;
    scrollDepth: number;
  };
  // Format preferences based on device
  formatPreferences: {
    mobile: AdFormat[];
    tablet: AdFormat[];
    desktop: AdFormat[];
  };
  // Maximum ads per page type
  maxAdsPerPage: {
    homepage: number;
    how_it_works: number;
    terms: number;
    privacy: number;
  };
}

// Default optimization configuration
export const DEFAULT_CONFIG: AdOptimizationConfig = {
  weights: {
    deviceType: 0.3,
    userJourney: 0.25,
    contentContext: 0.25,
    timeOnPage: 0.1,
    scrollDepth: 0.1,
  },
  formatPreferences: {
    mobile: ['fluid', 'auto', 'horizontal'],
    tablet: ['fluid', 'rectangle', 'horizontal'],
    desktop: ['rectangle', 'horizontal', 'fluid'],
  },
  maxAdsPerPage: {
    homepage: 3,
    how_it_works: 2,
    terms: 1,
    privacy: 1,
  },
};

/**
 * Detect the current device type based on screen width
 */
export function detectDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop'; // Default for SSR
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Determine if the user is a new or returning visitor
 */
export function determineUserJourney(): UserJourney {
  if (typeof window === 'undefined') return 'new_visitor';
  
  // Check if user has downloaded before
  const downloadHistory = sessionStorage.getItem('downloadHistory');
  if (!downloadHistory) return 'new_visitor';
  
  try {
    const history = JSON.parse(downloadHistory);
    if (!Array.isArray(history)) return 'new_visitor';
    
    if (history.length > 3) return 'multi_download';
    if (history.length > 0) return 'post_download';
    
    // Check if they've visited before (using localStorage)
    const hasVisitedBefore = localStorage.getItem('visited');
    return hasVisitedBefore ? 'returning_visitor' : 'new_visitor';
  } catch (e) {
    return 'new_visitor';
  }
}

/**
 * Determine the current content context based on URL
 */
export function determineContentContext(): ContentContext {
  if (typeof window === 'undefined') return 'homepage';
  
  const path = window.location.pathname;
  if (path.includes('how-it-works')) return 'how_it_works';
  if (path === '/') {
    // On homepage, determine if we're at FAQ section
    const faqSection = document.getElementById('faq-section');
    if (faqSection && isElementInViewport(faqSection)) {
      return 'faq';
    }
    
    // Check if we're at download section
    const downloadSection = document.querySelector('.downloader-card');
    if (downloadSection && isElementInViewport(downloadSection)) {
      return 'download_section';
    }
    
    return 'homepage';
  }
  
  return 'homepage';
}

/**
 * Check if an element is currently in the viewport
 */
function isElementInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Get the optimal ad format based on current context
 */
export function getOptimalAdFormat(
  deviceType: DeviceType = detectDeviceType(),
  context: ContentContext = determineContentContext(),
  journey: UserJourney = determineUserJourney(),
  config: AdOptimizationConfig = DEFAULT_CONFIG
): AdFormat {
  // Get preferred formats for the current device
  const preferredFormats = config.formatPreferences[deviceType];
  
  // Choose format based on context
  if (context === 'download_section') {
    // In download section, prefer rectangle or fluid ads
    return deviceType === 'mobile' ? 'fluid' : 'rectangle';
  }
  
  if (context === 'faq') {
    // In FAQ section, prefer horizontal ads
    return 'horizontal';
  }
  
  if (journey === 'post_download' || journey === 'multi_download') {
    // After download, show more prominent ads
    return deviceType === 'mobile' ? 'fluid' : 'rectangle';
  }
  
  // Default to first preferred format for the device
  return preferredFormats[0];
}

/**
 * Get optimal ad slot based on context
 */
export function getOptimalAdSlot(
  context: ContentContext = determineContentContext()
): AdSlot {
  switch (context) {
    case 'homepage':
      return AD_SLOTS.HOME_TOP;
    case 'download_section':
      return AD_SLOTS.HOME_MIDDLE;
    case 'how_it_works':
      return AD_SLOTS.HOWITWORKS_TOP;
    case 'faq':
      return AD_SLOTS.HOME_BOTTOM;
    default:
      return AD_SLOTS.HOME_TOP;
  }
}

/**
 * Decide whether to show an ad based on current conditions
 */
export function shouldShowAd(
  placementId: string,
  deviceType: DeviceType = detectDeviceType(),
  context: ContentContext = determineContentContext(),
  journey: UserJourney = determineUserJourney(),
  config: AdOptimizationConfig = DEFAULT_CONFIG
): boolean {
  // Count ads already shown on this page
  const shownAds = document.querySelectorAll('.ad-container').length;
  
  // Check against max ads for this page type
  const maxAds = config.maxAdsPerPage[context === 'how_it_works' ? 'how_it_works' : 'homepage'];
  if (shownAds >= maxAds) return false;
  
  // For new visitors, limit ads on first view
  if (journey === 'new_visitor' && shownAds > 1) return false;
  
  // Always show at least one ad 
  if (shownAds === 0) return true;
  
  // Skip certain placements on mobile
  if (deviceType === 'mobile' && (placementId === 'middle_content' || placementId === 'sidebar')) {
    return false;
  }
  
  return true;
}

// Track when the user entered the page
let pageEntryTime = Date.now();

/**
 * Calculate the time spent on the current page
 */
export function getTimeOnPage(): number {
  return (Date.now() - pageEntryTime) / 1000; // in seconds
}

/**
 * Reset the page entry time (call when navigating to a new page)
 */
export function resetPageEntryTime(): void {
  pageEntryTime = Date.now();
}

/**
 * Get the current scroll depth as a percentage
 */
export function getScrollDepth(): number {
  if (typeof window === 'undefined') return 0;
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  
  return (scrollTop / (scrollHeight - clientHeight)) * 100;
}

/**
 * Main ad optimization function
 * Returns the best ad format and slot for the current context
 */
export function optimizeAdPlacement(placementId: string): { 
  format: AdFormat; 
  slot: string;
  show: boolean;
} {
  const deviceType = detectDeviceType();
  const context = determineContentContext();
  const journey = determineUserJourney();
  
  // Decide if we should show this ad
  const show = shouldShowAd(placementId, deviceType, context, journey);
  
  // Get the optimal format
  const format = getOptimalAdFormat(deviceType, context, journey);
  
  // Get the optimal slot
  const adSlot = getOptimalAdSlot(context);
  
  return {
    format,
    slot: adSlot.slot,
    show
  };
}