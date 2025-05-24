import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Type, Image } from 'lucide-react';

interface WatermarkOptions {
  enabled: boolean;
  text: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

interface CaptionOptions {
  enabled: boolean;
  text: string;
  duration: number;
}

interface WatermarkCaptionControlsProps {
  watermark: WatermarkOptions;
  caption: CaptionOptions;
  onWatermarkChange: (watermark: WatermarkOptions) => void;
  onCaptionChange: (caption: CaptionOptions) => void;
}

export function WatermarkCaptionControls({
  watermark,
  caption,
  onWatermarkChange,
  onCaptionChange
}: WatermarkCaptionControlsProps) {
  return (
    <div className="space-y-4">
      {/* Watermark Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Image className="h-5 w-5" />
            Watermark
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="watermark-enabled" className="text-sm font-medium">
              Add watermark
            </Label>
            <Switch
              id="watermark-enabled"
              checked={watermark.enabled}
              onCheckedChange={(enabled) =>
                onWatermarkChange({ ...watermark, enabled })
              }
            />
          </div>
          
          {watermark.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="watermark-text" className="text-sm">
                  Watermark Text
                </Label>
                <Input
                  id="watermark-text"
                  placeholder="Enter watermark text..."
                  value={watermark.text}
                  onChange={(e) =>
                    onWatermarkChange({ ...watermark, text: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="watermark-position" className="text-sm">
                  Position
                </Label>
                <Select
                  value={watermark.position}
                  onValueChange={(position: any) =>
                    onWatermarkChange({ ...watermark, position })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Caption Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Type className="h-5 w-5" />
            Captions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="caption-enabled" className="text-sm font-medium">
              Add captions
            </Label>
            <Switch
              id="caption-enabled"
              checked={caption.enabled}
              onCheckedChange={(enabled) =>
                onCaptionChange({ ...caption, enabled })
              }
            />
          </div>
          
          {caption.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="caption-text" className="text-sm">
                  Caption Text
                </Label>
                <Textarea
                  id="caption-text"
                  placeholder="Enter caption text..."
                  value={caption.text}
                  onChange={(e) =>
                    onCaptionChange({ ...caption, text: e.target.value })
                  }
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="caption-duration" className="text-sm">
                  Display Duration (seconds)
                </Label>
                <Input
                  id="caption-duration"
                  type="number"
                  min="1"
                  max="60"
                  value={caption.duration}
                  onChange={(e) =>
                    onCaptionChange({ ...caption, duration: parseInt(e.target.value) || 5 })
                  }
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}