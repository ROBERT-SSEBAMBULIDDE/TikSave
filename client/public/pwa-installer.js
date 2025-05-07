// PWA Installation Helper
let deferredPrompt;

// Configure the install button on page load
window.addEventListener('load', () => {
  // Get the install button container
  const installButtonContainer = document.getElementById('pwa-install-button-container');
  
  if (installButtonContainer) {
    // Check if the app is running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator.standalone === true) || 
                        document.referrer.includes('android-app://');
    
    // Hide the container if we're already in standalone mode
    if (isStandalone) {
      installButtonContainer.style.display = 'none';
    } else {
      // Otherwise ensure it's visible
      installButtonContainer.style.display = 'flex';
      
      // Set a timeout to auto-hide the label after 10 seconds
      // but keep the button visible
      setTimeout(() => {
        const label = installButtonContainer.querySelector('div');
        if (label) {
          label.style.display = 'none';
        }
      }, 10000);
    }
  }
});

// Store the beforeinstallprompt event when it fires
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Store the event for later use
  deferredPrompt = e;
  
  console.log('beforeinstallprompt event fired and stored');
  
  // If we have the button, add proper behavior
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.addEventListener('click', (e) => {
      if (deferredPrompt) {
        // Show the native install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          // Clear the saved prompt
          deferredPrompt = null;
        });
      }
    });
  }
});

// When the app is successfully installed
window.addEventListener('appinstalled', (event) => {
  console.log('PWA was installed');
  // Hide the install button if visible
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.style.display = 'none';
  }
  
  // Optional: track successful installations
  if (typeof gtag === 'function') {
    gtag('event', 'pwa_install', {
      'event_category': 'PWA',
      'event_label': 'App Installed'
    });
  }
});

// Expose installation method globally
window.installPWA = function() {
  if (deferredPrompt) {
    // If we have the deferred prompt, use it
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
    return true;
  } else {
    // Fallback for browsers/devices that don't support beforeinstallprompt
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      // iOS-specific installation instructions
      alert("To install TikSave on iOS:\n\n1. Tap the share icon (square with arrow)\n2. Scroll down and tap 'Add to Home Screen'\n3. Tap 'Add' in the top-right corner");
    } else if (/android/.test(userAgent)) {
      // Android-specific installation instructions
      alert("To install TikSave on Android:\n\n1. Tap the menu button (three dots) in your browser\n2. Select 'Add to Home screen' or 'Install App'\n3. Follow the on-screen instructions");
    } else if (/chrome/.test(userAgent)) {
      // Chrome desktop installation instructions
      alert("To install TikSave in Chrome:\n\n1. Look for the install icon (+) in the address bar\n2. Click 'Install'\n\nIf you don't see the install icon, open Chrome's menu (three dots) and select 'Install TikSave'");
    } else {
      // Generic installation instructions
      alert("To install TikSave as an app:\n\n• Mobile: Use your browser's 'Add to Home Screen' option\n• Desktop: Look for an install icon in the address bar or browser menu");
    }
    return false;
  }
};