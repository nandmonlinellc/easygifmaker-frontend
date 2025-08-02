import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Button } from '@/components/ui/button.jsx' // Assuming Button is used for presets
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx' // Assuming these exist
import { Settings } from 'lucide-react'

export default function TextSettingsPanel({ canvasSize, textSettings, onSettingChange }) {
  const settings = textSettings || {}

  // Clamp helper
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const handleSettingChange = (key, value) => {
    // For fontSize and strokeWidth, always store as number, clamp, and prevent NaN
    if (key === 'fontSize') {
      // Allow empty string for input field, but convert to number for processing
      if (value === '') {
        onSettingChange(key, ''); // Allow empty for input field
        return;
      }
      const numValue = Number(value);
      if (isNaN(numValue)) return; // Don't update on invalid
      value = clamp(numValue, 8, 150);
    }
    if (key === 'strokeWidth') {
      // Allow empty string for input field, but convert to number for processing
      if (value === '') {
        onSettingChange(key, ''); // Allow empty for input field
        return;
      }
      const numValue = Number(value);
      if (isNaN(numValue)) return; // Don't update on invalid
      value = clamp(numValue, 0, 5);
    }
    onSettingChange(key, value);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Text Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="text-content">Text Content</Label>
            <Textarea
              id="text-content"
              value={settings.text}
              onChange={(e) => handleSettingChange('text', e.target.value)}
              placeholder="Enter your text here..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="font-family">Font Family</Label>
            <Select value={settings.fontFamily} onValueChange={(value) => handleSettingChange('fontFamily', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                <SelectItem value="Impact">Impact</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <label htmlFor="font-size" className="block font-semibold mb-3 text-gray-800 text-base">
              Font Size
              <span className="text-sm text-gray-500 ml-2 font-normal">(pixels)</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  id="font-size"
                  type="range"
                  min="8"
                  max="150"
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                  className="w-full h-3 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full appearance-none cursor-pointer slider-thumb-blue"
                />
                <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                  <span className="font-medium">Small</span>
                  <span className="font-medium">Large</span>
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={settings.fontSize || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleSettingChange('fontSize', val);
                  }}
                  min="8"
                  max="150"
                  className="w-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-semibold text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border border-white/30"
                />
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">px</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3 leading-relaxed">
              Controls text size. Larger text is more prominent but may cover more of your GIF.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="font-color">Text Color</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  id="font-color"
                  value={settings.color} // Use 'color' from textSettings
                  onChange={(e) => handleSettingChange('color', e.target.value)}
                  className="w-12 h-8 rounded border"
                />
                <Input
                  type="text"
                  value={settings.color} // Use 'color' from textSettings
                  onChange={(e) => handleSettingChange('color', e.target.value)}
                  placeholder="#ffffff"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="stroke-color">Stroke Color</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  id="stroke-color"
                  value={settings.strokeColor}
                  onChange={(e) => handleSettingChange('strokeColor', e.target.value)}
                  className="w-12 h-8 rounded border"
                />
                <Input
                  type="text"
                  value={settings.strokeColor}
                  onChange={(e) => handleSettingChange('strokeColor', e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <label htmlFor="stroke-width" className="block font-semibold mb-3 text-gray-800 text-base">
              Stroke Width
              <span className="text-sm text-gray-500 ml-2 font-normal">(pixels)</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  id="stroke-width"
                  type="range"
                  min="0"
                  max="5"
                  value={settings.strokeWidth}
                  onChange={(e) => handleSettingChange('strokeWidth', e.target.value)}
                  className="w-full h-3 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 rounded-full appearance-none cursor-pointer slider-thumb-green"
                />
                <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                  <span className="font-medium">None</span>
                  <span className="font-medium">Thick</span>
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={settings.strokeWidth || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleSettingChange('strokeWidth', val);
                  }}
                  min="0"
                  max="5"
                  className="w-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-semibold text-base shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none border border-white/30"
                />
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">px</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3 leading-relaxed">
              Adds outline to text for better visibility. 0 = no stroke, higher values = thicker outline.
            </p>
          </div>

          {/* Horizontal Alignment */}
          <div>
            <Label>Horizontal Alignment</Label>
            <RadioGroup
              value={settings.horizontalAlign}
              onValueChange={(value) => handleSettingChange('horizontalAlign', value)}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="left" id="h-left" />
                <Label htmlFor="h-left">Left</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="center" id="h-center" />
                <Label htmlFor="h-center">Center</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="right" id="h-right" />
                <Label htmlFor="h-right">Right</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Vertical Alignment */}
          <div>
            <Label>Vertical Alignment</Label>
            <RadioGroup
              value={settings.verticalAlign}
              onValueChange={(value) => handleSettingChange('verticalAlign', value)}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="top" id="v-top" />
                <Label htmlFor="v-top">Top</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="middle" id="v-middle" />
                <Label htmlFor="v-middle">Middle</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bottom" id="v-bottom" />
                <Label htmlFor="v-bottom">Bottom</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Offset Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="offset-x">Offset X (px)</Label>
              <Input
                id="offset-x"
                type="number"
                value={settings.offsetX}
                onChange={(e) => handleSettingChange('offsetX', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="offset-y">Offset Y (px)</Label>
              <Input
                id="offset-y"
                type="number"
                value={settings.offsetY}
                onChange={(e) => handleSettingChange('offsetY', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Presets */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Text Presets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm" 
            className="w-full justify-start"
            onClick={() => {
              handleSettingChange('fontFamily', 'Impact')
              handleSettingChange('fontSize', 36)
              handleSettingChange('color', '#ffffff')
              handleSettingChange('strokeColor', '#000000')
              handleSettingChange('strokeWidth', 3)
              handleSettingChange('horizontalAlign', 'center')
              handleSettingChange('verticalAlign', 'middle')
              handleSettingChange('offsetX', 0)
              handleSettingChange('offsetY', 0)
            }}
          >
            Meme Style
          </Button>
          <Button
            variant="outline"
            size="sm" 
            className="w-full justify-start"
            onClick={() => {
              handleSettingChange('fontFamily', 'Arial')
              handleSettingChange('fontSize', 18)
              handleSettingChange('color', '#000000')
              handleSettingChange('strokeColor', '#ffffff')
              handleSettingChange('strokeWidth', 1)
              handleSettingChange('horizontalAlign', 'left')
              handleSettingChange('verticalAlign', 'top')
              handleSettingChange('offsetX', 10)
              handleSettingChange('offsetY', 10)
            }}
          >
            Subtitle Style
          </Button>
          <Button
            variant="outline"
            size="sm" 
            className="w-full justify-start"
            onClick={() => {
              handleSettingChange('fontFamily', 'Georgia')
              handleSettingChange('fontSize', 24)
              handleSettingChange('color', '#333333')
              handleSettingChange('strokeColor', '#ffffff')
              handleSettingChange('strokeWidth', 0)
              handleSettingChange('horizontalAlign', 'center')
              handleSettingChange('verticalAlign', 'bottom')
              handleSettingChange('offsetX', 0)
              handleSettingChange('offsetY', -20)
            }}
          >
            Clean Text
          </Button>
        </CardContent>
      </Card>

      {/* Enhanced Tips Section */}
      <div className="mt-8 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-3">
          <span className="text-2xl">💡</span>
          Pro Tips for Perfect Text
        </h4>

        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
            <div><strong>Font Size</strong> 18-36px works well for most text. Larger for headlines, smaller for captions.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
            <div><strong>Stroke Width</strong> 1-3px provides good contrast. Use white stroke on dark backgrounds.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
            <div><strong>Positioning</strong> Use alignment and offsets to place text where it won't interfere with the main action.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
            <div><strong>Contrast</strong> Choose colors that stand out against your GIF background for maximum readability.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
            <div><strong>Length</strong> Keep text concise and readable. Short phrases work better than long sentences.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></span>
            <div><strong>Preview</strong> Use the preview to see how your text looks before finalizing. Make adjustments as needed!</div>
          </li>
        </ul>
      </div>
    </>
  )
}
