import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

// Create a direct install button that works across platforms
export function DirectInstallButton() {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Check if already installed as app
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
    
    // Hide if already installed
    if (isStandalone) {
      setIsVisible(false);
    }
  }, []);
  
  if (!isVisible) return null;
  
  const handleInstall = () => {
    // Try to trigger native install prompt
    if (typeof window !== 'undefined') {
      // If we have the deferredPrompt already stored by our script
      if ((window as any).deferredPrompt) {
        (window as any).deferredPrompt.prompt();
        (window as any).deferredPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
            setIsVisible(false);
          }
          // Clear the prompt
          (window as any).deferredPrompt = null;
        });
      } else {
        // Get user agent for platform detection
        const userAgent = navigator.userAgent.toLowerCase();
        
        // Simple detection for major platforms
        if (/iphone|ipad|ipod/.test(userAgent)) {
          // Show iOS installation dialog
          showIOSInstallDialog();
        } else if (/android/.test(userAgent)) {
          // Show Android installation dialog
          showAndroidInstallDialog();
        } else {
          // Show generic installation dialog
          showGenericInstallDialog();
        }
      }
    }
  };
  
  const showIOSInstallDialog = () => {
    // Force iOS users to use Add to Home Screen
    // Create a full-screen modal with clear instructions
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.zIndex = '9999';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.padding = '20px';
    modal.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '20px';
    closeButton.style.right = '20px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '30px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => document.body.removeChild(modal);
    
    // Create content
    const content = document.createElement('div');
    content.style.backgroundColor = 'white';
    content.style.borderRadius = '12px';
    content.style.width = '100%';
    content.style.maxWidth = '350px';
    content.style.padding = '20px';
    content.style.textAlign = 'center';
    
    // Add installation steps
    content.innerHTML = `
      <h2 style="font-size: 20px; margin-bottom: 20px; color: #1a56db;">Install TikSave on iOS</h2>
      <p style="margin-bottom: 10px; font-size: 15px;">1. Tap the <strong>Share</strong> button</p>
      <p style="margin-bottom: 5px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
          <polyline points="16 6 12 2 8 6"></polyline>
          <line x1="12" y1="2" x2="12" y2="15"></line>
        </svg>
      </p>
      <p style="margin-bottom: 15px; font-size: 15px;">2. Scroll down and tap <strong>Add to Home Screen</strong></p>
      <p style="margin-bottom: 15px; font-size: 15px;">3. Tap <strong>Add</strong> in the top-right corner</p>
      <button id="ios-close-button" style="background-color: #1a56db; color: white; border: none; padding: 12px 0; border-radius: 6px; font-weight: bold; width: 100%; margin-top: 10px; cursor: pointer;">Got it</button>
    `;
    
    // Add elements to the DOM
    modal.appendChild(closeButton);
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Add event listener to the close button in content
    document.getElementById('ios-close-button')?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  };
  
  const showAndroidInstallDialog = () => {
    // Force Android users to use Add to Home Screen
    // Create a full-screen modal with clear instructions
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.zIndex = '9999';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.padding = '20px';
    modal.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '20px';
    closeButton.style.right = '20px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '30px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => document.body.removeChild(modal);
    
    // Create content
    const content = document.createElement('div');
    content.style.backgroundColor = 'white';
    content.style.borderRadius = '12px';
    content.style.width = '100%';
    content.style.maxWidth = '350px';
    content.style.padding = '20px';
    content.style.textAlign = 'center';
    
    // Add installation steps
    content.innerHTML = `
      <h2 style="font-size: 20px; margin-bottom: 20px; color: #1a56db;">Install TikSave on Android</h2>
      <p style="margin-bottom: 15px; font-size: 15px;">1. Tap the menu button (⋮) in the top-right</p>
      <p style="margin-bottom: 15px; font-size: 15px;">2. Tap <strong>Install app</strong> or <strong>Add to Home screen</strong></p>
      <p style="margin-bottom: 15px; font-size: 15px;">3. Follow the on-screen instructions</p>
      <button id="android-close-button" style="background-color: #1a56db; color: white; border: none; padding: 12px 0; border-radius: 6px; font-weight: bold; width: 100%; margin-top: 10px; cursor: pointer;">Got it</button>
    `;
    
    // Add elements to the DOM
    modal.appendChild(closeButton);
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Add event listener to the close button in content
    document.getElementById('android-close-button')?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  };
  
  const showGenericInstallDialog = () => {
    // For other browsers, show a generic modal
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.zIndex = '9999';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.padding = '20px';
    modal.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '20px';
    closeButton.style.right = '20px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '30px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => document.body.removeChild(modal);
    
    // Create content
    const content = document.createElement('div');
    content.style.backgroundColor = 'white';
    content.style.borderRadius = '12px';
    content.style.width = '100%';
    content.style.maxWidth = '350px';
    content.style.padding = '20px';
    content.style.textAlign = 'center';
    
    // Add installation steps
    content.innerHTML = `
      <h2 style="font-size: 20px; margin-bottom: 20px; color: #1a56db;">Install TikSave</h2>
      <p style="margin-bottom: 15px; font-size: 15px;">Look for the install icon in your browser:</p>
      <p style="margin-bottom: 15px; font-size: 15px;">• In Chrome/Edge: Look for + icon in the address bar</p>
      <p style="margin-bottom: 15px; font-size: 15px;">• In Firefox/Safari: Find "Add to Home Screen" in the menu</p>
      <button id="generic-close-button" style="background-color: #1a56db; color: white; border: none; padding: 12px 0; border-radius: 6px; font-weight: bold; width: 100%; margin-top: 10px; cursor: pointer;">Got it</button>
    `;
    
    // Add elements to the DOM
    modal.appendChild(closeButton);
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Add event listener to the close button in content
    document.getElementById('generic-close-button')?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  };
  
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 shadow-lg flex items-center justify-center"
        onClick={handleInstall}
      >
        <Download className="h-7 w-7" />
      </Button>
    </div>
  );
}