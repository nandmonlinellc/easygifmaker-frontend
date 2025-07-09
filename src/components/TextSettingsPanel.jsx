import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Button } from '@/components/ui/button.jsx' // Assuming Button is used for presets
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx' // Assuming these exist
import { Settings } from 'lucide-react'

export default function TextSettingsPanel({ canvasSize, textSettings, onTextSettingsChange }) {
  const settings = textSettings || {}
  const setSettings = onTextSettingsChange;

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
              onChange={(e) => setSettings({ ...settings, text: e.target.value })}
              placeholder="Enter your text here..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="font-family">Font Family</Label>
            <Select value={settings.fontFamily} onValueChange={(value) => setSettings({ ...settings, fontFamily: value })}>
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

          <div>
            <Label htmlFor="font-size">Font Size: {settings.fontSize}px</Label>
            <Input
              id="font-size"
              type="range"
              min="8"
              max="150" // Adjusted max font size for better control
              value={settings.fontSize}
              onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="font-color">Text Color</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  id="font-color"
                  value={settings.color} // Use 'color' from textSettings
                  onChange={(e) => setSettings({ ...settings, color: e.target.value })}
                  className="w-12 h-8 rounded border"
                />
                <Input
                  type="text"
                  value={settings.color} // Use 'color' from textSettings
                  onChange={(e) => setSettings({ ...settings, color: e.target.value })}
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
                  onChange={(e) => setSettings({ ...settings, strokeColor: e.target.value })}
                  className="w-12 h-8 rounded border"
                />
                <Input
                  type="text"
                  value={settings.strokeColor}
                  onChange={(e) => setSettings({ ...settings, strokeColor: e.target.value })}
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="stroke-width">Stroke Width: {settings.strokeWidth}px</Label>
            <Input
              id="stroke-width"
              type="range"
              min="0"
              max="5" // Adjusted max stroke width
              value={settings.strokeWidth}
              onChange={(e) => setSettings({ ...settings, strokeWidth: parseInt(e.target.value) })}
            />
          </div>

          {/* Horizontal Alignment */}
          <div>
            <Label>Horizontal Alignment</Label>
            <RadioGroup
              value={settings.horizontalAlign}
              onValueChange={(value) => {
                const newSettings = { ...settings, horizontalAlign: value }
                const { x, y } = calculateAbsolutePosition(newSettings, canvasSize)
                setSettings({ ...newSettings, x, y })
              }}
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
              onValueChange={(value) => {
                const newSettings = { ...settings, verticalAlign: value }
                const { x, y } = calculateAbsolutePosition(newSettings, canvasSize)
                setSettings({ ...newSettings, x, y })
              }}
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
                onChange={(e) => {
                  const newSettings = { ...settings, offsetX: parseInt(e.target.value) || 0 }
                  const { x, y } = calculateAbsolutePosition(newSettings, canvasSize)
                  setSettings({ ...newSettings, x, y })
                }}
              />
            </div>
            <div>
              <Label htmlFor="offset-y">Offset Y (px)</Label>
              <Input
                id="offset-y"
                type="number"
                value={settings.offsetY}
                onChange={(e) => {
                  const newSettings = { ...settings, offsetY: parseInt(e.target.value) || 0 }
                  const { x, y } = calculateAbsolutePosition(newSettings, canvasSize)
                  setSettings({ ...newSettings, x, y })
                }}
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
            onClick={() => setSettings({ ...settings, fontFamily: 'Impact', fontSize: 36, color: '#ffffff', strokeColor: '#000000', strokeWidth: 3, horizontalAlign: 'center', verticalAlign: 'middle', offsetX: 0, offsetY: 0, x: 0, y: 0 })}
          >
            Meme Style
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => setSettings({ ...settings, fontFamily: 'Arial', fontSize: 18, color: '#000000', strokeColor: '#ffffff', strokeWidth: 1, horizontalAlign: 'left', verticalAlign: 'top', offsetX: 10, offsetY: 10, x: 0, y: 0 })}
          >
            Subtitle Style
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => setSettings({ ...settings, fontFamily: 'Georgia', fontSize: 24, color: '#333333', strokeColor: '#ffffff', strokeWidth: 0, horizontalAlign: 'center', verticalAlign: 'bottom', offsetX: 0, offsetY: -20, x: 0, y: 0 })}
          >
            Clean Text
          </Button>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Text Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600"> 
          <p>• Use the alignment options and offsets to precisely position your text.</p>
          <p>• Drag the text directly on the preview for fine-tuning after initial placement.</p>
          <p>• Use stroke for better text visibility</p>
          <p>• Position text away from busy areas</p>
          <p>• Keep text short for better readability</p>
          <p>• Test different font sizes</p>
        </CardContent>
      </Card>
    </>
  )
}

// Helper function to calculate absolute X/Y based on alignment and offsets, using actual canvas size
const calculateAbsolutePosition = (settings, canvasSize) => {
  const { text, fontSize, horizontalAlign, verticalAlign, offsetX, offsetY } = settings
  const { width: canvasWidth, height: canvasHeight } = canvasSize

  let newX = 0
  let newY = 0

  // Use a canvas to measure actual text width for more accurate alignment
  let estimatedTextWidth = text.length * (fontSize * 0.6)
  if (typeof window !== 'undefined' && window.document) {
    const tempCanvas = document.createElement('canvas')
    const ctx = tempCanvas.getContext('2d')
    ctx.font = `${fontSize || 24}px Arial`
    estimatedTextWidth = ctx.measureText(text).width
  }
  const estimatedTextHeight = fontSize

  switch (horizontalAlign) {
    case 'left':
      newX = 0
      break
    case 'center':
      newX = (canvasWidth / 2) - (estimatedTextWidth / 2)
      break
    case 'right':
      newX = canvasWidth - estimatedTextWidth
      break
    default:
      newX = 0
  }

  switch (verticalAlign) {
    case 'top':
      newY = 0
      break
    case 'middle':
      newY = (canvasHeight / 2) - (estimatedTextHeight / 2)
      break
    case 'bottom':
      newY = canvasHeight - estimatedTextHeight
      break
    default:
      newY = 0
  }

  // Apply offsets and ensure positions are not negative
  return { x: Math.max(0, newX + offsetX), y: Math.max(0, newY + offsetY) }
}
