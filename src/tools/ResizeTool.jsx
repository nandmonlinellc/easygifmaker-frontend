import React, { useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Input } from '@/components/ui/input.jsx'
import { RotateCw, Settings } from 'lucide-react'
import ResultSection from '../components/ResultSection'
import FileUploadSection from '../components/FileUploadSection'

export default function ResizeTool() {
  const [workflowState, setWorkflowState] = useState('upload') // 'upload', 'editing', 'processing', 'result'
  const [uploadMethod, setUploadMethod] = useState('file')
  const [mediaUrl, setMediaUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [settings, setSettings] = useState({
    width: 300,
    height: 300,
    maintainAspectRatio: true
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

  // Handle resize process
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
      formData.append('width', settings.width.toString())
      formData.append('height', settings.height.toString())
      formData.append('maintain_aspect_ratio', settings.maintainAspectRatio.toString())
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/resize`, {
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
            status = statusData.status
            result = statusData.result
            if ((status === 'SUCCESS' || status === 'Task completed!') && result) {
              break
            } else if (status === 'FAILURE') {
              throw new Error(statusData.error || 'GIF resize failed.')
            }
          }
          await new Promise(res => setTimeout(res, 1000))
        }
        if ((status === 'SUCCESS' || status === 'Task completed!') && result) {
          const downloadUrl = `${apiUrl}/api/download/${result}`
          setResultUrl(downloadUrl)
          setWorkflowState('result')
        } else {
          throw new Error('GIF resize timed out. Please try again.')
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
      width: 300,
      height: 300,
      maintainAspectRatio: true
    })
  }

  // --- Render ---
  return (
    <>
      <Helmet>
        <title>Resize GIF - Change GIF Dimensions Online | EasyGIFMaker</title>
        <meta 
          name="description" 
          content="Resize GIFs online for free. Change GIF dimensions, maintain aspect ratio, and optimize for web or social media. Fast and easy GIF resizer tool." 
        />
        <meta 
          name="keywords" 
          content="resize gif, gif resizer, change gif size, gif dimensions, scale gif, gif resize tool" 
        />
        <link rel="canonical" href="https://easygifmaker.com/resize" />
      </Helmet>
      <div className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              <RotateCw size={40} className="text-blue-600 drop-shadow" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 drop-shadow-sm tracking-tight">
                Resize GIF
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Resize GIFs online for free. Change GIF dimensions, maintain aspect ratio, and optimize for web or social media. Fast and easy GIF resizer tool.
            </p>
            </div>
          {/* Upload State */}
          {workflowState === 'upload' && (
            <Card>
              <CardHeader>
                <CardTitle>Upload GIF</CardTitle>
                <CardDescription>
                  Select a GIF file or enter a URL to resize
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
                    <img src={mediaUrl} alt="Preview" className="max-w-full h-auto mx-auto rounded-lg" loading="lazy" />
                    <div className="mt-4 flex gap-4">
                      <Button onClick={resetWorkflow} variant="outline">
                        Upload Different GIF
                      </Button>
                      <Button
                        onClick={handleProcess}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        {isProcessing ? 'Resizing...' : 'Resize GIF'}
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
                      Resize Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="width">Width (px)</Label>
                      <Input
                        id="width"
                        type="number"
                        min={1}
                        value={settings.width}
                        onChange={e => setSettings({...settings, width: parseInt(e.target.value, 10)})}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (px)</Label>
                      <Input
                        id="height"
                        type="number"
                        min={1}
                        value={settings.height}
                        onChange={e => setSettings({...settings, height: parseInt(e.target.value, 10)})}
                        className="mt-2"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        id="maintain-aspect"
                        type="checkbox"
                        checked={settings.maintainAspectRatio}
                        onChange={e => setSettings({...settings, maintainAspectRatio: e.target.checked})}
                      />
                      <Label htmlFor="maintain-aspect">Maintain Aspect Ratio</Label>
                    </div>
                    {/* Tips for users */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                      <strong>Tips:</strong>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Set the desired width and height for your GIF.</li>
                        <li>Enable "Maintain Aspect Ratio" to prevent distortion.</li>
                        <li>Reducing dimensions will decrease file size.</li>
                        <li>Preview the resized GIF before downloading.</li>
                        <li>Supported formats: GIF, WebP, APNG, MNG.</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                {/* Common Sizes */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Common Sizes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setSettings({...settings, width: 500, height: 500})}
                    >
                      500×500 (Square)
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setSettings({...settings, width: 400, height: 300})}
                    >
                      400×300 (4:3)
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setSettings({...settings, width: 640, height: 360})}
                    >
                      640×360 (16:9)
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setSettings({...settings, width: 200, height: 200})}
                    >
                      200×200 (Small)
                    </Button>
                  </CardContent>
                </Card>
                {/* Tips */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Resizing Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    <p>• If "Maintain aspect ratio" is checked, the GIF will be scaled to fit within the specified Width and Height while preserving its original proportions.</p>
                    <p>• If "Maintain aspect ratio" is unchecked, the GIF will be stretched or compressed to exactly match the specified Width and Height, which may distort its appearance.</p>
                    <p>• Use common presets for quick resizing to standard dimensions.</p>
                    <p>• Experiment with different dimensions to find the perfect size for your needs.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Processing State */}
          {workflowState === 'processing' && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Resizing Your GIF</h3>
                <p className="text-gray-600">Processing your GIF...</p>
              </CardContent>
            </Card>
          )}

          {/* Result State */}
          {workflowState === 'result' && resultUrl && (
            <ResultSection
              title="Your Resized GIF is Ready!"
              imageUrl={resultUrl}
              downloadFileName="resized.gif"
              onReset={resetWorkflow}
            />
          )}

          {/* Unique Publisher Content for AdSense/SEO */}
          <section className="bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-xl shadow-lg p-8 mb-8 mt-4">
            <div className="flex items-center gap-4 mb-4">
              <RotateCw size={40} className="text-white drop-shadow" />
              <h1 className="text-3xl font-extrabold tracking-tight">Resize GIF</h1>
            </div>
            <p className="text-lg font-medium mb-2">Easily resize your GIFs with aspect ratio presets or custom dimensions. Whether you need to shrink a GIF for faster loading, fit a specific social media format, or enlarge for presentations, our Resize GIF tool gives you full control. Maintain quality while reducing file size for seamless sharing and web performance. No technical skills required—just upload, adjust, and preview your GIF in real time.</p>
            <ul className="list-disc pl-6 text-base mt-2">
              <li>📏 Choose from popular aspect ratio presets or enter custom width and height</li>
              <li>🔍 Real-time preview to ensure your GIF looks perfect before downloading</li>
              <li>⚡ Fast, high-quality resizing with minimal loss of detail</li>
              <li>🌐 Optimized for web, social media, and messaging apps</li>
            </ul>
          </section>
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Tips & FAQs</h2>
            <ul className="list-disc pl-6 text-blue-900">
              <li><b>Tip:</b> Use the preview window to check your resized GIF before downloading. This helps you avoid unwanted cropping or stretching.</li>
              <li><b>Tip:</b> For best results, keep the "Maintain Aspect Ratio" option enabled to prevent distortion.</li>
              <li><b>Tip:</b> Smaller GIFs load faster and are ideal for sharing on social media or embedding in emails.</li>
              <li><b>FAQ:</b> <b>Can I resize very large GIFs?</b> Yes, our tool supports files up to 200MB, but resizing very large GIFs may take a bit longer.</li>
              <li><b>FAQ:</b> <b>Will resizing reduce the quality of my GIF?</b> Our advanced algorithms minimize quality loss, but extreme downsizing may affect clarity. Use the preview to find the best balance.</li>
              <li><b>FAQ:</b> <b>What formats are supported?</b> You can upload GIF, APNG, and many other popular animated image formats.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}