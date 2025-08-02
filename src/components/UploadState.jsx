import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import FileUploadSection from './FileUploadSection.jsx';

const UploadState = ({
  title,
  description,
  errorMessage,
  uploadMethod,
  setUploadMethod,
  onFileSelect,
  onUrlSubmit,
  isProcessing,
  supportedFormats,
  accept,
  toolName,
  useGradient = true,
  isMultiple = false,
  isMultipleUrl = false,
  urlList = null,
  setUrlList = null
}) => {
  const cardClassName = useGradient
    ? "bg-gradient-to-br from-white to-blue-50/30 shadow-lg"
    : "";

  return (
    <Card className={cardClassName}>
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-800">{title}</CardTitle>
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        <FileUploadSection
          uploadMethod={uploadMethod}
          setUploadMethod={setUploadMethod}
          onFileSelect={onFileSelect}
          onUrlSubmit={onUrlSubmit}
          isProcessing={isProcessing}
          supportedFormats={supportedFormats}
          accept={accept}
          toolName={toolName}
          isMultiple={isMultiple}
          isMultipleUrl={isMultipleUrl}
          urlList={urlList}
          setUrlList={setUrlList}
        />
      </CardContent>
    </Card>
  );
};

export default UploadState; 