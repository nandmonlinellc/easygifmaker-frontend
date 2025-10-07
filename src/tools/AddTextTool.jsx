import React, { useState, useCallback, useMemo } from 'react'
import DisplayAd from '@/components/ads/DisplayAd.jsx'
import InArticleAd from '@/components/ads/InArticleAd.jsx'
import * as Slider from '@radix-ui/react-slider'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Type } from 'lucide-react'
import InteractiveCanvas from '../components/InteractiveCanvas'
import ResultSection from '../components/ResultSection'
import TextSettingsPanel from '../components/TextSettingsPanel'
import ProcessingState from '../components/ProcessingState'
import UploadState from '../components/UploadState'
import ToolPageLayout from '../components/ToolPageLayout'

export default function AddTextTool() {
  const [workflowState, setWorkflowState] = useState('upload') // 'upload', 'editing', 'processing', 'result'
  const [uploadMethod, setUploadMethod] = useState('file')
  const [sourceFile, setSourceFile] = useState(null) // To hold the original file
  const [mediaUrl, setMediaUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  // Text settings state
  const [textSettings, setTextSettings] = useState({
    text: 'Sample Text',
    fontSize: 24,
    fontFamily: 'Arial',
    color: '#ffffff',
    strokeColor: '#000000',
    strokeWidth: 2,
    horizontalAlign: 'center',
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: 0,
    x: 0,
    y: 0,
    animationStyle: 'none',
    // advanced layout defaults
    maxWidthRatio: 0.95,
    lineHeight: 1.2,
    autoFit: true,
  })
  // Start and end time state (in seconds)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState('')
  // Multiple text layers support
  const [layers, setLayers] = useState([]) // each item mirrors textSettings + per-layer timing
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(-1)
  // GIF metadata
  const [gifDuration, setGifDuration] = useState(10) // fallback default
  const [gifFrameCount, setGifFrameCount] = useState(1)
  const [durationWarning, setDurationWarning] = useState(false)

  const adSlots = useMemo(() => ({
    header: <DisplayAd slot="1125232950" className="max-w-3xl w-full" />,
    mid: <InArticleAd slot="8336674411" className="max-w-2xl w-full" />,
    footer: <DisplayAd slot="1125232950" className="max-w-3xl w-full" />
  }), [])

  // Handle text settings change from TextSettingsPanel
  const handleSettingChange = useCallback((key, value) => {
    setTextSettings(prev => {
      const updated = { ...prev, [key]: value }
      // If a layer is selected, keep it in sync
      if (selectedLayerIndex >= 0) {
        setLayers(curr => curr.map((layer, idx) => idx === selectedLayerIndex ? { ...layer, [key]: value } : layer))
      }
      return updated
    })
  }, [selectedLayerIndex])

  // Unified upload handler for file or URL
  const handleFileUpload = useCallback((files, urlInput = null) => {
    if ((!files || files.length === 0) && !urlInput) return
    setErrorMessage(null)
    setResultUrl(null)
    let url
    let fileObj = null
    let isUrl = false
    if (uploadMethod === 'url' && urlInput) { // URL upload
      url = urlInput
      setSourceFile(null)
      isUrl = true
    } else { // File upload
      fileObj = files[0]
      setSourceFile(fileObj)
      url = URL.createObjectURL(fileObj)
    }
    setMediaUrl(url)
    setWorkflowState('editing')

    // Fetch real GIF metadata from backend
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
    const formData = new FormData()
    if (isUrl) {
      formData.append('url', url)
    } else {
      formData.append('file', fileObj, fileObj?.name)
    }
    fetch(`${apiUrl}/api/gif-metadata`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.duration && data.frame_count) {
          setGifFrameCount(data.frame_count)
          setGifDuration(data.duration)
          setDurationWarning(false)
          setStartTime(0)
          setEndTime(data.duration.toFixed(2))
        } else {
          setGifFrameCount(1)
          setGifDuration(10)
          setDurationWarning(true)
        }
      })
      .catch(() => {
        setGifFrameCount(1)
        setGifDuration(10)
        setDurationWarning(true)
      })
  }, [uploadMethod])

  // Handle text position change from InteractiveCanvas
  const handleTextPositionChange = useCallback((position) => {
    // Keep absolute x,y and mirror into offsets without forcing alignment
    setTextSettings(prev => ({
      ...prev,
      x: position.x,
      y: position.y,
      offsetX: position.x,
      offsetY: position.y,
    }))
    if (selectedLayerIndex >= 0) {
      setLayers(curr => curr.map((layer, idx) => idx === selectedLayerIndex ? {
        ...layer,
        x: position.x,
        y: position.y,
        offsetX: position.x,
        offsetY: position.y,
      } : layer))
    }
  }, [selectedLayerIndex])

  // Reset workflow to upload state
  const resetWorkflow = () => {
    setWorkflowState('upload')
    setSourceFile(null)
    setMediaUrl(null)
    setErrorMessage(null)
    setResultUrl(null)
    setTextSettings(prev => ({
      ...prev,
      text: 'Sample Text',
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 2,
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      x: 0,
      y: 0,
      maxWidthRatio: 0.95,
      lineHeight: 1.2,
      autoFit: true,
    }))
    setStartTime(0)
    setEndTime('')
    setLayers([])
    setSelectedLayerIndex(-1)
  }

  // Handle final process (API call)
  const handleFinalProcess = async () => {
    if (!mediaUrl) return
    setIsProcessing(true)
    setErrorMessage(null)
    setWorkflowState('processing')
    try {
      const formData = new FormData()
      if (uploadMethod === 'url') {
        formData.append('url', mediaUrl)
      } else {
        formData.append('file', sourceFile, sourceFile.name)
      }
      // Build layers payload (use existing layers or a single ephemeral layer)
      const preparedLayers = (layers.length > 0 ? layers : [{ ...textSettings, startTime, endTime }]).map((l, idx) => {
        const entry = {
          text: l.text || '',
          font_family: l.fontFamily || 'Arial',
          font_size: Number(l.fontSize || 24),
          color: l.color || '#ffffff',
          stroke_color: l.strokeColor || '#000000',
          stroke_width: Number(l.strokeWidth || 0),
          // Respect layer alignment from UI; provide offsets based on x/y if present
          horizontal_align: l.horizontalAlign || 'center',
          vertical_align: l.verticalAlign || 'middle',
          offset_x: Number((l.offsetX != null ? l.offsetX : l.x) || 0),
          offset_y: Number((l.offsetY != null ? l.offsetY : l.y) || 0),
          start_time: (l.startTime !== undefined ? l.startTime : startTime) ?? 0,
          end_time: (l.endTime !== undefined ? l.endTime : endTime) ?? '',
          animation_style: l.animationStyle || 'none',
          max_width_ratio: (l.maxWidthRatio ?? 0.95),
          line_height: (l.lineHeight ?? 1.2),
          auto_fit: (l.autoFit ?? true)
        }
        // Attach font file if provided
        if (l.customFontFile) {
          const field = `font_${idx}`
          formData.append(field, l.customFontFile, l.customFontFile.name)
          entry.font_field = field
        }
        return entry
      })
      formData.append('layers', JSON.stringify(preparedLayers))
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
      const response = await fetch(`${apiUrl}/api/add-text-layers`, {
        method: 'POST',
        body: formData
      })
      if (response.ok) {
        const data = await response.json()
        const taskId = data.task_id
        // Poll for task status
        let state = null
        let result = null
        let pollCount = 0
        const baseDelay = parseInt(import.meta.env.VITE_TASK_POLL_MS || '1500', 10)
        let delay = isNaN(baseDelay) ? 1500 : baseDelay
        while (pollCount < 60) { // up to 60s
          const statusResp = await fetch(`${apiUrl}/api/task-status/${taskId}`)
          if (statusResp.ok) {
            const statusData = await statusResp.json()
            state = statusData.state
            result = statusData.result
            if (state === 'SUCCESS' && result) break
            if (state === 'FAILURE') throw new Error(statusData.error || 'Processing failed.')
          }
          await new Promise(res => setTimeout(res, delay))
          delay = Math.min(delay + 250, 3000)
          pollCount++
        }
        if (state === 'SUCCESS' && result) {
          // Fetch the actual GIF from /api/download/<result>
          const downloadResp = await fetch(`${apiUrl}/api/download/${result}?proxy=1`)
          if (!downloadResp.ok) throw new Error('Failed to fetch result GIF.')
          const gifBlob = await downloadResp.blob()
          const url = URL.createObjectURL(gifBlob)
          setResultUrl({
            previewUrl: url,
            downloadUrl: `${apiUrl}/api/download/${result}?proxy=1`
          })
          setWorkflowState('result')
        } else {
          throw new Error('Timed out waiting for processing.')
        }
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || 'An unknown error occurred during processing.')
        setWorkflowState('editing')
      }
    } catch (error) {
      setErrorMessage(error.message || 'Network error or unexpected issue.')
      setWorkflowState('editing')
    } finally {
      setIsProcessing(false)
    }
  }

  // --- Render ---
  return (
    <ToolPageLayout
      title="Add Text to GIF"
      description="Add multiple captions, watermarks, and animated callouts to your GIFs in seconds. Upload custom fonts, control timing, and preview changes instantly."
      icon={Type}
      seoProps={{
        title: 'Add Text to GIF - Overlay Text on GIFs Online | EasyGIFMaker',
        description: 'Add text to GIFs with precise timing, custom fonts, outlines, and animations. Perfect for captions, memes, and branded overlays.',
        keywords: 'add text to gif, gif text overlay, gif captions, gif editor with text, custom font gif',
        canonical: 'https://easygifmaker.com/add-text',
        ogImage: 'https://easygifmaker.com/og-image.svg'
      }}
      toolKey="addText"
      adSlots={adSlots}
      midAdPosition={2}
    >
      {workflowState === 'upload' && (
        <UploadState
          title="Upload GIF"
          description="Select a GIF file or paste a direct GIF URL to start adding text."
          errorMessage={errorMessage}
          uploadMethod={uploadMethod}
          setUploadMethod={setUploadMethod}
          onFileSelect={(files) => handleFileUpload(files)}
          onUrlSubmit={(url) => handleFileUpload(null, url)}
          isProcessing={isProcessing}
          supportedFormats="Supported formats: GIF only"
          accept="image/gif"
          toolName="GIF"
          useGradient={false}
        />
      )}

      {workflowState === 'editing' && mediaUrl && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-800">GIF Preview & Text Editor</CardTitle>
                  <CardDescription className="text-gray-600">
                    Drag text on the canvas, stack layers, and fine-tune timing before export.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                    <div className="text-center">
                      <InteractiveCanvas
                        imageUrl={mediaUrl}
                        textLayers={layers.length > 0 ? layers : [{ ...textSettings }]}
                        onTextPositionChange={handleTextPositionChange}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">Text Layers</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const newLayer = { ...textSettings, startTime, endTime }
                            setLayers(prev => [...prev, newLayer])
                            setSelectedLayerIndex(layers.length)
                          }}
                        >
                          Add Layer
                        </Button>
                        {selectedLayerIndex >= 0 && (
                          <Button
                            variant="destructive"
                            onClick={() => {
                              setLayers(prev => prev.filter((_, index) => index !== selectedLayerIndex))
                              setSelectedLayerIndex(-1)
                            }}
                          >
                            Delete Selected
                          </Button>
                        )}
                      </div>
                    </div>
                    {layers.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {layers.map((layer, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`px-3 py-1 rounded border transition-colors ${index === selectedLayerIndex ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-200 hover:border-blue-300'}`}
                            onClick={() => {
                              setSelectedLayerIndex(index)
                              setTextSettings({ ...layer })
                              setStartTime(layer.startTime ?? 0)
                              setEndTime(layer.endTime ?? '')
                            }}
                          >
                            {(layer.text || 'Layer').slice(0, 16) || 'Layer'}
                            {layer.text && layer.text.length > 16 ? '…' : ''}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        No layers yet. Use “Add Layer” to capture the current settings.
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Layer Timing</span>
                      <span className="text-xs text-gray-500">GIF duration: {gifDuration.toFixed(2)}s • {gifFrameCount} frames</span>
                    </div>
                    <Slider.Root
                      className="relative flex items-center select-none touch-none w-full h-8"
                      min={0}
                      max={gifDuration}
                      step={0.01}
                      value={[Number(startTime), Number(endTime) || gifDuration]}
                      onValueChange={([start, end]) => {
                        const newStart = Number(start)
                        const newEnd = Number(end)
                        setStartTime(newStart)
                        setEndTime(newEnd)
                        if (selectedLayerIndex >= 0) {
                          setLayers(prev => prev.map((layer, index) => index === selectedLayerIndex ? { ...layer, startTime: newStart, endTime: newEnd } : layer))
                        }
                      }}
                      minStepsBetweenThumbs={1}
                      aria-label="Text timing range"
                    >
                      <Slider.Track className="bg-blue-200 relative grow rounded-full h-2">
                        <Slider.Range className="absolute bg-blue-500 rounded-full h-2" />
                      </Slider.Track>
                      <Slider.Thumb className="block w-5 h-5 bg-blue-600 rounded-full shadow-lg border-2 border-white focus:outline-none" />
                      <Slider.Thumb className="block w-5 h-5 bg-purple-600 rounded-full shadow-lg border-2 border-white focus:outline-none" />
                    </Slider.Root>
                    <div className="flex gap-4 mt-2">
                      <div className="flex-1">
                        <label htmlFor="start-time" className="block font-semibold mb-1 text-gray-800">Start time (seconds)</label>
                        <input
                          id="start-time"
                          type="number"
                          min="0"
                          max={Number(endTime) || gifDuration}
                          value={startTime}
                          onChange={(event) => {
                            const value = Math.max(0, Math.min(Number(event.target.value), Number(endTime) || gifDuration))
                            setStartTime(value)
                            if (selectedLayerIndex >= 0) {
                              setLayers(prev => prev.map((layer, index) => index === selectedLayerIndex ? { ...layer, startTime: value } : layer))
                            }
                          }}
                          className="w-full bg-white/90 rounded-lg px-3 py-2 text-base border border-gray-300"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="end-time" className="block font-semibold mb-1 text-gray-800">End time (seconds)</label>
                        <input
                          id="end-time"
                          type="number"
                          min={startTime}
                          max={gifDuration}
                          value={endTime}
                          onChange={(event) => {
                            const value = Math.max(Number(startTime), Math.min(Number(event.target.value), gifDuration))
                            setEndTime(value)
                            if (selectedLayerIndex >= 0) {
                              setLayers(prev => prev.map((layer, index) => index === selectedLayerIndex ? { ...layer, endTime: value } : layer))
                            }
                          }}
                          className="w-full bg-white/90 rounded-lg px-3 py-2 text-base border border-gray-300"
                          placeholder="(leave blank for end)"
                        />
                      </div>
                    </div>
                    {durationWarning && (
                      <div className="text-xs text-red-500 mt-2">
                        Could not auto-detect GIF duration. Defaulting to 10s. Timing may be inaccurate.
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={resetWorkflow}
                      variant="outline"
                      className="flex-1 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
                    >
                      Upload Different GIF
                    </Button>
                    <Button
                      onClick={handleFinalProcess}
                      disabled={isProcessing || !textSettings.text}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {isProcessing ? 'Processing...' : 'Add Text to GIF'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="min-w-0 space-y-6">
              <Card className="bg-gradient-to-br from-white to-indigo-50/30 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <Type className="h-5 w-5 text-white" />
                    </div>
                    Text Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TextSettingsPanel
                    textSettings={textSettings}
                    onSettingChange={handleSettingChange}
                    showAnimationDropdown
                  />
                </CardContent>
              </Card>

              <EnhancedTipsSection
                title="Pro tips for readable GIF captions"
                tips={[
                  '<strong>Keep it short.</strong> Two or three lines read faster than long paragraphs.',
                  '<strong>Add contrast.</strong> Use outlines or bold colours when text overlaps busy frames.',
                  '<strong>Stagger layers.</strong> Offset start/end times to build sequences or dialogue.',
                  '<strong>Test fonts.</strong> Upload brand fonts in .ttf/.otf for a consistent look.'
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {workflowState === 'processing' && (
        <ProcessingState
          title="Processing your GIF"
          description="Applying text overlays across every frame..."
        />
      )}

      {workflowState === 'result' && resultUrl && (
        <ResultSection
          title="Your GIF with text is ready!"
          description="Download the updated animation or tweak the settings and run another pass."
          imageUrl={resultUrl.previewUrl}
          downloadFileName="gif-with-text.gif"
          downloadUrl={resultUrl.downloadUrl}
          onReset={resetWorkflow}
        />
      )}
    </ToolPageLayout>
  )
}
