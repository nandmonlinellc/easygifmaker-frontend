import React, { useState, useCallback, useMemo } from 'react'
import DisplayAd from '@/components/ads/DisplayAd.jsx'
import InArticleAd from '@/components/ads/InArticleAd.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Maximize2 } from 'lucide-react'
import ResultSection from '../components/ResultSection'
import EnhancedTipsSection from '../components/EnhancedTipsSection'
import ProcessingState from '../components/ProcessingState'
import UploadState from '../components/UploadState'
import ToolPageLayout from '../components/ToolPageLayout'
import useTaskPolling from '@/hooks/useTaskPolling.js'
import { safeJson } from '@/utils/http.js'

const DEFAULT_SETTINGS = {
  width: 300,
  height: 300,
  maintainAspectRatio: true,
  percentage: 100,
  aspectPreset: 'free'
}

const presetToRatio = (preset) => {
  if (preset === '1:1') return 1
  if (preset === '16:9') return 16 / 9
  if (preset === '9:16') return 9 / 16
  return null
}

export default function ResizeTool() {
  const [workflowState, setWorkflowState] = useState('upload')
  const [uploadMethod, setUploadMethod] = useState('file')
  const [mediaUrl, setMediaUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [originalSize, setOriginalSize] = useState({ width: null, height: null })

  const { runTask, isProcessing: isPolling, reset: resetTask } = useTaskPolling()

  const adSlots = useMemo(() => ({
    header: <DisplayAd slot="1125232950" className="max-w-3xl w-full" />,
    mid: <InArticleAd slot="8336674411" className="max-w-2xl w-full" />,
    footer: <DisplayAd slot="1125232950" className="max-w-3xl w-full" />
  }), [])

  const busy = isProcessing || isPolling

  const handleWidthChange = useCallback((value) => {
    const newWidth = parseInt(value, 10)
    if (!Number.isFinite(newWidth) || newWidth <= 0) {
      setSettings((prev) => ({ ...prev, width: 1 }))
      return
    }
    setSettings((prev) => {
      const next = { ...prev, width: newWidth }
      const ratio = presetToRatio(prev.aspectPreset)
      if (ratio) {
        next.height = Math.max(1, Math.round(newWidth / ratio))
      } else if (prev.maintainAspectRatio && originalSize.width && originalSize.height) {
        const origRatio = originalSize.width / originalSize.height
        next.height = Math.max(1, Math.round(newWidth / origRatio))
      }
      return next
    })
  }, [originalSize.height, originalSize.width])

  const handleHeightChange = useCallback((value) => {
    const newHeight = parseInt(value, 10)
    if (!Number.isFinite(newHeight) || newHeight <= 0) {
      setSettings((prev) => ({ ...prev, height: 1 }))
      return
    }
    setSettings((prev) => {
      const next = { ...prev, height: newHeight }
      const ratio = presetToRatio(prev.aspectPreset)
      if (ratio) {
        next.width = Math.max(1, Math.round(newHeight * ratio))
      } else if (prev.maintainAspectRatio && originalSize.width && originalSize.height) {
        const origRatio = originalSize.width / originalSize.height
        next.width = Math.max(1, Math.round(newHeight * origRatio))
      }
      return next
    })
  }, [originalSize.height, originalSize.width])

  const handleAspectPresetChange = useCallback((value) => {
    setSettings((prev) => {
      const next = { ...prev, aspectPreset: value }
      const ratio = presetToRatio(value)
      if (ratio) {
        next.height = Math.max(1, Math.round(prev.width / ratio))
      } else if (prev.maintainAspectRatio && originalSize.width && originalSize.height) {
        const origRatio = originalSize.width / originalSize.height
        next.height = Math.max(1, Math.round(prev.width / origRatio))
      }
      return next
    })
  }, [originalSize.height, originalSize.width])

  const handlePercentageChange = useCallback((value) => {
    const pct = parseInt(value, 10)
    if (!Number.isFinite(pct) || pct <= 0) {
      setSettings((prev) => ({ ...prev, percentage: 1 }))
      return
    }
    setSettings((prev) => {
      const next = { ...prev, percentage: pct }
      if (originalSize.width && originalSize.height) {
        next.width = Math.max(1, Math.round((originalSize.width * pct) / 100))
        next.height = Math.max(1, Math.round((originalSize.height * pct) / 100))
      }
      return next
    })
  }, [originalSize.height, originalSize.width])

  const handleMaintainAspect = useCallback((value) => {
    setSettings((prev) => {
      const next = { ...prev, maintainAspectRatio: value }
      if (value && originalSize.width && originalSize.height) {
        const origRatio = originalSize.width / originalSize.height
        next.height = Math.max(1, Math.round(prev.width / origRatio))
      }
      return next
    })
  }, [originalSize.height, originalSize.width])

  const handleFileUpload = useCallback((files, urlInput = null) => {
    if ((!files || files.length === 0) && !urlInput) return
    setErrorMessage(null)
    setResultUrl(null)

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
    setOriginalSize({ width: null, height: null })
  }, [uploadMethod])

  const handleProcess = useCallback(async () => {
    if (!mediaUrl) return
    setErrorMessage(null)
    setResultUrl(null)
    setIsProcessing(true)
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
          formData.append('width', settings.width.toString())
          formData.append('height', settings.height.toString())
          formData.append('maintain_aspect_ratio', settings.maintainAspectRatio.toString())

          const response = await fetch(`${apiUrl}/api/resize`, {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            const errorData = await safeJson(response)
            throw new Error(errorData.error || 'Unable to start resize task.')
          }

          const data = await safeJson(response)
          if (!data?.task_id) {
            throw new Error('No task_id returned from backend.')
          }
          return { taskId: data.task_id }
        },
        pollTask: async (taskId) => {
          const resp = await fetch(`${apiUrl}/api/task-status/${taskId}`)
          if (!resp.ok) {
            throw new Error('Failed to retrieve task status.')
          }
          return resp.json()
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
        throw new Error('Failed to fetch resized GIF.')
      }
      const gifBlob = await downloadResp.blob()
      const url = URL.createObjectURL(gifBlob)
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
  }, [mediaUrl, runTask, settings.height, settings.maintainAspectRatio, settings.width, uploadMethod])

  const resetWorkflow = useCallback(() => {
    resetTask()
    setWorkflowState('upload')
    setMediaUrl(null)
    setResultUrl(null)
    setErrorMessage(null)
    setSettings({ ...DEFAULT_SETTINGS })
    setOriginalSize({ width: null, height: null })
    setIsProcessing(false)
  }, [resetTask])

  return (
    <ToolPageLayout
      title="Resize GIF Easily"
      description="Resize and scale GIFs online for free. Change dimensions while preserving quality—perfect for social media, landing pages, and chat apps."
      icon={Maximize2}
      seoProps={{
        title: 'Resize GIF Online | EasyGIFMaker',
        description: 'Resize GIFs quickly and accurately. Set exact width and height or scale by percentage for pixel-perfect results.',
        keywords: 'resize gif, scale gif, change gif size, gif resizer, gif dimensions, resize animated gif, gif editor, gif converter, gif maker',
        canonical: 'https://easygifmaker.com/resize',
        ogImage: 'https://easygifmaker.com/blog/complete-guide-to-resize-gif.svg'
      }}
      toolKey="resizeGif"
      adSlots={adSlots}
      midAdPosition={2}
    >
      {workflowState === 'upload' && (
        <UploadState
          title="Upload GIF to Resize"
          description="Select a GIF file or paste a direct GIF URL to start"
          errorMessage={errorMessage}
          uploadMethod={uploadMethod}
          setUploadMethod={setUploadMethod}
          onFileSelect={(files) => handleFileUpload(files)}
          onUrlSubmit={(url) => handleFileUpload(null, url)}
          isProcessing={busy}
          supportedFormats="GIF only"
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
                    Review your GIF and confirm the new dimensions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                    <div className="text-center">
                      <img
                        src={mediaUrl}
                        alt="GIF Preview"
                        className="max-w-full h-auto rounded-xl shadow-lg mx-auto"
                        style={{ maxHeight: '320px' }}
                        onLoad={(event) => {
                          const img = event.currentTarget
                          if (img?.naturalWidth && img?.naturalHeight) {
                            setOriginalSize({ width: img.naturalWidth, height: img.naturalHeight })
                            if (settings.aspectPreset === 'free' && settings.maintainAspectRatio) {
                              const ratio = img.naturalWidth / img.naturalHeight
                              setSettings((prev) => ({ ...prev, height: Math.max(1, Math.round(prev.width / ratio)) }))
                            }
                          }
                        }}
                      />
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
                      {busy ? 'Resizing...' : 'Resize GIF'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="min-w-0">
              <Card className="bg-gradient-to-br from-white to-indigo-50/30 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <Maximize2 className="h-5 w-5 text-white" />
                    </div>
                    Resize Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                    <Label htmlFor="width" className="block font-semibold mb-3 text-gray-800">
                      Width (px)
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      min="1"
                      value={settings.width}
                      onChange={(event) => handleWidthChange(event.target.value)}
                      className="mb-4"
                    />
                    <Label htmlFor="height" className="block font-semibold mb-3 text-gray-800">
                      Height (px)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      min="1"
                      value={settings.height}
                      onChange={(event) => handleHeightChange(event.target.value)}
                    />
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">Maintain aspect ratio</span>
                      <Button
                        type="button"
                        variant={settings.maintainAspectRatio ? 'default' : 'outline'}
                        onClick={() => handleMaintainAspect(!settings.maintainAspectRatio)}
                        className="h-8 px-3 text-sm"
                      >
                        {settings.maintainAspectRatio ? 'On' : 'Off'}
                      </Button>
                    </div>
                    <div>
                      <Label className="block font-semibold mb-2 text-gray-800">Aspect preset</Label>
                      <Select value={settings.aspectPreset} onValueChange={handleAspectPresetChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Free" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="1:1">1:1 Square</SelectItem>
                          <SelectItem value="16:9">16:9 Landscape</SelectItem>
                          <SelectItem value="9:16">9:16 Portrait</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                    <Label className="block font-semibold mb-3 text-gray-800">Scale by percentage</Label>
                    <Input
                      type="number"
                      min="1"
                      value={settings.percentage}
                      onChange={(event) => handlePercentageChange(event.target.value)}
                    />
                    <p className="text-xs text-gray-600 mt-3">
                      100% keeps the original size. Lower values shrink the GIF, higher values enlarge it.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <EnhancedTipsSection
            title="Pro tips for sharp, lightweight GIFs"
            tips={[
              '<strong>Match the end-use.</strong> 480-640px wide is ideal for social feeds; go larger only when detail matters.',
              '<strong>Stick to even numbers.</strong> Many platforms prefer even pixel dimensions for faster encoding.',
              '<strong>Resize before optimising.</strong> Scaling first produces better colour preservation when you compress later.',
              '<strong>Preview at target size.</strong> Small fonts can blur—consider adding text overlays after resizing if needed.'
            ]}
          />
        </div>
      )}

      {workflowState === 'processing' && (
        <ProcessingState
          title="Resizing your GIF"
          description="Changing dimensions and regenerating frames..."
        />
      )}

      {workflowState === 'result' && resultUrl && (
        <ResultSection
          title="Your resized GIF is ready!"
          description="Download the new dimensions or share the preview link."
          imageUrl={resultUrl.previewUrl}
          downloadFileName="resized.gif"
          downloadUrl={resultUrl.downloadUrl}
          onReset={resetWorkflow}
        />
      )}
    </ToolPageLayout>
  )
}
