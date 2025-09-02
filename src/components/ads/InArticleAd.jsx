import React, { useEffect } from 'react'
import { isBrowser, isProd, isConsentGranted, loadAdSenseScript, pushAd, onConsentChange } from '@/lib/adsense'

const CLIENT = 'ca-pub-2276892930727265'

export default function InArticleAd({ slot = '8336674411', className = '', minHeight = 250 }) {
  useEffect(() => {
    if (!isBrowser()) return

    let dispose = () => {}

    async function init() {
      if (!isProd()) return
      if (!isConsentGranted()) return
      try {
        await loadAdSenseScript(CLIENT)
        pushAd()
      } catch {
        // ignore
      }
    }

    init()
    dispose = onConsentChange((status) => {
      if (status === 'accepted') init()
    })

    return () => dispose()
  }, [])

  return (
    <div className={className} aria-label="Advertisement" style={{ minHeight }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center', minHeight }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={CLIENT}
        data-ad-slot={slot}
      />
    </div>
  )
}
