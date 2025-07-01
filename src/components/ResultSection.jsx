import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Download } from 'lucide-react'

export default function ResultSection({
  title,
  description,
  imageUrl,
  downloadFileName,
  onReset
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
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <a href={imageUrl} download={downloadFileName}>
                Download
              </a>
            </Button>
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
