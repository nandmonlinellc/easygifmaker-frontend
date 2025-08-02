import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Download } from 'lucide-react'

export default function ResultSection({
  title,
  description,
  imageUrl,
  downloadFileName,
  downloadUrl,
  onReset,
  extraDownload
}) {

  if (!imageUrl) return null

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Download failed')
      }
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download error:', error)
      // Fallback to direct link
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
                          <div className="text-center">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="max-w-full h-auto mx-auto mb-4 rounded-lg"
                      loading="lazy"
                    />
          <div className="flex gap-4 justify-center flex-wrap">
            <Button onClick={() => handleDownload(downloadUrl || imageUrl, downloadFileName)}>
              Download GIF
            </Button>
            {extraDownload && extraDownload.url && (
              <Button onClick={() => handleDownload(extraDownload.url, extraDownload.label || 'extra.mp4')} variant="secondary">
                {extraDownload.label || 'Download Extra'}
              </Button>
            )}
            {onReset && (
              <Button onClick={onReset} variant="outline">
                Create Another
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
