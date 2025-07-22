import React from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords, url, image }) => {
  const siteName = 'EasyGIFMaker';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Create and Edit GIFs Online`;
  
  const defaultDescription = 'The easiest way to create, edit, and optimize GIFs. Convert videos to GIFs, resize, crop, add text, and more - all in your browser.';
  const pageDescription = description || defaultDescription;

  const siteUrl = 'https://easygifmaker.com';
  const pageUrl = `${siteUrl}${url || '/'}`;
  const defaultImage = `${siteUrl}/og-image.png`; // Ensure this image exists in /public
  const pageImage = image || defaultImage;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={pageImage} />
    </Helmet>
  );
};

export default Meta;