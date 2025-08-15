import React, { useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx'
import { Image, Settings } from 'lucide-react'
import FileUploadSection from '../components/FileUploadSection'
import ResultSection from '../components/ResultSection'
import GifConversionSettings from '../components/GifConversionSettings'
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

export default function GifMakerTool() {
  // Workflow: upload, preview, processing, result
  const [workflowState, setWorkflowState] = useState('upload')
  const [uploadMethod, setUploadMethod] = useState('file')
  // Each frame: { file, url, duration, effect }
  const [frames, setFrames] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  // GIF settings
  const [gifSettings, setGifSettings] = useState({
    frameDuration: 500,
    loopCount: 0
  })

  // Add quality level state
  const [qualityLevel, setQualityLevel] = useState('high')
  // Handle file or URL upload
  // Accepts files or an array of URLs
  const handleFileUpload = useCallback((files, urlInput = null) => {
    setErrorMessage(null)
    setResultUrl(null)
    let newFrames = []
    if (uploadMethod === 'url' && urlInput) {
      const urls = Array.isArray(urlInput) ? urlInput : [urlInput]
      newFrames = urls.map(url => ({ url, duration: gifSettings.frameDuration, effect: 'none' }))
    } else if (files && files.length > 0) {
      newFrames = Array.from(files).map(file => ({ file, duration: gifSettings.frameDuration, effect: 'none' }))
    }
    setFrames(newFrames)
    setWorkflowState('preview')
  }, [uploadMethod, gifSettings.frameDuration])

  // Add support for multiple URLs (optional, for parity with old UI)
  const handleAddUrl = (url) => {
    setFrames((prev) => [...prev, { url, duration: gifSettings.frameDuration, effect: 'none' }])
    setWorkflowState('preview')
  }

  // Remove a URL from the list
  const handleRemoveFrame = (index) => {
    setFrames((prev) => prev.filter((_, i) => i !== index))
  }

  // Reset workflow to upload state
  const resetWorkflow = () => {
    setWorkflowState('upload')
    setFrames([])
    setResultUrl(null)
    setErrorMessage(null)
  }

  // Handle GIF creation
  const handleConvert = useCallback(async () => {
    if (!frames || frames.length === 0) return

    setErrorMessage(null)
    setIsProcessing(true)
    setResultUrl(null)
    setWorkflowState('processing')

    try {
      const formData = new FormData()
      frames.forEach((frame) => {
        if (frame.file) {
          formData.append('files', frame.file)
        } else if (frame.url) {
          formData.append('urls', frame.url)
        }
      })
      // Send durations and effects as JSON arrays
      formData.append('frame_durations', JSON.stringify(frames.map(f => f.duration)))
      formData.append('effects', JSON.stringify(frames.map(f => f.effect)))
      formData.append('loop_count', gifSettings.loopCount.toString())
      formData.append('quality_level', qualityLevel)

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
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
              
              // Create blob URL for preview
              const url = URL.createObjectURL(gifBlob)
              setResultUrl({
                previewUrl: url,
                downloadUrl: `${apiUrl}/api/download/${result}`
              })
              // Fire Google Ads conversion event after GIF is created
            if (window.gtag) {
              window.gtag('event', 'conversion', {
                'send_to': 'AW-355581212/jpJHCIiCqI8DEJz6xqkB',
                'value': 1.0,
                'currency': 'USD',
                'transaction_id': ''
              });
            }
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
  }, [uploadMethod, gifSettings, frames])

  // Settings panel change handler
  const handleSettingsChange = (key, value) => {
    setGifSettings(prev => ({ ...prev, [key]: value }))
  }

  // Drag-and-drop state and handlers
  const [draggedIdx, setDraggedIdx] = useState(null)
  const handleDragStart = idx => setDraggedIdx(idx)
  const handleDragOver = idx => e => {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === idx) return
    setFrames(frames => {
      const updated = [...frames]
      const [removed] = updated.splice(draggedIdx, 1)
      updated.splice(idx, 0, removed)
      return updated
    })
    setDraggedIdx(idx)
  }
  const handleDragEnd = () => setDraggedIdx(null)

  // --- Render ---
  return (
    <>
    <ToolPageLayout
      title="GIF Maker"
      description="Create animated GIFs from multiple images online for free. Upload images, set custom timing, and generate high-quality GIFs instantly."
      icon={Image}
      seoProps={{
        title: "GIF Maker - Create Animated GIFs from Images | EasyGIFMaker",
        description: "Create animated GIFs from multiple images online for free. Upload images, set custom timing, and generate high-quality GIFs instantly. No registration required.",
        keywords: "gif maker, animated gif maker, make a gif from photos, make your own gif, create gif from images, create your own gif, make a gif from pictures, create a gif from pictures, gif creator, gif builder, custom gif, high quality gif maker, free gif maker, online gif maker, gif creator online, gif maker app, make my own gif, easy gif animator",
        canonical: "https://easygifmaker.com/gif-maker"
      }}
      howToSteps={[
        {
          "@type": "HowToStep",
          "name": "Upload Images",
          "text": "Select multiple image files or paste image URLs to create your GIF."
        },
        {
          "@type": "HowToStep",
          "name": "Arrange and Preview",
          "text": "Reorder your images using drag-and-drop and preview them in the gallery."
        },
        {
          "@type": "HowToStep",
          "name": "Set Frame Duration",
          "text": "Adjust the frame duration and loop count in the GIF settings panel."
        },
        {
          "@type": "HowToStep",
          "name": "Create and Download",
          "text": "Click 'Create GIF' to generate your animation, then download and share it!"
        }
      ]}
    >
      <HowToUseSection
        title="How to Use the GIF Maker"
        steps={[
          {
            title: "Upload your images",
            description: "Click \"Upload Images\" or drag and drop your files. You can also paste image URLs."
          },
          {
            title: "Arrange and preview",
            description: "Reorder your images using drag-and-drop, and preview them in the gallery."
          },
          {
            title: "Adjust settings",
            description: "Set frame duration and loop count in the GIF Settings panel."
          },
          {
            title: "Create and download",
            description: "Click \"Create GIF\" to generate your animation, then download and share it!"
          }
        ]}
      />
          {/* Upload State */}
          {workflowState === 'upload' && (
            <UploadState
              title="Upload Images"
              description="Select images or provide URLs to create your animated GIF"
              errorMessage={errorMessage}
              uploadMethod={uploadMethod}
              setUploadMethod={setUploadMethod}
              onFileSelect={(files) => handleFileUpload(files)}
              onUrlSubmit={(urls) => handleFileUpload(null, urls)}
              isProcessing={isProcessing}
              supportedFormats="Supported formats: JPG, PNG, GIF, WebP, APNG, HEIC, HEIF, MNG, JP2, AVIF, JXL, BMP, PDF"
              accept="image/*"
              toolName="Image"
              useGradient={false}
              isMultiple={true}
              isMultipleUrl={true}
              urlList={frames.filter(f => f.url).map(f => f.url)}
              setUrlList={urls => {
                setFrames(urls.map(url => ({ url, duration: gifSettings.frameDuration, effect: 'none' })));
                setWorkflowState('preview');
              }}
            />
          )}

          {/* Preview State */}
          {workflowState === 'preview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Preview Section */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-800">Preview Selected Images</CardTitle>
                    <CardDescription className="text-gray-600">
                      Drag and drop to reorder images. The order determines your GIF sequence.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Enhanced Preview Grid */}
                    <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {frames.map((frame, idx) => (
                          <div
                            key={idx}
                            className="relative group transform transition-all duration-300 hover:scale-105"
                            draggable
                            onDragStart={() => handleDragStart(idx)}
                            onDragOver={handleDragOver(idx)}
                            onDragEnd={handleDragEnd}
                            onDrop={handleDragEnd}
                          >
                            <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                              <img
                                src={frame.file ? URL.createObjectURL(frame.file) : frame.url}
                                alt={frame.file ? frame.file.name : `URL #${idx + 1}`}
                                className="w-full h-28 object-cover transition-transform duration-300 group-hover:scale-110"
                                loading="lazy"
                                style={{ pointerEvents: 'auto' }}
                                title={`${frame.file ? frame.file.name : `Image ${idx + 1}`} - Drag to reorder`}
                              />
                              <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                                {idx + 1}
                              </div>
                              <div className="absolute top-2 right-2 flex flex-col gap-1">
                                <input
                                  type="number"
                                  min="50"
                                  max="5000"
                                  value={frame.duration}
                                  onChange={e => {
                                    const val = parseInt(e.target.value, 10)
                                    setFrames(frames => frames.map((f, i) => i === idx ? { ...f, duration: val } : f))
                                  }}
                                  className="w-16 px-1 py-0.5 rounded bg-white/80 text-xs text-gray-800 border border-gray-200 shadow-sm z-10"
                                  title="Frame duration (ms)"
                                  style={{ pointerEvents: 'auto' }}
                                />
                                <select
                                  value={frame.effect}
                                  onChange={e => setFrames(frames => frames.map((f, i) => i === idx ? { ...f, effect: e.target.value } : f))}
                                  className="w-16 px-1 py-0.5 rounded bg-white/80 text-xs text-gray-800 border border-gray-200 shadow-sm z-10"
                                  title="Frame effect"
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  <option value="none">None</option>
                                  <option value="fade">Fade</option>
                                  <option value="zoom">Zoom</option>
                                </select>
                              </div>
                              <button
                                onClick={() => handleRemoveFrame(idx)}
                                className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-600"
                                title="Remove frame"
                              >
                                Remove
                              </button>
                              <div
                                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-2"
                                style={{ pointerEvents: 'none' }}
                              >
                                <div className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-full">
                                  Drag to reorder
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-700 font-medium shadow-sm">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          {frames.length} images selected
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button onClick={resetWorkflow} variant="outline" className="flex-1 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300">
                        Upload Different Images
                      </Button>
                      <Button 
                        onClick={handleConvert}
                        disabled={isProcessing || frames.length === 0}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {isProcessing ? 'Processing...' : 'Create GIF'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Settings Panel */}
              <div>
                <Card className="bg-gradient-to-br from-white to-indigo-50/30 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <Settings className="h-5 w-5 text-white" />
                      </div>
                      GIF Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                        <label htmlFor="frame-duration" className="block font-semibold mb-3 text-gray-800 text-base">
                          Frame Duration
                          <span className="text-sm text-gray-500 ml-2 font-normal">(milliseconds)</span>
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 relative">
                            <input
                              id="frame-duration"
                              type="range"
                              min="100"
                              max="2000"
                              step="50"
                              value={gifSettings.frameDuration}
                              onChange={e => handleSettingsChange('frameDuration', parseInt(e.target.value, 10))}
                              className="w-full h-3 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full appearance-none cursor-pointer slider-thumb-blue"
                            />
                            <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                              <span className="font-medium">Fast</span>
                              <span className="font-medium">Slow</span>
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              value={gifSettings.frameDuration}
                              onChange={e => handleSettingsChange('frameDuration', parseInt(e.target.value, 10))}
                              min="100"
                              max="2000"
                              className="w-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-semibold text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border border-white/30"
                            />
                            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">ms</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                          Controls animation speed. Lower values create faster, more energetic animations, while higher values create slower, more dramatic effects.
                        </p>
                      </div>
                      
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                        <label htmlFor="loop-count" className="block font-semibold mb-3 text-gray-800 text-base">
                          Loop Count
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 relative">
                            <input
                              id="loop-count"
                              type="range"
                              min="0"
                              max="10"
                              step="1"
                              value={gifSettings.loopCount}
                              onChange={e => handleSettingsChange('loopCount', parseInt(e.target.value, 10))}
                              className="w-full h-3 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 rounded-full appearance-none cursor-pointer slider-thumb-green"
                            />
                            <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                              <span className="font-medium">Infinite</span>
                              <span className="font-medium">10x</span>
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              value={gifSettings.loopCount}
                              onChange={e => handleSettingsChange('loopCount', parseInt(e.target.value, 10))}
                              min="0"
                              className="w-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-semibold text-base shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none border border-white/30"
                            />
                            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">loops</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                          0 = infinite loop (recommended), higher numbers = limited loops. Perfect for creating GIFs that play continuously or stop after a few cycles.
                        </p>
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                        <label htmlFor="quality-level" className="block font-semibold mb-3 text-gray-800 text-base">
                          Quality Level
                        </label>
                        <select 
                          id="quality-level"
                          value={qualityLevel} 
                          onChange={(e) => setQualityLevel(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm"
                        >
                          <option value="low">Low Quality (Smaller File)</option>
                          <option value="medium">Medium Quality</option>
                          <option value="high">High Quality (Recommended)</option>
                          <option value="ultra">Ultra Quality (Best)</option>
                        </select>
                        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                          Higher quality produces better colors and sharper images, but may result in larger file sizes.
                        </p>
                      </div>
                      </div>
                    </div>
                    
                    <EnhancedTipsSection
                      title="Pro Tips for Perfect GIFs"
                      tips={[
                        "<strong>Frame Duration</strong> 200-500ms works well for most animations. Faster for energetic content, slower for dramatic effects.",
                        "<strong>Loop Count</strong> 0 (infinite) is perfect for most use cases. Use limited loops for special effects.",
                        "<strong>Image Order</strong> Drag to reorder for the perfect sequence. The order determines your GIF's story.",
                        "<strong>File Size</strong> More images = larger GIF. Consider optimization for faster sharing.",
                        "<strong>Quality</strong> Higher resolution images = better quality GIFs. Balance quality with file size.",
                        "<strong>Preview</strong> Use the preview to see your animation before downloading. Make adjustments as needed!"
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
              description="Creating your animated GIF..."
              useGradient={false}
            />
          )}

          {/* Result State */}
          {workflowState === 'result' && resultUrl && (
            <ResultSection
              title="Your GIF is Ready!"
              description="Your animated GIF has been successfully generated."
              imageUrl={resultUrl.previewUrl}
              downloadFileName="created.gif"
              downloadUrl={resultUrl.downloadUrl}
              onReset={resetWorkflow}
            />
          )}

        <ToolSeoSection
          icon={Image}
          title="Animated GIF Maker, Easy GIF Animator"
          description1="Create stunning animated GIFs from multiple images with our advanced online animated GIF maker. Now with per-frame effects (fade, zoom), custom timing, and drag-and-drop reordering. Perfect for memes, tutorials, banners, and more! Whether you want to make a gif from images, create a gif online, or are looking for a free gif maker, our tool is for you. This is a great tool for making animated gifs for your blog or social media."
          description2="Our intuitive drag-and-drop interface lets you arrange images in the perfect sequence, while advanced settings allow you to fine-tune timing, loops, quality, and per-frame animation effects. Ideal for content creators, marketers, educators, and anyone who wants to bring their images to life. You can use this tool to create a gif from pictures, make your own gif, and much more. It's a full-featured gif creator and gif generator."
          features1={[
            { emoji: "🖼️", text: "Upload multiple image formats (JPG, PNG, GIF, WebP, etc.)" },
            { emoji: "🎬", text: "Drag-and-drop image reordering for perfect sequences" },
            { emoji: "✨", text: "Per-frame effects: Fade and Zoom for animated transitions" },
            { emoji: "⏱️", text: "Customizable frame duration and loop settings (per-frame and global)" }
          ]}
          features2={[
            { emoji: "👀", text: "Live preview of your animation before downloading" },
            { emoji: "💎", text: "High-quality output with optimization options" },
            { emoji: "💸", text: "Completely free to use, no watermarks or registration" }
          ]}
          useCases={[
            { color: "bg-yellow-400", text: "Make animated memes and social posts for Instagram, Twitter, and TikTok" },
            { color: "bg-green-400", text: "Create step-by-step tutorials and how-to GIFs for blogs and help centers" },
            { color: "bg-blue-400", text: "Design fun birthday, holiday, or event GIFs to share with friends" },
            { color: "bg-purple-400", text: "Build product demos, banners, and marketing visuals for your business" }
          ]}
        />
        
        <TipsFaqsBestPracticesSection 
          proTips={[
            {
              color: "bg-blue-500",
              text: "Use the drag-and-drop interface to quickly reorder your images for the perfect animation."
            },
            {
              color: "bg-green-500",
              text: "Try the optimization settings to reduce file size without losing quality."
            },
            {
              color: "bg-purple-500",
              text: "Set a lower frame duration for faster, more energetic GIFs, or a higher value for slower animations."
            },
            {
              color: "bg-pink-500",
              text: "Apply Fade or Zoom effects to individual frames for eye-catching animated transitions."
            },
            {
              color: "bg-orange-500",
              text: "Use the live preview to check your animation before downloading—make adjustments as needed!"
            }
          ]}
          tips={["For best results, use images of similar dimensions.", "You can mix JPG, PNG, GIF, and WebP images.", "Set a lower frame duration (e.g. 100ms) for faster animation.", "Use drag-and-drop to reorder frames.", "Try the Fade or Zoom effect for eye-catching animated transitions.", "Set loop count to 0 for infinite looping.", "Preview your GIF before downloading.", "Animated GIF Maker supports per-frame customization for advanced users."]}
          faqs={[
            {
              question: "What image formats are supported?",
              answer: "You can upload JPG, PNG, GIF, WebP, APNG, HEIC, HEIF, MNG, JP2, AVIF, JXL, BMP, and PDF images."
            },
            {
              question: "How do I add effects to individual frames?",
              answer: "After uploading, use the dropdown under each image to select an effect: None, Fade, or Zoom. Each effect will animate that frame in the final GIF."
            },
            {
              question: "Can I set different durations for each frame?",
              answer: "Yes! Enter a custom duration (in ms) for each image. This controls how long each frame is shown."
            },
            {
              question: "Why is my GIF blank or white?",
              answer: "If you use the Fade effect, the frame will fade in from white. This is normal for fade-in transitions."
            },
            {
              question: "What does the Zoom effect do?",
              answer: "Zoom creates a smooth zoom-in animation for the selected frame."
            },
            {
              question: "Is this tool free?",
              answer: "Yes, EasyGIFMaker is 100% free and does not require registration."
            },
            {
              question: "Is this an animated gif maker?",
              answer: "Yes! This tool is a full-featured animated gif maker with per-frame effects, timing, and drag-and-drop reordering."
            }
          ]}
          relatedResources={[
            {
              href: "/blog/how-to-make-gifs-from-videos",
              icon: "📹",
              text: "How to Make GIFs from Videos"
            },
            {
              href: "/blog/top-5-gif-optimization-tips",
              icon: "⚡",
              text: "Top 5 GIF Optimization Tips"
            }
          ]}
        />

        <TroubleshootingSection 
          commonIssues={[
            {
              color: "bg-yellow-500",
              text: "If your GIF doesn't look right, try adjusting the frame duration or reordering your images."
            },
            {
              color: "bg-orange-500",
              text: "If upload fails, check your file size (max 200MB) and supported formats."
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
              text: "Clear browser cache if images aren't loading"
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

        {/* Value Content Section (end of page for additional context and internal links) */}
        <ValueContentSection
          toolTitle="GIF Maker"
          relatedLinks={[
            { href: '/blog/comprehensive-gif-making-guide', label: 'Comprehensive GIF Making Guide' },
            { href: '/blog/gif-optimization-techniques', label: 'GIF Optimization Techniques' }
          ]}
          altTools={[
            { href: '/video-to-gif', label: 'Video to GIF', desc: 'Convert video clips into animated GIFs.' },
            { href: '/optimize', label: 'Optimize GIF', desc: 'Reduce file size without losing quality.' },
            { href: '/add-text', label: 'Add Text to GIF', desc: 'Add captions, watermarks, and callouts.' }
          ]}
        />
      </ToolPageLayout>
    </>
  )
}