import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Video, Settings, Download } from 'lucide-react'
import VideoTimeline from '../components/VideoTimeline'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import EnhancedTipsSection from '../components/EnhancedTipsSection'
import ProcessingState from '../components/ProcessingState'
import UploadState from '../components/UploadState'
import ToolPageLayout from '../components/ToolPageLayout'
import DisplayAd from '@/components/ads/DisplayAd.jsx'
import InArticleAd from '@/components/ads/InArticleAd.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import useTaskPolling from '@/hooks/useTaskPolling.js'
import { safeJson } from '@/utils/http.js'

export default function VideoToGifTool() {
  const [workflowState, setWorkflowState] = useState('upload') // 'upload', 'editing', 'processing', 'result'
  const [uploadMethod, setUploadMethod] = useState('file')
  const [videoUrl, setVideoUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  // Video settings state
  const [videoSettings, setVideoSettings] = useState({
    fps: 15,
    width: 480,
    height: 360,
    quality: 'medium',
    includeAudio: false,
    includeWebp: false
  })
  // Segments state
  const [segments, setSegments] = useState([{ start: 0, end: 10 }])
  const addSegment = useCallback(() => {
    setSegments(prev => [...prev, { start: 0, end: 10 }])
  }, [])
  // Brightness and contrast controls
  const [brightness, setBrightness] = useState(0)
  const [contrast, setContrast] = useState(1)
  
  // Stable handlers for sliders to prevent infinite re-renders
  const handleBrightnessChange = useCallback((value) => {
    setBrightness(value[0])
  }, [])
  
  const handleContrastChange = useCallback((value) => {
    setContrast(value[0])
  }, [])
  
  const totalDuration = useMemo(
    () => segments.reduce((sum, s) => sum + (s.end - s.start), 0),
    [segments]
  )

  const { runTask, isProcessing: isPolling, reset: resetTask } = useTaskPolling({
    maxAttempts: 90,
    maxDelay: 5000
  })

  const busy = isProcessing || isPolling

  const adSlots = useMemo(() => ({
    header: <DisplayAd slot="1125232950" className="max-w-3xl w-full" />,
    mid: <InArticleAd slot="8336674411" className="max-w-2xl w-full" />,
    footer: <DisplayAd slot="1125232950" className="max-w-3xl w-full" />
  }), [])

  // Reset segments when video changes to prevent stale state
  useEffect(() => {
    if (videoUrl) {
      setSegments([{ start: 0, end: 10 }])
    }
  }, [videoUrl])

  // Unified upload handler for file or URL
  const handleFileUpload = useCallback(async (files, urlInput = null) => {
    if ((!files || files.length === 0) && !urlInput) return
    setErrorMessage(null)
    setResultUrl(null)
    setIsProcessing(true)
    try {
      let url
      if (uploadMethod === 'url' && urlInput) {
        // For URL uploads, send to backend for yt-dlp processing
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
        const response = await fetch(`${apiUrl}/api/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlInput })
        })
        if (response.ok) {
          const blob = await response.blob()
          url = URL.createObjectURL(blob)
        } else {
          let errorMessage = 'Failed to process video URL'
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } catch {}
          throw new Error(errorMessage)
        }
      } else {
        url = URL.createObjectURL(files[0])
      }
      setVideoUrl(url)
      setWorkflowState('editing')
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load video file/URL.')
    } finally {
      setIsProcessing(false)
    }
  }, [uploadMethod])

  const handleSegmentChange = useCallback((index, segment) => {
    setSegments(prev => {
      const updated = [...prev]
      updated[index] = { start: segment.startTime, end: segment.startTime + segment.duration }
      return updated
    })
  }, [])
  const handleSegmentRangeChange = useCallback((index, range) => {
    setSegments(prev => {
      const updated = [...prev]
      updated[index] = { start: range[0], end: range[1] }
      return updated
    })
  }, [])

  const handleSettingChange = useCallback((key, value) => {
    setVideoSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const mapBackendError = useCallback((message) => {
    if (!message) return 'An unknown error occurred during processing.'
    if (message.includes('Brightness must be between')) {
      return 'Brightness setting is out of range. Please choose a value between -1.0 and 1.0.'
    }
    if (message.includes('Contrast must be between')) {
      return 'Contrast setting is out of range. Please choose a value between 0 and 2.0.'
    }
    if (message.includes('Segments must be a non-empty list')) {
      return 'Please select at least one valid segment for conversion.'
    }
    if (message.includes('Each segment must have numeric start and end')) {
      return 'Segment start/end times must be numbers. Please check your segment settings.'
    }
    if (message.includes('Invalid segment timing')) {
      return 'Segment timing is invalid. Ensure start is >= 0 and end > start.'
    }
    if (message.includes('Segment exceeds video length')) {
      return 'One of your segments is longer than the video. Please adjust segment end times.'
    }
    if (message.includes('Invalid segments JSON')) {
      return 'There was a problem with your segment selection. Please reselect your segments.'
    }
    return message
  }, [])

  const handleFinalProcess = useCallback(async () => {
    if (!videoUrl) return
    setErrorMessage(null)
    setResultUrl(null)
    setIsProcessing(true)
    setWorkflowState('processing')
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'

    try {
      const taskResult = await runTask({
        startTask: async () => {
          const formData = new FormData()
          const videoBlobResponse = await fetch(videoUrl)
          const blob = await videoBlobResponse.blob()
          formData.append('file', blob, 'video.mp4')
          formData.append('segments', JSON.stringify(segments))
          formData.append('brightness', brightness.toString())
          formData.append('contrast', contrast.toString())
          formData.append('fps', videoSettings.fps.toString())
          formData.append('width', videoSettings.width.toString())
          formData.append('height', videoSettings.height.toString())
          formData.append('quality', videoSettings.quality)
          formData.append('include_audio', videoSettings.includeAudio ? 'true' : 'false')
          formData.append('include_webp', videoSettings.includeWebp ? 'true' : 'false')

          const response = await fetch(`${apiUrl}/api/video-to-gif`, {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            const errorData = await safeJson(response)
            throw new Error(mapBackendError(errorData.error))
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

      if (taskResult && typeof taskResult === 'object' && taskResult.gif) {
        setResultUrl({
          gif: `${apiUrl}/api/download/${taskResult.gif}?proxy=1`,
          mp4: taskResult.mp4 ? `${apiUrl}/api/download/${taskResult.mp4}?proxy=1` : null,
          webp: taskResult.webp ? `${apiUrl}/api/download/${taskResult.webp}?proxy=1` : null
        })
      } else if (taskResult) {
        setResultUrl(`${apiUrl}/api/download/${taskResult}?proxy=1`)
      } else {
        throw new Error('GIF conversion produced no output. Please try again.')
      }
      setWorkflowState('result')
    } catch (error) {
      setErrorMessage(mapBackendError(error.message))
      setWorkflowState('editing')
    } finally {
      setIsProcessing(false)
    }
  }, [videoUrl, runTask, segments, brightness, contrast, videoSettings, mapBackendError])

  const resetWorkflow = useCallback(() => {
    resetTask()
    setWorkflowState('upload')
    setVideoUrl(null)
    setErrorMessage(null)
    setResultUrl(null)
    setVideoSettings({
      fps: 15,
      width: 480,
      height: 360,
      quality: 'medium',
      includeAudio: false
    })
    setSegments([{ start: 0, end: 10 }])
    setBrightness(0)
    setContrast(1)
    setIsProcessing(false)
  }, [resetTask])

  // --- Render ---
  return (
    <>
      <ToolPageLayout
        title="Video to GIF Converter"
        description="Trim highlights, adjust colour, and export polished GIFs (plus optional MP4/WebP) from any video."
        icon={Video}
        seoProps={{
          title: 'Video to GIF Converter | EasyGIFMaker',
          description: 'Convert MP4, WebM, MOV, or URLs into crisp GIFs. Trim segments, tweak brightness/contrast, and export GIF, MP4, or WebP in one workflow.',
          keywords: 'video to gif, mp4 to gif, video to gif converter, convert video to gif, gif from video',
          canonical: 'https://easygifmaker.com/video-to-gif',
          ogImage: 'https://easygifmaker.com/blog/how-to-make-gifs-from-videos.svg'
        }}
        toolKey="videoToGif"
        adSlots={adSlots}
        midAdPosition={2}
      >
          {/* Upload State */}
          {workflowState === 'upload' && (
            <>
              <UploadState
                title="Upload Video or Enter URL"
                description="Select a video file or enter a YouTube/video URL to convert to GIF"
                errorMessage={errorMessage}
                uploadMethod={uploadMethod}
                setUploadMethod={setUploadMethod}
                onFileSelect={(files) => handleFileUpload(files)}
                onUrlSubmit={(url) => handleFileUpload(null, url)}
                isProcessing={busy}
                supportedFormats="Supported formats: MP4, WebM, AVI, MOV, MKV, FLV. Public video URLs (e.g., YouTube) are supported if accessible."
                accept="video/*"
                toolName="Video"
                useGradient={false}
              />
              <p className="mt-4 text-sm text-gray-600 text-center">
                You can also paste a YouTube or other video URL above to convert it into a GIF.
              </p>
            </>
          )}

          {/* Editing State */}
          {workflowState === 'editing' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Video Preview and Timeline */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-800">Video Preview & Timeline Selection</CardTitle>
                    <CardDescription className="text-gray-600">
                      Use the timeline to select the exact segment you want to convert to GIF
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-6 mb-6 backdrop-blur-sm border border-white/30 space-y-6">
                      {segments.map((seg, idx) => (
                        <VideoTimeline
                          key={`${videoUrl}-${idx}`}
                          videoUrl={videoUrl}
                          onSegmentChange={(segment) => handleSegmentChange(idx, segment)}
                          segmentRange={[seg.start, seg.end]}
                          setSegmentRange={(range) => handleSegmentRangeChange(idx, range)}
                          brightness={brightness}
                          contrast={contrast}
                        />
                      ))}
                      <Button
                        onClick={addSegment}
                        variant="outline"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 border-0 shadow-md hover:shadow-lg transition-colors"
                      >
                        ➕ Add Segment
                      </Button>
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={resetWorkflow} variant="outline" className="flex-1 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 border border-white/30">
                        Upload Different Video
                      </Button>
                      <Button 
                        onClick={handleFinalProcess}
                        disabled={busy}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {busy ? 'Converting...' : 'Convert to GIF'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Settings Panel */}
              <div className="min-w-0">
                <Card className="bg-gradient-to-br from-white to-indigo-50/30 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-bold text-gray-800">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <Settings className="h-5 w-5 text-white" />
                      </div>
                      Conversion Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
                        <label className="block font-semibold mb-3 sm:mb-4 text-gray-800 text-base sm:text-lg">
                          Frame Rate (FPS)
                        </label>
                        <Select value={videoSettings.fps} onValueChange={(value) => handleSettingChange('fps', value)}>
                          <SelectTrigger className="bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl px-3 sm:px-4 py-2 sm:py-3 font-medium text-sm sm:text-base">
                            <SelectValue placeholder="Select frame rate" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10 FPS (Small file)</SelectItem>
                            <SelectItem value="15">15 FPS (Balanced)</SelectItem>
                            <SelectItem value="24">24 FPS (Smooth)</SelectItem>
                            <SelectItem value="30">30 FPS (High quality)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 leading-relaxed">
                          Higher FPS creates smoother animations but larger files. 15 FPS is perfect for most use cases.
                        </p>
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
                        <label className="block font-semibold mb-3 sm:mb-4 text-gray-800 text-base sm:text-lg">
                          Quality
                        </label>
                        <Select value={videoSettings.quality} onValueChange={(value) => handleSettingChange('quality', value)}>
                          <SelectTrigger className="bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl px-3 sm:px-4 py-2 sm:py-3 font-medium text-sm sm:text-base">
                            <SelectValue placeholder="Select quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low (Small file)</SelectItem>
                            <SelectItem value="medium">Medium (Balanced)</SelectItem>
                            <SelectItem value="high">High (Best quality)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 leading-relaxed">
                          Choose quality based on your needs. Medium is recommended for most GIFs.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                          <input
                            type="checkbox"
                            checked={videoSettings.includeAudio}
                            onChange={e => handleSettingChange('includeAudio', e.target.checked)}
                          />
                          <span className="text-sm">Also export MP4 (with audio)</span>
                        </label>
                        <label className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                          <input
                            type="checkbox"
                            checked={videoSettings.includeWebp}
                            onChange={e => handleSettingChange('includeWebp', e.target.checked)}
                          />
                          <span className="text-sm">Also export animated WebP</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                          <label className="block font-semibold mb-2 sm:mb-3 text-gray-800 text-sm sm:text-base">
                            Width (pixels)
                          </label>
                          <input
                            type="number"
                            value={videoSettings.width}
                            onChange={e => handleSettingChange('width', parseInt(e.target.value, 10))}
                            min="100"
                            max="1920"
                            className="w-full bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-2 text-center font-semibold text-sm sm:text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border border-white/30"
                          />
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                          <label className="block font-semibold mb-2 sm:mb-3 text-gray-800 text-sm sm:text-base">
                            Height (pixels)
                          </label>
                          <input
                            type="number"
                            value={videoSettings.height}
                            onChange={e => handleSettingChange('height', parseInt(e.target.value, 10))}
                            min="100"
                            max="1080"
                            className="w-full bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-2 text-center font-semibold text-sm sm:text-base shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none border border-white/30"
                          />
                        </div>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
                        <label className="block font-semibold mb-3 sm:mb-4 text-gray-800 text-base sm:text-lg">
                          Brightness
                        </label>
                        <Slider min={-1} max={1} step={0.1} value={[brightness]} onValueChange={handleBrightnessChange} />
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
                        <label className="block font-semibold mb-3 sm:mb-4 text-gray-800 text-base sm:text-lg">
                          Contrast
                        </label>
                        <Slider min={0} max={3} step={0.1} value={[contrast]} onValueChange={handleContrastChange} />
                      </div>

                      {/* Export options are controlled above */}
                    </div>

                    {/* Enhanced Summary Section */}
                    <div className="mt-6 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/30">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-3 text-base sm:text-lg">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                          <span className="text-white text-sm">📊</span>
                        </div>
                        Conversion Summary
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/30">
                          <div className="flex items-center justify-between">
                            <div className="text-sm sm:text-base font-semibold text-gray-700">Duration</div>
                            <div className="text-sm sm:text-base font-bold text-blue-600">
                              {totalDuration.toFixed(1)}s
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/30">
                          <div className="flex items-center justify-between">
                            <div className="text-sm sm:text-base font-semibold text-gray-700">Size</div>
                            <div className="text-sm sm:text-base font-bold text-green-600">{videoSettings.width}×{videoSettings.height}</div>
                          </div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/30">
                          <div className="flex items-center justify-between">
                            <div className="text-sm sm:text-base font-semibold text-gray-700">Frame Rate</div>
                            <div className="text-sm sm:text-base font-bold text-purple-600">{videoSettings.fps} FPS</div>
                          </div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/30">
                          <div className="flex items-center justify-between">
                            <div className="text-sm sm:text-base font-semibold text-gray-700">Quality</div>
                            <div className="text-sm sm:text-base font-bold text-orange-600 capitalize">{videoSettings.quality}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <EnhancedTipsSection
                      title="Pro Tips for Perfect GIFs"
                      tips={[
                        "<strong>Timeline Selection</strong> Use the timeline to select only the part you want—shorter GIFs load faster and are easier to share.",
                        "<strong>FPS Settings</strong> 15 FPS provides excellent balance of smoothness and file size for most videos.",
                        "<strong>Quality Balance</strong> Medium quality works well for most use cases, balancing file size and visual quality.",
                        "<strong>Video Length</strong> Keep segments under 10 seconds for optimal GIF performance and sharing.",
                        "<strong>File Size</strong> Larger videos take longer to process. Consider trimming to the most important segment.",
                        "<strong>Preview First</strong> Use the preview to check your GIF before downloading. Make adjustments as needed!"
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
              description="Converting your video to GIF..."
            />
          )}

          {/* Result State */}
          {workflowState === 'result' && resultUrl && (
            <Card className="bg-gradient-to-br from-white to-green-50/30 shadow-lg">
              <CardContent className="text-center py-12">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {typeof resultUrl === 'object' && resultUrl.mp4 ? 'Your Files Are Ready!' : 'Your GIF is Ready!'}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {typeof resultUrl === 'object' && resultUrl.mp4 
                      ? 'Your video has been successfully converted to both GIF and MP4 formats.'
                      : 'Your video has been successfully converted to GIF.'
                    }
                  </p>
                </div>

                {/* Preview */}
                <div className="mb-6">
                  <img 
                    src={typeof resultUrl === 'string' ? resultUrl : (resultUrl.gif || resultUrl.mp4 || '')} 
                    alt="Preview" 
                    className="max-w-full h-auto rounded-xl shadow-lg mx-auto" 
                    style={{ maxHeight: '300px' }}
                  />
                </div>


                {/* Download Buttons */}
                <div className="space-y-3">
                  {/* GIF Download */}
                  <Button 
                    onClick={async () => {
                      const gifUrl = typeof resultUrl === 'string' ? resultUrl : resultUrl.gif
                      // Removed console.log for GIF download URL
                      try {
                        const response = await fetch(gifUrl)
                        if (!response.ok) {
                          throw new Error(`HTTP error! status: ${response.status}`)
                        }
                        const blob = await response.blob()
                        const url = window.URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = 'converted.gif'
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        window.URL.revokeObjectURL(url)
                      } catch (error) {
                        console.error('Download failed:', error)
                        alert('Download failed. Please try again.')
                      }
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download GIF
                  </Button>

                  {/* MP4 Download (only show if MP4 exists) */}
                  {typeof resultUrl === 'object' && resultUrl.mp4 && (
                    <Button 
                      onClick={async () => {
                        // Removed console.log for MP4 download URL
                        try {
                          const response = await fetch(resultUrl.mp4)
                          if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`)
                          }
                          const blob = await response.blob()
                          const url = window.URL.createObjectURL(blob)
                          const link = document.createElement('a')
                          link.href = url
                          link.download = 'converted.mp4'
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                          window.URL.revokeObjectURL(url)
                        } catch (error) {
                          console.error('Download failed:', error)
                          alert('Download failed. Please try again.')
                        }
                      }}
                      variant="outline"
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Download MP4 (with Audio)
                    </Button>
                  )}

                  {/* WebP Download (only show if WebP exists) */}
                  {typeof resultUrl === 'object' && resultUrl.webp && (
                    <Button 
                      onClick={async () => {
                        try {
                          const response = await fetch(resultUrl.webp)
                          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
                          const blob = await response.blob()
                          const url = window.URL.createObjectURL(blob)
                          const link = document.createElement('a')
                          link.href = url
                          link.download = 'converted.webp'
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                          window.URL.revokeObjectURL(url)
                        } catch (error) {
                          console.error('Download failed:', error)
                          alert('Download failed. Please try again.')
                        }
                      }}
                      variant="outline"
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download WebP
                    </Button>
                  )}
                </div>

                <div className="mt-6">
                  <Button 
                    onClick={resetWorkflow}
                    variant="outline"
                    className="bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
                  >
                    Convert Another Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}


      </ToolPageLayout>
    </>
  )
}
