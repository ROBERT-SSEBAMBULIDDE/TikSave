import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import HowItWorks from "@/pages/howitworks";
import { ThemeProvider } from "./providers/ThemeProvider";
import { DirectInstallButton } from "@/components/DirectInstallButton";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/how-it-works" component={HowItWorks} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      // Force update check for service worker on each app load
      navigator.serviceWorker.ready.then(registration => {
        // Check for updates
        registration.update();
        
        // If there's a waiting service worker, activate it
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
      
      // Listen for updates and refresh
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // When the service worker is updated, reload the page
        window.location.reload();
      });
      
      // Also run our ad removal script
      const removeAdElements = () => {
        const adSelectors = [
          '[id*="google_ads"]',
          '[id*="ad-"]',
          '[id*="ad_"]',
          '[class*="ad-container"]',
          '[class*="ad-wrapper"]',
          '[class*="ad-slot"]',
          '[class*="advert"]',
          '[class*="banner-ad"]',
          '[class*="dfp-"]',
          '[class*="adsense"]'
        ];
        
        // Remove elements matching selectors
        adSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            if (el && el.parentNode) {
              el.parentNode.removeChild(el);
            }
          });
        });
        
        // Find "Advertisement" text using text content search
        // Use querySelectorAll instead of TreeWalker to avoid TypeScript errors
        const allElements = document.querySelectorAll('*');
        const nodesToRemove: Element[] = [];
        
        // Look through all elements on the page
        allElements.forEach(el => {
          // Check if element contains only the Advertisement text
          if (el.childNodes.length === 1 && 
              el.childNodes[0].nodeType === Node.TEXT_NODE && 
              el.childNodes[0].textContent && 
              el.childNodes[0].textContent.trim() === 'Advertisement') {
            nodesToRemove.push(el);
          }
          
          // Also check if element has text content exactly matching Advertisement
          if (el.textContent && el.textContent.trim() === 'Advertisement') {
            nodesToRemove.push(el);
          }
        });
        
        // Remove all identified ad elements
        nodesToRemove.forEach(node => {
          if (node && node.parentNode) {
            node.parentNode.removeChild(node);
          }
        });
      };
      
      // Run initially and set up a timer to check periodically
      removeAdElements();
      const adRemovalInterval = setInterval(removeAdElements, 1000);
      
      // Clean up interval on component unmount
      return () => clearInterval(adRemovalInterval);
    }
  }, []);
  
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
          <DirectInstallButton />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
