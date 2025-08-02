import React, { useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Zap, Settings } from 'lucide-react'
import ResultSection from '../components/ResultSection'
import FileUploadSection from '../components/FileUploadSection'
import SocialSharingSection from '../components/SocialSharingSection'
import TroubleshootingSection from '../components/TroubleshootingSection'
import TipsFaqsBestPracticesSection from '../components/TipsFaqsBestPracticesSection'
import ToolSeoSection from '../components/ToolSeoSection'
import HowToUseSection from '../components/HowToUseSection'
import EnhancedTipsSection from '../components/EnhancedTipsSection'
import ProcessingState from '../components/ProcessingState'
import UploadState from '../components/UploadState'
import ToolPageLayout from '../components/ToolPageLayout'

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
    lossy: 20,
    dither: 'floyd-steinberg',
    optimize_level: 3
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
      formData.append('dither', settings.dither)
      formData.append('optimize_level', settings.optimize_level.toString())
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
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
          // Fetch the actual GIF from /api/download/<result>
          const downloadResp = await fetch(`${apiUrl}/api/download/${result}`)
          if (!downloadResp.ok) throw new Error('Failed to fetch result GIF.')
          const gifBlob = await downloadResp.blob()
          const url = URL.createObjectURL(gifBlob)
          setResultUrl({
            previewUrl: url,
            downloadUrl: `${apiUrl}/api/download/${result}`
          })
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
      lossy: 20,
      dither: 'floyd-steinberg',
      optimize_level: 3
    })
  }

  // --- Render ---
  return (
    <>
      <ToolPageLayout
        title="GIF Optimizer"
        description="Optimize and compress GIFs online for faster loading and smaller file sizes. Reduce GIF file size while maintaining quality. Free GIF optimizer."
        icon={Zap}
        seoProps={{
          title: "GIF Optimizer - Compress and Optimize GIFs Online | EasyGIFMaker",
          description: "Optimize and compress GIFs online for faster loading and smaller file sizes. Reduce GIF file size while maintaining quality. Free GIF optimizer.",
          keywords: "gif optimizer, compress gif, reduce gif size, gif compression, optimize gif, gif file size reducer",
          canonical: "https://easygifmaker.com/optimize"
        }}
      >
        <HowToUseSection
          title="How to Use the GIF Optimizer"
          steps={[
            {
              title: "Upload your GIF",
              description: "Select a GIF file or enter a GIF URL to optimize."
            },
            {
              title: "Adjust optimization settings",
              description: "Set quality, colors, and compression level for optimal results."
            },
            {
              title: "Preview and compare",
              description: "See the file size reduction and quality comparison."
            },
            {
              title: "Download optimized GIF",
              description: "Download your optimized GIF with reduced file size!"
            }
          ]}
        />

          {/* Upload State */}
          {workflowState === 'upload' && (
            <UploadState
              title="Upload GIF to Optimize"
              description="Select a GIF file or enter a GIF URL to optimize and compress"
              errorMessage={errorMessage}
              uploadMethod={uploadMethod}
              setUploadMethod={setUploadMethod}
              onFileSelect={(files) => handleFileUpload(files)}
              onUrlSubmit={(url) => handleFileUpload(null, url)}
              isProcessing={isProcessing}
              supportedFormats="Supported formats: GIF only"
              accept="image/gif"
              toolName="GIF"
            />
          )}

          {/* Editing State */}
          {workflowState === 'editing' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* GIF Preview */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-800">GIF Preview</CardTitle>
                    <CardDescription className="text-gray-600">
                      Preview your GIF and see optimization results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                      <div className="text-center">
                        <img 
                          src={mediaUrl} 
                          alt="GIF Preview" 
                          className="max-w-full h-auto rounded-xl shadow-lg mx-auto" 
                          style={{ maxHeight: '300px' }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={resetWorkflow} variant="outline" className="flex-1 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300">
                        Upload Different GIF
                      </Button>
                      <Button 
                        onClick={handleProcess}
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {isProcessing ? 'Optimizing...' : 'Optimize GIF'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Optimization Settings Panel */}
              <div>
                <Card className="bg-gradient-to-br from-white to-indigo-50/30 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      Optimization Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                        <label htmlFor="quality" className="block font-semibold mb-3 text-gray-800 text-base">
                          Quality Level
                          <span className="text-sm text-gray-500 ml-2 font-normal">(1-100)</span>
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 relative">
                            <input
                              id="quality"
                              type="range"
                              min="1"
                              max="100"
                              step="1"
                              value={settings.quality}
                              onChange={(e) => setSettings({...settings, quality: parseInt(e.target.value, 10)})}
                              className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full appearance-none cursor-pointer slider-thumb-blue"
                            />
                            <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                              <span className="font-medium">Small</span>
                              <span className="font-medium">High</span>
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              value={settings.quality}
                              onChange={e => setSettings({...settings, quality: parseInt(e.target.value, 10)})}
                              min="1"
                              max="100"
                              className="w-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-semibold text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border border-white/30"
                            />
                            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">%</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                          Controls file size vs quality. Lower values = smaller files, higher values = better quality.
                        </p>
                      </div>
                      
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                        <label htmlFor="colors" className="block font-semibold mb-3 text-gray-800 text-base">
                          Color Count
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 relative">
                            <input
                              id="colors"
                              type="range"
                              min="2"
                              max="256"
                              step="2"
                              value={settings.colors}
                              onChange={(e) => setSettings({...settings, colors: parseInt(e.target.value, 10)})}
                              className="w-full h-3 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full appearance-none cursor-pointer slider-thumb-green"
                            />
                            <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                              <span className="font-medium">Few</span>
                              <span className="font-medium">Many</span>
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              value={settings.colors}
                              onChange={e => setSettings({...settings, colors: parseInt(e.target.value, 10)})}
                              min="2"
                              max="256"
                              className="w-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-semibold text-base shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none border border-white/30"
                            />
                            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">colors</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                          Controls color variety. Fewer colors = smaller files but less visual richness.
                        </p>
                      </div>
                      
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                        <label htmlFor="dither" className="block font-semibold mb-3 text-gray-800 text-base">
                          Dithering Method
                        </label>
                        <Select value={settings.dither} onValueChange={(value) => setSettings({...settings, dither: value})}>
                          <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm">
                            <SelectValue placeholder="Select dithering method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="floyd-steinberg">Floyd-Steinberg (Best Quality)</SelectItem>
                            <SelectItem value="atkinson">Atkinson (Balanced)</SelectItem>
                            <SelectItem value="burkes">Burkes (Fast)</SelectItem>
                            <SelectItem value="none">None (No Dithering)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                          Dithering improves color quality when reducing colors. Floyd-Steinberg provides the best results.
                        </p>
                      </div>
                      
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                        <label htmlFor="optimize-level" className="block font-semibold mb-3 text-gray-800 text-base">
                          Optimization Level
                          <span className="text-sm text-gray-500 ml-2 font-normal">(1-3)</span>
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 relative">
                            <input
                              id="optimize-level"
                              type="range"
                              min="1"
                              max="3"
                              step="1"
                              value={settings.optimize_level}
                              onChange={(e) => setSettings({...settings, optimize_level: parseInt(e.target.value, 10)})}
                              className="w-full h-3 bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 rounded-full appearance-none cursor-pointer slider-thumb-orange"
                            />
                            <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                              <span className="font-medium">Fast</span>
                              <span className="font-medium">Thorough</span>
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              value={settings.optimize_level}
                              onChange={e => setSettings({...settings, optimize_level: parseInt(e.target.value, 10)})}
                              min="1"
                              max="3"
                              className="w-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-semibold text-base shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none border border-white/30"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                          Level 1: Fast optimization. Level 3: Thorough optimization with best compression.
                        </p>
                      </div>
                    </div>
                    
                    <EnhancedTipsSection
                      title="Pro Tips for Perfect Optimization"
                      tips={[
                        "<strong>Quality Level</strong> 80-90% provides excellent balance of quality and file size for most GIFs.",
                        "<strong>Color Count</strong> 64-128 colors maintains good variety while reducing file size significantly.",
                        "<strong>Dithering</strong> Floyd-Steinberg provides the best color quality when reducing colors.",
                        "<strong>Optimization Level</strong> Level 3 provides the best compression but takes longer to process.",
                        "<strong>For Social Media:</strong> Use quality 70-80 for faster loading",
                        "<strong>For Websites:</strong> Use quality 85-95 for better appearance"
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
              title="Optimizing Your GIF"
              description="Compressing and optimizing your GIF..."
            />
          )}

          {/* Result State */}
          {workflowState === 'result' && resultUrl && (
            <ResultSection
              title="Your Optimized GIF is Ready!"
              description="Your GIF has been successfully optimized with reduced file size."
              imageUrl={resultUrl.previewUrl}
              downloadFileName="optimized.gif"
              downloadUrl={resultUrl.downloadUrl}
              onReset={resetWorkflow}
            />
          )}

        <ToolSeoSection
          icon={Zap}
          title="GIF Optimizer"
          description1="Speed up your website and social media posts with our powerful GIF optimization tool. Reduce file sizes by up to 80% while maintaining visual quality, making your GIFs load faster and perform better across all platforms."
          description2="Our advanced compression algorithms intelligently reduce colors and optimize frame data without sacrificing the visual appeal of your GIFs. Perfect for web developers, content creators, and anyone who wants faster-loading animations."
          features1={[
            { emoji: "⚡", text: "Reduce file size by up to 80%" },
            { emoji: "🎨", text: "Intelligent color optimization" },
            { emoji: "🔧", text: "Customizable quality settings" }
          ]}
          features2={[
            { emoji: "📊", text: "Real-time size comparison" },
            { emoji: "💎", text: "Maintain visual quality" }
          ]}
          useCases={[
            { color: "bg-yellow-400", text: "Optimize GIFs for faster website loading" },
            { color: "bg-green-400", text: "Reduce file sizes for social media sharing" },
            { color: "bg-blue-400", text: "Compress GIFs for email attachments" },
            { color: "bg-purple-400", text: "Optimize GIFs for mobile devices" }
          ]}
        />
          
          <TipsFaqsBestPracticesSection 
            proTips={[
              {
                color: "bg-blue-500",
                text: "Start with quality 80-85 for a good balance of size and quality."
              },
              {
                color: "bg-green-500",
                text: "Use fewer colors (64-128) for simpler GIFs to reduce file size."
              },
              {
                color: "bg-purple-500",
                text: "Test different settings to find the perfect balance for your use case."
              },
              {
                color: "bg-orange-500",
                text: "Compare original and optimized versions to ensure quality meets your needs."
              }
            ]}
            faqs={[
              {
                question: "How much can I reduce the file size?",
                answer: "Typically 50-80% reduction depending on the original GIF and settings."
              },
              {
                question: "Will the optimization affect quality?",
                answer: "Some quality loss is expected, but our tool minimizes it while maximizing compression."
              },
              {
                question: "What's the best quality setting?",
                answer: "80-90 for most use cases, 70-80 for social media, 60-70 for email."
              },
              {
                question: "Can I optimize any GIF?",
                answer: "Yes, our tool works with all GIF files regardless of size or complexity."
              }
            ]}
            relatedResources={[
              {
                href: "/blog/top-5-gif-optimization-tips",
                icon: "⚡",
                text: "Top 5 GIF Optimization Tips"
              },
              {
                href: "/blog/how-to-make-gifs-from-videos",
                icon: "📹",
                text: "How to Make GIFs from Videos"
              }
            ]}
          />

          <TroubleshootingSection 
            commonIssues={[
              {
                color: "bg-yellow-500",
                text: "If file size reduction is minimal, try lowering the quality setting."
              },
              {
                color: "bg-orange-500",
                text: "If quality loss is too high, increase the quality setting."
              },
              {
                color: "bg-red-500",
                text: "Still having issues?",
                link: "/contact"
              }
            ]}
            quickFixes={[
              {
                icon: "📊",
                text: "Compare file sizes before and after optimization"
              },
              {
                icon: "🎨",
                text: "Adjust color count for better compression"
              },
              {
                icon: "⚡",
                text: "Test different quality settings for optimal results"
              }
            ]}
          />

          <SocialSharingSection 
            title="Share Your Optimized GIF!"
            description="Share your optimized GIF on Instagram, Twitter, TikTok, Facebook, or embed it in your blog or website. Tag us with #EasyGIFMaker for a chance to be featured!"
          />
      </ToolPageLayout>
    </>
  )
}
