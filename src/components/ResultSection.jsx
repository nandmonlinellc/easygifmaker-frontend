import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Download } from 'lucide-react'

export default function ResultSection({
  title,
  description,
  imageUrl,
  downloadFileName,
  onReset,
  extraDownload
}) {
  if (!imageUrl) return null

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
          <img src={imageUrl} alt={title} className="max-w-full h-auto mx-auto mb-4 rounded-lg" />
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild>
              <a href={imageUrl} download={downloadFileName}>
                Download GIF
              </a>
            </Button>
            {extraDownload && extraDownload.url && (
              <Button asChild variant="secondary">
                <a href={extraDownload.url} download>
                  {extraDownload.label || 'Download Extra'}
                </a>
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
