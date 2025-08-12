import React from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords, url, image, twitterCard = 'summary_large_image', imageAlt }) => {
  const siteName = 'EasyGIFMaker';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Create and Edit GIFs Online`;
  
  const defaultDescription = 'The easiest way to create, edit, and optimize GIFs. Convert videos to GIFs, resize, crop, add text, and more - all in your browser.';
  const pageDescription = description || defaultDescription;

  const siteUrl = 'https://easygifmaker.com';
  const pageUrl = `${siteUrl}${url || '/'}`;
  const defaultImage = `${siteUrl}/og-image.png`; // Ensure this image exists in /public
  const pageImage = image || defaultImage;
  const pageImageAlt = imageAlt || title || siteName;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={siteName} />

  {/* Twitter site-wide attribution */}
  <meta name="twitter:site" content="@NMToolbox" />
  <meta name="twitter:creator" content="@NMToolbox" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:image:alt" content={pageImageAlt} />
    </Helmet>
  );
};

export default Meta;