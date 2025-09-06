import React, { useEffect, useMemo, useRef, useState } from 'react'

// Plays a sequence of frames (file or URL) honoring per-frame durations.
// Props:
// - frames: [{ file?: File, url?: string, duration: number }]
// - playing: boolean
// - speed: 0.5 | 1 | 2 | number
// - loopCount: number (0 = infinite)
// - width, height: optional CSS size for preview box
export default function FrameSequencePreview({
  frames = [],
  playing = false,
  speed = 1,
  loopCount = 0,
  width = '100%',
  height = 240,
  className = ''
}) {
  const [index, setIndex] = useState(0)
  const [loops, setLoops] = useState(0)
  const timerRef = useRef(null)
  const urlMapRef = useRef(new Map()) // File -> blob URL

  // Build stable display frames, reusing object URLs across renders.
  const displayFrames = useMemo(() => {
    const items = (frames || []).map((f) => {
      if (f?.file instanceof File) {
        let u = urlMapRef.current.get(f.file)
        if (!u) {
          try { u = URL.createObjectURL(f.file); urlMapRef.current.set(f.file, u) } catch {}
        }
        return { src: u, duration: f.duration || 500 }
      }
      return { src: f?.url, duration: f?.duration || 500 }
    }).filter(f => !!f.src)
    return items
  }, [frames])


  useEffect(() => {
    if (!playing || displayFrames.length === 0) {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
      return
    }
    const frame = displayFrames[index]
    const nextDelay = Math.max(20, Math.round((frame?.duration || 500) / (speed || 1)))
    timerRef.current = setTimeout(() => {
      const nextIndex = (index + 1) % displayFrames.length
      if (nextIndex === 0) {
        const nextLoops = loops + 1
        setLoops(nextLoops)
        if (loopCount > 0 && nextLoops >= loopCount) {
          // Stop at end
          return
        }
      }
      setIndex(nextIndex)
    }, nextDelay)
    return () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null } }
  }, [playing, index, displayFrames, speed, loops, loopCount])

  // Reset when frames change or playback toggles off
  useEffect(() => {
    if (!playing) { setIndex(0); setLoops(0) }
  }, [playing, frames])

  const current = displayFrames[index]

  return (
    <div className={`rounded-xl border bg-white overflow-hidden ${className}`} style={{ width, height }}>
      {current?.src ? (
        <img
          src={current.src}
          alt="GIF preview"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          decoding="async"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
          No preview
        </div>
      )}
    </div>
  )
}
