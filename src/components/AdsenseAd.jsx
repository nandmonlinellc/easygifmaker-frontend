import React, { useEffect } from 'react';

const AdsenseAd = ({ adSlot, adFormat = 'auto', adLayout = '', fullWidthResponsive = false, style = {} }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-2276892930727265"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-ad-layout={adLayout}
      data-full-width-responsive={fullWidthResponsive}
    ></ins>
  );
};

export default AdsenseAd;
