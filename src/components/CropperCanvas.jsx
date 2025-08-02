import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

export default function CropperCanvas({
  imageUrl,
  aspect,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete
}) {
  // Ensure crop values are valid numbers
  const safeCrop = {
    x: typeof crop.x === 'number' && !isNaN(crop.x) ? crop.x : 0,
    y: typeof crop.y === 'number' && !isNaN(crop.y) ? crop.y : 0
  }
  
  const safeZoom = typeof zoom === 'number' && !isNaN(zoom) ? zoom : 1
  
  return (
    <div style={{ position: 'relative', width: '100%', height: 400, background: '#222' }}>
      <Cropper
        image={imageUrl}
        crop={safeCrop}
        zoom={safeZoom}
        aspect={aspect}
        onCropChange={onCropChange}
        onZoomChange={onZoomChange}
        onCropComplete={onCropComplete}
        cropShape="rect"
        showGrid={true}
        style={{ containerStyle: { borderRadius: 12 } }}
      />
    </div>
  )
}
