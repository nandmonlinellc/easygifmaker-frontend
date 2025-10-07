import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Sparkles, SlidersHorizontal, Download } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import ToolPageLayout from '@/components/ToolPageLayout.jsx'
import ProcessingState from '@/components/ProcessingState'
import ResultSection from '@/components/ResultSection'
import EnhancedTipsSection from '@/components/EnhancedTipsSection'
import UploadState from '@/components/UploadState'
import DisplayAd from '@/components/ads/DisplayAd.jsx'
import InArticleAd from '@/components/ads/InArticleAd.jsx'
import useTaskPolling from '@/hooks/useTaskPolling.js'
import { getApiBase } from '@/lib/api.js'

const MIN_FRAMES = 8
const MAX_FRAMES = 24
const MIN_STEPS = 12
const MAX_STEPS = 40
const MIN_FPS = 4
const MAX_FPS = 16

export default function PromptToGifTool() {
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [frameCount, setFrameCount] = useState(16)
  const [guidanceScale, setGuidanceScale] = useState(7.5)
  const [steps, setSteps] = useState(24)
  const [fps, setFps] = useState(8)
  const [seed, setSeed] = useState('')
  const [error, setError] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)
  const [result, setResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { runTask, isProcessing, reset } = useTaskPolling({
    maxAttempts: 120,
    maxDelay: 6000
  })

  useEffect(() => {
    return () => {
      if (result?.previewUrl) {
        URL.revokeObjectURL(result.previewUrl)
      }
    }
  }, [result?.previewUrl])

  const adSlots = useMemo(() => ({
    header: <DisplayAd slot="1125232950" className="max-w-3xl w-full" />,
    mid: <InArticleAd slot="8336674411" className="max-w-2xl w-full" />,
    footer: <DisplayAd slot="1125232950" className="max-w-3xl w-full" />
  }), [])

  const busy = isSubmitting || isProcessing

  const startGeneration = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Write a prompt to describe the animation you want to create.')
      return
    }

    if (result?.previewUrl) {
      URL.revokeObjectURL(result.previewUrl)
    }

    setError(null)
    setResult(null)
    setStatusMessage(null)
    setIsSubmitting(true)

    const apiBase = getApiBase()
    const payload = {
      prompt: prompt.trim(),
      negative_prompt: negativePrompt.trim() || null,
      num_frames: frameCount,
      guidance_scale: Number(guidanceScale.toFixed(2)),
      num_inference_steps: steps,
      fps,
      seed: seed && !Number.isNaN(Number(seed)) ? Number(seed) : null
    }

    try {
      const resultKey = await runTask({
        startTask: async () => {
          const response = await fetch(`${apiBase}/api/ai/prompt-gif`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
          const data = await response.json().catch(() => ({}))
          if (!response.ok) {
            throw new Error(data?.message || data?.error || 'Failed to start generation.')
          }
          const taskId = data.task_id || data.taskId
          if (!taskId) throw new Error('Backend did not return a task identifier.')
          return { taskId }
        },
        pollTask: async (taskId) => {
          const statusResp = await fetch(`${apiBase}/api/task-status/${taskId}`)
          if (!statusResp.ok) {
            throw new Error('Failed to poll task status.')
          }
          return statusResp.json()
        },
        extractResult: (payload) => payload?.result,
        onStatus: (payload) => setStatusMessage(payload?.status || payload?.state)
      })

      if (!resultKey) {
        throw new Error('Generation completed without a result key.')
      }

      const downloadUrl = `${apiBase}/api/download/${encodeURIComponent(resultKey)}?proxy=1`
      const downloadResp = await fetch(downloadUrl)
      if (!downloadResp.ok) {
        throw new Error('Failed to download generated GIF.')
      }
      const blob = await downloadResp.blob()
      const previewUrl = URL.createObjectURL(blob)
      setResult({ previewUrl, downloadUrl })
      setWorkflowState('result')
    } catch (err) {
      reset()
      setError(err.message || 'Generation failed. Please tweak your prompt or try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }, [prompt, negativePrompt, frameCount, guidanceScale, steps, fps, seed, result?.previewUrl, runTask, reset])

  const [workflowState, setWorkflowState] = useState('prompt')

  const resetWorkflow = useCallback(() => {
    setWorkflowState('prompt')
    setPrompt('')
    setNegativePrompt('')
    setSeed('')
    setResult(null)
    setError(null)
    setStatusMessage(null)
    setIsSubmitting(false)
    reset()
  }, [reset])

  return (
    <ToolPageLayout
      title="AI GIF Generator"
      description="Describe a scene and AnimateDiff will render it as a looping GIF. Tune frames, steps, and style guidance for exactly the motion you need."
      icon={Sparkles}
      seoProps={{
        title: 'Prompt to GIF Generator | EasyGIFMaker',
        description: 'Generate looping GIFs from plain-language prompts. Control frames, FPS, diffusion steps, guidance, and seeds for repeatable results.',
        keywords: 'ai gif generator, prompt to gif, animated diffusion gif, generate gif from prompt',
        canonical: 'https://easygifmaker.com/prompt-gif',
        ogImage: 'https://easygifmaker.com/og-image.svg'
      }}
      toolKey="promptGif"
      adSlots={adSlots}
      midAdPosition={2}
    >
      {workflowState === 'prompt' && (
        <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-500" />
              Describe your animated idea
            </CardTitle>
            <CardDescription className="text-gray-600">
              Prompts work best with a subject, mood, and shot description. Add a negative prompt to discourage unwanted details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="prompt" className="font-semibold text-gray-800">Prompt</label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="E.g. cinematic loop of a neon-lit city alleyway with rain and reflections"
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="negative" className="font-semibold text-gray-800">Negative prompt (optional)</label>
              <Textarea
                id="negative"
                value={negativePrompt}
                onChange={(event) => setNegativePrompt(event.target.value)}
                placeholder="blur, distortion, watermark"
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white/70 rounded-xl p-4 border border-white/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">Frames</span>
                  <span className="text-sm text-gray-500">{frameCount}</span>
                </div>
                <Slider
                  value={[frameCount]}
                  min={MIN_FRAMES}
                  max={MAX_FRAMES}
                  step={2}
                  onValueChange={([value]) => setFrameCount(value)}
                />
                <p className="mt-2 text-xs text-gray-600">More frames = longer clips but higher cost.</p>
              </div>

              <div className="bg-white/70 rounded-xl p-4 border border-white/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">Diffusion Steps</span>
                  <span className="text-sm text-gray-500">{steps}</span>
                </div>
                <Slider
                  value={[steps]}
                  min={MIN_STEPS}
                  max={MAX_STEPS}
                  step={2}
                  onValueChange={([value]) => setSteps(value)}
                />
                <p className="mt-2 text-xs text-gray-600">Higher steps sharpen detail but take longer.</p>
              </div>

              <div className="bg-white/70 rounded-xl p-4 border border-white/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">FPS</span>
                  <span className="text-sm text-gray-500">{fps} fps</span>
                </div>
                <Slider
                  value={[fps]}
                  min={MIN_FPS}
                  max={MAX_FPS}
                  step={1}
                  onValueChange={([value]) => setFps(value)}
                />
                <p className="mt-2 text-xs text-gray-600">Balance smoothness with render time.</p>
              </div>

              <div className="bg-white/70 rounded-xl p-4 border border-white/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">Guidance</span>
                  <span className="text-sm text-gray-500">{guidanceScale.toFixed(1)}</span>
                </div>
                <Slider
                  value={[guidanceScale]}
                  min={1}
                  max={15}
                  step={0.5}
                  onValueChange={([value]) => setGuidanceScale(value)}
                />
                <p className="mt-2 text-xs text-gray-600">Higher values follow the prompt tightly; lower values explore more.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="seed" className="font-semibold text-gray-800">Seed (optional)</label>
                <Input
                  id="seed"
                  value={seed}
                  onChange={(event) => setSeed(event.target.value)}
                  placeholder="Leave blank for random"
                />
              </div>
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 text-sm text-indigo-900">
                {statusMessage ? `Status: ${statusMessage}` : 'Tip: refine prompts with colour, mood, or camera cues.'}
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={startGeneration}
                disabled={busy}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg"
              >
                {busy ? 'Generating...' : 'Generate GIF'}
              </Button>
              <Button
                variant="outline"
                onClick={resetWorkflow}
                disabled={busy}
                className="flex-1"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {workflowState === 'processing' && (
        <ProcessingState
          title="Generating your GIF"
          description="Our diffusion pipeline is rendering frames and assembling your loop..."
        />
      )}

      {workflowState === 'result' && result && (
        <Card className="bg-gradient-to-br from-white to-emerald-50/40 shadow-lg">
          <CardContent className="py-12 text-center space-y-6">
            <div className="flex flex-col items-center gap-3">
              <Sparkles className="h-10 w-10 text-emerald-500" />
              <h2 className="text-2xl font-bold text-gray-800">Your GIF is ready!</h2>
              <p className="text-gray-600">Download the loop or refine the prompt to iterate.</p>
            </div>
            <div className="flex justify-center">
              <img src={result.previewUrl} alt="Generated GIF preview" className="rounded-xl shadow-lg max-h-72" />
            </div>
            <div className="space-y-3">
              <Button
                onClick={async () => {
                  try {
                    const response = await fetch(result.downloadUrl)
                    if (!response.ok) throw new Error('Download failed')
                    const blob = await response.blob()
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = 'generated.gif'
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(url)
                  } catch (err) {
                    setError(err.message || 'Download failed, please try again.')
                  }
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white"
              >
                <Download className="h-4 w-4 mr-2" /> Download GIF
              </Button>
              <Button variant="outline" onClick={resetWorkflow} className="w-full">
                Generate another GIF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <EnhancedTipsSection
        title="Prompt engineering tips"
        tips={[
          '<strong>Lead with subject + action</strong> then layer in atmosphere, medium, or colour palette for clarity.',
          '<strong>Add stylistic anchors</strong> (e.g., watercolor, cyberpunk, claymation) to steer visual tone.',
          '<strong>Use the negative prompt</strong> to avoid unwanted artefacts like text, logos, or motion blur.',
          '<strong>Experiment with seeds</strong> for reproducible variations when a style hits the mark.'
        ]}
      />
    </ToolPageLayout>
  )
}
