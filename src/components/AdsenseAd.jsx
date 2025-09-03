import React, { useEffect } from 'react';

// Reserve space to avoid CLS; allow override via prop
const AdsenseAd = ({
  adSlot,
  adFormat = 'auto',
  adLayout = '',
  fullWidthResponsive = false,
  style = {},
  minHeight = 250,
  className = ''
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className={className} aria-label="Advertisement" style={{ minHeight, ...('minHeight' in style ? {} : {}) }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight, ...style }}
        data-ad-client="ca-pub-2276892930727265"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
};

export default AdsenseAd;
