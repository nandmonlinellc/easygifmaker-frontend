import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { RefreshCcw } from 'lucide-react'
import ResultSection from '../components/ResultSection'
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
import AdsenseAd from '../components/AdsenseAd'

export default function ReverseTool() {
  const [workflowState, setWorkflowState] = useState('upload')
  const [uploadMethod, setUploadMethod] = useState('file')
  const [mediaUrl, setMediaUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
      const response = await fetch(`${apiUrl}/api/reverse`, {
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
            status = statusData.status || statusData.state
            result = statusData.result
            if ((status === 'SUCCESS' || status === 'Task completed!') && result) {
              break
            } else if (status === 'FAILURE') {
              throw new Error(statusData.error || 'GIF reverse failed.')
            }
          }
          await new Promise(res => setTimeout(res, delay))
          delay = Math.min(delay + 250, 3000)
        }
        if ((status === 'SUCCESS' || status === 'Task completed!') && result) {
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
          throw new Error('GIF reverse timed out. Please try again.')
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
  }, [uploadMethod, mediaUrl])

  const resetWorkflow = () => {
    setWorkflowState('upload')
    setMediaUrl(null)
    setResultUrl(null)
    setErrorMessage(null)
  }

  return (
    <>
      <ToolPageLayout
        title="Reverse GIF"
        description="Reverse the playback direction of animated GIFs online for free."
        icon={RefreshCcw}
        seoProps={{
          title: 'Reverse GIF - Play GIFs Backwards Online | EasyGIFMaker',
          description: 'Reverse the playback of animated GIFs online for free. Upload a GIF or paste a URL to reverse its animation direction instantly.',
          keywords: 'reverse gif, play gif backwards, gif reverser, reverse animation, gif editor',
          canonical: 'https://easygifmaker.com/reverse'
        }}
        howToSteps={[
          { '@type': 'HowToStep', name: 'Upload GIF', text: 'Select a GIF file or enter a GIF URL.' },
          { '@type': 'HowToStep', name: 'Reverse GIF', text: 'Click Reverse GIF to flip the animation.' },
          { '@type': 'HowToStep', name: 'Download', text: 'Download your reversed GIF.' }
        ]}
      >
        <HowToUseSection
          title="How to Use the GIF Reverser"
          steps={[
            { title: 'Upload your GIF', description: 'Select a GIF file or enter a GIF URL.' },
            { title: 'Preview', description: 'Check the animation before reversing.' },
            { title: 'Reverse the GIF', description: 'Click Reverse GIF to flip the playback.' },
            { title: 'Download', description: 'Save the reversed GIF.' }
          ]}
        />

        {workflowState === 'upload' && (
          <UploadState
            title="Upload GIF to Reverse"
            description="Select a GIF file or enter a GIF URL to reverse its playback."
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

        {workflowState === 'editing' && mediaUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-800">GIF Preview</CardTitle>
                  <CardDescription className="text-gray-600">
                    Preview your GIF before reversing
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
                      {isProcessing ? 'Reversing...' : 'Reverse GIF'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <EnhancedTipsSection
                title="Tips for Better Reversed GIFs"
                tips={[
                  'Use reversed GIFs to create boomerang-style effects.',
                  'Shorter GIFs reverse faster and smoother.',
                  'Combine forward and reversed clips for creative loops.'
                ]}
              />
            </div>
          </div>
        )}

        {workflowState === 'processing' && (
          <ProcessingState
            title="Reversing GIF..."
            description="Please wait while we reverse your GIF."
          />
        )}

        {workflowState === 'result' && resultUrl && (
          <ResultSection
            title="Your Reversed GIF is Ready!"
            description="Download your reversed GIF below."
            imageUrl={resultUrl.previewUrl}
            downloadFileName="reversed.gif"
            downloadUrl={resultUrl.downloadUrl}
            onReset={resetWorkflow}
          />
        )}

        <ToolSeoSection
          icon={RefreshCcw}
          title="Reverse GIF"
          description1="Reverse the playback direction of your GIFs with a single click. Perfect for creating boomerang-style animations or playing scenes backward."
          description2="Our free tool processes GIFs entirely in the cloud and keeps your files private. No registration required."
          features1={[
            { emoji: '↩️', text: 'Reverse GIF playback' },
            { emoji: '🎞️', text: 'Supports animated GIF files' },
            { emoji: '⚡', text: 'Fast processing in the cloud' }
          ]}
          features2={[
            { emoji: '🔄', text: 'Loop seamlessly in reverse' },
            { emoji: '🔒', text: 'We never store your files' }
          ]}
          useCases={[
            { color: 'bg-blue-400', text: 'Create boomerang-style GIFs' },
            { color: 'bg-green-400', text: 'Play moments backward for effect' },
            { color: 'bg-purple-400', text: 'Make fun reversed reaction GIFs' }
          ]}
        />

        <AdsenseAd adSlot="8336674411" adFormat="fluid" adLayout="in-article" />

        <TipsFaqsBestPracticesSection
          proTips={[
            { color: 'bg-blue-500', text: 'Shorter GIFs reverse faster and more smoothly.' },
            { color: 'bg-green-500', text: 'Use reversed clips to create engaging loops.' },
            { color: 'bg-purple-500', text: 'Combine forward and reverse for boomerang effects.' }
          ]}
          faqs={[
            { question: 'Does reversing change file size?', answer: 'The file size remains similar to the original.' },
            { question: 'Will the GIF loop backwards?', answer: 'Yes, the animation plays from last frame to first.' },
            { question: 'Can I reverse very large GIFs?', answer: 'Large files may take longer; try to keep under 200MB.' }
          ]}
          relatedResources={[
            { href: '/blog/top-5-gif-optimization-tips', icon: '⚡', text: 'Top 5 GIF Optimization Tips' },
            { href: '/blog/how-to-make-gifs-from-videos', icon: '📹', text: 'How to Make GIFs from Videos' }
          ]}
        />

        <TroubleshootingSection
          commonIssues={[
            { color: 'bg-yellow-500', text: 'Ensure the uploaded file is a valid GIF.' },
            { color: 'bg-orange-500', text: 'If processing takes too long, try a smaller file.' },
            { color: 'bg-red-500', text: 'Still having issues?', link: '/contact' }
          ]}
          quickFixes={[
            { icon: '🔁', text: 'Re-upload the GIF and try again' },
            { icon: '⏱️', text: 'Use shorter clips for quicker results' },
            { icon: '📥', text: 'Download the result to verify playback' }
          ]}
        />

        <SocialSharingSection
          title="Share Your Reversed GIF!"
          description="Share your reversed GIF on social media. Tag us with #EasyGIFMaker."
        />

        <ValueContentSection
          toolTitle="Reverse GIF"
          relatedLinks={[
            { href: '/blog/ultimate-guide-to-viral-gifs', label: 'Ultimate Guide to Viral GIFs' },
            { href: '/blog/gif-optimization-techniques', label: 'GIF Optimization Techniques' }
          ]}
          altTools={[
            { href: '/gif-maker', label: 'GIF Maker', desc: 'Create animated GIFs from images.' },
            { href: '/video-to-gif', label: 'Video to GIF', desc: 'Convert video clips to GIFs.' },
            { href: '/add-text', label: 'Add Text to GIF', desc: 'Add captions and watermarks.' }
          ]}
        />
      </ToolPageLayout>
    </>
  )
}
