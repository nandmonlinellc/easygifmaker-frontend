import React, { useRef, useState, useEffect, useCallback } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { Button } from '@/components/ui/button.jsx'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'

export default function VideoTimeline({
  videoUrl,
  onSegmentChange,
  segmentRange, // Now controlled by parent
  setSegmentRange // Now controlled by parent
}) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
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
      // Only initialize once per video load and only if value is different
      if (
        !initializedRef.current &&
        (segmentRange[0] !== 0 || segmentRange[1] !== Math.min(10, newDuration))
      ) {
        setSegmentRange([0, Math.min(10, newDuration)])
        setIsVideoLoaded(true)
        initializedRef.current = true
      } else if (!initializedRef.current) {
        setIsVideoLoaded(true)
        initializedRef.current = true
      }
    }

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      initializedRef.current = false // Reset for next video
    }
  }, [videoUrl, setSegmentRange])

  // Effect to notify parent about segment range changes
  useEffect(() => {
    if (onSegmentChange && isVideoLoaded) {
      onSegmentChange({
        startTime: segmentRange[0],
        duration: segmentRange[1] - segmentRange[0]
      })
    }
  }, [segmentRange, onSegmentChange, isVideoLoaded])

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(prev => !prev)
  }, [isPlaying])

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

    // Stop at segment end
    const checkTime = () => {
      if (video.currentTime >= segmentRange[1]) {
        video.pause()
        setIsPlaying(false)
        return
      }
      if (isPlaying) { // Only continue checking if still playing
        requestAnimationFrame(checkTime)
      }
    }
    requestAnimationFrame(checkTime)
  }, [segmentRange, isPlaying])

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
    <div className="space-y-4">
      {/* Video Player */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto max-h-96"
          controls={false}
          preload="metadata"
        />
        
        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-4 text-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayPause}
              disabled={!isVideoLoaded}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => seekToTime(segmentRange[0])}
              disabled={!isVideoLoaded}
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={playSegment}
              disabled={!isVideoLoaded}
              className="text-white hover:bg-white/20"
            >
              Play Segment
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => seekToTime(segmentRange[1])}
              disabled={!isVideoLoaded}
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 text-center text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {isVideoLoaded && (
        <div className="space-y-4">
          <div className="px-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Start: {formatTime(segmentRange[0])}</span>
              <span>Duration: {formatTime(segmentRange[1] - segmentRange[0])}</span>
              <span>End: {formatTime(segmentRange[1])}</span>
            </div>
            
            <div className="relative">
              <Slider
                range
                min={0}
                max={duration}
                step={0.1}
                value={segmentRange}
                onChange={handleRangeChange}
                trackStyle={[{ backgroundColor: '#3b82f6', height: 8 }]}
                handleStyle={[
                  { borderColor: '#3b82f6', height: 20, width: 20, backgroundColor: '#3b82f6' },
                  { borderColor: '#3b82f6', height: 20, width: 20, backgroundColor: '#3b82f6' }
                ]}
                railStyle={{ backgroundColor: '#e5e7eb', height: 8 }}
              />
              
              {/* Current time indicator */}
              <div
                className="absolute top-0 w-0.5 h-8 bg-red-500 pointer-events-none"
                style={{
                  left: `${(currentTime / duration) * 100}%`,
                  transform: 'translateX(-50%)'
                }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0:00</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

