import React, { useState, useMemo, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Video } from 'lucide-react'
import VideoTimeline from '../components/VideoTimeline'
import ResultSection from '../components/ResultSection'
import GifConversionSettings from '../components/GifConversionSettings'
import FileUploadSection from '../components/FileUploadSection'

export default function VideoToGifTool() {
  const [workflowState, setWorkflowState] = useState('upload') // 'upload', 'editing', 'processing', 'result'
  const [uploadMethod, setUploadMethod] = useState('file')
  const [videoUrl, setVideoUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  // Video settings state
  const [videoSettings, setVideoSettings] = useState({
    startTime: 0,
    duration: 10,
    fps: 15,
    width: 480,
    height: 360,
    quality: 'medium',
    includeAudio: false
  })
  // State for video timeline segment range, controlled by VideoToGifTool
  const [segmentRangeState, setSegmentRange] = useState([0, 10])
  // Memoize segmentRange to ensure stable reference
  const segmentRange = useMemo(() => [...segmentRangeState], [segmentRangeState[0], segmentRangeState[1]])

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
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
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
          } catch (e) {}
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

  const handleSegmentChange = useCallback((segment) => {
    setVideoSettings(prev => ({
      ...prev,
      startTime: segment.startTime,
      duration: segment.duration
    }))
  }, [])

  const handleSettingChange = useCallback((key, value) => {
    setVideoSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const handleFinalProcess = async () => {
    if (!videoUrl) return
    setIsProcessing(true)
    setErrorMessage(null)
    setWorkflowState('processing')
    try {
      const formData = new FormData()
      const videoBlobResponse = await fetch(videoUrl)
      const blob = await videoBlobResponse.blob()
      formData.append('file', blob, 'video.mp4')
      formData.append('start_time', videoSettings.startTime.toString())
      formData.append('duration', videoSettings.duration.toString())
      formData.append('fps', videoSettings.fps.toString())
      formData.append('width', videoSettings.width.toString())
      formData.append('height', videoSettings.height.toString())
      formData.append('quality', videoSettings.quality)
      formData.append('include_audio', videoSettings.includeAudio ? 'true' : 'false')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/video-to-gif`, {
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
              throw new Error(statusData.error || 'GIF conversion failed.')
            }
          }
          await new Promise(res => setTimeout(res, 1000))
        }
        if ((status === 'SUCCESS' || status === 'Task completed!') && result) {
          // If result is an object with gif/mp4, show both download links
          if (typeof result === 'object' && result.gif) {
            setResultUrl({ gif: `${apiUrl}/api/download/${result.gif}`, mp4: result.mp4 ? `${apiUrl}/api/download/${result.mp4}` : null })
          } else {
            setResultUrl(`${apiUrl}/api/download/${result}`)
          }
          setWorkflowState('result')
        } else {
          throw new Error('GIF conversion timed out. Please try again.')
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

  const resetWorkflow = () => {
    setWorkflowState('upload')
    setVideoUrl(null)
    setErrorMessage(null)
    setResultUrl(null)
    setVideoSettings({
      startTime: 0,
      duration: 10,
      fps: 15,
      width: 480,
      height: 360,
      quality: 'medium',
      includeAudio: false
    })
    setSegmentRange([0, 10])
  }

  // --- Unique Publisher Content for AdSense/SEO ---
  const heroSection = (
    <section className="bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-xl shadow-lg p-8 mb-8 mt-4">
      <div className="flex items-center gap-4 mb-4">
        <Video size={40} className="text-white drop-shadow" />
        <h1 className="text-3xl font-extrabold tracking-tight">Video to GIF Converter</h1>
      </div>
      <p className="text-lg font-medium mb-2">Convert any video segment into a GIF or MP4 with our interactive timeline. Select the exact start and end points, preview your selection, and choose whether to include audio (MP4 output). Supports YouTube, Dailymotion, and direct video URLs—perfect for highlights, reactions, or tutorials.<br/>
      <span className='block mt-2'>Our tool is ideal for content creators, educators, marketers, and anyone who wants to capture the best moments from videos and share them as GIFs or short clips. No software to install—just upload, edit, and download in seconds.</span></p>
      <ul className="list-disc pl-6 text-base mt-2">
        <li>🎬 Interactive timeline for precise segment selection and trimming</li>
        <li>🔊 Option to include audio and download as MP4 if available</li>
        <li>🌐 Supports YouTube, Dailymotion, and direct video links</li>
        <li>⚡ Fast, high-quality GIF and MP4 generation for all major formats</li>
        <li>📱 Mobile-friendly and optimized for large files up to 200MB</li>
      </ul>
      <div className="mt-6 text-blue-100 text-base">
        <b>Popular Use Cases:</b> <br/>
        <span className="block mt-1">• Capture and share the best moments from YouTube, TikTok, or Instagram videos</span>
        <span className="block">• Create reaction GIFs, highlight reels, or tutorial snippets for blogs and social media</span>
        <span className="block">• Convert webinars, lectures, or meetings into shareable GIFs for your team</span>
        <span className="block">• Make animated previews or teasers for your own video content</span>
      </div>
    </section>
  )

  const tipsAndFaq = (
    <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-blue-700 mb-2">Tips, FAQs & Best Practices</h2>
      <ul className="list-disc pl-6 text-blue-900">
        <li><b>Tip:</b> Use the timeline to select only the part you want—shorter GIFs load faster and are easier to share.</li>
        <li><b>Tip:</b> Try different FPS and quality settings for the best balance of size and smoothness.</li>
        <li><b>Tip:</b> For best results, trim your video to the most interesting or relevant segment before converting.</li>
        <li><b>Tip:</b> Use the preview to check your GIF or MP4 before downloading—make adjustments as needed!</li>
        <li><b>FAQ:</b> <b>Why is my MP4 with audio not available?</b> If your video has no audio track, only a GIF will be generated.</li>
        <li><b>FAQ:</b> <b>Can I use YouTube or Dailymotion links?</b> Yes! Paste the video URL and we’ll handle the rest.</li>
        <li><b>FAQ:</b> <b>What video formats are supported?</b> MP4, MOV, WebM, AVI, MKV, FLV, and more.</li>
        <li><b>FAQ:</b> <b>Is there a file size limit?</b> Yes, up to 200MB per video for fast, reliable processing.</li>
      </ul>
    </section>
  )

  // --- Render ---
  return (
    <>
      <Helmet>
        <title>Video to GIF Converter - Convert MP4 to GIF Online | EasyGIFMaker</title>
        <meta 
          name="description" 
          content="Convert videos to GIFs online with interactive timeline selection. Support for YouTube, MP4, WebM, AVI, MOV. Trim, resize, and optimize your GIFs." 
        />
        <meta 
          name="keywords" 
          content="video to gif, mp4 to gif, youtube to gif, convert video gif, video gif converter, gif maker from video" 
        />
        <link rel="canonical" href="https://easygifmaker.com/video-to-gif" />
      </Helmet>
      <div className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          

          {/* Upload State */}
          {workflowState === 'upload' && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Video or Enter URL</CardTitle>
                <CardDescription>
                  Select a video file or enter a YouTube/video URL to convert to GIF
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
                  supportedFormats="Supported formats: MP4, WebM, AVI, MOV, MKV, FLV. Only direct video file links are accepted. YouTube, Facebook, TikTok, and similar links are not supported."
                  accept="video/*"
                  toolName="Video"
                />
              </CardContent>
            </Card>
          )}

          {/* Editing State */}
          {workflowState === 'editing' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Video Preview and Timeline */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Preview & Timeline Selection</CardTitle>
                    <CardDescription>
                      Use the timeline to select the exact segment you want to convert to GIF
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VideoTimeline
                      videoUrl={videoUrl}
                      onSegmentChange={handleSegmentChange}
                      segmentRange={segmentRange}
                      setSegmentRange={setSegmentRange}
                    />
                    <div className="mt-6 flex gap-4">
                      <Button onClick={resetWorkflow} variant="outline">
                        Upload Different Video
                      </Button>
                      <Button 
                        onClick={handleFinalProcess}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        {isProcessing ? 'Converting...' : 'Convert to GIF'}
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
                      Video to GIF Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GifConversionSettings
                      videoSettings={videoSettings}
                      onSettingChange={handleSettingChange}
                    />
                    {/* Tips for users */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                      <strong>Tips:</strong>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Use the timeline to select the exact segment of the video you want to convert.</li>
                        <li>Adjust FPS for smoother or smaller GIFs. Higher FPS = smoother, but larger file size.</li>
                        <li>Width/Height lets you resize the output GIF. Keep aspect ratio for best results.</li>
                        <li>Quality setting balances file size and visual clarity.</li>
                        <li>Supported video formats: MP4, WebM, AVI, MOV, MKV, FLV, and YouTube URLs.</li>
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Converting Video to GIF</h3>
                <p className="text-gray-600">Processing your video segment...</p>
              </CardContent>
            </Card>
          )}

          {/* Result State */}
          {workflowState === 'result' && resultUrl && (
            <>
              <ResultSection
                title="Your GIF is Ready!"
                description={resultUrl.mp4
                  ? "You can download both the GIF and the .mp4 with audio."
                  : videoSettings.includeAudio
                    ? "No audio was found in your video, so only a GIF was generated."
                    : ""}
                imageUrl={resultUrl.gif || resultUrl}
                downloadFileName="converted.gif"
                onReset={resetWorkflow}
                extraDownload={resultUrl.mp4 ? { url: resultUrl.mp4, label: 'Download MP4 with Audio' } : null}
              />
            </>
          )}


          {heroSection}
          {tipsAndFaq}
        </div>
      </div>
    </>
  )
}
