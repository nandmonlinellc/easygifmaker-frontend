import React from 'react';
import DisplayAd from '@/components/ads/DisplayAd.jsx';
import { Helmet } from 'react-helmet-async';

const ToolPageLayout = ({
  title,
  description,
  icon: Icon,
  seoProps,
  howToSteps,
  children
}) => {
  // Create structured data for the tool page (SoftwareApplication fits tools better)
  const softwareStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": seoProps.title,
    "description": seoProps.description,
    "url": seoProps.canonical,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "potentialAction": {
      "@type": "CreateAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": seoProps.canonical
      },
      "name": title
    },
    "author": {
      "@type": "Organization",
      "name": "EasyGIFMaker"
    },
    "publisher": {
      "@type": "Organization",
      "name": "EasyGIFMaker",
      "url": "https://easygifmaker.com"
    }
  };

  // Create HowTo structured data only if steps are provided
  const howToStructuredData = howToSteps ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to ${title}`,
    "description": seoProps.description,
    "tool": [`EasyGIFMaker ${title} Tool`],
    "step": howToSteps
  } : null;

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://easygifmaker.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tools",
        "item": "https://easygifmaker.com/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": seoProps.canonical
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{seoProps.title}</title>
        <meta name="description" content={seoProps.description} />
        <meta name="keywords" content={seoProps.keywords} />
        <link rel="canonical" href={seoProps.canonical} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoProps.title} />
        <meta property="og:description" content={seoProps.description} />
        <meta property="og:url" content={seoProps.canonical} />
        <meta property="og:site_name" content="EasyGIFMaker" />
        <meta property="og:image" content={seoProps.ogImage || "https://easygifmaker.com/og-image.png"} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoProps.title} />
        <meta name="twitter:description" content={seoProps.description} />
        <meta name="twitter:image" content={seoProps.ogImage || "https://easygifmaker.com/og-image.png"} />
  <meta name="twitter:site" content="@NMToolbox" />
  <meta name="twitter:creator" content="@NMToolbox" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="EasyGIFMaker" />
        
        {/* Structured Data - SoftwareApplication */}
        <script type="application/ld+json">
          {JSON.stringify(softwareStructuredData)}
        </script>
        
        {/* Structured Data - HowTo (only if steps provided) */}
        {howToStructuredData && (
          <script type="application/ld+json">
            {JSON.stringify(howToStructuredData)}
          </script>
        )}

        {/* Structured Data - Breadcrumbs */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-[60vh] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-7xl bg-white/90 rounded-3xl shadow-xl p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            {/* Visible Breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-sm text-blue-700 mb-3">
              <a href="/" className="hover:underline">Home</a>
              <span className="mx-2">/</span>
              <a href="/" className="hover:underline">Tools</a>
              <span className="mx-2">/</span>
              <span aria-current="page" className="font-semibold">{title}</span>
            </nav>
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Icon size={40} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 tracking-tight">
                {title}
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {description}
            </p>
          </div>

          {/* Header Ad - High visibility after tool introduction */}
          <div className="mb-8 flex justify-center">
            <DisplayAd 
              slot="1125232950"
              className="max-w-3xl w-full"
            />
          </div>

          {/* Tool-specific content */}
          {children}
        </div>
      </div>
    </>
  );
};

export default ToolPageLayout;
