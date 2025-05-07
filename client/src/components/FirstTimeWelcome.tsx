import { useState, useEffect } from "react";
import { useFirstVisit } from "@/hooks/use-first-visit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FAIcon } from "@/components/ui/fa-icon";

export function FirstTimeWelcome() {
  const { isFirstVisit, markVisited } = useFirstVisit("welcome_seen");
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    if (isFirstVisit) {
      // Delay opening the welcome dialog slightly for better UX
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit]);
  
  const handleClose = () => {
    setOpen(false);
    markVisited();
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <FAIcon icon="magic" className="mr-2 text-blue-500" />
            Welcome to TikSave!
          </DialogTitle>
          <DialogDescription>
            We're here to help you download TikTok videos without watermarks.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex">
            <div className="bg-blue-100 rounded-full p-2 mr-3 text-blue-600">
              <FAIcon icon="paste" />
            </div>
            <div>
              <h3 className="font-medium">Easy to Use</h3>
              <p className="text-sm text-slate-500">Just paste a TikTok video URL to get started.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="bg-blue-100 rounded-full p-2 mr-3 text-blue-600">
              <FAIcon icon="sliders-h" />
            </div>
            <div>
              <h3 className="font-medium">Multiple Formats</h3>
              <p className="text-sm text-slate-500">Choose between MP4, MP3, and WebM formats.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="bg-blue-100 rounded-full p-2 mr-3 text-blue-600">
              <FAIcon icon="question-circle" />
            </div>
            <div>
              <h3 className="font-medium">Look for Help Tips</h3>
              <p className="text-sm text-slate-500">Hover over elements with <FAIcon icon="question-circle" className="text-xs text-blue-500" /> for helpful tips.</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleClose} className="w-full">Get Started</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}