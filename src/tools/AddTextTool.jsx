import React, { useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Type, Settings } from 'lucide-react'
import InteractiveCanvas from '../components/InteractiveCanvas'
import ResultSection from '../components/ResultSection'
import TextSettingsPanel from '../components/TextSettingsPanel'
import FileUploadSection from '../components/FileUploadSection'

export default function AddTextTool() {
  const [workflowState, setWorkflowState] = useState('upload') // 'upload', 'editing', 'processing', 'result'
  const [uploadMethod, setUploadMethod] = useState('file')
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
    y: 0
  })

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

  // Handle text position change from InteractiveCanvas
  const handleTextPositionChange = useCallback((position) => {
    setTextSettings(prev => ({
      ...prev,
      x: position.x,
      y: position.y
    }))
  }, [])

  // Reset workflow to upload state
  const resetWorkflow = () => {
    setWorkflowState('upload')
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
      y: 0
    }))
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
        const response = await fetch(mediaUrl)
        const blob = await response.blob()
        formData.append('file', blob, 'image.png')
      }
      formData.append('text', textSettings.text)
      formData.append('font_family', textSettings.fontFamily)
      formData.append('font_size', textSettings.fontSize.toString())
      formData.append('color', textSettings.color)
      formData.append('stroke_color', textSettings.strokeColor)
      formData.append('stroke_width', textSettings.strokeWidth.toString())
      formData.append('x', textSettings.x.toString())
      formData.append('y', textSettings.y.toString())
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/add-text`, {
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
          const url = URL.createObjectURL(new Blob([gifBlob], { type: 'image/gif' }))
          setResultUrl(url)
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
      <Helmet>
        <title>Add Text to GIF - Text Overlay Tool | EasyGIFMaker</title>
        <meta 
          name="description" 
          content="Add custom text, captions, and watermarks to your GIFs and images. Interactive text editor with live preview, custom fonts, colors, and positioning." 
        />
        <meta 
          name="keywords" 
          content="adobe mov to gif, ahegao gif, animated gif converter, animated gif to mp4, animated gif to video, birthday sex gif, change video to gif, convert a mov to gif, convert a mp4 to gif, convert animated gif to mp4, convert animated gif to video, convert from gif to mp4, convert from mov to gif, convert gif in video, convert gif to mp4, convert gif to video, convert mov to gif, convert movie to gif, convert mp4 to animated gif, convert mp4 to gif, convert video to animated gif, converting a video to gif, create animated gif from video, create gif from video, download tweet gif, gif converter, gif convertir, gif dancing funny, gif generator from video, gif recording, gif to mp4, gif to video, gif tweet downloader, gifv to mp4, make a gif from video, make video in gif, mov to animated gif, mov to gif, movie to gif converter, mp4 to animated gif, mp4 to gif, quicktime to gif, tiktok gif, turn gif into video, turn mov into gif, turn mp4 into gif, turn video into animated gif, turn video into gif, video as gif, video clip to gif, video in gif converter, video in to gif, video to animated gif, video to gif, video to gif converter, webm to gif, www gifyoutube, youtube gif maker, youtube to gif, youtube video to gif" 
        />
        <link rel="canonical" href="https://easygifmaker.com/add-text" />
      </Helmet>
      <div className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              <Type size={40} className="text-blue-600 drop-shadow" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 drop-shadow-sm tracking-tight">
                Add Text to GIF
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Add custom text, captions, and watermarks to your GIFs and images. Interactive text editor with live preview, custom fonts, colors, and positioning.
            </p>
          </div>

          {/* Upload State */}
          {workflowState === 'upload' && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Image or GIF</CardTitle>
                <CardDescription>
                  Select an image or GIF to add text overlay
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
                  supportedFormats="Supported formats: JPG, PNG, GIF, WebP, APNG, HEIC, HEIF, MNG, JP2, AVIF, JXL, BMP, PDF"
                  accept="image/*"
                  toolName="Image"
                />
              </CardContent>
            </Card>
          )}

          {/* Editing State */}
          {workflowState === 'editing' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Preview Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Live Preview</CardTitle>
                    <CardDescription>
                      Drag the text to position it. Changes are shown in real-time.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InteractiveCanvas
                      imageUrl={mediaUrl}
                      text={textSettings.text}
                      textSettings={textSettings}
                      onTextPositionChange={handleTextPositionChange}
                      onCanvasResize={setCanvasDimensions}
                    />
                    <div className="mt-4 flex gap-4">
                      <Button onClick={resetWorkflow} variant="outline">
                        Upload Different File
                      </Button>
                      <Button 
                        onClick={handleFinalProcess}
                        disabled={isProcessing || !textSettings.text.trim()}
                        className="flex-1"
                      >
                        {isProcessing ? 'Processing...' : 'Add Text to Image'}
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
                      Text Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TextSettingsPanel
                      canvasSize={canvasDimensions}
                      textSettings={textSettings}
                      onTextSettingsChange={setTextSettings}
                    />
                    {/* Tips for users */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                      <strong>Tips:</strong>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Type your text and customize font, size, color, and outline.</li>
                        <li>Drag the text on the preview to position it exactly where you want.</li>
                        <li>Use the settings to adjust alignment and fine-tune placement.</li>
                        <li>Preview your changes live before applying.</li>
                        <li>Supported formats: JPG, PNG, GIF, WebP, and more.</li>
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Processing Your Image</h3>
                <p className="text-gray-600">Adding text overlay to your image...</p>
              </CardContent>
            </Card>
          )}

          {/* Result State */}
          {workflowState === 'result' && resultUrl && (
            <ResultSection
              title="Your Image is Ready!"
              description="Your image with text has been successfully generated."
              imageUrl={resultUrl}
              downloadFileName="image-with-text.gif"
              onReset={resetWorkflow}
            />
          )}

          {/* Unique Publisher Content for AdSense/SEO */}
          <section className="bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-xl shadow-lg p-8 mb-8 mt-4">
            <div className="flex items-center gap-4 mb-4">
              <Type size={40} className="text-white drop-shadow" />
              <h1 className="text-3xl font-extrabold tracking-tight">Add Text to GIF</h1>
            </div>
            <p className="text-lg font-medium mb-2">Add animated or static text overlays to your GIFs with full creative control. Our Add Text tool lets you customize font, color, size, and position, and see your changes live before downloading. Perfect for captions, memes, branding, or just having fun—no design skills required! Choose from a variety of fonts and styles to make your GIFs stand out on social media, websites, or anywhere you share them.</p>
            <ul className="list-disc pl-6 text-base mt-2">
              <li>📝 Add captions, memes, or branding to any GIF</li>
              <li>🎨 Customize font, color, size, and position</li>
              <li>🔍 Live preview to see your edits in real time</li>
              <li>🌐 Works with GIF, APNG, and other animated formats</li>
            </ul>
          </section>
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Tips & FAQs</h2>
            <ul className="list-disc pl-6 text-blue-900">
              <li><b>Tip:</b> Use the live preview to position your text exactly where you want it on the GIF.</li>
              <li><b>Tip:</b> Try different fonts and colors to match your brand or style.</li>
              <li><b>Tip:</b> Animated text can make your GIFs more eye-catching for social media.</li>
              <li><b>FAQ:</b> <b>Can I use custom fonts?</b> We support a variety of fonts and styles for maximum creativity.</li>
              <li><b>FAQ:</b> <b>Will the text be animated?</b> You can choose static or animated text overlays depending on your needs.</li>
              <li><b>FAQ:</b> <b>What file types are supported?</b> GIF, APNG, and many other animated formats are accepted.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
