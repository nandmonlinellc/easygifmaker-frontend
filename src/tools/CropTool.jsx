import React, { useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Crop, Settings } from 'lucide-react'
import ResultSection from '../components/ResultSection'
import FileUploadSection from '../components/FileUploadSection'
import CropperCanvas from '../components/CropperCanvas'

export default function CropTool() {
  const [workflowState, setWorkflowState] = useState('upload') // 'upload', 'editing', 'processing', 'result'
  const [uploadMethod, setUploadMethod] = useState('file')
  const [mediaUrl, setMediaUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  // Cropper state
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [aspect, setAspect] = useState(null) // null = free

  // Unified upload handler for file or URL
  const handleFileUpload = useCallback((files, urlInput = null) => {
    if ((!files || files.length === 0) && !urlInput) return
    setErrorMessage(null)
    setResultUrl(null)
    let url
    if (uploadMethod === 'url' && urlInput) {
      url = urlInput
    } else {
      url = URL.createObjectURL(files[0])
    }
    setMediaUrl(url)
    setWorkflowState('editing')
  }, [uploadMethod])

  // Handle crop complete from Cropper
  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  // Handle aspect ratio change
  const handleAspectChange = (value) => {
    setAspect(value === 'free' ? null : value)
  }

  // Handle crop process
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/crop`, {
        method: 'POST',
        body: formData
      })
      if (response.ok) {
        const data = await response.json()
        const taskId = data.task_id
        if (!taskId) throw new Error('No task_id returned from backend.')
        let status = null
        let result = null
        for (let i = 0; i < 60; i++) {
          const statusResp = await fetch(`${apiUrl}/api/task-status/${taskId}`)
          if (statusResp.ok) {
            const statusData = await statusResp.json()
            status = statusData.state
            result = statusData.result
            if (status === 'SUCCESS' && result) {
              break
            } else if (status === 'FAILURE') {
              throw new Error(statusData.error || 'GIF crop failed.')
            }
          }
          await new Promise(res => setTimeout(res, 1000))
        }
        if (status === 'SUCCESS' && result) {
          const downloadUrl = `${apiUrl}/api/download/${encodeURIComponent(result)}`
          setResultUrl(downloadUrl)
          setWorkflowState('result')
        } else {
          throw new Error('GIF crop timed out. Please try again.')
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
  }, [uploadMethod, mediaUrl, croppedAreaPixels, aspect])

  // Reset workflow to upload state
  const resetWorkflow = () => {
    setWorkflowState('upload')
    setMediaUrl(null)
    setResultUrl(null)
    setErrorMessage(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setAspect(null)
  }

  // --- Render ---
  return (
    <>
      <Helmet>
        <title>Crop GIF - Trim and Cut GIFs Online | EasyGIFMaker</title>
        <meta 
          name="description" 
          content="Crop GIFs online for free. Trim, cut, and resize GIFs with precision. Custom dimensions and aspect ratios. Perfect for social media and web use." 
        />
        <meta 
          name="keywords" 
          content="crop gif, gif cropper, trim gif, cut gif, gif crop tool, resize gif area" 
        />
        <link rel="canonical" href="https://easygifmaker.com/crop" />
      </Helmet>
      <div className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          {/* Unique Publisher Content for AdSense/SEO */}
          <section className="bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-xl shadow-lg p-8 mb-8 mt-4">
            <div className="flex items-center gap-4 mb-4">
              <Crop size={40} className="text-white drop-shadow" />
              <h1 className="text-3xl font-extrabold tracking-tight">Crop GIF</h1>
            </div>
            <p className="text-lg font-medium mb-2">Crop your GIFs with pixel-perfect precision using our easy-to-use Crop GIF tool. Select the exact area you want to keep, preview the result in real time, and download your cropped GIF instantly. Whether you want to focus on a key moment, remove unwanted borders, or create a square GIF for social media, our tool gives you full creative control. No software to install—just upload, crop, and go!</p>
            <ul className="list-disc pl-6 text-base mt-2">
              <li>✂️ Drag to select the area you want to keep—perfect for memes, reactions, and highlights</li>
              <li>🔍 Real-time preview so you can see exactly what you’ll get</li>
              <li>⚡ Fast, high-quality cropping with no loss of animation</li>
              <li>🌐 Works with GIF, APNG, and other animated formats</li>
            </ul>
          </section>
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Tips & FAQs</h2>
            <ul className="list-disc pl-6 text-blue-900">
              <li><b>Tip:</b> Use the preview to make sure you’re not cutting off important parts of your GIF.</li>
              <li><b>Tip:</b> Cropping to a square or vertical format is great for Instagram, TikTok, and other social platforms.</li>
              <li><b>Tip:</b> You can crop animated GIFs, APNGs, and more—just upload and start editing.</li>
              <li><b>FAQ:</b> <b>Will cropping affect the animation?</b> No, our tool preserves the animation and quality of your GIF.</li>
              <li><b>FAQ:</b> <b>Can I undo a crop?</b> Yes, simply re-upload your original GIF or adjust the crop area before downloading.</li>
              <li><b>FAQ:</b> <b>What file types are supported?</b> GIF, APNG, and many other animated formats are accepted.</li>
            </ul>
          </section>

          {/* Upload State */}
          {workflowState === 'upload' && (
            <Card>
              <CardHeader>
                <CardTitle>Upload GIF</CardTitle>
                <CardDescription>
                  Select a GIF file or enter a URL to crop
                </CardDescription>
              </CardHeader>
              <CardContent>
                {errorMessage && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{errorMessage}</span>
                  </div>
                )}
                <FileUploadSection
                  uploadMethod={uploadMethod}
                  setUploadMethod={setUploadMethod}
                  onFileSelect={(files) => handleFileUpload(files)}
                  onUrlSubmit={(url) => handleFileUpload(null, url)}
                  isProcessing={isProcessing}
                  supportedFormats="Supported formats: GIF, WebP, APNG, MNG"
                  accept=".gif,.webp,.apng"
                  toolName="GIF"
                />
              </CardContent>
            </Card>
          )}

          {/* Editing State */}
          {workflowState === 'editing' && mediaUrl && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Preview Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Crop Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CropperCanvas
                      imageUrl={mediaUrl}
                      aspect={aspect ? Number(aspect.split(':')[0]) / Number(aspect.split(':')[1]) : undefined}
                      crop={crop}
                      zoom={zoom}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                    <div className="mt-4 flex gap-4">
                      <Button onClick={resetWorkflow} variant="outline">
                        Upload Different GIF
                      </Button>
                      <Button
                        onClick={handleProcess}
                        disabled={isProcessing || !croppedAreaPixels}
                        className="flex-1"
                      >
                        {isProcessing ? 'Cropping...' : 'Crop GIF'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Settings Panel */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Crop Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                      <select
                        id="aspect-ratio"
                        value={aspect || 'free'}
                        onChange={e => handleAspectChange(e.target.value)}
                        className="w-full border rounded px-2 py-1 mt-2"
                      >
                        <option value="free">Free</option>
                        <option value="1:1">Square (1:1)</option>
                        <option value="4:3">4:3</option>
                        <option value="16:9">16:9</option>
                        <option value="3:2">3:2</option>
                        <option value="2:1">2:1</option>
                        <option value="golden">Golden Ratio</option>
                      </select>
                    </div>
                    <div>
                      <Label>Zoom</Label>
                      <Input
                        type="range"
                        min={1}
                        max={3}
                        step={0.01}
                        value={zoom}
                        onChange={e => setZoom(Number(e.target.value))}
                        className="w-full mt-2"
                      />
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                      <strong>Tips:</strong>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Drag and resize the crop area directly on the image.</li>
                        <li>Choose an aspect ratio or use free-form cropping.</li>
                        <li>Use the zoom slider to fine-tune your selection.</li>
                        <li>Preview updates live as you adjust the crop.</li>
                        <li>Supported formats: GIF, WebP, APNG, MNG.</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Processing State */}
          {workflowState === 'processing' && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Cropping Your GIF</h3>
                <p className="text-gray-600">Processing your GIF...</p>
              </CardContent>
            </Card>
          )}

          {/* Result State */}
          {workflowState === 'result' && resultUrl && (
            <ResultSection
              title="Your Cropped GIF is Ready!"
              imageUrl={resultUrl}
              downloadFileName="cropped.gif"
              onReset={resetWorkflow}
            />
          )}
        </div>
      </div>
    </>
  )
}
