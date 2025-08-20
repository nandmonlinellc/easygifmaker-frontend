import React, { useState, useCallback } from 'react'
import DisplayAd from '@/components/ads/DisplayAd.jsx';
import InArticleAd from '@/components/ads/InArticleAd.jsx';import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Crop, Settings } from 'lucide-react'
import ResultSection from '../components/ResultSection'
import FileUploadSection from '../components/FileUploadSection'
import CropperCanvas from '../components/CropperCanvas'
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

export default function CropTool() {
  const [workflowState, setWorkflowState] = useState('upload') // 'upload', 'editing', 'processing', 'result'
  const [uploadMethod, setUploadMethod] = useState('file')
  const [mediaUrl, setMediaUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  // Cropper state - crop uses percentages (0-1), croppedAreaPixels uses actual pixel values
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({ x: 0, y: 0, width: 100, height: 100 })
  const [aspect, setAspect] = useState(null) // null = free

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
    // Reset crop state when new image is loaded
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels({ x: 0, y: 0, width: 100, height: 100 })
    setWorkflowState('editing')
  }, [uploadMethod])

  // Handle crop complete from Cropper
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    if (croppedAreaPixels && 
        typeof croppedAreaPixels.x === 'number' && 
        typeof croppedAreaPixels.y === 'number' && 
        typeof croppedAreaPixels.width === 'number' && 
        typeof croppedAreaPixels.height === 'number') {
      setCroppedAreaPixels(croppedAreaPixels)
    }
  }, [])

  // Handle aspect ratio change
  const handleAspectChange = (value) => {
    if (value === 'free') {
      setAspect(null)
    } else if (value === 'square') {
      setAspect(1)
    } else if (value === '4:3') {
      setAspect(4/3)
    } else if (value === '16:9') {
      setAspect(16/9)
    } else if (value === '3:2') {
      setAspect(3/2)
    } else if (value === '2:1') {
      setAspect(2)
    } else if (value === 'golden') {
      setAspect(1.618)
    } else {
      setAspect(null)
    }
  }

  // Handle crop process
  const handleProcess = useCallback(async () => {
    if (!mediaUrl || !croppedAreaPixels) return
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
      formData.append('x', Math.round(croppedAreaPixels.x).toString())
      formData.append('y', Math.round(croppedAreaPixels.y).toString())
      formData.append('width', Math.round(croppedAreaPixels.width).toString())
      formData.append('height', Math.round(croppedAreaPixels.height).toString())
      formData.append('aspect_ratio', aspect || 'free')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
      const response = await fetch(`${apiUrl}/api/crop`, {
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
            status = statusData.status || statusData.state
            result = statusData.result
            if ((status === 'SUCCESS' || status === 'Task completed!') && result) {
              break
            } else if (status === 'FAILURE') {
              throw new Error(statusData.error || 'GIF crop failed.')
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
          const resultUrlObj = {
            previewUrl: url,
            downloadUrl: `${apiUrl}/api/download/${result}`
          }
          setResultUrl(resultUrlObj)
          setWorkflowState('result')
        } else {
          throw new Error('GIF crop timed out. Please try again.')
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
  }, [uploadMethod, mediaUrl, croppedAreaPixels, aspect])

  // Reset workflow to upload state
  const resetWorkflow = () => {
    setWorkflowState('upload')
    setMediaUrl(null)
    setResultUrl(null)
    setErrorMessage(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels({ x: 0, y: 0, width: 100, height: 100 })
    setAspect(null)
  }

  // --- Render ---
  return (
    <>
      <ToolPageLayout
        title="Crop GIF"
        description="Crop and trim GIFs online for free. Remove unwanted parts and focus on the important content. Perfect for social media and messaging."
        icon={Crop}
        seoProps={{
          title: "Crop GIF - Crop and Trim GIFs Online | EasyGIFMaker",
          description: "Crop and trim GIFs online for free. Remove unwanted parts and focus on the important content. Perfect for social media and messaging.",
          keywords: "crop gif, trim gif, cut gif, gif cropper, gif editor, crop animated gif, gif maker, free gif maker, online gif maker, gif converter, gif creator",
          canonical: "https://easygifmaker.com/crop"
        }}
        howToSteps={[
          {
            "@type": "HowToStep",
            "name": "Upload GIF",
            "text": "Select a GIF file or enter a GIF URL to crop."
          },
          {
            "@type": "HowToStep",
            "name": "Select Crop Area",
            "text": "Use the interactive crop tool to select the area you want to keep."
          },
          {
            "@type": "HowToStep",
            "name": "Adjust and Preview",
            "text": "Fine-tune your crop selection and preview the result."
          },
          {
            "@type": "HowToStep",
            "name": "Download Cropped GIF",
            "text": "Download your cropped GIF with the selected area!"
          }
        ]}
      >
        <HowToUseSection
          title="How to Use the GIF Cropper"
          steps={[
            {
              title: "Upload your GIF",
              description: "Select a GIF file or enter a GIF URL to crop."
            },
            {
              title: "Select crop area",
              description: "Drag to create a selection box around the area you want to keep."
            },
            {
              title: "Adjust and preview",
              description: "Fine-tune your selection and preview the cropped result."
            },
            {
              title: "Download cropped GIF",
              description: "Download your perfectly cropped GIF!"
            }
          ]}
        />

  {/* Value content moved to end of page */}


          {/* Upload State */}
          {workflowState === 'upload' && (
            <UploadState
              title="Upload GIF to Crop"
              description="Select a GIF file or enter a GIF URL to crop and trim"
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

          {/* Editing State */}
          {workflowState === 'editing' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* GIF Preview and Cropper */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-800">GIF Preview & Cropper</CardTitle>
                    <CardDescription className="text-gray-600">
                      Drag to select the area you want to keep in your GIF
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                      <CropperCanvas
                        imageUrl={mediaUrl}
                        aspect={aspect}
                        crop={crop}
                        zoom={zoom}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
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
                        {isProcessing ? 'Cropping...' : 'Crop GIF'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Crop Settings Panel */}
              <div>
                <Card className="bg-gradient-to-br from-white to-indigo-50/30 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <Crop className="h-5 w-5 text-white" />
                      </div>
                      Crop Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                        <label htmlFor="crop-x" className="block font-semibold mb-3 text-gray-800">
                          X Position
                          <span className="text-sm text-gray-500 ml-2 font-normal">(pixels)</span>
                        </label>
                        <input
                          id="crop-x"
                          type="number"
                          value={croppedAreaPixels.x || 0}
                          onChange={e => {
                            const newX = parseInt(e.target.value, 10) || 0
                            setCroppedAreaPixels({ ...croppedAreaPixels, x: newX })
                          }}
                          min="0"
                          max="1000"
                          className="w-full bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                        <label htmlFor="crop-y" className="block font-semibold mb-3 text-gray-800">
                          Y Position
                          <span className="text-sm text-gray-500 ml-2 font-normal">(pixels)</span>
                        </label>
                        <input
                          id="crop-y"
                          type="number"
                          value={croppedAreaPixels.y || 0}
                          onChange={e => {
                            const newY = parseInt(e.target.value, 10) || 0
                            setCroppedAreaPixels({ ...croppedAreaPixels, y: newY })
                          }}
                          min="0"
                          max="1000"
                          className="w-full bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-medium shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                        <label htmlFor="crop-width" className="block font-semibold mb-3 text-gray-800">
                          Width
                          <span className="text-sm text-gray-500 ml-2 font-normal">(pixels)</span>
                        </label>
                        <input
                          id="crop-width"
                          type="number"
                          value={croppedAreaPixels.width || 0}
                          onChange={e => {
                            const newWidth = parseInt(e.target.value, 10) || 0
                            setCroppedAreaPixels({ ...croppedAreaPixels, width: newWidth })
                          }}
                          min="10"
                          max="1000"
                          className="w-full bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-medium shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                        <label htmlFor="crop-height" className="block font-semibold mb-3 text-gray-800">
                          Height
                          <span className="text-sm text-gray-500 ml-2 font-normal">(pixels)</span>
                        </label>
                        <input
                          id="crop-height"
                          type="number"
                          value={croppedAreaPixels.height || 0}
                          onChange={e => {
                            const newHeight = parseInt(e.target.value, 10) || 0
                            setCroppedAreaPixels({ ...croppedAreaPixels, height: newHeight })
                          }}
                          min="10"
                          max="1000"
                          className="w-full bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-center font-medium shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    {/* Aspect Ratio Selector */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                      <label htmlFor="aspect-ratio" className="block font-semibold mb-3 text-gray-800">
                        Aspect Ratio
                        <span className="text-sm text-gray-500 ml-2 font-normal">(optional)</span>
                      </label>
                      <Select value={aspect === null ? 'free' : 
                        aspect === 1 ? 'square' :
                        aspect === 4/3 ? '4:3' :
                        aspect === 16/9 ? '16:9' :
                        aspect === 3/2 ? '3:2' :
                        aspect === 2 ? '2:1' :
                        aspect === 1.618 ? 'golden' : 'free'} 
                        onValueChange={handleAspectChange}>
                        <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm">
                          <SelectValue placeholder="Select aspect ratio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free (Custom)</SelectItem>
                          <SelectItem value="square">Square (1:1)</SelectItem>
                          <SelectItem value="4:3">4:3</SelectItem>
                          <SelectItem value="16:9">16:9</SelectItem>
                          <SelectItem value="3:2">3:2</SelectItem>
                          <SelectItem value="2:1">2:1</SelectItem>
                          <SelectItem value="golden">Golden Ratio (1.618:1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
          
          {/* Mid-content Ad */}
                              <div className="my-8 flex justify-center">
                                <InArticleAd 
                                  slot="8336674411"
                                  className="max-w-2xl w-full"
                                />
                                </div>
                    
          <EnhancedTipsSection
            title="Pro Tips for Perfect Cropping"
            tips={[
              "<strong>Focus on Subject</strong> Crop to highlight the main action or subject. Keep the most important elements in frame.",
              "<strong>Remove Distractions</strong> Eliminate unwanted background elements that don't add to your story.",
              "<strong>Maintain Quality</strong> Don't crop too small to preserve detail. Keep at least 200x200px for good quality.",
              "<strong>Consider Aspect Ratio</strong> Think about where you'll use the GIF. Square works well for Instagram, wider for Twitter.",
              "<strong>Preview First</strong> Check the result before finalizing. Make sure the crop looks good throughout the animation.",
              "<strong>Use Coordinates</strong> Use the X/Y position and width/height inputs for precise control over your crop area."
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
              title="Cropping Your GIF"
              description="Processing your cropped GIF..."
            />
          )}

          {/* Result State */}
          {workflowState === 'result' && resultUrl && (
            <ResultSection
              title="Your Cropped GIF is Ready!"
              description="Your GIF has been successfully cropped to your specifications."
              imageUrl={resultUrl.previewUrl}
              downloadFileName="cropped.gif"
              downloadUrl={resultUrl.downloadUrl}
              onReset={resetWorkflow}
            />
          )}
        
        <ToolSeoSection
          icon={Crop}
          title="Crop GIF"
          description1="Perfect your GIFs with our powerful online cropping tool. Remove unwanted areas, focus on the most important parts, and create clean, professional GIFs that grab attention. Whether you're removing backgrounds, focusing on specific actions, or creating perfectly sized GIFs for different platforms."
          description2="Our intuitive cropping interface lets you precisely select the area you want to keep, with real-time preview so you can see exactly what your final GIF will look like. Perfect for content creators, marketers, and anyone who wants to create polished, professional GIFs."
          features1={[
            { emoji: "✂️", text: "Precise cropping with pixel-perfect control" },
            { emoji: "👁️", text: "Real-time preview of cropped results" },
            { emoji: "🎯", text: "Focus on specific areas or subjects" }
          ]}
          features2={[
            { emoji: "💎", text: "Maintain animation quality" },
            { emoji: "📱", text: "Optimize for any platform" }
          ]}
          useCases={[
            { color: "bg-yellow-400", text: "Remove unwanted backgrounds from GIFs" },
            { color: "bg-green-400", text: "Focus on specific actions or subjects" },
            { color: "bg-blue-400", text: "Create square GIFs for social media" },
            { color: "bg-purple-400", text: "Trim GIFs to fit specific dimensions" }
          ]}
        />
          <AdsenseAd adSlot="8336674411" adFormat="fluid" adLayout="in-article" />
          <TipsFaqsBestPracticesSection 
            proTips={[
              {
                color: "bg-blue-500",
                text: "Focus on the main subject or action in your GIF for better visual impact."
              },
              {
                color: "bg-green-500",
                text: "Remove distracting background elements for cleaner, more focused results."
              },
              {
                color: "bg-purple-500",
                text: "Choose appropriate aspect ratios for your target platform (square for Instagram, 16:9 for YouTube)."
              },
              {
                color: "bg-orange-500",
                text: "Don't crop too small to maintain quality and detail in your final GIF."
              }
            ]}
            faqs={[
              {
                question: "Will cropping affect animation quality?",
                answer: "No, our tool maintains animation smoothness while cropping."
              },
              {
                question: "Can I crop to any size?",
                answer: "Yes, you can set custom width and height values."
              },
              {
                question: "What's the minimum crop size?",
                answer: "Minimum 10x10 pixels for optimal results."
              },
              {
                question: "Does cropping reduce file size?",
                answer: "Yes, smaller cropped areas typically result in smaller files."
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
                text: "If the crop area is too small, increase the dimensions."
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
                icon: "✂️",
                text: "Use precise coordinates for accurate cropping"
              },
              {
                icon: "👁️",
                text: "Preview before finalizing your crop"
              },
              {
                icon: "📏",
                text: "Maintain aspect ratio for better results"
              }
            ]}
          />

          <SocialSharingSection 
            title="Share Your Cropped GIF!"
            description="Share your perfectly cropped GIF on Instagram, Twitter, TikTok, Facebook, or embed it in your blog or website. Tag us with #EasyGIFMaker for a chance to be featured!"
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
            toolTitle="GIF Cropper"
            relatedLinks={[
              { href: '/blog/professional-gif-cropping-and-composition-guide', label: 'Professional GIF Cropping and Composition Guide' },
              { href: '/blog/creative-gif-design-tutorial', label: 'Creative GIF Design Tutorial' }
            ]}
            altTools={[
              { href: '/resize', label: 'Resize GIF', desc: 'Change dimensions without cropping.' },
              { href: '/optimize', label: 'Optimize GIF', desc: 'Compress for faster loading.' },
              { href: '/add-text', label: 'Add Text to GIF', desc: 'Add captions and labels.' }
            ]}
          />

        </ToolPageLayout>
    </>
  )
}