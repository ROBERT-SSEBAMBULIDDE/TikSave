// PWA Installation Helper
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  console.log('beforeinstallprompt event fired and stored');
  
  // Add a custom install button if available
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.style.display = 'block';
    
    installButton.addEventListener('click', (e) => {
      // Show the prompt
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
  }
  return false;
};