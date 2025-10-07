import React from 'react'
import { Helmet } from 'react-helmet-async'
import ToolGuideContent from './ToolGuideContent.jsx'
import { toolContent } from '@/data/toolContent.js'

const ToolPageLayout = ({
  title,
  description,
  icon: Icon,
  seoProps,
  toolKey,
  howToSteps,
  adSlots = {},
  midAdPosition,
  afterContent,
  children
}) => {
  const guideContent = toolKey ? toolContent[toolKey] : null
  const derivedGuideSteps = guideContent?.guide?.steps || []

  const effectiveHowToSteps = howToSteps || (derivedGuideSteps.length > 0
    ? derivedGuideSteps.map((step, index) => ({
        '@type': 'HowToStep',
        name: step.title || `Step ${index + 1}`,
        text: step.description || step.title
      }))
    : null)

  const softwareStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: seoProps.title,
    description: seoProps.description,
    url: seoProps.canonical,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    potentialAction: {
      '@type': 'CreateAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: seoProps.canonical
      },
      name: title
    },
    author: {
      '@type': 'Organization',
      name: 'EasyGIFMaker'
    },
    publisher: {
      '@type': 'Organization',
      name: 'EasyGIFMaker',
      url: 'https://easygifmaker.com'
    }
  }

  const howToStructuredData = effectiveHowToSteps ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to ${title}`,
    description: seoProps.description,
    tool: [`EasyGIFMaker ${title} Tool`],
    step: effectiveHowToSteps
  } : null

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://easygifmaker.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: 'https://easygifmaker.com/'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: seoProps.canonical
      }
    ]
  }

  const { header: headerAd, mid: midAd, footer: footerAd } = adSlots
  const contentSections = React.Children.toArray(children)
  const insertionIndex = typeof midAdPosition === 'number'
    ? midAdPosition
    : Math.ceil(contentSections.length / 2)
  let midInserted = false

  return (
    <>
      <Helmet>
        <title>{seoProps.title}</title>
        <meta name="description" content={seoProps.description} />
        <meta name="keywords" content={seoProps.keywords} />
        <link rel="canonical" href={seoProps.canonical} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoProps.title} />
        <meta property="og:description" content={seoProps.description} />
        <meta property="og:url" content={seoProps.canonical} />
        <meta property="og:site_name" content="EasyGIFMaker" />
        <meta property="og:image" content={seoProps.ogImage || 'https://easygifmaker.com/og-image.png'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoProps.title} />
        <meta name="twitter:description" content={seoProps.description} />
        <meta name="twitter:image" content={seoProps.ogImage || 'https://easygifmaker.com/og-image.png'} />
        <meta name="twitter:site" content="@NMToolbox" />
        <meta name="twitter:creator" content="@NMToolbox" />

        <meta name="robots" content="index, follow" />
        <meta name="author" content="EasyGIFMaker" />

        <script type="application/ld+json">
          {JSON.stringify(softwareStructuredData)}
        </script>

        {howToStructuredData && (
          <script type="application/ld+json">
            {JSON.stringify(howToStructuredData)}
          </script>
        )}

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      </Helmet>

      <div className="bg-slate-50 py-12 px-4 sm:py-16">
        <div className="mx-auto w-full max-w-6xl space-y-10">
          <header className="bg-white border border-slate-200 rounded-3xl shadow-sm px-6 py-8 sm:px-10">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-500 flex flex-wrap gap-2">
              <a href="/" className="hover:text-slate-700">Home</a>
              <span>/</span>
              <a href="/" className="hover:text-slate-700">Tools</a>
              <span>/</span>
              <span aria-current="page" className="text-slate-700 font-medium">{title}</span>
            </nav>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Icon size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h1>
                <p className="mt-2 text-slate-600 max-w-2xl">{description}</p>
              </div>
            </div>
          </header>

          {derivedGuideSteps.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
              <ol className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
                {derivedGuideSteps.slice(0, 4).map((step, index) => (
                  <li key={step.title || index} className="rounded-xl border border-slate-100 p-4">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Step {index + 1}</span>
                    <p className="mt-2 text-slate-800 font-medium">{step.title || `Step ${index + 1}`}</p>
                    {step.description && <p className="mt-1 text-xs text-slate-600">{step.description}</p>}
                  </li>
                ))}
              </ol>
              {derivedGuideSteps.length > 4 && (
                <p className="mt-4 text-xs text-slate-500">Need more detail? Scroll down for the full guide.</p>
              )}
            </section>
          )}

          {headerAd && (
            <div className="flex justify-center">
              {headerAd}
            </div>
          )}

          <div className="space-y-8">
            {contentSections.map((section, index) => {
              const shouldInsertMid = midAd && !midInserted && index === insertionIndex
              if (shouldInsertMid) {
                midInserted = true
              }
              return (
                <React.Fragment key={section?.key ?? index}>
                  {shouldInsertMid && (
                    <div className="flex justify-center">
                      {midAd}
                    </div>
                  )}
                  {section}
                </React.Fragment>
              )
            })}
          </div>

          {midAd && !midInserted && (
            <div className="flex justify-center">
              {midAd}
            </div>
          )}

          {afterContent}

          {toolKey && (
            <ToolGuideContent toolKey={toolKey} />
          )}
        </div>
      </div>

      {footerAd && (
        <div className="flex justify-center py-8">
          {footerAd}
        </div>
      )}
    </>
  )
}

export default ToolPageLayout

