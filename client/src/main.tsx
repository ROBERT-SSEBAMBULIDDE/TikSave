import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// PWA reload functionality - ensure fresh state when opening the app
(function forceReloadForPWA() {
  // Only run in standalone mode (installed PWA)
  const isStandalone = 
    window.matchMedia('(display-mode: standalone)').matches || 
    // @ts-ignore - Safari specific property 
    (window.navigator as any).standalone === true || 
    document.referrer.includes('android-app://');
  
  if (isStandalone) {
    console.log('PWA detected, setting up auto-refresh');
    
    // Check if we've already processed this session
    const sessionProcessed = sessionStorage.getItem('pwa_session_processed');
    
    if (!sessionProcessed) {
      // Mark this session as processed to prevent infinite reloads
      sessionStorage.setItem('pwa_session_processed', 'true');
      
      const currentTime = Date.now();
      const lastOpened = localStorage.getItem('last_pwa_open');
      
      if (lastOpened) {
        const timeSinceLast = currentTime - parseInt(lastOpened);
        // If more than 30 seconds have passed since the last opening,
        // consider this a new session and force reload for fresh content
        if (timeSinceLast > 30000) {
          console.log('New PWA session detected, forcing reload for fresh content');
          localStorage.setItem('last_pwa_open', currentTime.toString());
          // Force a cache-busting reload
          window.location.reload();
          return; // Stop execution since we're reloading
        }
      } else {
        // First time ever - just set the timestamp
        localStorage.setItem('last_pwa_open', currentTime.toString());
      }
    }
    
    // Handle app becoming visible again after being in background
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const lastVisible = localStorage.getItem('last_visible');
        const nowTime = Date.now();
        
        if (lastVisible) {
          const timeSinceVisible = nowTime - parseInt(lastVisible);
          // If app was in background for more than 5 minutes, reload
          if (timeSinceVisible > 300000) {
            console.log('App returning from background after long time, refreshing');
            window.location.reload();
          }
        }
        
        localStorage.setItem('last_visible', nowTime.toString());
      }
    });
  }
})();

// Load Font Awesome
const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js";
script.crossOrigin = "anonymous";
script.referrerPolicy = "no-referrer";
document.head.appendChild(script);

// Add font
const fontLink = document.createElement('link');
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
document.head.appendChild(fontLink);

// Add title
const title = document.createElement('title');
title.textContent = "TikSave - Download TikTok Videos Without Watermark";
document.head.appendChild(title);

createRoot(document.getElementById("root")!).render(<App />);
