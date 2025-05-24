import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlatformSelectorProps {
  selectedPlatform: "tiktok" | "youtube";
  onPlatformChange: (platform: "tiktok" | "youtube") => void;
}

export function PlatformSelector({ selectedPlatform, onPlatformChange }: PlatformSelectorProps) {
  return (
    <div className="flex gap-4 mb-6">
      <Card 
        className={`flex-1 cursor-pointer transition-all ${
          selectedPlatform === "tiktok" 
            ? "ring-2 ring-pink-500 bg-pink-50 dark:bg-pink-950/20" 
            : "hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
        onClick={() => onPlatformChange("tiktok")}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">TikTok</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Download TikTok videos</p>
              </div>
            </div>
            {selectedPlatform === "tiktok" && (
              <Badge className="bg-pink-500 text-white">Selected</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card 
        className={`flex-1 cursor-pointer transition-all ${
          selectedPlatform === "youtube" 
            ? "ring-2 ring-red-500 bg-red-50 dark:bg-red-950/20" 
            : "hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
        onClick={() => onPlatformChange("youtube")}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">YouTube</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Download YouTube videos</p>
              </div>
            </div>
            {selectedPlatform === "youtube" && (
              <Badge className="bg-red-500 text-white">Selected</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}