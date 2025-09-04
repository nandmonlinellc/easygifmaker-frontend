import React, { useEffect } from 'react';
import { isBrowser, isProd, isConsentGranted, loadAdSenseScript, onConsentChange } from '@/lib/adsense'

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
    if (!isBrowser()) return

    let dispose = () => {}

    async function init() {
      if (!isProd()) return
      if (!isConsentGranted()) return
      try {
        await loadAdSenseScript('ca-pub-2276892930727265')
        // queue render
        // eslint-disable-next-line no-unused-expressions
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        // ignore
      }
    }

    // Early queue to be safe; script will process later
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}) } catch {}

    init()
    dispose = onConsentChange((status) => {
      if (status === 'accepted') init()
    })

    return () => dispose()
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
