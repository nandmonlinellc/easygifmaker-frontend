import React, { useState, useCallback, useRef } from 'react'
import DisplayAd from '@/components/ads/DisplayAd.jsx';
import InArticleAd from '@/components/ads/InArticleAd.jsx';import * as Slider from '@radix-ui/react-slider'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Type, Settings } from 'lucide-react'
import InteractiveCanvas from '../components/InteractiveCanvas'
import ResultSection from '../components/ResultSection'
import TextSettingsPanel from '../components/TextSettingsPanel'
import FileUploadSection from '../components/FileUploadSection'
import SocialSharingSection from '../components/SocialSharingSection'
import TroubleshootingSection from '../components/TroubleshootingSection'
import TipsFaqsBestPracticesSection from '../components/TipsFaqsBestPracticesSection'
import ToolSeoSection from '../components/ToolSeoSection'
import HowToUseSection from '../components/HowToUseSection'
import ProcessingState from '../components/ProcessingState'
import UploadState from '../components/UploadState'
import ToolPageLayout from '../components/ToolPageLayout'
          {/* Bottom Ad - Before value content */}
          <div className="my-8 flex justify-center">
            <DisplayAd 
              slot="1125232950"
              className="max-w-3xl w-full"
            />
          </div>
import ValueContentSection from '../components/ValueContentSection'
import AdsenseAd from '../components/AdsenseAd'

export default function AddTextTool() {
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001'
  const [workflowState, setWorkflowState] = useState('upload') // 'upload', 'editing', 'processing', 'result'
  const [uploadMethod, setUploadMethod] = useState('file')
  const [sourceFile, setSourceFile] = useState(null) // To hold the original file
  const [mediaUrl, setMediaUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 })
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
  const imageRef = useRef(null)

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
  }, [])

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
    setTextSettings(prev => ({
      ...prev,
      x: position.x,
      y: position.y
    }))
    if (selectedLayerIndex >= 0) {
      setLayers(curr => curr.map((layer, idx) => idx === selectedLayerIndex ? { ...layer, x: position.x, y: position.y } : layer))
    }
  }, [])

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
          horizontal_align: l.horizontalAlign || 'center',
          vertical_align: l.verticalAlign || 'middle',
          offset_x: Number(l.offsetX || 0),
          offset_y: Number(l.offsetY || 0),
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
        while (pollCount < 60) { // up to 60s
          const statusResp = await fetch(`${apiUrl}/api/task-status/${taskId}`)
          if (statusResp.ok) {
            const statusData = await statusResp.json()
            state = statusData.state
            result = statusData.result
            if (state === 'SUCCESS' && result) break
            if (state === 'FAILURE') throw new Error(statusData.error || 'Processing failed.')
          }
          await new Promise(res => setTimeout(res, 1000))
          pollCount++
        }
        if (state === 'SUCCESS' && result) {
          // Fetch the actual GIF from /api/download/<result>
          const downloadResp = await fetch(`${apiUrl}/api/download/${result}`)
          if (!downloadResp.ok) throw new Error('Failed to fetch result GIF.')
          const gifBlob = await downloadResp.blob()
          const url = URL.createObjectURL(gifBlob)
          setResultUrl({
            previewUrl: url,
            downloadUrl: `${apiUrl}/api/download/${result}`
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
    <>
      <ToolPageLayout
        title="Add Text to GIF"
        description="Add multiple text layers, captions, and watermarks to GIFs online. Customize fonts (including custom uploads), colors, position, timing, and animations. Free online GIF text editor."
        icon={Type}
        seoProps={{
          title: "Add Text to GIF - Overlay Text on GIFs Online | EasyGIFMaker",
          description: "Add multiple text layers, upload custom fonts, and control per-layer timing and animations. Precise alignment, max-width wrapping, and auto-fit for perfect captions and watermarks.",
          keywords: "add text to gif, multiple text layers gif, custom fonts gif, gif text editor, gif caption, gif watermark, text overlay gif, animated text gif, line height, max width",
          canonical: "https://easygifmaker.com/add-text"
        }}
      >
        <HowToUseSection
          title="How to Add Text to GIFs"
          steps={[
            {
              title: "Upload your GIF",
              description: "Select a GIF file or enter a GIF URL to add text to."
            },
            {
              title: "Customize text properties",
              description: "Set font, size, color, position, and animation effects."
            },
            {
              title: "Position text precisely",
              description: "Use the interactive canvas to position your text perfectly."
            },
            {
              title: "Download your enhanced GIF",
              description: "Get your GIF with professional text overlay!"
            }
          ]}
        />

  {/* Value content moved to end of page */}

         {/* Upload State */}
          {workflowState === 'upload' && (
            <UploadState
              title="Upload GIF"
              description="Select a GIF file or enter a GIF URL to add text overlay"
              errorMessage={errorMessage}
              uploadMethod={uploadMethod}
              setUploadMethod={setUploadMethod}
              onFileSelect={(files) => handleFileUpload(files)}
              onUrlSubmit={(url) => handleFileUpload(null, url)}
              isProcessing={isProcessing}
              supportedFormats="Supported formats: GIF only"
              accept="image/gif"
              toolName="GIF"
            />
          )}

          {/* Editing State */}
          {workflowState === 'editing' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* GIF Preview and Text Editor */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white md:text-xl sm:text-lg">GIF Preview & Text Editor</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-200">
                      Add and customize text overlay on your GIF
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                      <div className="text-center">
                        <InteractiveCanvas
                          imageUrl={mediaUrl}
                          textLayers={(layers && layers.length > 0) ? layers : [{ ...textSettings }]}
                          onTextPositionChange={handleTextPositionChange}
                        />
                      </div>
                    </div>
                    {/* Simple Layers Manager */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800 dark:text-white">Text Layers</span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              const newLayer = {
                                ...textSettings,
                                startTime,
                                endTime,
                              }
                              setLayers(prev => [...prev, newLayer])
                              setSelectedLayerIndex(layers.length)
                            }}
                          >Add Layer</Button>
                          {selectedLayerIndex >= 0 && (
                            <Button
                              variant="destructive"
                              onClick={() => {
                                setLayers(prev => prev.filter((_, i) => i !== selectedLayerIndex))
                                setSelectedLayerIndex(-1)
                              }}
                            >Delete Selected</Button>
                          )}
                        </div>
                      </div>
                      {layers.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {layers.map((l, i) => (
                            <button
                              key={i}
                              className={`px-3 py-1 rounded border ${i === selectedLayerIndex ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}
                              onClick={() => {
                                setSelectedLayerIndex(i)
                                setTextSettings({ ...l })
                                setStartTime(l.startTime ?? 0)
                                setEndTime(l.endTime ?? '')
                              }}
                            >{(l.text || 'Layer').slice(0, 16) || 'Layer'}{l.text && l.text.length > 16 ? '…' : ''}</button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">No layers yet. Use "Add Layer" to create one from current settings.</div>
                      )}
                    </div>
                    {/* Start/End Time Controls with Slider */}
                    <div className="mb-4">
                      <div className="mb-2 flex justify-between items-center">
                        <span className="font-semibold text-gray-800 dark:text-white">Layer Timing</span>
                        <span className="text-xs text-gray-500 dark:text-gray-300">GIF duration: {gifDuration.toFixed(2)}s, {gifFrameCount} frames</span>
                      </div>
                      <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-8"
                        min={0}
                        max={gifDuration}
                        step={0.01}
                        value={[Number(startTime), Number(endTime) || gifDuration]}
                        onValueChange={([start, end]) => {
                          const s = Number(start)
                          const e = Number(end)
                          setStartTime(s)
                          setEndTime(e)
                          if (selectedLayerIndex >= 0) {
                            setLayers(curr => curr.map((layer, idx) => idx === selectedLayerIndex ? { ...layer, startTime: s, endTime: e } : layer))
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
                          <label htmlFor="start-time" className="block font-semibold mb-1 text-gray-800 dark:text-white">Start Time (seconds)</label>
                          <input
                            id="start-time"
                            type="number"
                            min="0"
                            max={Number(endTime) || gifDuration}
                            value={startTime}
                            onChange={e => setStartTime(Math.max(0, Math.min(Number(e.target.value), Number(endTime) || gifDuration)))}
                            className="w-full bg-white/90 rounded-lg px-3 py-2 text-base border border-gray-300"
                            placeholder="0"
                          />
                        </div>
                        <div className="flex-1">
                          <label htmlFor="end-time" className="block font-semibold mb-1 text-gray-800 dark:text-white">End Time (seconds, optional)</label>
                          <input
                            id="end-time"
                            type="number"
                            min={startTime}
                            max={gifDuration}
                            value={endTime}
                            onChange={e => {
                              const val = Math.max(Number(startTime), Math.min(Number(e.target.value), gifDuration))
                              setEndTime(val)
                              if (selectedLayerIndex >= 0) {
                                setLayers(curr => curr.map((layer, idx) => idx === selectedLayerIndex ? { ...layer, endTime: val } : layer))
                              }
                            }}
                            className="w-full bg-white/90 rounded-lg px-3 py-2 text-base border border-gray-300"
                            placeholder="(leave blank for end of GIF)"
                          />
                        </div>
                      </div>
                      {durationWarning && (
                        <div className="text-xs text-red-500 mt-2">Could not auto-detect GIF duration. Defaulting to 10s. Timing may be inaccurate.</div>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={resetWorkflow} variant="outline" className="flex-1 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300">
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
              {/* Text Settings Panel */}
              <div>
                <Card className="bg-gradient-to-br from-white to-indigo-50/30 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
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
                      showAnimationDropdown={true}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Processing State */}
          {workflowState === 'processing' && (
            <ProcessingState
              title="Processing Your GIF"
              description="Adding text overlay to your GIF..."
            />
          )}

          {/* Result State */}
          {workflowState === 'result' && resultUrl && (
            <ResultSection
              title="Your GIF with Text is Ready!"
              description="Your GIF has been successfully updated with text overlay."
              imageUrl={resultUrl.previewUrl}
              downloadFileName="gif-with-text.gif"
              downloadUrl={resultUrl.downloadUrl}
              onReset={resetWorkflow}
            />
          )}

        <ToolSeoSection
          icon={Type}
          title="Add Text to GIF"
          description1="Transform your GIFs with layered text overlays. Add multiple captions, watermarks, and callouts with per-layer timing and animation."
          description2="Customize fonts (including uploads), colors, sizes, alignment, and wrapping. Fine-tune line height, max text width, and auto-fit for crisp, readable captions."
          features1={[
            { emoji: "🧩", text: "Multiple text layers with per-layer settings" },
            { emoji: "🔤", text: "Custom fonts (.ttf/.otf) per layer" },
            { emoji: "🎞️", text: "Per-layer timing and simple animations" }
          ]}
          features2={[
            { emoji: "📐", text: "Max width wrapping, line height, and auto-fit" },
            { emoji: "⚡", text: "Real-time preview and editing" },
            { emoji: "💎", text: "High-quality output preservation" }
          ]}
          useCases={[
            { color: "bg-yellow-400", text: "Add captions and subtitles to GIFs" },
            { color: "bg-green-400", text: "Create branded watermarks with custom fonts" },
            { color: "bg-blue-400", text: "Add funny text and memes to GIFs" },
            { color: "bg-purple-400", text: "Create promotional content with layered callouts" }
          ]}
        />
        <AdsenseAd adSlot="8336674411" adFormat="fluid" adLayout="in-article" />
          
        <TipsFaqsBestPracticesSection 
          proTips={[
            {
              color: "bg-blue-500",
              text: "Use Max Text Width and Line Height for readable multi-line captions. Keep Auto-Fit on for smaller GIFs."
            },
            {
              color: "bg-green-500",
              text: "Prefer short, punchy lines. Multiple short layers often read better than one long paragraph."
            },
            {
              color: "bg-purple-500",
              text: "Use alignment + offsets to avoid busy regions. Center alignment works well for captions."
            },
            {
              color: "bg-orange-500",
              text: "Stagger layer timing for storytelling. Simple animations (fade/slide) add polish without distraction."
            }
          ]}
          faqs={[
            {
              question: "What text formats are supported?",
              answer: "All standard text characters, emojis, and special characters."
            },
            {
              question: "Can I add multiple text elements?",
              answer: "Yes. Add multiple text layers, each with its own font, styling, position, timing, and animation."
            },
            {
              question: "Can I upload custom fonts?",
              answer: "Yes. Upload .ttf or .otf for a layer. If a font can’t be loaded, we’ll fall back to a safe font to keep text legible."
            },
            {
              question: "Will the text quality be preserved?",
              answer: "Yes, we maintain high quality while adding text overlay."
            },
            {
              question: "Is there a text length limit?",
              answer: "No hard limit. For readability, keep lines short and use wrapping with Max Text Width and Line Height."
            },
            {
              question: "Why isn’t my layer visible?",
              answer: "Check timing (start/end), color contrast, and alignment/offsets. Also ensure the animation isn’t mid-fade at that moment."
            }
          ]}
          relatedResources={[
            {
              href: "/blog/add-text-to-gifs-guide",
              icon: "📝",
              text: "Adding Text to GIFs Guide"
            },
            {
              href: "/blog/top-5-gif-optimization-tips",
              icon: "⚡",
              text: "Top 5 GIF Optimization Tips"
            }
          ]}
        />

        <TroubleshootingSection 
          commonIssues={[
            {
              color: "bg-yellow-500",
              text: "If a layer isn’t visible, verify its timing range, color contrast, and alignment/offsets."
            },
            {
              color: "bg-orange-500",
              text: "If upload fails, check your file format (GIF only) and file size. For custom fonts, use .ttf or .otf."
            },
            {
              color: "bg-red-500",
              text: "Still having issues?",
              link: "/contact"
            }
          ]}
          quickFixes={[
            {
              icon: "🎨",
              text: "Use high contrast colors and a subtle stroke for clarity"
            },
            {
              icon: "📏",
              text: "Use Auto-Fit and Max Width to fit within the frame"
            },
            {
              icon: "📍",
              text: "Use alignment + offsets to avoid busy areas"
            }
          ]}
        />

        <SocialSharingSection 
          title="Share Your GIF!"
          description="Share your new GIF with text on Instagram, Twitter, TikTok, Facebook, or embed it in your blog or website. Tag us with #EasyGIFMaker for a chance to be featured!"
        />

        {/* Value Content Section (moved to end) */}
          {/* Bottom Ad - Before value content */}
          <div className="my-8 flex justify-center">
            <DisplayAd 
              slot="1125232950"
              className="max-w-3xl w-full"
            />
          </div>
        <ValueContentSection
          toolTitle="Add Text to GIF"
          relatedLinks={[
            { href: '/blog/master-the-art-of-adding-text-to-gifs', label: 'Master the Art of Adding Text to GIFs' },
            { href: '/blog/creative-gif-design-tutorial', label: 'Creative GIF Design Tutorial' }
          ]}
          altTools={[
            { href: '/gif-maker', label: 'GIF Maker', desc: 'Create GIFs from images or short clips.' },
            { href: '/resize', label: 'Resize GIF', desc: 'Make your GIF fit any platform.' },
            { href: '/optimize', label: 'Optimize GIF', desc: 'Reduce size for faster sharing.' }
          ]}
        />
      </ToolPageLayout>
    </>
  )
}
