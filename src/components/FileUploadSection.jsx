import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Upload } from 'lucide-react'

// Supported formats for each tool (must match backend and UI)
const ACCEPTED_FORMATS = {
  'Image': [
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'apng', 'heic', 'heif', 'mng', 'jp2', 'avif', 'jxl', 'bmp', 'pdf'
  ],
  'GIF': [
    'gif', 'webp', 'apng', 'mng'
  ],
  'Video': [
    'mp4', 'webm', 'avi', 'mov', 'mkv', 'flv'
  ]
}

function getAcceptedExtensions(toolName) {
  return ACCEPTED_FORMATS[toolName] || []
}

function isFileTypeSupported(file, toolName) {
  const exts = getAcceptedExtensions(toolName)
  const name = file.name || ''
  const ext = name.split('.').pop().toLowerCase()
  return exts.includes(ext)
}

function isUrlSupported(url, toolName) {
  try {
    // Always allow YouTube URLs for Video tool
    if (toolName === 'Video') {
      const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i
      if (ytRegex.test(url)) return true
    }
    const exts = getAcceptedExtensions(toolName)
    const urlObj = new URL(url)
    const ext = urlObj.pathname.split('.').pop().toLowerCase()
    return exts.includes(ext)
  } catch {
    return false
  }
}

export default function FileUploadSection({
  uploadMethod,
  setUploadMethod,
  onFileSelect,
  onUrlSubmit,
  isProcessing,
  supportedFormats,
  isMultiple = false,
  isMultipleUrl = false, // NEW PROP
  accept,
  toolName = 'File',
  urlList = [], // NEW PROP: for controlled multi-url
  setUrlList = null // NEW PROP: for controlled multi-url
}) {
  const [urlInput, setUrlInput] = useState('')
  const [error, setError] = useState(null)

  // For single URL
  const handleUrlButtonClick = () => {
    setError(null)
    if (!urlInput) return
    if (!isUrlSupported(urlInput, toolName)) {
      setError(`Unsupported file type for this tool. Allowed: ${getAcceptedExtensions(toolName).join(', ').toUpperCase()}`)
      return
    }
    onUrlSubmit(urlInput)
  }

  // For multiple URLs (textarea, comma/newline separated)
  const handleMultiUrlSubmit = () => {
    setError(null)
    if (!urlInput) return
    // Split by newlines or commas, trim, filter empty
    const urls = urlInput.split(/\n|,/).map(u => u.trim()).filter(Boolean)
    const unsupported = urls.filter(url => !isUrlSupported(url, toolName))
    if (unsupported.length > 0) {
      setError(`Unsupported URLs: ${unsupported.join(', ')}. Allowed: ${getAcceptedExtensions(toolName).join(', ').toUpperCase()}`)
      return
    }
    if (setUrlList) setUrlList(urls)
    onUrlSubmit(urls)
  }

  const handleFileChange = (e) => {
    setError(null)
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      const unsupported = files.filter(f => !isFileTypeSupported(f, toolName))
      if (unsupported.length > 0) {
        setError(`Unsupported file type: ${unsupported.map(f => f.name).join(', ')}. Allowed: ${getAcceptedExtensions(toolName).join(', ').toUpperCase()}`)
        return
      }
      onFileSelect(e.target.files)
    }
  }

  return (
    <Tabs value={uploadMethod} onValueChange={setUploadMethod}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="file">Upload {isMultiple ? 'Files' : 'File'}</TabsTrigger>
        <TabsTrigger value="url">From URL{isMultipleUrl ? 's' : ''}</TabsTrigger>
      </TabsList>
      <TabsContent value="file" className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <input
            type="file"
            multiple={isMultiple}
            accept={accept}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-upload"
            disabled={isProcessing}
          />
          <Button 
            onClick={() => document.getElementById('file-upload').click()}
            disabled={isProcessing}
          >
            {isProcessing ? 'Loading...' : `Choose ${isMultiple ? 'Files' : 'File'}`}
          </Button>
          <p className="text-sm text-gray-500 mt-4">{supportedFormats}</p>
          <p className="text-xs text-gray-400">Max file size: 200MB</p>
        </div>
      </TabsContent>
      <TabsContent value="url" className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="url-input">Enter {toolName} URL{isMultipleUrl ? 's' : ''}:</Label>
            <div className="flex flex-col gap-2 mt-2">
              {isMultipleUrl ? (
                <>
                  <textarea
                    id="url-input"
                    rows={4}
                    placeholder={`Paste one URL per line or separate by comma`}
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    disabled={isProcessing}
                    className="w-full border rounded px-2 py-1"
                  />
                  <Button 
                    onClick={handleMultiUrlSubmit}
                    disabled={isProcessing || !urlInput}
                  >
                    {isProcessing ? 'Loading...' : 'Load URLs'}
                  </Button>
                  {urlList && urlList.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      <strong>Loaded URLs:</strong>
                      <ul className="list-disc pl-4">
                        {urlList.map((url, idx) => (
                          <li key={idx}>{url}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex gap-2">
                  <Input
                    id="url-input"
                    type="url"
                    placeholder={`https://example.com/${toolName.toLowerCase()}.${getAcceptedExtensions(toolName)[0] || 'gif'}`}
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={isProcessing}
                  />
                  <Button 
                    onClick={handleUrlButtonClick}
                    disabled={isProcessing || !urlInput}
                  >
                    {isProcessing ? 'Loading...' : 'Load'}
                  </Button>
                </div>
              )}
            </div>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <p className="text-sm text-gray-500">{supportedFormats}</p>
          <p className="text-xs text-gray-400">Max file size: 200MB</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}