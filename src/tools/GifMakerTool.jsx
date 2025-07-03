import React, { useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx'
import { Image, Settings } from 'lucide-react'
import FileUploadSection from '../components/FileUploadSection'
import ResultSection from '../components/ResultSection'
import GifConversionSettings from '../components/GifConversionSettings'

export default function GifMakerTool() {
  // Workflow: upload, preview, processing, result
  const [workflowState, setWorkflowState] = useState('upload')
  const [uploadMethod, setUploadMethod] = useState('file')
  const [mediaFiles, setMediaFiles] = useState([]) // File[] or []
  const [mediaUrls, setMediaUrls] = useState([]) // string[] for URLs
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  // GIF settings
  const [gifSettings, setGifSettings] = useState({
    frameDuration: 500,
    loopCount: 0
  })

  // Handle file or URL upload
  // Accepts files or an array of URLs
  const handleFileUpload = useCallback((files, urlInput = null) => {
    setErrorMessage(null)
    setResultUrl(null)
    if (uploadMethod === 'url' && urlInput) {
      // urlInput can be a string (single) or array (multi)
      if (Array.isArray(urlInput)) {
        setMediaUrls(urlInput)
      } else {
        setMediaUrls([urlInput])
      }
      setMediaFiles([])
    } else if (files && files.length > 0) {
      setMediaFiles(Array.from(files))
      setMediaUrls([])
    }
    setWorkflowState('preview')
  }, [uploadMethod])

  // Add support for multiple URLs (optional, for parity with old UI)
  const handleAddUrl = (url) => {
    setMediaUrls((prev) => [...prev, url])
    setMediaFiles([])
    setWorkflowState('preview')
  }

  // Remove a URL from the list
  const handleRemoveUrl = (index) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index))
  }

  // Reset workflow to upload state
  const resetWorkflow = () => {
    setWorkflowState('upload')
    setMediaFiles([])
    setMediaUrls([])
    setResultUrl(null)
    setErrorMessage(null)
  }

  // Handle GIF creation
  const handleConvert = useCallback(async () => {
    if (
      (uploadMethod === 'file' && (!mediaFiles || mediaFiles.length === 0)) ||
      (uploadMethod === 'url' && (!mediaUrls || mediaUrls.length === 0 || mediaUrls.some(url => !url)))
    ) return

    setErrorMessage(null)
    setIsProcessing(true)
    setResultUrl(null)
    setWorkflowState('processing')

    try {
      const formData = new FormData()
      if (uploadMethod === 'url') {
        mediaUrls.forEach(url => {
          formData.append('urls', url)
        })
      } else {
        mediaFiles.forEach(file => {
          formData.append('files', file)
        })
      }
      formData.append('frame_duration', gifSettings.frameDuration.toString())
      formData.append('loop_count', gifSettings.loopCount.toString())

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/gif-maker`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        if (data.task_id) {
          // Poll for result
          let state = null
          let result = null
          let pollCount = 0
          while (pollCount < 60) { // up to 60s
            const statusResp = await fetch(`${apiUrl}/api/task-status/${data.task_id}`)
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
          setErrorMessage('Unexpected response from server.')
          setWorkflowState('preview')
        }
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || 'An unknown error occurred during processing.')
        setWorkflowState('preview')
      }
    } catch (error) {
      setErrorMessage(error.message || 'Network error or unexpected issue.')
      setWorkflowState('preview')
    } finally {
      setIsProcessing(false)
    }
  }, [uploadMethod, gifSettings, mediaFiles, mediaUrls])

  // Settings panel change handler
  const handleSettingsChange = (key, value) => {
    setGifSettings(prev => ({ ...prev, [key]: value }))
  }

  // --- Render ---
  return (
    <>
      <Helmet>
        <title>GIF Maker - Create Animated GIFs from Images | EasyGIFMaker</title>
        <meta 
          name="description" 
          content="Create animated GIFs from multiple images online for free. Upload images, set custom timing, and generate high-quality GIFs instantly. No registration required." 
        />
        <meta 
          name="keywords" 
          content="gif maker, create gif, make gif, images to gif, animated gif creator, gif generator, free gif maker" 
        />
        <link rel="canonical" href="https://easygifmaker.com/gif-maker" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Image className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              GIF Maker - Create Animated GIFs from Images
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload multiple images and create stunning animated GIFs with custom timing and loop settings. 
              Perfect for creating memes, animations, and visual stories.
            </p>
          </div>

          {/* Upload State */}
          {workflowState === 'upload' && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Images</CardTitle>
                <CardDescription>
                  Select images or provide URLs to create your animated GIF
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
                  onUrlSubmit={(urls) => handleFileUpload(null, urls)}
                  isProcessing={isProcessing}
                  supportedFormats="Supported formats: JPG, PNG, GIF, WebP, APNG, HEIC, HEIF, MNG, JP2, AVIF, JXL, BMP, PDF"
                  accept="image/*"
                  isMultiple={true}
                  isMultipleUrl={true}
                  toolName="Image"
                  urlList={mediaUrls}
                  setUrlList={setMediaUrls}
                />
              </CardContent>
            </Card>
          )}

          {/* Preview State */}
          {workflowState === 'preview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Preview Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Preview Selected Images</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {uploadMethod === 'file' && mediaFiles && mediaFiles.length > 0 && (
                      mediaFiles.map((file, idx) => (
                        <img key={idx} src={URL.createObjectURL(file)} alt={file.name} className="rounded-lg object-cover aspect-square" />
                      ))
                    )}
                    {uploadMethod === 'url' && mediaUrls && mediaUrls.length > 0 && (
                      mediaUrls.map((url, idx) => (
                        <img key={idx} src={url} alt={`URL #${idx + 1}`} className="rounded-lg object-cover aspect-square" />
                      ))
                    )}
                  </CardContent>
                  <CardContent>
                    <div className="flex gap-4 mt-4">
                      <Button onClick={resetWorkflow} variant="outline">
                        Upload Different Images
                      </Button>
                      <Button 
                        onClick={handleConvert}
                        disabled={isProcessing || ((uploadMethod === 'file' && mediaFiles.length === 0) || (uploadMethod === 'url' && mediaUrls.length === 0))}
                        className="flex-1"
                      >
                        {isProcessing ? 'Processing...' : 'Create GIF'}
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
                      GIF Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="frame-duration" className="block font-medium mb-1">Frame Duration (ms)</label>
                        <input
                          id="frame-duration"
                          type="number"
                          value={gifSettings.frameDuration}
                          onChange={e => handleSettingsChange('frameDuration', parseInt(e.target.value, 10))}
                          min="10"
                          max="5000"
                          className="w-full border rounded px-2 py-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Time between frames in milliseconds</p>
                      </div>
                      <div>
                        <label htmlFor="loop-count" className="block font-medium mb-1">Loop Count</label>
                        <input
                          id="loop-count"
                          type="number"
                          value={gifSettings.loopCount}
                          onChange={e => handleSettingsChange('loopCount', parseInt(e.target.value, 10))}
                          min="0"
                          className="w-full border rounded px-2 py-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">0 = infinite loop</p>
                      </div>
                    </div>
                    {/* Tips for users */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                      <strong>Tips:</strong>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Frame Duration controls the speed of your GIF. Lower values = faster animation.</li>
                        <li>Loop Count sets how many times the GIF repeats. 0 means it will loop forever.</li>
                        <li>You can upload multiple images or paste image URLs to create your GIF.</li>
                        <li>Supported formats: JPG, PNG, GIF, WebP, and more.</li>
                        <li>Preview your images before creating the GIF.</li>
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
                <h3 className="text-lg font-semibold mb-2">Processing Your GIF</h3>
                <p className="text-gray-600">Creating your animated GIF...</p>
              </CardContent>
            </Card>
          )}

          {/* Result State */}
          {workflowState === 'result' && resultUrl && (
            <ResultSection
              title="Your GIF is Ready!"
              description="Your animated GIF has been successfully generated."
              imageUrl={resultUrl}
              downloadFileName="created.gif"
              onReset={resetWorkflow}
            />
          )}
        </div>
      </div>
    </>
  )
}