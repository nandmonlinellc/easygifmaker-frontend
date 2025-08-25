import React, { useRef, useState, useEffect, useCallback } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { Button } from '@/components/ui/button.jsx'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'

export default function VideoTimeline({
  videoUrl,
  onSegmentChange,
  segmentRange, // Now controlled by parent
  setSegmentRange, // Now controlled by parent
  brightness = 0,
  contrast = 1
}) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const isPlayingRef = useRef(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const initializedRef = useRef(false)

  // Effect to handle video metadata loading and initial segment range setup
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      const newDuration = video.duration
      setDuration(newDuration)
      setIsVideoLoaded(true)
      // Only initialize once per video load - don't modify parent state here
      initializedRef.current = true
    }

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleEnded = () => {
      setIsPlaying(false)
      isPlayingRef.current = false
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      initializedRef.current = false // Reset for next video
    }
  }, [videoUrl])

  // Reset initialized state when video URL changes
  useEffect(() => {
    initializedRef.current = false
  }, [videoUrl])

  // Effect to notify parent about segment range changes.
  // We intentionally exclude onSegmentChange from deps to avoid infinite loops when
  // parent passes a new (inline) function each render. This only fires when the
  // actual numeric range changes after video is loaded.
  useEffect(() => {
    if (!isVideoLoaded) return
    if (!onSegmentChange) return
    onSegmentChange({
      startTime: segmentRange[0],
      duration: segmentRange[1] - segmentRange[0]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segmentRange[0], segmentRange[1], isVideoLoaded])

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setIsPlaying(true)
      isPlayingRef.current = true
    } else {
      video.pause()
      setIsPlaying(false)
      isPlayingRef.current = false
    }
  }, [])

  const seekToTime = useCallback((time) => {
    const video = videoRef.current
    if (!video) return
    
    video.currentTime = time
    setCurrentTime(time)
  }, [])

  const playSegment = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = segmentRange[0]
    video.play()
    setIsPlaying(true)
    isPlayingRef.current = true

    // Stop at segment end
    const checkTime = () => {
      if (video.currentTime >= segmentRange[1]) {
        video.pause()
        setIsPlaying(false)
        isPlayingRef.current = false
        return
      }
      if (isPlayingRef.current) { // Only continue checking if still playing
        requestAnimationFrame(checkTime)
      }
    }
    requestAnimationFrame(checkTime)
  }, [segmentRange])

  const handleRangeChange = useCallback((value) => {
    // Only update if value is actually different
    if (value[0] !== segmentRange[0] || value[1] !== segmentRange[1]) {
      setSegmentRange(value)
    }
  }, [setSegmentRange, segmentRange])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto max-h-96 object-contain"
          controls={false}
          preload="metadata"
          style={{ filter: `brightness(${1 + brightness}) contrast(${contrast})` }}
        />
        {/* Custom Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={togglePlayPause}
              size="sm"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 rounded-full p-3"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              onClick={() => seekToTime(Math.max(0, currentTime - 5))}
              size="sm"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 rounded-full p-2"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <div className="text-white text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <Button
              onClick={() => seekToTime(Math.min(duration, currentTime + 5))}
              size="sm"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 rounded-full p-2"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 text-lg">Timeline Selection</h3>
          <Button
            onClick={playSegment}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-4 py-2"
          >
            Play Segment
          </Button>
        </div>
        
        {/* Enhanced Timeline Slider */}
        <div className="space-y-4">
          <div className="relative">
            <Slider
              range
              min={0}
              max={duration}
              step={0.1}
              value={segmentRange}
              onChange={setSegmentRange}
              className="custom-slider"
              trackStyle={[
                { backgroundColor: '#3b82f6', height: 8, borderRadius: 4 },
                { backgroundColor: '#8b5cf6', height: 8, borderRadius: 4 }
              ]}
              handleStyle={[
                { 
                  backgroundColor: '#3b82f6', 
                  border: '3px solid white',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                  width: 20,
                  height: 20,
                  marginTop: -6
                },
                { 
                  backgroundColor: '#8b5cf6', 
                  border: '3px solid white',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
                  width: 20,
                  height: 20,
                  marginTop: -6
                }
              ]}
              railStyle={{ backgroundColor: '#e5e7eb', height: 8, borderRadius: 4 }}
            />
            {/* Current time indicator */}
            <div 
              className="absolute top-0 w-1 h-8 bg-red-500 rounded-full shadow-lg"
              style={{ 
                left: `${(currentTime / duration) * 100}%`,
                transform: 'translateX(-50%)'
              }}
            />
          </div>
          
          {/* Time Display */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Start:</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg font-mono">
                {formatTime(segmentRange[0])}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Duration:</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg font-mono">
                {formatTime(segmentRange[1] - segmentRange[0])}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">End:</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg font-mono">
                {formatTime(segmentRange[1])}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

