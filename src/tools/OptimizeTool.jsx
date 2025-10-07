import React, { useState, useCallback, useMemo } from 'react'
import DisplayAd from '@/components/ads/DisplayAd.jsx'
import InArticleAd from '@/components/ads/InArticleAd.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { RotateCw, Zap } from 'lucide-react'
import ResultSection from '../components/ResultSection'
import EnhancedTipsSection from '../components/EnhancedTipsSection'
import ProcessingState from '../components/ProcessingState'
import UploadState from '../components/UploadState'
import ToolPageLayout from '../components/ToolPageLayout'
import useTaskPolling from '@/hooks/useTaskPolling.js'
import { safeJson } from '@/utils/http.js'

const DEFAULT_SETTINGS = {
  quality: 80,
  colors: 256,
  lossy: 20,
  dither: 'floyd-steinberg',
  optimize_level: 3
}

export default function OptimizeTool() {
  const [workflowState, setWorkflowState] = useState('upload')
  const [uploadMethod, setUploadMethod] = useState('file')
  const [mediaUrl, setMediaUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [originalSize, setOriginalSize] = useState(null)
  const [optimizedSize, setOptimizedSize] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  const { runTask, isProcessing: isPolling, reset: resetTask } = useTaskPolling()
  const busy = isProcessing || isPolling

  const adSlots = useMemo(() => ({
    header: <DisplayAd slot="1125232950" className="max-w-3xl w-full" />,
    mid: <InArticleAd slot="8336674411" className="max-w-2xl w-full" />,
    footer: <DisplayAd slot="1125232950" className="max-w-3xl w-full" />
  }), [])

  const estimatedReduction = useMemo(() => {
    const quality = Math.min(100, Math.max(1, settings.quality))
    const colors = Math.min(256, Math.max(2, settings.colors))
    const lossy = Math.min(100, Math.max(0, settings.lossy))
    let estimate = 0.15 + 0.004 * (100 - quality) + 0.0015 * (256 - colors) + 0.006 * lossy
    return Math.max(0.05, Math.min(0.85, estimate))
  }, [settings])

  const estimatedSizeKB = useMemo(() => {
    if (!originalSize) return null
    const estSize = Math.max(1, Math.round(originalSize * (1 - estimatedReduction)))
    return estSize / 1024
  }, [originalSize, estimatedReduction])

  const handleFileUpload = useCallback((files, urlInput = null) => {
    if ((!files || files.length === 0) && !urlInput) return
    setErrorMessage(null)
    setResultUrl(null)
    setOptimizedSize(null)

    let url
    if (uploadMethod === 'url' && urlInput) {
      url = urlInput
    } else if (files && files[0]) {
      url = URL.createObjectURL(files[0])
    }

    if (!url) return

    setMediaUrl(url)
    setWorkflowState('editing')
    setSettings({ ...DEFAULT_SETTINGS })

    try {
      if (uploadMethod === 'url' && urlInput) {
        fetch(urlInput, { method: 'HEAD' }).then(res => {
          const len = res.headers.get('content-length')
          if (len) setOriginalSize(parseInt(len, 10))
        }).catch(() => {})
      } else if (files && files[0]) {
        setOriginalSize(files[0].size)
      }
    } catch {}
  }, [uploadMethod])

  const handleProcess = useCallback(async () => {
    if (!mediaUrl) return
    setErrorMessage(null)
    setIsProcessing(true)
    setResultUrl(null)
    setWorkflowState('processing')

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'

    try {
      const resultKey = await runTask({
        startTask: async () => {
          const formData = new FormData()
          if (uploadMethod === 'url') {
            formData.append('url', mediaUrl)
          } else {
            const response = await fetch(mediaUrl)
            const blob = await response.blob()
            formData.append('file', blob, 'image.gif')
          }
          formData.append('quality', settings.quality.toString())
          formData.append('colors', settings.colors.toString())
          formData.append('lossy', settings.lossy.toString())
          formData.append('dither', settings.dither)
          formData.append('optimize_level', settings.optimize_level.toString())

          const response = await fetch(`${apiUrl}/api/optimize`, {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            const errorData = await safeJson(response)
            throw new Error(errorData.error || 'Failed to start optimisation task.')
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

      const downloadResp = await fetch(`${apiUrl}/api/download/${resultKey}?proxy=1`)
      if (!downloadResp.ok) {
        throw new Error('Failed to fetch optimised GIF.')
      }
      const gifBlob = await downloadResp.blob()
      const url = URL.createObjectURL(gifBlob)
      try {
        setOptimizedSize(gifBlob.size)
      } catch {}
      setResultUrl({
        previewUrl: url,
        downloadUrl: `${apiUrl}/api/download/${resultKey}?proxy=1`
      })
      setWorkflowState('result')
    } catch (error) {
      setErrorMessage(error.message || 'Network error or unexpected issue.')
      setWorkflowState('editing')
    } finally {
      setIsProcessing(false)
    }
  }, [mediaUrl, runTask, settings.colors, settings.dither, settings.lossy, settings.optimize_level, settings.quality, uploadMethod])

  const resetWorkflow = useCallback(() => {
    resetTask()
    setWorkflowState('upload')
    setMediaUrl(null)
    setResultUrl(null)
    setErrorMessage(null)
    setOriginalSize(null)
    setOptimizedSize(null)
    setSettings({ ...DEFAULT_SETTINGS })
    setIsProcessing(false)
  }, [resetTask])

  const formatSize = (size) => {
    if (!size) return null
    return `${Math.max(1, Math.round(size / 1024))} KB`
  }

  return (
    <ToolPageLayout
      title="Optimize GIF for Smaller Size"
      description="Compress GIFs without losing clarity. Adjust palette size, dithering, and lossy compression to meet strict file-size targets."
      icon={RotateCw}
      seoProps={{
        title: 'Optimize GIF Online | EasyGIFMaker',
        description: 'Reduce GIF file size in minutes. Tune colours, lossy compression, and dithering while previewing results before download.',
        keywords: 'optimize gif, compress gif, reduce gif size, gif optimizer, gif compression',
        canonical: 'https://easygifmaker.com/optimize',
        ogImage: 'https://easygifmaker.com/blog/top-5-gif-optimization-tips-2.svg'
      }}
      toolKey="optimizeGif"
      adSlots={adSlots}
      midAdPosition={2}
      howToSteps={[
        {
          '@type': 'HowToStep',
          name: 'Upload GIF',
          text: 'Select a GIF file or enter a GIF URL to optimise.'
        },
        {
          '@type': 'HowToStep',
          name: 'Adjust Optimisation',
          text: 'Tune colours, quality, lossy compression, and dithering.'
        },
        {
          '@type': 'HowToStep',
          name: 'Preview & Compare',
          text: 'Review the estimated reduction before processing.'
        },
        {
          '@type': 'HowToStep',
          name: 'Download Optimised GIF',
          text: 'Export the compressed GIF ready for sharing.'
        }
      ]}
    >
      {workflowState === 'upload' && (
        <UploadState
          title="Upload GIF to Optimize"
          description="Select a GIF file or enter a GIF URL to optimise and compress"
          errorMessage={errorMessage}
          uploadMethod={uploadMethod}
          setUploadMethod={setUploadMethod}
          onFileSelect={(files) => handleFileUpload(files)}
          onUrlSubmit={(url) => handleFileUpload(null, url)}
          isProcessing={busy}
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
                  <CardTitle className="text-2xl font-bold text-gray-800">GIF Preview</CardTitle>
                  <CardDescription className="text-gray-600">
                    Preview your GIF and review estimated savings before optimising
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                    <div className="text-center">
                      <img
                        src={mediaUrl}
                        alt="GIF Preview"
                        className="max-w-full h-auto rounded-xl shadow-lg mx-auto"
                        style={{ maxHeight: '300px' }}
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 mb-6">
                    <div className="rounded-xl bg-white/70 p-3 text-center shadow-sm">
                      <div className="text-xs uppercase tracking-wide text-gray-500">Original size</div>
                      <div className="text-sm font-semibold text-gray-800">{formatSize(originalSize) || '—'}</div>
                    </div>
                    <div className="rounded-xl bg-white/70 p-3 text-center shadow-sm">
                      <div className="text-xs uppercase tracking-wide text-gray-500">Estimated after optimisation</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {estimatedSizeKB != null ? `${Math.max(1, Math.round(estimatedSizeKB))} KB` : '—'}
                      </div>
                    </div>
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
                      onClick={handleProcess}
                      disabled={busy}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {busy ? 'Optimizing...' : 'Optimize GIF'}
                    </Button>
                  </div>
                  <p className="mt-3 text-xs text-gray-600 text-center">
                    Estimated reduction: ~{(estimatedReduction * 100).toFixed(0)}%
                    {estimatedSizeKB != null && ' · Preview above reflects your current settings.'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="min-w-0">
              <Card className="bg-gradient-to-br from-white to-indigo-50/30 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    Optimisation Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-semibold text-gray-800">One-click presets</span>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSettings(s => ({ ...s, quality: 75, colors: 128, lossy: 20 }))}
                          className="bg-white/80"
                        >
                          Optimize for Social
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSettings(s => ({ ...s, quality: 85, colors: 128, lossy: 10 }))}
                          className="bg-white/80"
                        >
                          Optimize for Web
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSettings(s => ({ ...s, quality: 60, colors: 64, lossy: 30 }))}
                        >
                          Max Compression
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <label htmlFor="quality" className="block font-semibold mb-3 text-gray-800 text-base">
                      Quality Level
                      <span className="text-sm text-gray-500 ml-2 font-normal">(1-100)</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative">
                        <input
                          id="quality"
                          type="range"
                          min="1"
                          max="100"
                          step="1"
                          value={settings.quality}
                          onChange={(event) => setSettings({ ...settings, quality: parseInt(event.target.value, 10) })}
                          className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full appearance-none cursor-pointer slider-thumb-blue"
                        />
                        <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                          <span className="font-medium">Smaller</span>
                          <span className="font-medium">Sharper</span>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          value={settings.quality}
                          onChange={(event) => setSettings({ ...settings, quality: parseInt(event.target.value, 10) })}
                          min="1"
                          max="100"
                          className="w-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-semibold text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border border-white/30"
                        />
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium">%
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                      Lower values shrink file size faster; higher values keep more detail.
                    </p>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <label htmlFor="colors" className="block font-semibold mb-3 text-gray-800 text-base">
                      Colour Count
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative">
                        <input
                          id="colors"
                          type="range"
                          min="2"
                          max="256"
                          step="2"
                          value={settings.colors}
                          onChange={(event) => setSettings({ ...settings, colors: parseInt(event.target.value, 10) })}
                          className="w-full h-3 bg-gradient-to-r from-purple-200 via-indigo-200 to-blue-200 rounded-full appearance-none cursor-pointer slider-thumb-purple"
                        />
                        <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                          <span className="font-medium">Fewer</span>
                          <span className="font-medium">Full palette</span>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          value={settings.colors}
                          onChange={(event) => setSettings({ ...settings, colors: parseInt(event.target.value, 10) })}
                          min="2"
                          max="256"
                          className="w-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-semibold text-base shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none border border-white/30"
                        />
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium">colors
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                      Reducing colours is the quickest way to shrink file size—drop gradually to find the sweet spot.
                    </p>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <Label htmlFor="lossy" className="block font-semibold mb-3 text-gray-800 text-base">
                      Lossy Compression
                      <span className="text-sm text-gray-500 ml-2 font-normal">(0-100)</span>
                    </Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative">
                        <input
                          id="lossy"
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={settings.lossy}
                          onChange={(event) => setSettings({ ...settings, lossy: parseInt(event.target.value, 10) })}
                          className="w-full h-3 bg-gradient-to-r from-emerald-200 via-lime-200 to-amber-200 rounded-full appearance-none cursor-pointer slider-thumb-green"
                        />
                        <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                          <span className="font-medium">Gentle</span>
                          <span className="font-medium">Aggressive</span>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          value={settings.lossy}
                          onChange={(event) => setSettings({ ...settings, lossy: parseInt(event.target.value, 10) })}
                          min="0"
                          max="100"
                          className="w-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-semibold text-base shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none border border-white/30"
                        />
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium">level
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                      Adds controlled blur to busy frames. Try 10-20 for most loops; increase slowly when you need tiny files.
                    </p>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <label htmlFor="dither" className="block font-semibold mb-3 text-gray-800 text-base">
                      Dithering Method
                    </label>
                    <Select value={settings.dither} onValueChange={(value) => setSettings({ ...settings, dither: value })}>
                      <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm">
                        <SelectValue placeholder="Select dithering method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="floyd-steinberg">Floyd-Steinberg (Best Quality)</SelectItem>
                        <SelectItem value="atkinson">Atkinson (Balanced)</SelectItem>
                        <SelectItem value="burkes">Burkes (Fast)</SelectItem>
                        <SelectItem value="none">None (No dithering)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                      Dithering smooths gradients when you reduce colours. Turn it off for flat brand colours.
                    </p>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <label htmlFor="optimize-level" className="block font-semibold mb-3 text-gray-800 text-base">
                      Optimisation Level
                      <span className="text-sm text-gray-500 ml-2 font-normal">(1-3)</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative">
                        <input
                          id="optimize-level"
                          type="range"
                          min="1"
                          max="3"
                          step="1"
                          value={settings.optimize_level}
                          onChange={(event) => setSettings({ ...settings, optimize_level: parseInt(event.target.value, 10) })}
                          className="w-full h-3 bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 rounded-full appearance-none cursor-pointer slider-thumb-orange"
                        />
                        <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                          <span className="font-medium">Fast</span>
                          <span className="font-medium">Thorough</span>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          value={settings.optimize_level}
                          onChange={(event) => setSettings({ ...settings, optimize_level: parseInt(event.target.value, 10) })}
                          min="1"
                          max="3"
                          className="w-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-semibold text-base shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none border border-white/30"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                      Level 1 is quickest; level 3 squeezes the smallest files when you have time to spare.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <EnhancedTipsSection
            title="Pro tips for lean, great-looking GIFs"
            tips={[
              '<strong>Dial colours first.</strong> Dropping from 256 to 128 colours often removes 30-40% of the weight instantly.',
              '<strong>Balance lossy + quality.</strong> Moderate lossy (10-20) plus a quality of 70-80 keeps text sharp.',
              '<strong>Optimise after editing.</strong> Crop and resize before you compress to avoid reprocessing.',
              '<strong>Test frame-heavy clips.</strong> Use lower optimisation levels if animations look flickery.'
            ]}
          />
        </div>
      )}

      {workflowState === 'processing' && (
        <ProcessingState
          title="Optimizing your GIF"
          description="Applying palette, lossy, and dithering tweaks..."
        />
      )}

      {workflowState === 'result' && resultUrl && (
        <>
          <ResultSection
            title="Your optimised GIF is ready!"
            description="Download the compressed loop or tweak settings for another pass."
            imageUrl={resultUrl.previewUrl}
            downloadFileName="optimised.gif"
            downloadUrl={resultUrl.downloadUrl}
            onReset={resetWorkflow}
          />
          <div className="mt-4 text-sm text-gray-600 text-center">
            {originalSize && (
              <span>Original size: {formatSize(originalSize)}</span>
            )}
            {optimizedSize && (
              <span>{originalSize ? ' · ' : ''}Optimised size: {formatSize(optimizedSize)}</span>
            )}
          </div>
        </>
      )}
    </ToolPageLayout>
  )
}
