import React from 'react'
import { Label } from '@/components/ui/label.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'

export default function GifConversionSettings({
  videoSettings,
  onSettingChange
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fps">Frame Rate (FPS)</Label>
        <Select 
          value={videoSettings.fps.toString()} 
          onValueChange={(value) => onSettingChange('fps', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 FPS (Smaller file)</SelectItem>
            <SelectItem value="15">15 FPS (Balanced)</SelectItem>
            <SelectItem value="20">20 FPS (Smooth)</SelectItem>
            <SelectItem value="25">25 FPS (High quality)</SelectItem>
            <SelectItem value="30">30 FPS (Maximum)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="quality">Quality</Label>
        <Select 
          value={videoSettings.quality} 
          onValueChange={(value) => onSettingChange('quality', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low (Smaller file)</SelectItem>
            <SelectItem value="medium">Medium (Balanced)</SelectItem>
            <SelectItem value="high">High (Best quality)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="width">Width (pixels)</Label>
        <Input
          id="width"
          type="number"
          value={videoSettings.width}
          onChange={(e) => onSettingChange('width', parseInt(e.target.value) || 480)}
          min="100"
          max="1920"
        />
      </div>

      <div>
        <Label htmlFor="height">Height (pixels)</Label>
        <Input
          id="height"
          type="number"
          value={videoSettings.height}
          onChange={(e) => onSettingChange('height', parseInt(e.target.value) || 360)}
          min="100"
          max="1080"
        />
      </div>

      <div className="pt-4 border-t">
        <div className="text-sm text-gray-600">
          <p><strong>Segment:</strong> {videoSettings.duration.toFixed(1)}s</p>
          <p><strong>Start:</strong> {videoSettings.startTime.toFixed(1)}s</p>
          <p><strong>Size:</strong> {videoSettings.width}x{videoSettings.height}</p>
        </div>
      </div>
    </div>
  )
}

