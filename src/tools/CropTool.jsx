import React, { useState, useCallback, useMemo } from 'react'
import DisplayAd from '@/components/ads/DisplayAd.jsx'
import InArticleAd from '@/components/ads/InArticleAd.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Crop } from 'lucide-react'
import ResultSection from '../components/ResultSection'
import CropperCanvas from '../components/CropperCanvas'
import EnhancedTipsSection from '../components/EnhancedTipsSection'
import ProcessingState from '../components/ProcessingState'
import UploadState from '../components/UploadState'
import ToolPageLayout from '../components/ToolPageLayout'

export default function CropTool() {
  const [workflowState, setWorkflowState] = useState('upload')
  const [uploadMethod, setUploadMethod] = useState('file')
  const [mediaUrl, setMediaUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({ x: 0, y: 0, width: 100, height: 100 })
  const [aspect, setAspect] = useState(null)

  const adSlots = useMemo(() => ({
    header: <DisplayAd slot="1125232950" className="max-w-3xl w-full" />,
    mid: <InArticleAd slot="8336674411" className="max-w-2xl w-full" />,
    footer: <DisplayAd slot="1125232950" className="max-w-3xl w-full" />
  }), [])

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
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels({ x: 0, y: 0, width: 100, height: 100 })
    setWorkflowState('editing')
  }, [uploadMethod])

  const onCropComplete = useCallback((_, areaPixels) => {
    if (!areaPixels) return
    const { x, y, width, height } = areaPixels
    if ([x, y, width, height].every(value => typeof value === 'number')) {
      setCroppedAreaPixels(areaPixels)
    }
  }, [])

  const handleAspectChange = (value) => {
    if (value === 'free') setAspect(null)
    else if (value === 'square') setAspect(1)
    else if (value === '4:3') setAspect(4 / 3)
    else if (value === '16:9') setAspect(16 / 9)
    else if (value === '9:16') setAspect(9 / 16)
    else if (value === '3:2') setAspect(3 / 2)
    else if (value === '2:1') setAspect(2)
    else if (value === 'golden') setAspect(1.618)
    else setAspect(null)
  }

  const handleProcess = useCallback(async () => {
    if (!mediaUrl || !croppedAreaPixels) return
    setErrorMessage(null)
    setIsProcessing(true)
    setResultUrl(null)
    setWorkflowState('processing')

    try {
      const formData = new FormData()
      if (uploadMethod === 'url') {
        formData.append('url', mediaUrl)
      } else {
        const response = await fetch(mediaUrl)
        const blob = await response.blob()
        formData.append('file', blob, 'image.gif')
      }

      formData.append('x', Math.round(croppedAreaPixels.x).toString())
      formData.append('y', Math.round(croppedAreaPixels.y).toString())
      formData.append('width', Math.round(croppedAreaPixels.width).toString())
      formData.append('height', Math.round(croppedAreaPixels.height).toString())
      formData.append('aspect_ratio', aspect || 'free')

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
      const response = await fetch(`${apiUrl}/api/crop`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'An unknown error occurred during processing.')
      }

      const data = await response.json()
      if (!data?.task_id) {
        throw new Error('No task_id returned from backend.')
      }

      const baseDelay = parseInt(import.meta.env.VITE_TASK_POLL_MS || '1500', 10)
      let delay = Number.isNaN(baseDelay) ? 1500 : baseDelay
      let resultKey = null

      for (let i = 0; i < 60; i++) {
        const statusResp = await fetch(`${apiUrl}/api/task-status/${data.task_id}`)
        if (statusResp.ok) {
          const statusData = await statusResp.json()
          const status = statusData.status || statusData.state
          if ((status === 'SUCCESS' || status === 'Task completed!') && statusData.result) {
            resultKey = statusData.result
            break
          }
          if (status === 'FAILURE') {
            throw new Error(statusData.error || 'GIF crop failed.')
          }
        }

        await new Promise(res => setTimeout(res, delay))
        delay = Math.min(delay + 250, 3000)
      }

      if (!resultKey) {
        throw new Error('GIF crop timed out. Please try again.')
      }

      const downloadResp = await fetch(`${apiUrl}/api/download/${resultKey}?proxy=1`)
      if (!downloadResp.ok) {
        throw new Error('Failed to fetch result GIF.')
      }

      const gifBlob = await downloadResp.blob()
      const previewUrl = URL.createObjectURL(gifBlob)
      setResultUrl({
        previewUrl,
        downloadUrl: `${apiUrl}/api/download/${resultKey}?proxy=1`
      })
      setWorkflowState('result')
    } catch (error) {
      setErrorMessage(error.message || 'Network error or unexpected issue.')
      setWorkflowState('editing')
    } finally {
      setIsProcessing(false)
    }
  }, [aspect, croppedAreaPixels, mediaUrl, uploadMethod])

  const resetWorkflow = useCallback(() => {
    setWorkflowState('upload')
    setMediaUrl(null)
    setResultUrl(null)
    setErrorMessage(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels({ x: 0, y: 0, width: 100, height: 100 })
    setAspect(null)
  }, [])

  return (
    <ToolPageLayout
      title="Crop GIF Easily and Quickly"
      description="Crop and trim GIFs online for free. Remove unwanted parts and focus on the important content. Perfect for social media and messaging."
      icon={Crop}
      seoProps={{
        title: 'Crop GIF Easily Online | EasyGIFMaker',
        description: 'Crop your GIFs quickly and easily with our online GIF cropping tool. Perfect for creating shareable animations that fit your needs!',
        keywords: 'crop gif, trim gif, cut gif, gif cropper, gif editor, crop animated gif, gif maker, free gif maker, online gif maker, gif converter, gif creator',
        canonical: 'https://easygifmaker.com/crop',
        ogImage: 'https://easygifmaker.com/blog/professional-gif-cropping-and-composition-guide.svg'
      }}
      toolKey="cropGif"
      adSlots={adSlots}
      midAdPosition={2}
      howToSteps={[
        {
          '@type': 'HowToStep',
          name: 'Upload GIF',
          text: 'Select a GIF file or enter a GIF URL to crop.'
        },
        {
          '@type': 'HowToStep',
          name: 'Select Crop Area',
          text: 'Use the interactive crop tool to select the area you want to keep.'
        },
        {
          '@type': 'HowToStep',
          name: 'Adjust and Preview',
          text: 'Fine-tune your crop selection and preview the result.'
        },
        {
          '@type': 'HowToStep',
          name: 'Download Cropped GIF',
          text: 'Download your cropped GIF with the selected area!'
        }
      ]}
    >
      {workflowState === 'upload' && (
        <UploadState
          title="Upload GIF to Crop"
          description="Select a GIF file or enter a GIF URL to crop and trim"
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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-800">GIF Preview & Cropper</CardTitle>
                <CardDescription className="text-gray-600">
                  Drag to select the area you want to keep in your GIF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                  <CropperCanvas
                    imageUrl={mediaUrl}
                    aspect={aspect}
                    crop={crop}
                    zoom={zoom}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
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
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {isProcessing ? 'Cropping...' : 'Crop GIF'}
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
                    <Crop className="h-5 w-5 text-white" />
                  </div>
                  Crop Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                    <Label htmlFor="crop-x" className="block font-semibold text-gray-800">
                      X Position
                      <span className="ml-1 text-sm font-normal text-gray-500">(px)</span>
                    </Label>
                    <Input
                      id="crop-x"
                      type="number"
                      min="0"
                      value={croppedAreaPixels.x || 0}
                      onChange={({ target }) => {
                        const newX = parseInt(target.value, 10) || 0
                        setCroppedAreaPixels({ ...croppedAreaPixels, x: newX })
                      }}
                      className="mt-3 text-center"
                    />
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                    <Label htmlFor="crop-y" className="block font-semibold text-gray-800">
                      Y Position
                      <span className="ml-1 text-sm font-normal text-gray-500">(px)</span>
                    </Label>
                    <Input
                      id="crop-y"
                      type="number"
                      min="0"
                      value={croppedAreaPixels.y || 0}
                      onChange={({ target }) => {
                        const newY = parseInt(target.value, 10) || 0
                        setCroppedAreaPixels({ ...croppedAreaPixels, y: newY })
                      }}
                      className="mt-3 text-center"
                    />
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                    <Label htmlFor="crop-width" className="block font-semibold text-gray-800">
                      Width
                      <span className="ml-1 text-sm font-normal text-gray-500">(px)</span>
                    </Label>
                    <Input
                      id="crop-width"
                      type="number"
                      min="10"
                      value={croppedAreaPixels.width || 0}
                      onChange={({ target }) => {
                        const newWidth = parseInt(target.value, 10) || 0
                        setCroppedAreaPixels({ ...croppedAreaPixels, width: newWidth })
                      }}
                      className="mt-3 text-center"
                    />
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                    <Label htmlFor="crop-height" className="block font-semibold text-gray-800">
                      Height
                      <span className="ml-1 text-sm font-normal text-gray-500">(px)</span>
                    </Label>
                    <Input
                      id="crop-height"
                      type="number"
                      min="10"
                      value={croppedAreaPixels.height || 0}
                      onChange={({ target }) => {
                        const newHeight = parseInt(target.value, 10) || 0
                        setCroppedAreaPixels({ ...croppedAreaPixels, height: newHeight })
                      }}
                      className="mt-3 text-center"
                    />
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                  <Label className="block font-semibold text-gray-800 mb-3">
                    Aspect ratio presets
                  </Label>
                  <Select value={aspect ? aspect.toString() : 'free'} onValueChange={handleAspectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Free" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="square">1:1</SelectItem>
                      <SelectItem value="4:3">4:3</SelectItem>
                      <SelectItem value="16:9">16:9</SelectItem>
                      <SelectItem value="9:16">9:16</SelectItem>
                      <SelectItem value="3:2">3:2</SelectItem>
                      <SelectItem value="2:1">2:1</SelectItem>
                      <SelectItem value="golden">Golden Ratio (1.618:1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <EnhancedTipsSection
                  title="Pro Tips for Perfect Cropping"
                  tips={[
                    '<strong>Focus on Subject</strong> Crop to highlight the main action or subject and keep attention on what matters.',
                    '<strong>Remove Distractions</strong> Trim away background elements that add noise to your animation.',
                    '<strong>Maintain Quality</strong> Avoid very small crops to preserve detail—aim for at least 200x200px.',
                    '<strong>Pick the Right Ratio</strong> Match your crop to the destination platform for a polished final result.',
                    '<strong>Preview Every Frame</strong> Scrub through the animation to ensure the subject stays within the crop.',
                    '<strong>Use Coordinates</strong> Fine-tune X/Y and size values for pixel-perfect framing.'
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {workflowState === 'processing' && (
        <ProcessingState
          title="Cropping Your GIF"
          description="Processing your cropped GIF..."
        />
      )}

      {workflowState === 'result' && resultUrl && (
        <ResultSection
          title="Your Cropped GIF is Ready!"
          description="Your GIF has been successfully cropped to your specifications."
          imageUrl={resultUrl.previewUrl}
          downloadFileName="cropped.gif"
          downloadUrl={resultUrl.downloadUrl}
          onReset={resetWorkflow}
        />
      )}
    </ToolPageLayout>
  )
}
