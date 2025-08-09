import React, { useRef, useEffect, useState } from 'react'

export default function InteractiveCanvas({ 
  imageUrl, 
  text, 
  textSettings, 
  textLayers, // optional array of layers
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
    const layers = Array.isArray(textLayers) && textLayers.length > 0
      ? textLayers
      : (text && textSettings ? [{ ...textSettings, text }] : [])

    layers.forEach(layer => {
      const initialFontSize = Number(layer.fontSize || 24)
      const fontFamily = layer.fontFamily || 'Arial'
      const maxWidthRatio = (layer.maxWidthRatio ?? 0.95)
      const lineHeightMult = (layer.lineHeight ?? 1.2)
      const autoFit = (layer.autoFit ?? true)

      let effectiveFont = initialFontSize
      ctx.font = `${effectiveFont}px ${fontFamily}`
      const maxWidth = Math.round(maxWidthRatio * width)
      let lines = wrapCanvasText(ctx, layer.text || '', maxWidth)
      let lineHeight = Math.max(10, Math.round(effectiveFont * lineHeightMult))
      let blockHeight = lines.length * lineHeight
      let blockWidth = lines.reduce((m, l) => Math.max(m, ctx.measureText(l).width), 0)

      if (autoFit) {
        let guard = 0
        while ((blockHeight > height * 0.95) && effectiveFont > 8 && guard < 50) {
          effectiveFont = Math.max(8, Math.floor(effectiveFont * 0.9))
          ctx.font = `${effectiveFont}px ${fontFamily}`
          lineHeight = Math.max(10, Math.round(effectiveFont * lineHeightMult))
          lines = wrapCanvasText(ctx, layer.text || '', maxWidth)
          blockHeight = lines.length * lineHeight
          blockWidth = lines.reduce((m, l) => Math.max(m, ctx.measureText(l).width), 0)
          guard++
        }
      }

      const tSize = { width: blockWidth, height: blockHeight }
      setTextSize(tSize)
      if ((layer.text || '').trim()) {
        const drawSettings = { ...layer, fontSize: effectiveFont }
        drawText(ctx, lines, drawSettings, width, height, tSize, lineHeight)
      }
    })
  }, [imageLoaded, text, textSettings, canvasSize, textLayers])

  // Draw text at x/y position from settings
  const drawText = (ctx, lines, settings, canvasWidth, canvasHeight, tSize, lineHeight) => {
    if (!lines || lines.length === 0) return;
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
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Compute top-left of the text block based on alignment
    let x;
    if (horizontalAlign === 'left') {
      x = 0 + offsetX;
    } else if (horizontalAlign === 'center') {
      x = (canvasWidth - tSize.width) / 2 + offsetX;
    } else if (horizontalAlign === 'right') {
      x = canvasWidth - tSize.width + offsetX;
    } else {
      x = (canvasWidth - tSize.width) / 2 + offsetX;
    }

    let y;
    if (verticalAlign === 'top') {
      y = 0 + offsetY;
    } else if (verticalAlign === 'middle') {
      y = (canvasHeight - tSize.height) / 2 + offsetY;
    } else if (verticalAlign === 'bottom') {
      y = canvasHeight - tSize.height + offsetY;
    } else {
      y = (canvasHeight - tSize.height) / 2 + offsetY;
    }

    ctx.fillStyle = color;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const ly = y + i * lineHeight
      if (strokeWidth > 0) {
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = strokeWidth
        ctx.strokeText(line, x, ly)
      }
      ctx.fillText(line, x, ly)
    }
  }

  // Wrap text into multiple lines based on canvas width
  const wrapCanvasText = (ctx, textContent, maxWidth) => {
    if (!textContent) return []
    const wordsByPara = textContent.split('\n').map(p => p.split(/\s+/))
    const lines = []
    for (const words of wordsByPara) {
      let line = ''
      for (const word of words) {
        const test = line ? `${line} ${word}` : word
        const w = ctx.measureText(test).width
        if (w <= maxWidth || !line) {
          line = test
        } else {
          lines.push(line)
          line = word
        }
      }
      if (line) lines.push(line)
    }
    return lines
  }

  return (
    <div className="w-full flex flex-col items-center">
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