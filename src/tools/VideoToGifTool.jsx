import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Video, Settings, Download } from 'lucide-react'
import VideoTimeline from '../components/VideoTimeline'
import SocialSharingSection from '../components/SocialSharingSection'
import TroubleshootingSection from '../components/TroubleshootingSection'
import TipsFaqsBestPracticesSection from '../components/TipsFaqsBestPracticesSection'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import ToolSeoSection from '../components/ToolSeoSection'
import HowToUseSection from '../components/HowToUseSection'
import EnhancedTipsSection from '../components/EnhancedTipsSection'
import ProcessingState from '../components/ProcessingState'
import UploadState from '../components/UploadState'
import ToolPageLayout from '../components/ToolPageLayout'
import ValueContentSection from '../components/ValueContentSection'
import DisplayAd from '@/components/ads/DisplayAd.jsx'
import InArticleAd from '@/components/ads/InArticleAd.jsx'
import AdsenseAd from '../components/AdsenseAd'
import { Slider } from '@/components/ui/slider.jsx'

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
    includeAudio: false
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
      formData.append('segments', JSON.stringify(segments))
      formData.append('brightness', brightness.toString())
      formData.append('contrast', contrast.toString())
      formData.append('fps', videoSettings.fps.toString())
      formData.append('width', videoSettings.width.toString())
      formData.append('height', videoSettings.height.toString())
      formData.append('quality', videoSettings.quality)
      formData.append('include_audio', videoSettings.includeAudio ? 'true' : 'false')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
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
      fps: 15,
      width: 480,
      height: 360,
      quality: 'medium',
      includeAudio: false
    })
    setSegments([{ start: 0, end: 10 }])
    setBrightness(0)
    setContrast(1)
  }

  // --- Render ---
  return (
    <>
      <ToolPageLayout
        title="Video to GIF Converter"
        description="Convert videos to GIFs online for free. Upload video files or paste URLs to create animated GIFs instantly."
        icon={Video}
        seoProps={{
          title: "Video to GIF Converter - Convert Videos to GIFs Online | EasyGIFMaker",
          description: "Free, high-quality video to GIF conversion. Upload files or paste a YouTube or other video URL to create GIFs instantly.",
          keywords: "video to gif, mp4 to gif, turn video into gif, make a gif from video, video to gif converter, create gif from video, convert mp4 to gif, mov to gif, mp4 to animated gif, video to animated gif, video to gif high quality, gif converter, gif kiss, gify, gif, converter, gif maker, ezgif, 视频转gif, imgflip, video video, screen to gif, gif converter, make a gif, gif creator, gif editor, ezgif.com, gifmaker, video to gif converter, gif downloader, how to make a gif, image to gif, gif generator, 视频转动图, 转gif, convert video to gif, mov to gif, youtube to gif, ezgif maker, make gif, ez gif, create gif, convert to gif, discord gif maker, gif maker free, ez gif maker, img flip, easygif, video a gif, gif to video, gif转换, 视频转gif 在线, turn video into gif, 视频转换gif, gif转视频, convertir video a gif, giif, gif maker online, com.smile.gifmaker, how to create a gif, mov转gif, transformar video em gif, 视频怎么转gif, imgflip.com, how to make gifs, 在线视频转gif, ezgif.com free, gif 변환, avi to gif, how to make gif, mkv to gif, youtube video to gif, lovegif, video into gif, видео в гиф, youtube gif, video gif, gif maker from video, gidf, gif animator, 動画をgifに変換, video to gif maker, 视频转gif工具, gif creator free, 转gif在线, ezgi, make gif from video, create gif from video, 视频变gif, gif to video converter, yt to gif, mov to gif converter, gif video, make your own gif, transformar vídeo em gif, 视频转为gif, ezgif video to gif, gifmaker.me, convertir video en gif, how to create gif, togif, ghif, 视频制作gif, adobe gif, 動画 gif 変換, gif変換, de video a gif, how to turn a video into a gif, video to, converter video em gif, adobe gif maker, picture to gif, to gif, turn video to gif,  create gif online, blog gif, link to gif, video para gif, convert mov to gif, из视频 вgif, 视频转gif软件, 视频转gif在线, 实况转gif, 视频转gif图, video to gif online, сделать гиф из видео, video to gif converter online, how to make a gif from a video, make video into gif, convert gif, convertir en gif, how to turn video into gif, convert gif to video, transformar em gif, gif化, converter to gif, 视频转gif动图, video to gif converter free, video to gif online, vid to gif, youtube video to gif converter, gif maker from video",
          canonical: "https://easygifmaker.com/video-to-gif"
        }}
        howToSteps={[
          {
            "@type": "HowToStep",
            "name": "Upload Video or Paste URL",
            "text": "Select your video file or paste a YouTube/other video URL."
          },
          {
            "@type": "HowToStep",
            "name": "Trim and Customize",
            "text": "Choose start and end time, crop, reverse, or overlay text on your video."
          },
          {
            "@type": "HowToStep",
            "name": "Generate and Download",
            "text": "Click 'Generate GIF' to create and download your animated GIF."
          }
        ]}
      >
        <HowToUseSection
          title="How to Use the Video to GIF Converter"
          steps={[
            {
              title: "Upload your video or paste a URL",
              description: "Select a local video file or paste a YouTube / public video URL. We fetch and prepare it automatically."
            },
            {
              title: "Create one or multiple segments",
              description: "Drag the timeline handles to set start/end. Click 'Add Segment' to append another portion – all segments are merged in order."
            },
            {
              title: "Preview each segment",
              description: "Use the Play Segment button to instantly preview the trimmed portion before processing."
            },
            {
              title: "Fine‑tune visuals",
              description: "Adjust Brightness (−1 to +1) and Contrast (0–3). Subtle tweaks (±0.1 / +0.2) preserve detail while improving clarity."
            },
            {
              title: "Tune conversion settings",
              description: "Pick FPS (smoothness vs size), choose quality level, and set output dimensions. Keep width ≤ 720 for faster processing."
            },
            {
              title: "(Optional) Include audio",
              description: "Enable 'Include Audio' to also produce an MP4 alongside your GIF (only if the source has an audio track)."
            },
            {
              title: "Generate & download",
              description: "Click Convert to process. When complete, download the GIF (and MP4 if enabled)."
            },
            {
              title: "Share & iterate",
              description: "Not perfect? Hit 'Convert Another Video' or adjust segments/settings and re‑run."
            }
          ]}
        />

  {/* Value content moved to end of page */}

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
                isProcessing={isProcessing}
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
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {isProcessing ? 'Converting...' : 'Convert to GIF'}
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

                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div className="flex items-center gap-3 mb-4">
                          <input
                            type="checkbox"
                            id="include-audio"
                            checked={videoSettings.includeAudio}
                            onChange={e => handleSettingChange('includeAudio', e.target.checked)}
                            className="w-5 h-5 text-blue-600 bg-white/90 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <label htmlFor="include-audio" className="font-semibold text-gray-800 text-lg">
                            Include Audio
                          </label>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Output as .mp4 with audio in addition to GIF. Perfect for preserving sound effects or music.
                        </p>
                      </div>
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


        <ToolSeoSection
          icon={Video}
          title="Video to GIF Converter"
          description1="Transform your videos into shareable GIFs with our powerful online converter. Whether you're creating memes, tutorials, or social media content, our tool makes it easy to extract the perfect moment from any video and convert it into a high-quality animated GIF."
          description2="Our interactive timeline lets you precisely select the segment you want to convert, while advanced settings allow you to control frame rate, quality, and size. Perfect for content creators, marketers, and anyone who wants to bring their video moments to life as GIFs."
          features1={[
            { emoji: "🎬", text: "Interactive timeline for precise segment selection" },
            { emoji: "⚡", text: "Fast conversion with high-quality output" },
            { emoji: "🔧", text: "Advanced settings for frame rate and quality control" }
          ]}
          features2={[
            { emoji: "🌐", text: "Supports MP4, WebM, AVI, MOV, and more" },
            { emoji: "📱", text: "Optimized for social media sharing" }
          ]}
          useCases={[
            { color: "bg-yellow-400", text: "Create reaction GIFs from TV shows and movies" },
            { color: "bg-green-400", text: "Convert tutorial videos into step-by-step GIFs" },
            { color: "bg-blue-400", text: "Extract funny moments for social media sharing" },
            { color: "bg-purple-400", text: "Create product demos and marketing content" }
          ]}
        />

          <TipsFaqsBestPracticesSection 
            proTips={[
              { color: "bg-blue-500", text: "Use multiple segments to stitch highlights into one seamless GIF." },
              { color: "bg-green-500", text: "Keep the combined duration under ~15s for shareable file sizes." },
              { color: "bg-purple-500", text: "Subtle Brightness (±0.1) & Contrast (+0.2) tweaks enhance clarity without banding." },
              { color: "bg-orange-500", text: "Lower FPS (10–15) drastically reduces size with minimal motion loss." },
              { color: "bg-pink-500", text: "Resize down (e.g. 480px width) before sharing on chats to speed load times." },
              { color: "bg-indigo-500", text: "Enable audio only if you need an MP4 – GIFs never contain sound." }
            ]}
            faqs={[
              { question: "How do multi‑segment GIFs work?", answer: "Each segment you add is trimmed and concatenated in order into one output animation (and MP4 if audio enabled)." },
              { question: "Why did my MP4 not appear?", answer: "Your source likely had no audio track or you left 'Include Audio' off." },
              { question: "What Brightness / Contrast range is safe?", answer: "Stay within −0.3 to +0.3 brightness and 0.8–1.6 contrast for natural results." },
              { question: "Can I rearrange segments?", answer: "Currently they render in the order created. Delete & re‑add to change ordering (reorder UI coming soon)." },
              { question: "Best FPS for quality vs size?", answer: "15 FPS balances smoothness and size; use 24–30 only for fast motion clips." },
              { question: "Why is my GIF larger than expected?", answer: "High resolution + high FPS + long duration compounds size. Reduce one or two factors." }
            ]}
            relatedResources={[
              { href: "/blog/how-to-make-gifs-from-videos", icon: "📹", text: "How to Make GIFs from Videos" },
              { href: "/blog/top-5-gif-optimization-tips", icon: "⚡", text: "Top 5 GIF Optimization Tips" }
            ]}
          />
          {/* Mid-content Ad - After troubleshooting */}
          <div className="my-8 flex justify-center">
            <InArticleAd 
              slot="8336674411"
              className="max-w-2xl w-full"
            />
          </div>

          <TroubleshootingSection 

          commonIssues={[
              {
                color: "bg-yellow-500",
                text: "If conversion fails, check your video format and file size."
              },
              {
                color: "bg-orange-500",
                text: "For URL videos, ensure the link is publicly accessible."
              },
              {
                color: "bg-red-500",
                text: "Still having issues?",
                link: "/contact"
              }
            ]}
            quickFixes={[
              {
                icon: "🔄",
                text: "Clear browser cache if video isn't loading"
              },
              {
                icon: "📱",
                text: "Try a different browser if you're having issues"
              },
              {
                icon: "⚡",
                text: "Check your internet connection for large files"
              }
            ]}
          />

          <SocialSharingSection 
            title="Share Your GIF!"
            description="Share your new GIF on Instagram, Twitter, TikTok, Facebook, or embed it in your blog or website. Tag us with #EasyGIFMaker for a chance to be featured!"
          />

          {/* Value Content Section (moved to end) */}
          {/* Bottom Ad - Before value content */}
          <div className="my-8 flex justify-center">
            <DisplayAd 
              slot="1125232950"
              className="max-w-3xl w-full"
            />
          </div>
          <ValueContentSection
            toolTitle="Video to GIF Converter"
            relatedLinks={[
              { href: '/blog/how-to-make-gifs-from-videos', label: 'How to Make GIFs from Videos (Step-by-Step)' },
              { href: '/blog/gif-optimization-techniques', label: 'GIF Optimization Techniques' },
              { href: '/blog/creative-gif-design-tutorial', label: 'Creative GIF Design Tutorial' }
            ]}
            altTools={[
              { href: '/gif-maker', label: 'GIF Maker', desc: 'Create GIFs from images and short clips.' },
              { href: '/optimize', label: 'Optimize GIF', desc: 'Compress and reduce GIF size.' },
              { href: '/add-text', label: 'Add Text to GIF', desc: 'Caption and annotate your GIFs.' }
            ]}
          />
      </ToolPageLayout>
    </>
  )
}