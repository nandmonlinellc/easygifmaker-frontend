import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import CookieConsentBanner from './CookieConsentBanner'
import { isProd, loadAdSenseScript, onConsentChange } from '@/lib/adsense'

export default function Layout() {
  // Load AdSense script in prod regardless of consent; Consent Mode defaults control behavior
  useEffect(() => {
    if (!isProd()) return
    let dispose = () => {}
    const load = async () => { try { await loadAdSenseScript('ca-pub-2276892930727265') } catch {} }
    if ('requestIdleCallback' in window) {
      // Defer a bit to reduce contention with main work
      // @ts-ignore
      requestIdleCallback(load, { timeout: 2000 })
    } else {
      setTimeout(load, 0)
    }
    // Still listen for consent to prompt re-render of ad slots if needed
    dispose = onConsentChange((status) => { if (status === 'accepted') load() })
    return () => dispose()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Outlet />
      </main>
      <Footer />
      <CookieConsentBanner />
    </div>
  )
}
