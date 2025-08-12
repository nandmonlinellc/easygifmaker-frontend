import React, { useEffect, useRef } from 'react'
import { isBrowser, isProd, isConsentGranted, loadAdSenseScript, pushAd, onConsentChange } from '@/lib/adsense'

const CLIENT = 'ca-pub-2276892930727265'

export default function DisplayAd({ slot = '1125232950', className = '' }) {
  const insRef = useRef(null)

  useEffect(() => {
    if (!isBrowser()) return

    let dispose = () => {}

    async function init() {
      if (!isProd()) return // avoid dev noise
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
    <div className={className} aria-label="Advertisement">
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
