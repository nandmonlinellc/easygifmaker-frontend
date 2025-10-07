import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import DisplayAd from '@/components/ads/DisplayAd.jsx'
import InArticleAd from '@/components/ads/InArticleAd.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx'
import { Image, Settings } from 'lucide-react'
import FileUploadSection from '../components/FileUploadSection'
import ResultSection from '../components/ResultSection'
import GifConversionSettings from '../components/GifConversionSettings'
import EnhancedTipsSection from '../components/EnhancedTipsSection'
import ProcessingState from '../components/ProcessingState'
import UploadState from '../components/UploadState'
import ToolPageLayout from '../components/ToolPageLayout'
import FrameSequencePreview from '@/components/FrameSequencePreview.jsx'
import { getApiBase } from '@/lib/api'
import useTaskPolling from '@/hooks/useTaskPolling.js'
import { safeJson } from '@/utils/http.js'

export default function GifMakerTool() {
  // Workflow: upload, preview, processing, result
  const [workflowState, setWorkflowState] = useState('upload')
  const [uploadMethod, setUploadMethod] = useState('file')
  // Each frame: { file, url, duration, effect }
  const [frames, setFrames] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const pollTimerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [previewSpeed, setPreviewSpeed] = useState(1)
  const [resultUrl, setResultUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  // GIF settings
  const [gifSettings, setGifSettings] = useState({
    frameDuration: 500,
    loopCount: 0
  })

  // Add quality level state
  const [qualityLevel, setQualityLevel] = useState('high')
  // Transitions
  const [transitionType, setTransitionType] = useState('none')
  const [transitionSteps, setTransitionSteps] = useState(6)

  const { runTask, isProcessing: isPolling, reset: resetTask } = useTaskPolling({
    maxAttempts: 90,
    maxDelay: 3500
  })
  const busy = isProcessing || isPolling

  const adSlots = useMemo(() => ({
    header: <DisplayAd slot="1125232950" className="max-w-3xl w-full" />,
    mid: <InArticleAd slot="8336674411" className="max-w-2xl w-full" />,
    footer: <DisplayAd slot="1125232950" className="max-w-3xl w-full" />
  }), [])
  // Handle file or URL upload
  // Accepts files or an array of URLs
  const handleFileUpload = useCallback((files, urlInput = null) => {
    setErrorMessage(null)
    setResultUrl(null)
    let newFrames = []
    if (uploadMethod === 'url' && urlInput) {
      const urls = Array.isArray(urlInput) ? urlInput : [urlInput]
      newFrames = urls.map(url => ({ url, duration: gifSettings.frameDuration, effect: 'none' }))
    } else if (files && files.length > 0) {
      newFrames = Array.from(files).map(file => ({ file, duration: gifSettings.frameDuration, effect: 'none' }))
    }
    setFrames(newFrames)
    setWorkflowState('preview')
  }, [uploadMethod, gifSettings.frameDuration])

  // Add support for multiple URLs (optional, for parity with old UI)
  const handleAddUrl = (url) => {
    setFrames((prev) => [...prev, { url, duration: gifSettings.frameDuration, effect: 'none' }])
    setWorkflowState('preview')
  }

  // Remove a URL from the list
  const handleRemoveFrame = (index) => {
    setFrames((prev) => prev.filter((_, i) => i !== index))
  }

  // Reset workflow to upload state
  const resetWorkflow = useCallback(() => {
    resetTask()
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current)
      pollTimerRef.current = null
    }
    setWorkflowState('upload')
    setFrames([])
    setResultUrl(null)
    setErrorMessage(null)
    setIsProcessing(false)
    setElapsed(0)
  }, [resetTask])

  // Handle GIF creation
  const handleConvert = useCallback(async () => {
    if (!frames || frames.length === 0) return

    setErrorMessage(null)
    setResultUrl(null)
    setWorkflowState('processing')
    setIsProcessing(true)
    setElapsed(0)
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current)
      pollTimerRef.current = null
    }
    const startTs = Date.now()
    pollTimerRef.current = setInterval(() => setElapsed((Date.now() - startTs) / 1000), 500)

    const apiUrl = getApiBase()

    try {
      const resultKey = await runTask({
        startTask: async () => {
          const formData = new FormData()
          frames.forEach((frame) => {
            if (frame.file) {
              formData.append('files', frame.file)
            } else if (frame.url) {
              formData.append('urls', frame.url)
            }
          })
          formData.append('frame_durations', JSON.stringify(frames.map(f => f.duration)))
          formData.append('effects', JSON.stringify(frames.map(f => f.effect)))
          formData.append('loop_count', gifSettings.loopCount.toString())
          formData.append('quality_level', qualityLevel)
          formData.append('transition_type', transitionType)
          formData.append('transition_steps', String(transitionSteps))

          const response = await fetch(`${apiUrl}/api/gif-maker`, {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            const errorData = await safeJson(response)
            throw new Error(errorData.error || 'Failed to start GIF creation task.')
          }

          const data = await safeJson(response)
          if (!data?.task_id) {
            throw new Error('No task_id returned from backend.')
          }
          return { taskId: data.task_id }
        },
        pollTask: async (taskId) => {
          const statusResp = await fetch(`${apiUrl}/api/task-status/${taskId}`)
          if (!statusResp.ok) {
            throw new Error('Failed to fetch task status.')
          }
          return statusResp.json()
        },
        isSuccess: (payload) => {
          const stateSuccess = payload?.state === 'SUCCESS'
          const statusSuccess = payload?.status === 'Task completed!'
          return (stateSuccess || statusSuccess) && payload?.result
        },
        isFailure: (payload) => payload?.state === 'FAILURE',
        extractResult: (payload) => payload?.result
      })

      let gifPath = null
      if (typeof resultKey === 'string') {
        gifPath = resultKey
      } else if (Array.isArray(resultKey)) {
        gifPath = resultKey[0]
      } else if (resultKey && typeof resultKey === 'object') {
        gifPath = resultKey.gif || resultKey.path || null
      }

      if (!gifPath) {
        throw new Error('GIF generation completed but returned no file path.')
      }

      const downloadResp = await fetch(`${apiUrl}/api/download/${gifPath}?proxy=1`)
      if (!downloadResp.ok) {
        throw new Error('Failed to fetch generated GIF.')
      }
      const gifBlob = await downloadResp.blob()
      const url = URL.createObjectURL(gifBlob)
      setResultUrl({
        previewUrl: url,
        downloadUrl: `${apiUrl}/api/download/${gifPath}?proxy=1`
      })
      if (window.gtag) {
        window.gtag('event', 'conversion', {
          send_to: 'AW-355581212/jpJHCIiCqI8DEJz6xqkB',
          value: 1.0,
          currency: 'USD',
          transaction_id: ''
        })
      }
      setWorkflowState('result')
    } catch (error) {
      setErrorMessage(error.message || 'Network error or unexpected issue.')
      setWorkflowState('preview')
    } finally {
      setIsProcessing(false)
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current)
        pollTimerRef.current = null
      }
    }
  }, [frames, gifSettings.loopCount, qualityLevel, runTask, transitionSteps, transitionType])

  // Settings panel change handler
  const handleSettingsChange = (key, value) => {
    setGifSettings(prev => ({ ...prev, [key]: value }))
  }

  // Drag-and-drop state and handlers
  const [draggedIdx, setDraggedIdx] = useState(null)
  const handleDragStart = idx => setDraggedIdx(idx)
  const handleDragOver = idx => e => {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === idx) return
    setFrames(frames => {
      const updated = [...frames]
      const [removed] = updated.splice(draggedIdx, 1)
      updated.splice(idx, 0, removed)
      return updated
    })
    setDraggedIdx(idx)
  }
  const handleDragEnd = () => setDraggedIdx(null)

  // Accessible move helpers
  const moveFrame = (from, to) => {
    if (from === to || from < 0 || to < 0 || from >= frames.length || to >= frames.length) return
    setFrames(prev => {
      const updated = [...prev]
      const [item] = updated.splice(from, 1)
      updated.splice(to, 0, item)
      return updated
    })
  }
  const [announce, setAnnounce] = useState('')
  const announceMove = (i, dir) => {
    const to = i + (dir === 'left' ? -1 : 1)
    moveFrame(i, to)
    const msg = `Moved image ${i + 1} to position ${to + 1}`
    setAnnounce(msg)
    setTimeout(() => setAnnounce(''), 600)
  }
  // Stable thumbnail object URLs (no revoke in dev to avoid StrictMode issues)
  const thumbUrlMapRef = useRef(new Map())
  const getThumbSrc = (frame) => {
    if (frame?.file instanceof File) {
      let u = thumbUrlMapRef.current.get(frame.file)
      if (!u) {
        try { u = URL.createObjectURL(frame.file); thumbUrlMapRef.current.set(frame.file, u) } catch {}
      }
      return u
    }
    return frame?.url
  }

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current)
        pollTimerRef.current = null
      }
      resetTask()
    }
  }, [resetTask])

  // --- Render ---
  return (
    <>
    <ToolPageLayout
      title="GIF Maker"
      description="Arrange images or URLs, fine-tune timing, and export high-quality GIF loops in minutes."
      icon={Image}
      seoProps={{
        title: 'GIF Maker Online | EasyGIFMaker',
        description: 'Upload images or paste URLs, adjust frame timing and transitions, and export a polished animated GIF ready to share.',
        keywords: 'gif maker, make a gif, gif creator, create gif from images, gif maker online',
        canonical: 'https://easygifmaker.com/gif-maker',
        ogImage: 'https://easygifmaker.com/og-image.svg'
      }}
      toolKey="gifMaker"
      adSlots={adSlots}
      midAdPosition={2}
    >
          {/* Upload State */}
          {workflowState === 'upload' && (
            <UploadState
              title="Upload Images"
              description="Select images or provide URLs to create your animated GIF"
              errorMessage={errorMessage}
              uploadMethod={uploadMethod}
              setUploadMethod={setUploadMethod}
              onFileSelect={(files) => handleFileUpload(files)}
              onUrlSubmit={(urls) => handleFileUpload(null, urls)}
              isProcessing={busy}
              supportedFormats="Supported formats: JPG, PNG, GIF, WebP, APNG, HEIC, HEIF, MNG, JP2, AVIF, JXL, BMP, PDF"
              accept="image/*"
              toolName="Image"
              useGradient={false}
              isMultiple={true}
              isMultipleUrl={true}
              urlList={frames.filter(f => f.url).map(f => f.url)}
              setUrlList={urls => {
                setFrames(urls.map(url => ({ url, duration: gifSettings.frameDuration, effect: 'none' })));
              setWorkflowState('preview');
            }}
          />
          )}

          {/* Preview State */}
          {workflowState === 'preview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Preview Section */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-800">Preview Selected Images</CardTitle>
                    <CardDescription className="text-gray-600">
                      Drag and drop to reorder images. The order determines your GIF sequence.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Live Playback Preview */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-800">Live Preview</div>
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1 rounded border" onClick={() => setIsPlaying(p => !p)} aria-pressed={isPlaying}>
                            {isPlaying ? 'Pause' : 'Play'}
                          </button>
                          <label className="text-sm text-gray-600" htmlFor="previewSpeed">Speed</label>
                          <select id="previewSpeed" className="border rounded px-2 py-1 text-sm" value={previewSpeed} onChange={e => setPreviewSpeed(parseFloat(e.target.value))}>
                            <option value={0.5}>0.5x</option>
                            <option value={1}>1x</option>
                            <option value={2}>2x</option>
                          </select>
                        </div>
                      </div>
                      <FrameSequencePreview frames={frames} playing={isPlaying} speed={previewSpeed} loopCount={gifSettings.loopCount || 0} height={260} />
                    </div>
                    {/* Enhanced Preview Grid */}
                    <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {frames.map((frame, idx) => (
                          <div
                            key={idx}
                            className="relative group transform transition-all duration-300 hover:scale-105 focus:outline focus:outline-2 focus:outline-blue-500"
                            draggable
                            onDragStart={() => handleDragStart(idx)}
                            onDragOver={handleDragOver(idx)}
                            onDragEnd={handleDragEnd}
                            onDrop={handleDragEnd}
                            tabIndex={0}
                            role="listitem"
                            aria-label={`Image ${idx + 1}`}
                            onKeyDown={(e) => {
                              if (e.key === 'ArrowLeft') { e.preventDefault(); if (idx > 0) announceMove(idx, 'left') }
                              if (e.key === 'ArrowRight') { e.preventDefault(); if (idx < frames.length - 1) announceMove(idx, 'right') }
                            }}
                          >
                            <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                              <img
                                src={getThumbSrc(frame)}
                                alt={frame.file ? frame.file.name : `URL #${idx + 1}`}
                                className="w-full h-28 object-cover transition-transform duration-300 group-hover:scale-110"
                                loading="lazy"
                                style={{ pointerEvents: 'auto' }}
                                title={`${frame.file ? frame.file.name : `Image ${idx + 1}`} - Drag to reorder`}
                              />
                              <div className="absolute bottom-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition" style={{ pointerEvents: 'auto' }}>
                                <button className="px-2 py-1 text-xs rounded bg-white/80 border" onClick={() => announceMove(idx, 'left')} aria-label={`Move image ${idx + 1} left`} disabled={idx === 0}>
                                  ←
                                </button>
                                <button className="px-2 py-1 text-xs rounded bg-white/80 border" onClick={() => announceMove(idx, 'right')} aria-label={`Move image ${idx + 1} right`} disabled={idx === frames.length - 1}>
                                  →
                                </button>
                              </div>
                              <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                                {idx + 1}
                              </div>
                              <div className="absolute top-2 right-2 flex flex-col gap-1">
                                <input
                                  type="number"
                                  min="50"
                                  max="5000"
                                  value={frame.duration}
                                  onChange={e => {
                                    const val = parseInt(e.target.value, 10)
                                    setFrames(frames => frames.map((f, i) => i === idx ? { ...f, duration: val } : f))
                                  }}
                                  className="w-16 px-1 py-0.5 rounded bg-white/80 text-xs text-gray-800 border border-gray-200 shadow-sm z-10"
                                  title="Frame duration (ms)"
                                  style={{ pointerEvents: 'auto' }}
                                />
                                <select
                                  value={frame.effect}
                                  onChange={e => setFrames(frames => frames.map((f, i) => i === idx ? { ...f, effect: e.target.value } : f))}
                                  className="w-16 px-1 py-0.5 rounded bg-white/80 text-xs text-gray-800 border border-gray-200 shadow-sm z-10"
                                  title="Frame effect"
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  <option value="none">None</option>
                                  <option value="fade">Fade</option>
                                  <option value="zoom">Zoom</option>
                                </select>
                              </div>
                              <button
                                onClick={() => handleRemoveFrame(idx)}
                                className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-600"
                                title="Remove frame"
                              >
                                Remove
                              </button>
                              <div
                                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-2"
                                style={{ pointerEvents: 'none' }}
                              >
                                <div className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-full">
                                  Drag to reorder
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="sr-only" role="status" aria-live="polite">{announce}</div>
                      <div className="mt-4 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-700 font-medium shadow-sm">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          {frames.length} images selected
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button onClick={resetWorkflow} variant="outline" className="flex-1 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300">
                        Upload Different Images
                      </Button>
                      <Button 
                        onClick={handleConvert}
                        disabled={busy || frames.length === 0}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {busy ? 'Processing...' : 'Create GIF'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Settings Panel */}
              <div>
                <Card className="bg-gradient-to-br from-white to-indigo-50/30 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <Settings className="h-5 w-5 text-white" />
                      </div>
                      GIF Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                        <label htmlFor="frame-duration" className="block font-semibold mb-3 text-gray-800 text-base">
                          Frame Duration
                          <span className="text-sm text-gray-500 ml-2 font-normal">(milliseconds)</span>
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 relative">
                            <input
                              id="frame-duration"
                              type="range"
                              min="100"
                              max="2000"
                              step="50"
                              value={gifSettings.frameDuration}
                              onChange={e => handleSettingsChange('frameDuration', parseInt(e.target.value, 10))}
                              className="w-full h-3 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full appearance-none cursor-pointer slider-thumb-blue"
                            />
                            <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                              <span className="font-medium">Fast</span>
                              <span className="font-medium">Slow</span>
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              value={gifSettings.frameDuration}
                              onChange={e => handleSettingsChange('frameDuration', parseInt(e.target.value, 10))}
                              min="100"
                              max="2000"
                              className="w-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-semibold text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border border-white/30"
                            />
                            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">ms</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                          Controls animation speed. Lower values create faster, more energetic animations, while higher values create slower, more dramatic effects.
                        </p>
                      </div>
                      {/* Transition Settings */}
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                        <label className="block font-semibold mb-3 text-gray-800 text-base">
                          Transition Between Images
                        </label>
                        <div className="flex items-center gap-3 mb-2">
                          <select className="border rounded px-3 py-2" value={transitionType} onChange={(e) => setTransitionType(e.target.value)}>
                            <option value="none">None</option>
                            <option value="crossfade">Crossfade</option>
                          </select>
                          {transitionType !== 'none' && (
                            <>
                              <label className="text-sm text-gray-600" htmlFor="transitionSteps">Steps</label>
                              <input id="transitionSteps" type="number" min={2} max={12} value={transitionSteps} onChange={(e) => setTransitionSteps(Math.max(2, Math.min(12, parseInt(e.target.value || '6', 10))))} className="w-20 border rounded px-2 py-1" />
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">Crossfade inserts blended frames between images. More steps = smoother transition, larger file.</p>
                      </div>
                      
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                        <label htmlFor="loop-count" className="block font-semibold mb-3 text-gray-800 text-base">
                          Loop Count
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 relative">
                            <input
                              id="loop-count"
                              type="range"
                              min="0"
                              max="10"
                              step="1"
                              value={gifSettings.loopCount}
                              onChange={e => handleSettingsChange('loopCount', parseInt(e.target.value, 10))}
                              className="w-full h-3 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 rounded-full appearance-none cursor-pointer slider-thumb-green"
                            />
                            <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                              <span className="font-medium">Infinite</span>
                              <span className="font-medium">10x</span>
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              value={gifSettings.loopCount}
                              onChange={e => handleSettingsChange('loopCount', parseInt(e.target.value, 10))}
                              min="0"
                              className="w-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-semibold text-base shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none border border-white/30"
                            />
                            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">loops</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                          0 = infinite loop (recommended), higher numbers = limited loops. Perfect for creating GIFs that play continuously or stop after a few cycles.
                        </p>
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                        <label htmlFor="quality-level" className="block font-semibold mb-3 text-gray-800 text-base">
                          Quality Level
                        </label>
                        <select 
                          id="quality-level"
                          value={qualityLevel} 
                          onChange={(e) => setQualityLevel(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm"
                        >
                          <option value="low">Low Quality (Smaller File)</option>
                          <option value="medium">Medium Quality</option>
                          <option value="high">High Quality (Recommended)</option>
                          <option value="ultra">Ultra Quality (Best)</option>
                        </select>
                        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                          Higher quality produces better colors and sharper images, but may result in larger file sizes.
                        </p>
                      </div>
                      </div>
                    </div>
                    <EnhancedTipsSection

          
                      title="Pro Tips for Perfect GIFs"
                      tips={[
                        "<strong>Frame Duration</strong> 200-500ms works well for most animations. Faster for energetic content, slower for dramatic effects.",
                        "<strong>Loop Count</strong> 0 (infinite) is perfect for most use cases. Use limited loops for special effects.",
                        "<strong>Image Order</strong> Drag to reorder for the perfect sequence. The order determines your GIF's story.",
                        "<strong>File Size</strong> More images = larger GIF. Consider optimization for faster sharing.",
                        "<strong>Quality</strong> Higher resolution images = better quality GIFs. Balance quality with file size.",
                        "<strong>Preview</strong> Use the preview to see your animation before downloading. Make adjustments as needed!"
                      ]}
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
              description="Creating your animated GIF..."
              elapsedSeconds={elapsed}
              useGradient={false}
            />
          )}

          {/* Result State */}
          {workflowState === 'result' && resultUrl && (
            <ResultSection
              title="Your GIF is Ready!"
              description="Your animated GIF has been successfully generated."
              imageUrl={resultUrl.previewUrl}
              downloadFileName="created.gif"
              downloadUrl={resultUrl.downloadUrl}
              onReset={resetWorkflow}
            />
          )}

      </ToolPageLayout>
    </>
  )
}
