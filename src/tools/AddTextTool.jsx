import React, { useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Type, Settings } from 'lucide-react'
import InteractiveCanvas from '../components/InteractiveCanvas'
import ResultSection from '../components/ResultSection'
import TextSettingsPanel from '../components/TextSettingsPanel'
import FileUploadSection from '../components/FileUploadSection'
import SocialSharingSection from '../components/SocialSharingSection'
import TroubleshootingSection from '../components/TroubleshootingSection'
import TipsFaqsBestPracticesSection from '../components/TipsFaqsBestPracticesSection'
import ToolSeoSection from '../components/ToolSeoSection'
import HowToUseSection from '../components/HowToUseSection'
import ProcessingState from '../components/ProcessingState'
import UploadState from '../components/UploadState'
import ToolPageLayout from '../components/ToolPageLayout'

export default function AddTextTool() {
  const [workflowState, setWorkflowState] = useState('upload') // 'upload', 'editing', 'processing', 'result'
  const [uploadMethod, setUploadMethod] = useState('file')
  const [sourceFile, setSourceFile] = useState(null) // To hold the original file
  const [mediaUrl, setMediaUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 })
  // Text settings state
  const [textSettings, setTextSettings] = useState({
    text: 'Sample Text',
    fontSize: 24,
    fontFamily: 'Arial',
    color: '#ffffff',
    strokeColor: '#000000',
    strokeWidth: 2,
    horizontalAlign: 'center',
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: 0,
    x: 0,
    y: 0
  })

  // Handle text settings change from TextSettingsPanel
  const handleSettingChange = useCallback((key, value) => {
    setTextSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  // Unified upload handler for file or URL
  const handleFileUpload = useCallback((files, urlInput = null) => {
    if ((!files || files.length === 0) && !urlInput) return
    setErrorMessage(null)
    setResultUrl(null)
    let url
    if (uploadMethod === 'url' && urlInput) { // URL upload
      url = urlInput
      setSourceFile(null)
    } else { // File upload
      setSourceFile(files[0])
      url = URL.createObjectURL(files[0])
    }
    setMediaUrl(url)
    setWorkflowState('editing')
  }, [uploadMethod])

  // Handle text position change from InteractiveCanvas
  const handleTextPositionChange = useCallback((position) => {
    setTextSettings(prev => ({
      ...prev,
      x: position.x,
      y: position.y
    }))
  }, [])

  // Reset workflow to upload state
  const resetWorkflow = () => {
    setWorkflowState('upload')
    setSourceFile(null)
    setMediaUrl(null)
    setErrorMessage(null)
    setResultUrl(null)
    setTextSettings(prev => ({
      ...prev,
      text: 'Sample Text',
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 2,
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      x: 0,
      y: 0
    }))
  }

  // Handle final process (API call)
  const handleFinalProcess = async () => {
    if (!mediaUrl) return
    setIsProcessing(true)
    setErrorMessage(null)
    setWorkflowState('processing')
    try {
      const formData = new FormData()
      if (uploadMethod === 'url') {
        formData.append('url', mediaUrl)
      } else {
        formData.append('file', sourceFile, sourceFile.name)
      }
      formData.append('text', textSettings.text)
      formData.append('font_family', textSettings.fontFamily)
      formData.append('font_size', textSettings.fontSize.toString())
      formData.append('color', textSettings.color)
      formData.append('stroke_color', textSettings.strokeColor)
      formData.append('stroke_width', textSettings.strokeWidth.toString())
      formData.append('horizontal_align', textSettings.horizontalAlign)
      formData.append('vertical_align', textSettings.verticalAlign)
      formData.append('offset_x', textSettings.offsetX.toString())
      formData.append('offset_y', textSettings.offsetY.toString())
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
      const response = await fetch(`${apiUrl}/api/add-text`, {
        method: 'POST',
        body: formData
      })
      if (response.ok) {
        const data = await response.json()
        const taskId = data.task_id
        // Poll for task status
        let state = null
        let result = null
        let pollCount = 0
        while (pollCount < 60) { // up to 60s
          const statusResp = await fetch(`${apiUrl}/api/task-status/${taskId}`)
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
          const url = URL.createObjectURL(gifBlob)
          setResultUrl({
            previewUrl: url,
            downloadUrl: `${apiUrl}/api/download/${result}`
          })
          setWorkflowState('result')
        } else {
          throw new Error('Timed out waiting for processing.')
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

  // --- Render ---
  return (
    <>
      <ToolPageLayout
        title="Add Text to GIF"
        description="Add text and captions to GIFs online for free. Create memes, add watermarks, and customize your GIFs with text overlays."
        icon={Type}
        seoProps={{
          title: "Add Text to GIF - Add Captions and Text to GIFs Online | EasyGIFMaker",
          description: "Add text and captions to GIFs online for free. Create memes, add watermarks, and customize your GIFs with text overlays.",
          keywords: "add text to gif, gif captions, gif memes, gif watermark, text overlay gif, gif text editor, gif editor, gif maker, free gif maker, online gif maker, gif converter, gif creator, custom gif, create your own gif",
          canonical: "https://easygifmaker.com/add-text"
        }}
        howToSteps={[
          {
            "@type": "HowToStep",
            "name": "Upload GIF",
            "text": "Select a GIF file or enter a GIF URL to add text to."
          },
          {
            "@type": "HowToStep",
            "name": "Add and Customize Text",
            "text": "Add text, choose font, size, color, and position on your GIF."
          },
          {
            "@type": "HowToStep",
            "name": "Preview and Adjust",
            "text": "Preview your GIF with text and make final adjustments."
          },
          {
            "@type": "HowToStep",
            "name": "Generate and Download",
            "text": "Click 'Generate' to create your GIF with text overlay!"
          }
        ]}
      >
        <HowToUseSection
          title="How to Use the Text Editor"
          steps={[
            {
              title: "Upload your GIF",
              description: "Select a GIF file or enter a GIF URL to add text overlay."
            },
            {
              title: "Add and customize text",
              description: "Enter your text and customize font, color, size, and position."
            },
            {
              title: "Preview and adjust",
              description: "See your text overlay in real-time and make adjustments."
            },
            {
              title: "Download and share",
              description: "Download your GIF with text overlay and share it!"
            }
          ]}
        />

          {/* Upload State */}
          {workflowState === 'upload' && (
            <UploadState
              title="Upload GIF"
              description="Select a GIF file or enter a GIF URL to add text overlay"
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
              {/* GIF Preview and Text Editor */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-800">GIF Preview & Text Editor</CardTitle>
                    <CardDescription className="text-gray-600">
                      Add and customize text overlay on your GIF
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                      <div className="text-center">
                        <InteractiveCanvas
                          imageUrl={mediaUrl}
                          text={textSettings.text}
                          textSettings={textSettings}
                          onTextPositionChange={handleTextPositionChange}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={resetWorkflow} variant="outline" className="flex-1 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300">
                        Upload Different GIF
                      </Button>
                      <Button 
                        onClick={handleFinalProcess}
                        disabled={isProcessing || !textSettings.text}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {isProcessing ? 'Processing...' : 'Add Text to GIF'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Text Settings Panel */}
              <div>
                <Card className="bg-gradient-to-br from-white to-indigo-50/30 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <Type className="h-5 w-5 text-white" />
                      </div>
                      Text Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TextSettingsPanel
                      textSettings={textSettings}
                      onSettingChange={handleSettingChange}
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
              description="Adding text overlay to your GIF..."
            />
          )}

          {/* Result State */}
          {workflowState === 'result' && resultUrl && (
            <ResultSection
              title="Your GIF with Text is Ready!"
              description="Your GIF has been successfully updated with text overlay."
              imageUrl={resultUrl.previewUrl}
              downloadFileName="gif-with-text.gif"
              downloadUrl={resultUrl.downloadUrl}
              onReset={resetWorkflow}
            />
          )}

        <ToolSeoSection
          icon={Type}
          title="Add Text to GIF"
          description1="Transform your GIFs with custom text overlays using our powerful online editor. Whether you're adding captions, watermarks, or creative text effects, our tool makes it easy to enhance your GIFs with professional-looking text that stands out."
          description2="Our intuitive interface lets you customize font, color, size, position, and animation effects. Perfect for content creators, marketers, and anyone who wants to add context, branding, or creative flair to their GIFs."
          features1={[
            { emoji: "✏️", text: "Custom font selection and text styling" },
            { emoji: "🎨", text: "Color customization and effects" },
            { emoji: "📍", text: "Precise positioning and alignment" }
          ]}
          features2={[
            { emoji: "⚡", text: "Real-time preview and editing" },
            { emoji: "💎", text: "High-quality output preservation" }
          ]}
          useCases={[
            { color: "bg-yellow-400", text: "Add captions and subtitles to GIFs" },
            { color: "bg-green-400", text: "Create branded watermarks for business" },
            { color: "bg-blue-400", text: "Add funny text and memes to GIFs" },
            { color: "bg-purple-400", text: "Create promotional content with text" }
          ]}
        />
          
        <TipsFaqsBestPracticesSection 
          proTips={[
            {
              color: "bg-blue-500",
              text: "Use high contrast colors (white text on dark backgrounds or vice versa) for better readability."
            },
            {
              color: "bg-green-500",
              text: "Keep text concise and impactful - shorter messages are more memorable and readable."
            },
            {
              color: "bg-purple-500",
              text: "Position text away from busy areas of the GIF to avoid visual clutter."
            },
            {
              color: "bg-orange-500",
              text: "Preview your text overlay to ensure it's visible throughout the entire animation."
            }
          ]}
          faqs={[
            {
              question: "What text formats are supported?",
              answer: "All standard text characters, emojis, and special characters."
            },
            {
              question: "Can I add multiple text elements?",
              answer: "Currently supports single text overlay per GIF."
            },
            {
              question: "Will the text quality be preserved?",
              answer: "Yes, we maintain high quality while adding text overlay."
            },
            {
              question: "Is there a text length limit?",
              answer: "Recommended to keep text under 50 characters for best results."
            }
          ]}
          relatedResources={[
            {
              href: "/blog/add-text-to-gifs-guide",
              icon: "📝",
              text: "Adding Text to GIFs Guide"
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
              text: "If text isn't visible, try changing the color or adding a background."
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
              icon: "🎨",
              text: "Use high contrast colors for better visibility"
            },
            {
              icon: "📏",
              text: "Adjust text size to fit the GIF dimensions"
            },
            {
              icon: "📍",
              text: "Position text away from busy areas"
            }
          ]}
        />

        <SocialSharingSection 
          title="Share Your GIF!"
          description="Share your new GIF with text on Instagram, Twitter, TikTok, Facebook, or embed it in your blog or website. Tag us with #EasyGIFMaker for a chance to be featured!"
        />
      </ToolPageLayout>
    </>
  )
}
