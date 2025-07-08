import React, { useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Zap, Settings } from 'lucide-react'
import ResultSection from '../components/ResultSection'
import FileUploadSection from '../components/FileUploadSection'

// Unified workflow states: 'upload', 'editing', 'processing', 'result'
export default function OptimizeTool() {
  const [workflowState, setWorkflowState] = useState('upload')
  const [uploadMethod, setUploadMethod] = useState('file')
  const [mediaUrl, setMediaUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [settings, setSettings] = useState({
    quality: 80,
    colors: 256,
    lossy: 20
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

  // Handle optimize process
  const handleProcess = useCallback(async () => {
    if (!mediaUrl) return
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
      formData.append('quality', settings.quality.toString())
      formData.append('colors', settings.colors.toString())
      formData.append('lossy', settings.lossy.toString())
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/optimize`, {
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
            if ((status === 'SUCCESS' || status === 'Task completed!') && result) {
              break
            } else if (status === 'FAILURE') {
              throw new Error(statusData.error || 'GIF optimization failed.')
            }
          }
          await new Promise(res => setTimeout(res, 1000))
        }
        if ((status === 'SUCCESS' || status === 'Task completed!') && result) {
          const downloadUrl = `${apiUrl}/api/download/${encodeURIComponent(result)}`
          setResultUrl(downloadUrl)
          setWorkflowState('result')
        } else {
          throw new Error('GIF optimization timed out. Please try again.')
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
  }, [uploadMethod, settings, mediaUrl])

  // Reset workflow to upload state
  const resetWorkflow = () => {
    setWorkflowState('upload')
    setMediaUrl(null)
    setResultUrl(null)
    setErrorMessage(null)
    setSettings({
      quality: 80,
      colors: 256,
      lossy: 20
    })
  }

  // --- Render ---
  return (
    <>
      <Helmet>
        <title>Optimize GIF - Compress and Reduce GIF File Size | EasyGIFMaker</title>
        <meta 
          name="description" 
          content="Optimize and compress GIFs online for free. Reduce file size while maintaining quality. Perfect for web use and faster loading times." 
        />
        <meta 
          name="keywords" 
          content="optimize gif, compress gif, reduce gif size, gif optimizer, gif compression, smaller gif files" 
        />
        <link rel="canonical" href="https://easygifmaker.com/optimize" />
      </Helmet>

      <div className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 border border-blue-100">

          {/* Upload State */}
          {workflowState === 'upload' && (
            <Card>
              <CardHeader>
                <CardTitle>Upload GIF</CardTitle>
                <CardDescription>
                  Select a GIF file to optimize and compress
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
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img src={mediaUrl} alt="Preview" className="max-w-full h-auto mx-auto rounded-lg" />
                    <div className="mt-4 flex gap-4">
                      <Button onClick={resetWorkflow} variant="outline">
                        Upload Different GIF
                      </Button>
                      <Button 
                        onClick={handleProcess}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        {isProcessing ? 'Optimizing...' : 'Optimize GIF'}
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
                      Optimization Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="quality">Quality: {settings.quality}%</Label>
                      <Slider
                        id="quality"
                        min={10}
                        max={100}
                        step={5}
                        value={[settings.quality]}
                        onValueChange={(value) => setSettings({...settings, quality: value[0]})}
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">Higher quality = larger file size</p>
                    </div>

                    <div>
                      <Label htmlFor="colors">Colors: {settings.colors}</Label>
                      <Slider
                        id="colors"
                        min={8}
                        max={256}
                        step={8}
                        value={[settings.colors]}
                        onValueChange={(value) => setSettings({...settings, colors: value[0]})}
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">Fewer colors = smaller file size</p>
                    </div>

                    <div>
                      <Label htmlFor="lossy">Lossy Compression: {settings.lossy}</Label>
                      <Slider
                        id="lossy"
                        min={0}
                        max={100}
                        step={5}
                        value={[settings.lossy]}
                        onValueChange={(value) => setSettings({...settings, lossy: value[0]})}
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">Higher compression = smaller file size</p>
                    </div>
                    {/* Tips for users */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                      <strong>Tips:</strong>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Quality controls the overall visual fidelity. Lower for smaller files.</li>
                        <li>Reduce the number of colors for simple graphics to save space.</li>
                        <li>Lossy compression can greatly reduce file size, but may affect quality.</li>
                        <li>Try different settings and preview the result before downloading.</li>
                        <li>Supported formats: GIF, WebP, APNG, MNG.</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                {/* Presets */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Optimization Presets</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setSettings({quality: 95, colors: 256, lossy: 0})}
                    >
                      High Quality
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setSettings({quality: 80, colors: 128, lossy: 20})}
                    >
                      Balanced
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setSettings({quality: 60, colors: 64, lossy: 40})}
                    >
                      Small File Size
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setSettings({quality: 40, colors: 32, lossy: 60})}
                    >
                      Maximum Compression
                    </Button>
                  </CardContent>
                </Card>
                {/* Tips */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Optimization Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    <p>• Use fewer colors for simple graphics</p>
                    <p>• Higher lossy compression for web use</p>
                    <p>• Test different settings for best results</p>
                    <p>• Consider your target file size</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Processing State */}
          {workflowState === 'processing' && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Optimizing Your GIF</h3>
                <p className="text-gray-600">Processing your GIF...</p>
              </CardContent>
            </Card>
          )}

          {/* Result State */}
          {workflowState === 'result' && resultUrl && (
            <ResultSection
              title="Your Optimized GIF is Ready!"
              imageUrl={resultUrl}
              downloadFileName="optimized.gif"
              onReset={resetWorkflow}
            />
          )}


          {/* Unique Publisher Content for AdSense/SEO */}
          <section className="bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-xl shadow-lg p-8 mb-8 mt-4">
            <div className="flex items-center gap-4 mb-4">
              <Zap size={40} className="text-white drop-shadow" />
              <h1 className="text-3xl font-extrabold tracking-tight">Optimize GIF</h1>
            </div>
            <p className="text-lg font-medium mb-2">Compress and optimize your GIFs without sacrificing quality. Our Optimize GIF tool uses advanced algorithms to reduce file size, making your GIFs load faster on websites, social media, and messaging apps. Choose from multiple optimization levels to find the perfect balance between quality and size. Great for sharing, embedding, or saving bandwidth—no expertise required!</p>
            <ul className="list-disc pl-6 text-base mt-2">
              <li>⚡ Multiple optimization levels for maximum flexibility</li>
              <li>📉 Reduce file size for faster loading and sharing</li>
              <li>🔍 Preview your optimized GIF before downloading</li>
              <li>🌐 Works with GIF, APNG, and other animated formats</li>
            </ul>
          </section>
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Tips & FAQs</h2>
            <ul className="list-disc pl-6 text-blue-900">
              <li><b>Tip:</b> Try different optimization levels to find the best balance between file size and visual quality.</li>
              <li><b>Tip:</b> Lowering the number of colors can dramatically reduce file size with minimal impact on simple GIFs.</li>
              <li><b>Tip:</b> Use the preview to compare the original and optimized GIF before downloading.</li>
              <li><b>FAQ:</b> <b>Will optimization affect animation?</b> No, your GIF’s animation will remain smooth and intact.</li>
              <li><b>FAQ:</b> <b>Can I optimize very large GIFs?</b> Yes, files up to 200MB are supported, but larger files may take longer to process.</li>
              <li><b>FAQ:</b> <b>What formats are supported?</b> GIF, APNG, and many other animated formats are accepted.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
