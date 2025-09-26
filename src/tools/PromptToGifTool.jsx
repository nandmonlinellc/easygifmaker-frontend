import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Sparkles, SlidersHorizontal, Download } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import ToolPageLayout from '@/components/ToolPageLayout.jsx'
import ProcessingState from '@/components/ProcessingState'
import SocialSharingSection from '@/components/SocialSharingSection'
import TipsFaqsBestPracticesSection from '@/components/TipsFaqsBestPracticesSection'
import TroubleshootingSection from '@/components/TroubleshootingSection'
import HowToUseSection from '@/components/HowToUseSection'
import ToolSeoSection from '@/components/ToolSeoSection'
import EnhancedTipsSection from '@/components/EnhancedTipsSection'
import ValueContentSection from '@/components/ValueContentSection'
import AdsenseAd from '@/components/AdsenseAd'
import DisplayAd from '@/components/ads/DisplayAd.jsx'
import InArticleAd from '@/components/ads/InArticleAd.jsx'
import QuickFeaturesBox from '@/components/QuickFeaturesBox'
import LimitsTable from '@/components/LimitsTable'
import { toolContent } from '@/data/toolContent.js'
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

  const { runTask, status: taskStatus, isProcessing, reset } = useTaskPolling({
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

  const afterContent = useMemo(() => (
    <>
      <ToolSeoSection
        icon={Sparkles}
        title="AI GIF Generator"
        description1="Turn your ideas into motion. Type a prompt, fine-tune diffusion settings, and AnimateDiff renders a looping GIF styled to match your creative brief."
        description2="Control frame count, diffusion steps, and motion cadence. Perfect for concept art, hero illustrations, product explainers, or mood-setting loops for social posts."
        features1={[
          { emoji: '🪄', text: 'AnimateDiff pipeline with prompt & negative prompt control' },
          { emoji: '🎞️', text: 'Adjust frames, FPS, and diffusion steps for pacing' },
          { emoji: '🎨', text: 'Guidance dial keeps generations on-brand' }
        ]}
        features2={[
          { emoji: '📸', text: 'Outputs ready-to-share GIF loops' },
          { emoji: '⚙️', text: 'Optional seed for reproducible renders' }
        ]}
        useCases={[
          { color: 'bg-indigo-400', text: 'Pitch animated hero art or UI explorations' },
          { color: 'bg-emerald-400', text: 'Create atmospheric loops for product launches' },
          { color: 'bg-rose-400', text: 'Storyboard marketing beats before production' },
          { color: 'bg-amber-400', text: 'Design social-ready motion stickers on demand' }
        ]}
      />

      <AdsenseAd adSlot="8336674411" adFormat="fluid" adLayout="in-article" />

      <TipsFaqsBestPracticesSection
        proTips={[
          { color: 'bg-blue-500', text: 'Start with broad prompts, then add style or lighting descriptors to refine.' },
          { color: 'bg-purple-500', text: 'Lower frames or increase FPS if jobs exceed the duration cap.' },
          { color: 'bg-green-500', text: 'Reuse a seed to iterate on the same scene with small prompt tweaks.' },
          { color: 'bg-pink-500', text: 'Set guidance around 6–9 for creative variability without chaotic outputs.' },
          { color: 'bg-orange-500', text: 'Keep steps under 28 when exploring—the extra speed helps rapid ideation.' },
          { color: 'bg-cyan-500', text: 'Use a succinct negative prompt (e.g. "blurry, low quality") to avoid artefacts.' }
        ]}
        faqs={[
          { question: 'How long can the GIF be?', answer: 'We currently cap generations to roughly 12 seconds. Reduce frames or raise FPS if you hit the limit.' },
          { question: 'Do I need a GPU?', answer: 'Yes, AnimateDiff is designed for GPU-backed runners. On CPU-only machines the job will be extremely slow.' },
          { question: 'Why did my job fail?', answer: 'Common causes are missing AI dependencies or the queue being temporarily unavailable. Try again a little later or check server logs.' },
          { question: 'Can I change the loop direction?', answer: 'Download the GIF and drop it into the Reverse or Optimize tools for post-processing tweaks.' },
          { question: 'What’s the benefit of setting a seed?', answer: 'Seeds make the diffusion process deterministic so you can iterate or re-render with consistent motion.' },
          { question: 'Is the GIF stored?', answer: 'Exports live in a temporary session directory and follow the same scheduled cleanup policy as other tasks.' }
        ]}
        relatedResources={[
          { href: '/blog/creative-gif-design-tutorial', icon: '🎨', text: 'Creative GIF Design Tutorial' },
          { href: '/blog/top-5-gif-optimization-tips', icon: '⚡', text: 'Top GIF Optimisation Tips' }
        ]}
      />

      <TroubleshootingSection
        commonIssues={[
          { color: 'bg-red-500', text: 'Generation stalls at queueing' },
          { color: 'bg-amber-500', text: 'Prompt too long or missing key subject' },
          { color: 'bg-blue-500', text: 'Output looks noisy or off-topic' }
        ]}
        quickFixes={[
          { icon: '♻️', text: 'Reduce frames to 12–16 and retry' },
          { icon: '📝', text: 'Add style cues like “cinematic lighting” or “watercolour”' },
          { icon: '🚫', text: 'Use negative prompt “text, watermark, blurry” to suppress artefacts' }
        ]}
      />

      <SocialSharingSection
        title="Share your AI animation"
        description="Tag @NMToolbox when you post your loops—community spotlights go out weekly."
      />

      <ValueContentSection content={toolContent.promptGif} />
    </>
  ), [])

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
          const payload = await statusResp.json()
          return payload
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
      setResult({ previewUrl, downloadUrl, key: resultKey })
      setStatusMessage('SUCCESS')
    } catch (err) {
      setError(err.message || 'Prompt-to-GIF generation failed.')
      setStatusMessage(null)
    } finally {
      setIsSubmitting(false)
    }
  }, [prompt, negativePrompt, frameCount, guidanceScale, steps, fps, seed, runTask, result?.previewUrl])

  const resetForm = useCallback(() => {
    setPrompt('')
    setNegativePrompt('')
    setFrameCount(16)
    setGuidanceScale(7.5)
    setSteps(24)
    setFps(8)
    setSeed('')
    setError(null)
    setResult(null)
    setStatusMessage(null)
    reset()
  }, [reset])

  return (
    <ToolPageLayout
      title="Prompt to GIF"
      description="Generate looping GIFs from text prompts with AnimateDiff and adjustable diffusion controls."
      icon={Sparkles}
      seoProps={{
        title: 'Prompt to GIF Generator - AnimateDiff Online | EasyGIFMaker',
        description: 'Create AI GIFs from text prompts using AnimateDiff. Control frames, FPS, guidance scale, and seed for precise animated results.',
        keywords: 'prompt to gif, AI gif generator, animatediff, text to gif, diffusion gif, ai animation',
        canonical: 'https://easygifmaker.com/prompt-gif',
        ogImage: 'https://easygifmaker.com/og-image.svg'
      }}
      howToSteps={[
        { '@type': 'HowToStep', name: 'Describe your scene', text: 'Write a detailed prompt that captures subject, style, and motion.' },
        { '@type': 'HowToStep', name: 'Tune diffusion settings', text: 'Adjust frames, guidance, and steps to balance fidelity and speed.' },
        { '@type': 'HowToStep', name: 'Generate & download', text: 'Queue the job, preview the GIF, and download the loop.' }
      ]}
      adSlots={adSlots}
      afterContent={afterContent}
    >
      <HowToUseSection
        title="How to create an AI GIF"
        steps={[
          { title: 'Describe the loop', description: 'Include subject, atmosphere, and motion cues (e.g. “neon cyberpunk alley with rain”).' },
          { title: 'Dial in settings', description: 'Use fewer frames for shorter loops or bump steps for extra detail.' },
          { title: 'Generate & download', description: 'We render the GIF server-side—save the download once it finishes processing.' }
        ]}
      />

      <QuickFeaturesBox
        features={[
          { emoji: '✨', text: 'AnimateDiff pipeline tuned for quick iteration' },
          { emoji: '🧠', text: 'Prompt + negative prompt support' },
          { emoji: '🎚️', text: 'Guidance, frames, steps, and FPS controls' },
          { emoji: '🪄', text: 'Optional seed for reproducible renders' }
        ]}
      />

      <LimitsTable
        acceptedFormats={['Prompt input']}
        maxFps={`${MAX_FPS} fps`}
        maxFrames={`${MAX_FRAMES} frames`}
        maxResolution={'Model dependent (typically 512×512)'}
        recommendedDuration={'Keep loops under ~10 seconds for best results'}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 shadow-lg bg-gradient-to-br from-white to-indigo-50/40">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              Describe your animation
            </CardTitle>
            <CardDescription className="text-gray-600">
              Give the model clear subject, mood, lighting, and motion guidance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Prompt</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Futuristic city street at night, neon reflections, gentle camera pan, cinematic lighting"
                rows={4}
                disabled={busy}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Negative prompt (optional)</label>
              <Textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="e.g. blurry, low quality, text, watermark"
                rows={2}
                disabled={busy}
              />
            </div>

            <Card className="bg-white/80 border-dashed">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-indigo-500" />
                  Diffusion controls
                </CardTitle>
                <CardDescription>Adjust motion length and fidelity before you queue the job.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Frames</span>
                    <span>{frameCount}</span>
                  </div>
                  <Slider
                    value={[frameCount]}
                    min={MIN_FRAMES}
                    max={MAX_FRAMES}
                    step={2}
                    onValueChange={(value) => setFrameCount(value[0])}
                    disabled={busy}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Guidance</span>
                    <span>{guidanceScale.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[guidanceScale]}
                    min={1}
                    max={15}
                    step={0.5}
                    onValueChange={(value) => setGuidanceScale(value[0])}
                    disabled={busy}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Diffusion steps</span>
                    <span>{steps}</span>
                  </div>
                  <Slider
                    value={[steps]}
                    min={MIN_STEPS}
                    max={MAX_STEPS}
                    step={2}
                    onValueChange={(value) => setSteps(value[0])}
                    disabled={busy}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Frames per second</span>
                    <span>{fps}</span>
                  </div>
                  <Slider
                    value={[fps]}
                    min={MIN_FPS}
                    max={MAX_FPS}
                    step={1}
                    onValueChange={(value) => setFps(value[0])}
                    disabled={busy}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Seed (optional)</label>
                  <Input
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="Random each run"
                    disabled={busy}
                  />
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={startGeneration}
                disabled={busy}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                {busy ? 'Generating…' : 'Generate GIF'}
              </Button>
              <Button variant="outline" onClick={resetForm} disabled={busy}>
                Reset
              </Button>
            </div>
            {statusMessage && (
              <p className="text-sm text-gray-500">Status: {statusMessage}</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-500" />
              Result
            </CardTitle>
            <CardDescription>Preview the loop and grab the download link once processing finishes.</CardDescription>
          </CardHeader>
          <CardContent>
            {busy && (
              <ProcessingState
                title="Generating your animation"
                description="AnimateDiff is rendering frames. This can take a minute on longer prompts."
              />
            )}

            {!busy && result && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-4">
                  <img
                    src={result.previewUrl}
                    alt="Generated GIF preview"
                    className="w-full h-auto rounded-xl shadow"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                    <a href={result.downloadUrl} download target="_blank" rel="noopener noreferrer">
                      Download GIF
                    </a>
                  </Button>
                  <p className="text-xs text-gray-500">
                    GIFs are stored temporarily. Save the file promptly if you plan to share or remix it.
                  </p>
                </div>
              </div>
            )}

            {!busy && !result && !error && (
              <p className="text-sm text-gray-500">
                Your GIF preview will appear here after generation completes.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <EnhancedTipsSection
        title="Prompt writing checklist"
        highlights={[
          { label: 'Subject', description: 'Define the main character or object in one sentence.' },
          { label: 'Motion', description: 'Describe how the camera or subject should move (slow pan, looping bounce, etc.).' },
          { label: 'Style', description: 'Reference art movements, lighting, or atmosphere to steer the look.' }
        ]}
        insights={[
          'Keep prompts under 250 characters where possible—concise direction tends to render faster.',
          'Negative prompts are powerful: removing “text” and “watermark” reduces overlay artefacts.',
          'If outputs feel static, lower frame count and decrease FPS to exaggerate perceived motion.'
        ]}
      />
    </ToolPageLayout>
  )
}

