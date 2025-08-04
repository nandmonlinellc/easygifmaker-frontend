import React from 'react';
import { Helmet } from 'react-helmet-async';

const ToolPageLayout = ({
  title,
  description,
  icon: Icon,
  seoProps,
  howToSteps,
  children
}) => {
  // Create structured data for the tool page
  const webAppStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": seoProps.title,
    "description": seoProps.description,
    "url": seoProps.canonical,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
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
        <meta property="og:image" content="https://easygifmaker.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoProps.title} />
        <meta name="twitter:description" content={seoProps.description} />
        <meta name="twitter:image" content="https://easygifmaker.com/og-image.png" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="EasyGIFMaker" />
        
        {/* Structured Data - WebApplication */}
        <script type="application/ld+json">
          {JSON.stringify(webAppStructuredData)}
        </script>
        
        {/* Structured Data - HowTo (only if steps provided) */}
        {howToStructuredData && (
          <script type="application/ld+json">
            {JSON.stringify(howToStructuredData)}
          </script>
        )}
      </Helmet>
      
      <div className="min-h-[60vh] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-7xl bg-white/90 rounded-3xl shadow-xl p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
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

          {/* Tool-specific content */}
          {children}
        </div>
      </div>
    </>
  );
};

export default ToolPageLayout;
