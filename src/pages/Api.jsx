import React from 'react'
import { Helmet } from 'react-helmet-async'
import Meta from '@/components/Meta.jsx'

export default function Api() {
  const apiBase = import.meta.env.VITE_API_URL || 'https://api.easygifmaker.com'
  const openapiUrl = `${apiBase.replace(/\/$/, '')}/openapi.yaml`
  const webApiSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebAPI',
    name: 'EasyGIFMaker API',
    description: 'HTTP API for GIF creation and editing: video-to-GIF, optimization, resize, crop, add text, and more.',
    documentation: openapiUrl,
    termsOfService: 'https://easygifmaker.com/terms',
    provider: {
      '@type': 'Organization',
      name: 'EasyGIFMaker',
      url: 'https://easygifmaker.com'
    },
    endpointUrl: apiBase,
    audience: {
      '@type': 'Audience',
      audienceType: 'Developers'
    }
  }
  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100">
        <Meta
          title="API | EasyGIFMaker WebAPI"
          description="EasyGIFMaker API documentation and endpoints. OpenAPI spec, endpoints for video-to-gif, optimize, resize, crop, add text, and status."
          url="/api"
          image="https://easygifmaker.com/og-image.png"
          imageAlt="EasyGIFMaker API"
        />
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(webApiSchema)}</script>
        </Helmet>
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-3">EasyGIFMaker API</h1>
          <p className="text-gray-700">OpenAPI spec and endpoints</p>
        </header>
        <section className="mt-6 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="font-semibold text-blue-800">OpenAPI Spec</div>
            <a className="text-blue-700 underline" href={openapiUrl} target="_blank" rel="noopener noreferrer">{openapiUrl}</a>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="font-semibold text-blue-800">Base URL</div>
            <code className="text-sm">{apiBase}</code>
          </div>
        </section>
      </div>
    </main>
  )
}

