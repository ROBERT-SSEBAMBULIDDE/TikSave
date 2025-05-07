import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAdOptimizer } from '@/providers/AdOptimizerProvider';
import { AdFormat } from '@/lib/adOptimizer';

export function AdOptimizerDashboard() {
  const { 
    deviceType, 
    userJourney, 
    contentContext, 
    timeOnPage, 
    scrollDepth, 
    isAdBlockerDetected,
    adsViewed,
    isInPWAMode
  } = useAdOptimizer();
  
  const [showDashboard, setShowDashboard] = useState(false);
  const [adSlots, setAdSlots] = useState({
    'home_top': { enabled: true, format: 'auto' as AdFormat },
    'home_bottom': { enabled: true, format: 'horizontal' as AdFormat },
    'howitworks_top': { enabled: true, format: 'rectangle' as AdFormat },
    'howitworks_bottom': { enabled: true, format: 'fluid' as AdFormat },
    'faq_middle': { enabled: true, format: 'fluid' as AdFormat },
  });
  
  if (!showDashboard) {
    return (
      <div className="fixed bottom-5 left-5 z-40">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white/80 text-xs px-2 py-1 h-auto"
          onClick={() => setShowDashboard(true)}
        >
          Ad Optimizer
        </Button>
      </div>
    );
  }
  
  const toggleAdSlot = (slotId: string) => {
    setAdSlots(prev => ({
      ...prev,
      [slotId]: {
        ...prev[slotId as keyof typeof prev],
        enabled: !prev[slotId as keyof typeof prev].enabled
      }
    }));
  };
  
  const changeFormat = (slotId: string, format: AdFormat) => {
    setAdSlots(prev => ({
      ...prev,
      [slotId]: {
        ...prev[slotId as keyof typeof prev],
        format
      }
    }));
  };
  
  // Use a portal for the dashboard to prevent parent component layout shifts
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
      // Prevent event propagation to avoid rerenders of parent components
      onClick={(e) => e.stopPropagation()}
    >
      <Card 
        className="w-full max-w-4xl max-h-[90vh] overflow-auto"
        // Prevent scrolling the main page when scrolling the dashboard
        onScroll={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
          <CardTitle>Ad Placement Optimizer</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDashboard(false)}
          >
            Close
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="placements">Ad Placements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-sm mb-1">Current Context</h3>
                    <div className="text-2xl font-bold">{contentContext}</div>
                    <div className="text-xs text-gray-500 mt-1">Context determines ad relevance</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-sm mb-1">Device Type</h3>
                    <div className="text-2xl font-bold capitalize">{deviceType}</div>
                    <div className="text-xs text-gray-500 mt-1">Affects ad format and placement</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-sm mb-1">User Journey</h3>
                    <div className="text-2xl font-bold capitalize">
                      {userJourney.replace(/_/g, ' ')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Determines ad frequency</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-sm mb-1">User Engagement</h3>
                    <div className="flex justify-between">
                      <div>
                        <div className="text-lg font-bold">{Math.floor(timeOnPage)}s</div>
                        <div className="text-xs text-gray-500">Time on page</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{Math.floor(scrollDepth)}%</div>
                        <div className="text-xs text-gray-500">Scroll depth</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{adsViewed}</div>
                        <div className="text-xs text-gray-500">Ads viewed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-sm mb-1">Ad Blocker Status</h3>
                    <div className={`text-lg font-bold ${isAdBlockerDetected ? 'text-red-500' : 'text-green-500'}`}>
                      {isAdBlockerDetected ? 'Detected' : 'Not Detected'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {isAdBlockerDetected 
                        ? 'Fallback content showing if configured' 
                        : 'Ads are being displayed normally'
                      }
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-sm mb-1">PWA Mode</h3>
                    <div className={`text-lg font-bold ${isInPWAMode ? 'text-blue-500' : 'text-slate-500'}`}>
                      {isInPWAMode ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {isInPWAMode 
                        ? 'App is running as installed PWA' 
                        : 'App is running in browser'
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Contextual Optimization</h3>
                <p className="text-sm text-slate-600 mb-4">
                  The ad optimizer is dynamically adjusting ad formats and placements based on user behavior, 
                  device type, and content context. This ensures optimal ad performance and user experience.
                </p>
                <div className="text-xs text-slate-500">
                  <div><strong>Device:</strong> {deviceType} - Formats prioritized: fluid, auto, horizontal</div>
                  <div><strong>Context:</strong> {contentContext} - Max ads: 3</div>
                  <div><strong>User:</strong> {userJourney.replace(/_/g, ' ')} - Frequency: moderate</div>
                  <div className={isInPWAMode ? 'text-blue-500 font-medium mt-2' : 'mt-2'}>
                    <strong>App Status:</strong> {isInPWAMode ? 'PWA Mode' : 'Browser Mode'} 
                    {isInPWAMode && ' - Special ad handling is active'}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="placements">
              <div className="space-y-4">
                {Object.entries(adSlots).map(([slotId, slot]) => (
                  <Card key={slotId}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{slotId.replace(/_/g, ' ')}</h3>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`enabled-${slotId}`} className="text-sm">Enabled</Label>
                          <input 
                            type="checkbox" 
                            id={`enabled-${slotId}`}
                            checked={slot.enabled}
                            onChange={() => toggleAdSlot(slotId)}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`format-${slotId}`} className="text-sm">Format</Label>
                          <select
                            id={`format-${slotId}`}
                            value={slot.format}
                            onChange={(e) => changeFormat(slotId, e.target.value as AdFormat)}
                            className="w-full p-2 border rounded-md mt-1"
                          >
                            <option value="auto">Auto</option>
                            <option value="fluid">Fluid</option>
                            <option value="rectangle">Rectangle</option>
                            <option value="horizontal">Horizontal</option>
                          </select>
                        </div>
                        
                        <div>
                          <Label className="text-sm">Current Status</Label>
                          <div className={`mt-2 text-sm ${slot.enabled ? 'text-green-500' : 'text-red-500'}`}>
                            {slot.enabled ? 'Active' : 'Disabled'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">Ad Optimizer Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="max-ads-homepage">Max Ads on Homepage</Label>
                      <Input id="max-ads-homepage" type="number" defaultValue={3} min={0} max={5} />
                    </div>
                    
                    <div>
                      <Label htmlFor="max-ads-howitworks">Max Ads on How It Works</Label>
                      <Input id="max-ads-howitworks" type="number" defaultValue={2} min={0} max={5} />
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Format Prioritization by Device</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="mobile-priority" className="text-sm">Mobile</Label>
                          <select
                            id="mobile-priority"
                            className="w-full p-2 border rounded-md mt-1"
                            defaultValue="fluid"
                          >
                            <option value="fluid">Fluid</option>
                            <option value="auto">Auto</option>
                            <option value="horizontal">Horizontal</option>
                            <option value="rectangle">Rectangle</option>
                          </select>
                        </div>
                        
                        <div>
                          <Label htmlFor="tablet-priority" className="text-sm">Tablet</Label>
                          <select
                            id="tablet-priority"
                            className="w-full p-2 border rounded-md mt-1"
                            defaultValue="auto"
                          >
                            <option value="fluid">Fluid</option>
                            <option value="auto">Auto</option>
                            <option value="horizontal">Horizontal</option>
                            <option value="rectangle">Rectangle</option>
                          </select>
                        </div>
                        
                        <div>
                          <Label htmlFor="desktop-priority" className="text-sm">Desktop</Label>
                          <select
                            id="desktop-priority"
                            className="w-full p-2 border rounded-md mt-1"
                            defaultValue="rectangle"
                          >
                            <option value="fluid">Fluid</option>
                            <option value="auto">Auto</option>
                            <option value="horizontal">Horizontal</option>
                            <option value="rectangle">Rectangle</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button>Save Settings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}