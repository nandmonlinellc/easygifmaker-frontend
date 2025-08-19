import React from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Upload } from 'lucide-react'

export default function VideoUploadSection({
  uploadMethod,
  setUploadMethod,
  handleFileUpload,
  isProcessing
}) {
  const fileInputRef = React.useRef(null)
  const [urlInput, setUrlInput] = React.useState('')
  const fileInputId = React.useId()
  const urlInputId = React.useId()
  return (
    <Tabs value={uploadMethod} onValueChange={setUploadMethod}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="file">Upload File</TabsTrigger>
        <TabsTrigger value="url">From URL</TabsTrigger>
      </TabsList>
      
      <TabsContent value="file" className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg mb-2">Drop your video here or click to upload</p>
          <p className="text-sm text-gray-500 mb-4">
            Supported formats: MP4, WebM, AVI, MOV, MKV, FLV
          </p>
          <p className="text-xs text-gray-400 mb-4">Max file size: 200MB</p>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileUpload(e.target.files)}
            style={{ display: 'none' }}
            id={fileInputId}
            ref={fileInputRef}
            disabled={isProcessing}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            {isProcessing ? 'Loading...' : 'Choose Video'}
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="url" className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor={urlInputId}>Enter video URL:</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id={urlInputId}
                type="url"
                placeholder="https://youtube.com/watch?v=... or direct video URL"
                disabled={isProcessing}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (urlInput) {
                    handleFileUpload(null, urlInput)
                  }
                }}
                disabled={isProcessing}
              >
                {isProcessing ? 'Loading...' : 'Load'}
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Supports YouTube, Dailymotion, Vimeo, and direct video URLs
          </p>
          <p className="text-xs text-gray-400">Max file size: 200MB</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}

