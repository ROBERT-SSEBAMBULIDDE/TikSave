import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FAIcon } from '@/components/ui/fa-icon';

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
    <div className="bg-slate-50 rounded-lg p-4 space-y-4">
      {/* Watermark Controls */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-slate-700 flex items-center gap-2">
            <FAIcon icon="text-height" className="text-blue-600" />
            Add Watermark
          </h4>
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            checked={watermark.enabled}
            onChange={(e) => onWatermarkChange({ ...watermark, enabled: e.target.checked })}
          />
        </div>
        
        {watermark.enabled && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter watermark text..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={watermark.text || ''}
              onChange={(e) => onWatermarkChange({ ...watermark, text: e.target.value })}
            />
            
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={watermark.position || 'bottom-right'}
              onChange={(e) => onWatermarkChange({ ...watermark, position: e.target.value })}
            >
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="center">Center</option>
            </select>
          </div>
        )}
      </div>

      {/* Caption Controls */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-slate-700 flex items-center gap-2">
            <FAIcon icon="comment" className="text-blue-600" />
            Add Captions
          </h4>
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            checked={caption.enabled}
            onChange={(e) => onCaptionChange({ ...caption, enabled: e.target.checked })}
          />
        </div>
        
        {caption.enabled && (
          <div className="space-y-3">
            <textarea
              placeholder="Enter caption text..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={caption.text || ''}
              onChange={(e) => onCaptionChange({ ...caption, text: e.target.value })}
            />
            
            <input
              type="number"
              min="1"
              max="60"
              placeholder="Duration (seconds)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={caption.duration || 5}
              onChange={(e) => onCaptionChange({ ...caption, duration: parseInt(e.target.value) || 5 })}
            />
          </div>
        )}
      </div>
    </div>
  );
}