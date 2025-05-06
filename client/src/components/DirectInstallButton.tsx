import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Define the BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Set global variable to store the event
declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}

export function DirectInstallButton() {
  const [installable, setInstallable] = useState(false);
  
  useEffect(() => {
    // Store the BeforeInstallPromptEvent when it fires
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('BeforeInstallPromptEvent fired');
      // Prevent the browser's default install prompt
      e.preventDefault();
      
      // Store the event for later use
      window.deferredPrompt = e as BeforeInstallPromptEvent;
      
      // Show our install button
      setInstallable(true);
    };
    
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Check if already installed
    const isStandalone = () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    
    if (isStandalone()) {
      setInstallable(false);
    }
    
    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      // Clear the deferredPrompt
      window.deferredPrompt = null;
      // Hide the install button
      setInstallable(false);
      console.log('PWA was installed');
    });
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstallClick = async () => {
    if (!window.deferredPrompt) {
      console.log('No installation prompt available');
      
      // Fallback for browsers/devices without beforeinstallprompt support
      const userAgent = navigator.userAgent.toLowerCase();
      
      if (/iphone|ipad|ipod/.test(userAgent)) {
        alert("To install on iOS:\n\n1. Tap the share icon (square with arrow)\n2. Scroll down and tap 'Add to Home Screen'\n3. Tap 'Add' in the top right");
      } else if (/android/.test(userAgent)) {
        alert("To install on Android:\n\n1. Tap the menu button (three dots)\n2. Tap 'Add to Home screen'\n3. Follow the on-screen instructions");
      } else {
        alert("To install this app:\n\n• Look for the install icon in your browser's address bar\n• Or find 'Install' or 'Add to Home Screen' in your browser menu");
      }
      
      return;
    }
    
    // Show the installation prompt
    window.deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await window.deferredPrompt.userChoice;
    
    // We no longer need the prompt, clear it
    window.deferredPrompt = null;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setInstallable(false);
    } else {
      console.log('User dismissed the install prompt');
    }
  };
  
  // This component now uses the global button in index.html
  // Here we just update the window.installPWA method when needed
  
  useEffect(() => {
    // If we have a button in our React component but the app isn't installable,
    // we can try the global installPWA function
    if (!installable && typeof window.installPWA === 'function') {
      const globalInstallButton = document.getElementById('pwa-install-button');
      if (globalInstallButton) {
        globalInstallButton.addEventListener('click', window.installPWA);
      }
    }
  }, [installable]);
  
  // Return empty fragment - we're using the button from index.html instead
  return <></>;
}