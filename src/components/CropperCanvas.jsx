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
  return (
    <div style={{ position: 'relative', width: '100%', height: 400, background: '#222' }}>
      <Cropper
        image={imageUrl}
        crop={crop}
        zoom={zoom}
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
