import React, { useRef, useEffect, useState } from 'react'



export default function InteractiveCanvas({ 
  imageUrl, 
  text, 
  textSettings, 
  onTextPositionChange 
}) {
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [textSize, setTextSize] = useState({ width: 0, height: 0 })

  // Load image only when imageUrl changes
  useEffect(() => {
    if (!imageUrl) return
    const img = new Image()
    img.onload = () => {
      // Fit image to max 800x600, keep aspect ratio
      const maxWidth = 800
      const maxHeight = 600
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }
      setCanvasSize({ width, height })
      imageRef.current = img
      setImageLoaded(true)
    }
    img.crossOrigin = 'anonymous'
    img.src = imageUrl
  }, [imageUrl])

  // Draw image and text whenever imageLoaded, text, or settings change
  useEffect(() => {
    if (!imageLoaded || !canvasRef.current || !imageRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = imageRef.current
    const { width, height } = canvasSize
    canvas.width = width
    canvas.height = height
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)
    // Measure text size
    const font = `${textSettings.fontSize || 24}px ${textSettings.fontFamily || 'Arial'}`
    ctx.font = font
    const metrics = ctx.measureText(text)
    const tSize = { width: metrics.width, height: parseInt(font, 10) || 24 }
    setTextSize(tSize)
    // Draw text if provided
    if (text && text.trim()) {
      drawText(ctx, text, textSettings, width, height, tSize)
    }
  }, [imageLoaded, text, textSettings, canvasSize])

  // Draw text at x/y position from settings
  const drawText = (ctx, textContent, settings, canvasWidth, canvasHeight, tSize) => {
    if (!textContent || !textContent.trim()) return;
    const {
      fontSize = 24,
      fontFamily = 'Arial',
      color = '#ffffff',
      strokeColor = '#000000',
      strokeWidth = 2,
      horizontalAlign = 'center', // 'left', 'center', 'right'
      verticalAlign = 'middle',   // 'top', 'middle', 'bottom'
      offsetX = 0,
      offsetY = 0,
    } = settings;

    ctx.font = `${fontSize}px ${fontFamily}`;

    // Horizontal alignment
    let x;
    if (horizontalAlign === 'left') {
      ctx.textAlign = 'left';
      x = 0 + offsetX;
    } else if (horizontalAlign === 'center') {
      ctx.textAlign = 'center';
      x = canvasWidth / 2 + offsetX;
    } else if (horizontalAlign === 'right') {
      ctx.textAlign = 'right';
      x = canvasWidth + offsetX;
    } else {
      ctx.textAlign = 'center';
      x = canvasWidth / 2 + offsetX;
    }

    // Vertical alignment
    let y;
    if (verticalAlign === 'top') {
      ctx.textBaseline = 'top';
      y = 0 + offsetY;
    } else if (verticalAlign === 'middle') {
      ctx.textBaseline = 'middle';
      y = canvasHeight / 2 + offsetY;
    } else if (verticalAlign === 'bottom') {
      ctx.textBaseline = 'bottom';
      y = canvasHeight + offsetY;
    } else {
      ctx.textBaseline = 'middle';
      y = canvasHeight / 2 + offsetY;
    }

    // Draw stroke
    if (strokeWidth > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.strokeText(textContent, x, y);
    }
    ctx.fillStyle = color;
    ctx.fillText(textContent, x, y);
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-gray-100"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="block mx-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg bg-white bg-opacity-80">
            Loading image...
          </div>
        )}
      </div>
    </div>
  )
}
