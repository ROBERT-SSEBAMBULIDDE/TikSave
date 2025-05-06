import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smartphone, Laptop, Share, Menu, Globe, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PWAInstallModal() {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center bg-white dark:bg-slate-800">
          <Download className="mr-2 h-4 w-4" />
          Install TikSave App
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Install TikSave on your device</DialogTitle>
          <DialogDescription>
            Install TikSave as an app for faster access without browser controls
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="ios" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="ios" className="flex items-center justify-center">
              <Smartphone className="mr-2 h-4 w-4" /> 
              iOS
            </TabsTrigger>
            <TabsTrigger value="android" className="flex items-center justify-center">
              <Smartphone className="mr-2 h-4 w-4" /> 
              Android
            </TabsTrigger>
            <TabsTrigger value="desktop" className="flex items-center justify-center">
              <Laptop className="mr-2 h-4 w-4" />
              Desktop
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ios" className="pt-4 space-y-4">
            <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">1</div>
                <div>
                  <h3 className="font-medium">Tap the Share button</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Tap the <Share className="h-4 w-4 inline" /> share button in your browser
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">2</div>
                <div>
                  <h3 className="font-medium">Tap "Add to Home Screen"</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Scroll down in the share menu and tap "Add to Home Screen"
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">3</div>
                <div>
                  <h3 className="font-medium">Tap "Add"</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Tap "Add" in the top-right corner of the screen
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="android" className="pt-4 space-y-4">
            <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">1</div>
                <div>
                  <h3 className="font-medium">Tap the menu button</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Tap the <Menu className="h-4 w-4 inline" /> menu button (three dots) in your browser
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">2</div>
                <div>
                  <h3 className="font-medium">Tap "Add to Home screen"</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Select "Add to Home screen" from the menu options
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">3</div>
                <div>
                  <h3 className="font-medium">Confirm installation</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Tap "Add" to confirm and install TikSave
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="desktop" className="pt-4 space-y-4">
            <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">1</div>
                <div>
                  <h3 className="font-medium">Click the install icon</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Look for the install icon <Download className="h-4 w-4 inline" /> in the address bar
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">2</div>
                <div>
                  <h3 className="font-medium">Click "Install"</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Click the "Install" button in the installation prompt
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">3</div>
                <div>
                  <h3 className="font-medium">Use TikSave like a native app</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    TikSave will open in its own window without browser controls
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 pt-3 border-t">
          <Button className="w-full" onClick={() => setOpen(false)}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}