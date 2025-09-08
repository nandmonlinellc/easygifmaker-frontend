import React, { useState, useCallback } from 'react'
import DisplayAd from '@/components/ads/DisplayAd.jsx';
import InArticleAd from '@/components/ads/InArticleAd.jsx';
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Input } from '@/components/ui/input.jsx'
import { RotateCw, Settings, Maximize2 } from 'lucide-react'
import ResultSection from '../components/ResultSection'
import FileUploadSection from '../components/FileUploadSection'
import SocialSharingSection from '../components/SocialSharingSection'
import TroubleshootingSection from '../components/TroubleshootingSection'
import TipsFaqsBestPracticesSection from '../components/TipsFaqsBestPracticesSection'
import ToolSeoSection from '../components/ToolSeoSection'
import HowToUseSection from '../components/HowToUseSection'
import EnhancedTipsSection from '../components/EnhancedTipsSection'

          {/* Mid-content Ad */}
          <div className="my-8 flex justify-center">
            <InArticleAd 
              slot="8336674411"
              className="max-w-2xl w-full"
            />
          </div>
import ProcessingState from '../components/ProcessingState'
import UploadState from '../components/UploadState'
import ToolPageLayout from '../components/ToolPageLayout'
          {/* Bottom Ad - Before value content */}
          <div className="my-8 flex justify-center">
            <DisplayAd 
              slot="1125232950"
              className="max-w-3xl w-full"
            />
          </div>
import ValueContentSection from '../components/ValueContentSection'
import AdsenseAd from '../components/AdsenseAd'
import LimitsTable from '../components/LimitsTable'
import QuickFeaturesBox from '../components/QuickFeaturesBox'

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
    maintainAspectRatio: true,
    percentage: 100
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
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
        const baseDelay = parseInt(import.meta.env.VITE_TASK_POLL_MS || '1500', 10)
        let delay = isNaN(baseDelay) ? 1500 : baseDelay
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
          await new Promise(res => setTimeout(res, delay))
          delay = Math.min(delay + 250, 3000)
        }
        if ((status === 'SUCCESS' || status === 'Task completed!') && result) {
          // Fetch the actual GIF from /api/download/<result>
          const downloadResp = await fetch(`${apiUrl}/api/download/${result}?proxy=1`)
          if (!downloadResp.ok) throw new Error('Failed to fetch result GIF.')
          const gifBlob = await downloadResp.blob()
          const url = URL.createObjectURL(gifBlob)
          setResultUrl({
            previewUrl: url,
            downloadUrl: `${apiUrl}/api/download/${result}?proxy=1`
          })
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
    <ToolPageLayout
      title="Resize GIF Easily"
      description="Resize and scale GIFs online for free. Change GIF dimensions while maintaining quality. Perfect for social media, websites, and messaging apps."
      icon={Maximize2}
      seoProps={{
        title: "Resize GIF Online | EasyGIFMaker",
        description: "Resize GIFs quickly and easily. Set exact width and height or keep aspect ratio for perfect social media sizes.",
        keywords: "resize gif, scale gif, change gif size, gif resizer, gif dimensions, resize animated gif, gif editor, gif converter, gif maker, free gif maker, online gif maker",
        canonical: "https://easygifmaker.com/resize",
        ogImage: "https://easygifmaker.com/blog/complete-guide-to-resize-gif.svg"
      }}
      howToSteps={[
        {
          "@type": "HowToStep",
          "name": "Upload GIF",
          "text": "Select a GIF file or enter a GIF URL to resize."
        },
        {
          "@type": "HowToStep",
          "name": "Set New Dimensions",
          "text": "Choose width, height, or percentage scaling for your GIF."
        },
        {
          "@type": "HowToStep",
          "name": "Preview and Adjust",
          "text": "See the resized GIF and make adjustments if needed."
        },
        {
          "@type": "HowToStep",
          "name": "Download Resized GIF",
          "text": "Download your resized GIF with new dimensions!"
        }
      ]}
      >
        
      <HowToUseSection
        title="How to Use the GIF Resizer"
        steps={[
          {
            title: "Upload your GIF",
            description: "Select a GIF file or enter a GIF URL to resize."
          },
          {
            title: "Set new dimensions",
            description: "Choose width, height, or percentage scaling."
          },
          {
            title: "Preview and adjust",
            description: "See the resized GIF and make adjustments."
          },
          {
            title: "Download resized GIF",
            description: "Download your resized GIF with new dimensions!"
          }
        ]}
      />

      {/* FAQ + HowTo Schema */}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How do I resize a GIF without losing quality?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Upload your GIF, choose width/height or keep aspect ratio enabled, then download the resized animated GIF.'
              }
            },
            {
              '@type': 'Question',
              name: 'What size should a GIF be for social media?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Square (1:1) or vertical (4:5) often works best. Use Resize to set exact dimensions, then Optimize to reduce size.'
              }
            }
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'How to Resize a GIF',
          totalTime: 'PT1M',
          step: [
            { '@type': 'HowToStep', name: 'Upload', text: 'Add a GIF file or paste a direct GIF URL.' },
            { '@type': 'HowToStep', name: 'Set size', text: 'Enter a new width/height or keep aspect ratio to scale proportionally.' },
            { '@type': 'HowToStep', name: 'Download', text: 'Process and save the resized animated GIF.' }
          ]
        })}</script>
      </Helmet>

      {/* Tutorial section */}
      <section className="mt-10 space-y-3" aria-label="Tutorial: Resize GIF">
        <h2 className="text-2xl font-semibold text-gray-900">Tutorial: How to Resize a GIF</h2>
        <ol className="list-decimal pl-6 text-gray-700 space-y-2">
          <li>Upload a GIF or paste a direct URL.</li>
          <li>Set a new width and height, or keep aspect ratio for proportional scaling.</li>
          <li>Click Resize GIF and download your result.</li>
        </ol>
        <p className="text-gray-700">Need to crop first? Try the <a href="/crop" className="text-blue-600 hover:underline">GIF Cropper</a>. Want a smaller file? Use the <a href="/optimize" className="text-blue-600 hover:underline">GIF Optimizer</a>.</p>
      </section>

  {/* Value content moved to end of page */}

          {/* Upload State */}
          {workflowState === 'upload' && (
            <UploadState
              title="Upload GIF to Resize"
              description="Select a GIF file or enter a GIF URL to resize and scale"
              errorMessage={errorMessage}
              uploadMethod={uploadMethod}
              setUploadMethod={setUploadMethod}
              onFileSelect={(files) => handleFileUpload(files)}
              onUrlSubmit={(url) => handleFileUpload(null, url)}
              isProcessing={isProcessing}
              supportedFormats="Supported formats: GIF only"
              accept="image/gif"
              toolName="GIF"
              useGradient={false}
            />
          )}

          {/* Quick features + Limits (after upload section) */}
          <QuickFeaturesBox
            features={[
              { emoji: '📏', text: 'Custom width & height' },
              { emoji: '⚖️', text: 'Maintain aspect ratio' },
              { emoji: '📐', text: 'Percentage-based scaling' },
              { emoji: '💎', text: 'High-quality resizing' },
            ]}
          />
          <LimitsTable
            acceptedFormats={[ 'GIF' ]}
            maxFps={null}
            maxFrames={null}
            maxResolution={'Up to ~800×800 px equivalent for complex edits; larger may work for simple cases'}
            recommendedDuration={null}
          />

          {/* Editing State */}
          {workflowState === 'editing' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* GIF Preview */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-800">GIF Preview</CardTitle>
                    <CardDescription className="text-gray-600">
                      Preview your GIF and set new dimensions
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
                        {isProcessing ? 'Resizing...' : 'Resize GIF'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Resize Settings Panel */}
              <div>
                <Card className="bg-gradient-to-br from-white to-indigo-50/30 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <Maximize2 className="h-5 w-5 text-white" />
                      </div>
                      Resize Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                        <label htmlFor="width" className="block font-semibold mb-3 text-gray-800">
                          Width
                          <span className="text-sm text-gray-500 ml-2 font-normal">(pixels)</span>
                        </label>
                        <input
                          id="width"
                          type="number"
                          value={settings.width}
                          onChange={e => setSettings({...settings, width: parseInt(e.target.value, 10)})}
                          min="1"
                          max="2000"
                          className="w-full bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                        <label htmlFor="height" className="block font-semibold mb-3 text-gray-800">
                          Height
                          <span className="text-sm text-gray-500 ml-2 font-normal">(pixels)</span>
                        </label>
                        <input
                          id="height"
                          type="number"
                          value={settings.height}
                          onChange={e => setSettings({...settings, height: parseInt(e.target.value, 10)})}
                          min="1"
                          max="2000"
                          className="w-full bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-medium shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                        <label htmlFor="percentage" className="block font-semibold mb-3 text-gray-800 text-base">
                          Scale Percentage
                          <span className="text-sm text-gray-500 ml-2 font-normal">(%)</span>
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 relative">
                            <input
                              id="percentage"
                              type="range"
                              min="10"
                              max="200"
                              step="5"
                              value={settings.percentage}
                              onChange={e => setSettings({...settings, percentage: parseInt(e.target.value, 10)})}
                              className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full appearance-none cursor-pointer slider-thumb-blue"
                            />
                            <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                              <span className="font-medium">Small</span>
                              <span className="font-medium">Large</span>
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              value={settings.percentage}
                              onChange={e => setSettings({...settings, percentage: parseInt(e.target.value, 10)})}
                              min="10"
                              max="200"
                              className="w-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-semibold text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border border-white/30"
                            />
                            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">%</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                          Controls the size of your GIF. 100% = original size, lower values = smaller, higher values = larger.
                        </p>
                      </div>
                    </div>
                    {/* Mid-content Ad */}
                    <div className="my-8 flex justify-center">
                      <InArticleAd 
                        slot="8336674411"
                        className="max-w-2xl w-full"
                      />
                    </div>
                    <EnhancedTipsSection

                      title="Pro Tips for Perfect Resizing"
                      tips={[
                        "<strong>Scale Percentage</strong> 50-150% works well for most GIFs. Smaller for faster loading, larger for better detail.",
                        "<strong>Social Media</strong> 400-600px width is perfect for Instagram, Twitter, and other platforms.",
                        "<strong>Website:</strong> Use 800-1200px width for web display",
                        "<strong>Mobile:</strong> Use 300-500px width for mobile devices",
                        "<strong>Quality:</strong> Larger sizes maintain better quality"
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
              title="Resizing Your GIF"
              description="Changing dimensions and scaling your GIF..."
            />
          )}

          {/* Result State */}
          {workflowState === 'result' && resultUrl && (
            <ResultSection
              title="Your Resized GIF is Ready!"
              description="Your GIF has been successfully resized with new dimensions."
              imageUrl={resultUrl.previewUrl}
              downloadFileName="resized.gif"
              downloadUrl={resultUrl.downloadUrl}
              onReset={resetWorkflow}
            />
          )}

        <ToolSeoSection
          icon={Maximize2}
          title="Resize GIF"
          description1="Resize your GIFs to fit any platform or purpose with our powerful online resizer. Whether you need smaller dimensions for social media, larger sizes for websites, or custom scaling for specific applications, our tool makes it easy to adjust GIF dimensions while maintaining quality."
          description2="Our intelligent resizing algorithms preserve animation quality and ensure your GIFs look great at any size. Perfect for content creators, web developers, and anyone who needs to adapt GIFs for different platforms and use cases."
          features1={[
            { emoji: "📏", text: "Custom width and height dimensions" },
            { emoji: "⚖️", text: "Percentage-based scaling options" },
            { emoji: "🎯", text: "Maintain aspect ratio automatically" }
          ]}
          features2={[
            { emoji: "💎", text: "High-quality resizing algorithms" },
            { emoji: "📱", text: "Optimized for all platforms" }
          ]}
          useCases={[
            { color: "bg-yellow-400", text: "Resize GIFs for social media platforms" },
            { color: "bg-green-400", text: "Scale GIFs for website integration" },
            { color: "bg-blue-400", text: "Adjust GIFs for mobile devices" },
            { color: "bg-purple-400", text: "Create thumbnail versions of GIFs" }
          ]}
        />
        <AdsenseAd adSlot="8336674411" adFormat="fluid" adLayout="in-article" />
          
        <TipsFaqsBestPracticesSection 
          proTips={[
            {
              color: "bg-blue-500",
              text: "Keep aspect ratio enabled to prevent distortion and maintain visual quality."
            },
            {
              color: "bg-green-500",
              text: "Use percentage scaling for proportional resizing to maintain original proportions."
            },
            {
              color: "bg-purple-500",
              text: "Consider your target platform's recommended dimensions for optimal display."
            },
            {
              color: "bg-orange-500",
              text: "Larger sizes maintain better quality and detail for high-resolution displays."
            }
          ]}
          faqs={[
            {
              question: "Will resizing affect animation quality?",
              answer: "Our tool maintains animation smoothness while resizing."
            },
            {
              question: "Can I resize to any dimensions?",
              answer: "Yes, you can set custom width and height values."
            },
            {
              question: "What's the maximum size I can resize to?",
              answer: "Up to 2000x2000 pixels for optimal performance."
            },
            {
              question: "Does resizing affect file size?",
              answer: "Generally, smaller dimensions result in smaller file sizes."
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
              text: "If the GIF looks distorted, try maintaining aspect ratio."
            },
            {
              color: "bg-orange-500",
              text: "If upload fails, check your file format (GIF only) and file size."
            },
            {
              color: "bg-red-500",
              text: "Still having issues?",
              link: "/contact"
            }
          ]}
          quickFixes={[
            {
              icon: "📏",
              text: "Use percentage scaling for proportional resizing"
            },
            {
              icon: "⚖️",
              text: "Keep aspect ratio to prevent distortion"
            },
            {
              icon: "📱",
              text: "Consider target platform dimensions"
            }
          ]}
        />

        <SocialSharingSection 
          title="Share Your Resized GIF!"
          description="Share your resized GIF on Instagram, Twitter, TikTok, Facebook, or embed it in your blog or website. Tag us with #EasyGIFMaker for a chance to be featured!"
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
        toolTitle="GIF Resizer"
        relatedLinks={[
          { href: '/blog/complete-guide-to-resize-gif', label: 'Complete Guide to Resize GIF' },
          { href: '/blog/gif-optimization-techniques', label: 'GIF Optimization Techniques' }
        ]}
        altTools={[
          { href: '/optimize', label: 'Optimize GIF', desc: 'Compress and reduce GIF size.' },
          { href: '/crop', label: 'Crop GIF', desc: 'Focus on the important area.' },
          { href: '/add-text', label: 'Add Text to GIF', desc: 'Add captions and watermarks.' }
        ]}
      />
      </ToolPageLayout>
    </>
  )
}
