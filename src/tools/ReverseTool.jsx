import React, { useState, useCallback, useMemo } from 'react'
import DisplayAd from '@/components/ads/DisplayAd.jsx'
import InArticleAd from '@/components/ads/InArticleAd.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { RefreshCcw } from 'lucide-react'
import ResultSection from '../components/ResultSection'
import EnhancedTipsSection from '../components/EnhancedTipsSection'
import ProcessingState from '../components/ProcessingState'
import UploadState from '../components/UploadState'
import ToolPageLayout from '../components/ToolPageLayout'

export default function ReverseTool() {
  const [workflowState, setWorkflowState] = useState('upload')
  const [uploadMethod, setUploadMethod] = useState('file')
  const [mediaUrl, setMediaUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const adSlots = useMemo(() => ({
    header: <DisplayAd slot="1125232950" className="max-w-3xl w-full" />,
    mid: <InArticleAd slot="8336674411" className="max-w-2xl w-full" />,
    footer: <DisplayAd slot="1125232950" className="max-w-3xl w-full" />
  }), [])

  const handleFileUpload = useCallback((files, urlInput = null) => {
    if ((!files || files.length === 0) && !urlInput) return
    setErrorMessage(null)
    setResultUrl(null)

    let url
    if (uploadMethod === 'url' && urlInput) {
      url = urlInput
    } else if (files && files[0]) {
      url = URL.createObjectURL(files[0])
    }

    if (!url) return

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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to start reverse task.')
      }

      const data = await response.json()
      if (!data?.task_id) {
        throw new Error('No task_id returned from backend.')
      }

      const baseDelay = parseInt(import.meta.env.VITE_TASK_POLL_MS || '1500', 10)
      let delay = Number.isNaN(baseDelay) ? 1500 : baseDelay
      let resultKey = null

      for (let i = 0; i < 60; i++) {
        const statusResp = await fetch(`${apiUrl}/api/task-status/${data.task_id}`)
        if (statusResp.ok) {
          const statusData = await statusResp.json()
          const status = statusData.status || statusData.state
          if ((status === 'SUCCESS' || status === 'Task completed!') && statusData.result) {
            resultKey = statusData.result
            break
          }
          if (status === 'FAILURE') {
            throw new Error(statusData.error || 'GIF reverse failed.')
          }
        }

        await new Promise(res => setTimeout(res, delay))
        delay = Math.min(delay + 250, 3000)
      }

      if (!resultKey) {
        throw new Error('GIF reverse timed out. Please try again.')
      }

      const downloadResp = await fetch(`${apiUrl}/api/download/${resultKey}?proxy=1`)
      if (!downloadResp.ok) {
        throw new Error('Failed to fetch reversed GIF.')
      }
      const gifBlob = await downloadResp.blob()
      const previewUrl = URL.createObjectURL(gifBlob)
      setResultUrl({
        previewUrl,
        downloadUrl: `${apiUrl}/api/download/${resultKey}?proxy=1`
      })
      setWorkflowState('result')
    } catch (error) {
      setErrorMessage(error.message || 'Network error or unexpected issue.')
      setWorkflowState('editing')
    } finally {
      setIsProcessing(false)
    }
  }, [mediaUrl, uploadMethod])

  const resetWorkflow = useCallback(() => {
    setWorkflowState('upload')
    setMediaUrl(null)
    setResultUrl(null)
    setErrorMessage(null)
  }, [])

  return (
    <ToolPageLayout
      title="Reverse GIF"
      description="Flip any GIF backwards in seconds. Perfect for boomerang-style loops or playful reverse effects."
      icon={RefreshCcw}
      seoProps={{
        title: 'Reverse GIF - Play GIFs Backwards Online | EasyGIFMaker',
        description: 'Reverse the playback of animated GIFs online for free. Upload a GIF or paste a URL to reverse its animation direction instantly.',
        keywords: 'reverse gif, play gif backwards, gif reverser, reverse animation, gif editor',
        canonical: 'https://easygifmaker.com/reverse',
        ogImage: 'https://easygifmaker.com/og-image.svg'
      }}
      toolKey="reverseGif"
      adSlots={adSlots}
      midAdPosition={2}
      howToSteps={[
        {
          '@type': 'HowToStep',
          name: 'Upload GIF',
          text: 'Select a GIF file or paste a direct GIF URL.'
        },
        {
          '@type': 'HowToStep',
          name: 'Reverse Playback',
          text: 'Start the reverse process and preview your animation.'
        },
        {
          '@type': 'HowToStep',
          name: 'Download Result',
          text: 'Grab the reversed GIF when processing finishes.'
        }
      ]}
    >
      {workflowState === 'upload' && (
        <UploadState
          title="Upload GIF to Reverse"
          description="Select a GIF file or enter a GIF URL to flip the animation direction."
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-800">GIF Preview</CardTitle>
                  <CardDescription className="text-gray-600">
                    Check the animation before reversing it
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
                    <Button
                      onClick={resetWorkflow}
                      variant="outline"
                      className="flex-1 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
                    >
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

            <div className="min-w-0">
              <EnhancedTipsSection
                title="Quick tips for smooth reversals"
                tips={[
                  '<strong>Keep it short.</strong> Shorter loops reverse faster and look seamless.',
                  '<strong>Match the motion.</strong> Reversing works best on clear actions like jumps or spins.',
                  '<strong>Create boomerangs.</strong> Export both forward and reversed versions for back-and-forth loops.'
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {workflowState === 'processing' && (
        <ProcessingState
          title="Reversing your GIF"
          description="Flipping frames and rebuilding the animation..."
        />
      )}

      {workflowState === 'result' && resultUrl && (
        <ResultSection
          title="Your reversed GIF is ready!"
          description="Download the flipped animation or start another conversion."
          imageUrl={resultUrl.previewUrl}
          downloadFileName="reversed.gif"
          downloadUrl={resultUrl.downloadUrl}
          onReset={resetWorkflow}
        />
      )}
    </ToolPageLayout>
  )
}
