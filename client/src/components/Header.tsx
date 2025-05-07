import { FAIcon } from "@/components/ui/fa-icon";
import { Link } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import { PWAInstallModal } from "./PWAInstallModal";
import { useState, useEffect } from "react";
import { AdPlacement } from "./AdPlacement";

export function Header() {
  // Check if we're running in a standalone PWA mode
  const [isStandalone, setIsStandalone] = useState(false);
  
  useEffect(() => {
    const checkStandalone = () => {
      const isInStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone || 
        document.referrer.includes('android-app://');
      
      setIsStandalone(isInStandaloneMode);
    };
    
    checkStandalone();
    
    // Listen for changes in display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const listener = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(listener);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, []);
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <FAIcon icon="cloud-download-alt" className="text-white text-2xl" />
            <h1 className="font-bold text-xl sm:text-2xl text-white">TikSave</h1>
          </div>
        </Link>
        <div className="flex items-center">
          <nav className="mr-2">
            <ul className="flex space-x-4 sm:space-x-6">
              <li>
                <Link href="/how-it-works">
                  <div className="text-white hover:text-blue-200 text-sm sm:text-base font-medium transition-colors cursor-pointer">
                    How it works
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <div className="text-white hover:text-blue-200 text-sm sm:text-base font-medium transition-colors cursor-pointer">
                    Terms
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <div className="text-white hover:text-blue-200 text-sm sm:text-base font-medium transition-colors cursor-pointer">
                    Privacy
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Only show install button if not already in standalone mode */}
          {!isStandalone && (
            <div className="hidden sm:block mr-3">
              <PWAInstallModal />
            </div>
          )}
          
          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
