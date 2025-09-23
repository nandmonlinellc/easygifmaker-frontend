import React, { useState, useCallback, useMemo } from 'react'
import DisplayAd from '@/components/ads/DisplayAd.jsx'
import InArticleAd from '@/components/ads/InArticleAd.jsx'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Maximize2 } from 'lucide-react'
import ResultSection from '../components/ResultSection'
import SocialSharingSection from '../components/SocialSharingSection'
import TroubleshootingSection from '../components/TroubleshootingSection'
import TipsFaqsBestPracticesSection from '../components/TipsFaqsBestPracticesSection'
import ToolSeoSection from '../components/ToolSeoSection'
import HowToUseSection from '../components/HowToUseSection'
import EnhancedTipsSection from '../components/EnhancedTipsSection'
import ProcessingState from '../components/ProcessingState'
import UploadState from '../components/UploadState'
import ToolPageLayout from '../components/ToolPageLayout'
import ValueContentSection from '../components/ValueContentSection'
import AdsenseAd from '../components/AdsenseAd'
import LimitsTable from '../components/LimitsTable'
import QuickFeaturesBox from '../components/QuickFeaturesBox'
import useTaskPolling from '@/hooks/useTaskPolling.js'
import { toolContent } from '@/data/toolContent.js'
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

  const renderUploadSection = () => (
    workflowState === 'upload' && (
      <UploadState
        key="upload"
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
    )
  )

  const renderContextInfo = () => (
    <div key="context" className="space-y-4">
      <QuickFeaturesBox
        features={[
          { emoji: '📏', text: 'Pixel-perfect width & height control' },
          { emoji: '⚖️', text: 'Maintain aspect ratio automatically' },
          { emoji: '📐', text: 'Percentage-based scaling' },
          { emoji: '💎', text: 'High-quality resizing algorithms' }
        ]}
      />
      <LimitsTable
        acceptedFormats={['GIF']}
        maxFrames={null}
        maxResolution={'Best results up to ~1600 px on the longest edge'}
        recommendedDuration={'Keep loops short (≤15s) for quicker uploads'}
      />
    </div>
  )

  const renderEditingSection = () => (
    workflowState === 'editing' && mediaUrl && (
      <div key="editing" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  <Button onClick={resetWorkflow} variant="outline" className="flex-1 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300">
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
          <div>
            <Card className="bg-gradient-to-br from-white to-indigo-50/30 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Maximize2 className="h-5 w-5 text-white" />
                  </div>
                  Resize Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
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
    )
  )

  const renderProcessingSection = () => (
    workflowState === 'processing' && (
      <ProcessingState
        key="processing"
        title="Resizing your GIF"
        description="Changing dimensions and regenerating frames..."
      />
    )
  )

  const renderResultSection = () => (
    workflowState === 'result' && resultUrl && (
      <ResultSection
        key="result"
        title="Your resized GIF is ready!"
        description="Download the new dimensions or share the preview link."
        imageUrl={resultUrl.previewUrl}
        downloadFileName="resized.gif"
        downloadUrl={resultUrl.downloadUrl}
        onReset={resetWorkflow}
      />
    )
  )

  const afterContent = (
    <>
      <HowToUseSection
        title="How to use the GIF resizer"
        steps={[
          { title: 'Upload your GIF', description: 'Select a local file or paste a direct GIF URL.' },
          { title: 'Choose new dimensions', description: 'Set width & height, lock aspect ratio, or use percentage scaling.' },
          { title: 'Preview your loop', description: 'Confirm the resized result and tweak until it looks right.' },
          { title: 'Download instantly', description: 'Export the resized GIF or send it straight to the optimizer.' }
        ]}
      />

      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How do I resize a GIF without losing quality?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Upload your GIF, keep maintain aspect ratio enabled, and export at the smallest width that still looks crisp.'
              }
            },
            {
              '@type': 'Question',
              name: 'What size should a GIF be for social media?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Square (1:1) or portrait (4:5) loops perform well on feeds. Use percentage mode to generate multiple variants quickly.'
              }
            }
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'How to resize a GIF',
          totalTime: 'PT1M',
          step: [
            { '@type': 'HowToStep', name: 'Upload', text: 'Add a GIF file or paste a direct GIF URL.' },
            { '@type': 'HowToStep', name: 'Set size', text: 'Enter a new width/height or keep aspect ratio to scale proportionally.' },
            { '@type': 'HowToStep', name: 'Download', text: 'Process and save the resized animated GIF.' }
          ]
        })}</script>
      </Helmet>

      <section className="mt-10 space-y-3" aria-label="Tutorial: Resize GIF">
        <h2 className="text-2xl font-semibold text-gray-900">Tutorial: Resize a GIF in 60 seconds</h2>
        <ol className="list-decimal pl-6 text-gray-700 space-y-2">
          <li>Upload a GIF or paste a direct URL.</li>
          <li>Choose exact dimensions or percentage scaling.</li>
          <li>Keep aspect ratio on to avoid stretching.</li>
          <li>Click resize, preview, then download.</li>
        </ol>
        <p className="text-gray-700">
          Need to crop first? Try the <a href="/crop" className="text-blue-600 hover:underline">GIF cropper</a>.
          Want a smaller file afterwards? Run the result through the <a href="/optimize" className="text-blue-600 hover:underline">GIF optimizer</a>.
        </p>
      </section>

      <ValueContentSection content={toolContent.resizeGif} />

      <ToolSeoSection
        icon={Maximize2}
        title="Resize GIF"
        description1="Resize your GIFs to fit any platform or purpose with our fast, precise resizer. Adjust dimensions for social feeds, landing pages, chat apps, or product screenshots without opening a heavy editor."
        description2="Tune width, height, or percentage scaling while preserving quality. Great for content creators, marketers, and support teams who need polished loops across multiple canvases."
        features1={[
          { emoji: '📏', text: 'Custom width and height controls' },
          { emoji: '⚖️', text: 'Maintain aspect ratio automatically' },
          { emoji: '🎯', text: 'Percentage scaling for quick variants' }
        ]}
        features2={[
          { emoji: '💎', text: 'Quality-preserving resampling' },
          { emoji: '📱', text: 'Outputs sized for every device' }
        ]}
        useCases={[
          { color: 'bg-yellow-400', text: 'Resize GIFs for social media timelines' },
          { color: 'bg-green-400', text: 'Scale loops for product walkthroughs' },
          { color: 'bg-blue-400', text: 'Prepare GIFs for newsletters or blogs' },
          { color: 'bg-purple-400', text: 'Generate variants for A/B testing' }
        ]}
      />

      <AdsenseAd adSlot="8336674411" adFormat="fluid" adLayout="in-article" />

      <TipsFaqsBestPracticesSection
        proTips={[
          { color: 'bg-blue-500', text: 'Lock aspect ratio to avoid stretched logos or UI.' },
          { color: 'bg-green-500', text: 'Scale down large source GIFs before optimising for the web.' },
          { color: 'bg-purple-500', text: 'Generate multiple sizes (desktop, mobile, chat) for consistent branding.' },
          { color: 'bg-orange-500', text: 'Test playback speed after resizing—smaller dimensions can feel faster.' }
        ]}
        faqs={[
          { question: 'Will resizing affect animation quality?', answer: 'Our resizer uses high-quality sampling to preserve smooth motion, especially when scaling down.' },
          { question: 'Can I resize to any dimensions?', answer: 'Yes—enter custom width and height or use percentage scaling to keep proportions intact.' },
          { question: 'Does resizing change file size?', answer: 'Smaller dimensions usually reduce file size. Run the result through the optimizer for extra savings.' }
        ]}
        relatedResources={[
          { href: '/blog/complete-guide-to-resize-gif', icon: '📘', text: 'Complete guide to resize GIF' },
          { href: '/blog/gif-optimization-techniques', icon: '⚙️', text: 'GIF optimization techniques' }
        ]}
      />

      <TroubleshootingSection
        commonIssues={[
          { color: 'bg-yellow-500', text: 'Distorted GIF? Re-enable aspect ratio or start from the original source file.' },
          { color: 'bg-orange-500', text: 'Upload failing? Confirm you\'re using GIF format and under the 200 MB limit.' },
          { color: 'bg-red-500', text: 'Still stuck? Contact support and attach the GIF so we can reproduce the issue.' }
        ]}
        quickFixes={[
          { icon: '📏', text: 'Use percentage mode for quick proportional scaling.' },
          { icon: '⚖️', text: 'Switch to a preset ratio when preparing assets for social stories.' },
          { icon: '📱', text: 'Preview the resized loop on mobile before sharing widely.' }
        ]}
      />

      <SocialSharingSection
        title="Share your resized GIF"
        description="Send your new loop to teammates, drop it in community threads, or share on socials. Tag #EasyGIFMaker so we can celebrate your work!"
      />
    </>
  )

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
      howToSteps={[
        { '@type': 'HowToStep', 'name': 'Upload GIF', 'text': 'Select a GIF file or paste a direct URL.' },
        { '@type': 'HowToStep', 'name': 'Set new dimensions', 'text': 'Enter width/height or keep aspect ratio for proportional resizing.' },
        { '@type': 'HowToStep', 'name': 'Preview and adjust', 'text': 'Check the updated GIF and tweak if needed.' },
        { '@type': 'HowToStep', 'name': 'Download resized GIF', 'text': 'Export the resized animation instantly.' }
      ]}
      adSlots={adSlots}
      midAdPosition={0}
      afterContent={afterContent}
    >
      {renderUploadSection()}
      {renderContextInfo()}
      {renderEditingSection()}
      {renderProcessingSection()}
      {renderResultSection()}
    </ToolPageLayout>
  )
}
