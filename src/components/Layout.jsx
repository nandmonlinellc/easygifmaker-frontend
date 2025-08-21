import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import CookieConsentBanner from './CookieConsentBanner'
import { isProd, isConsentGranted, loadAdSenseScript, onConsentChange } from '@/lib/adsense'

export default function Layout() {
  // Preload AdSense script once consent is granted to avoid FOUC when ad components mount
  useEffect(() => {
    if (!isProd()) return
    let dispose = () => {}
    const maybeLoad = async () => {
      if (isConsentGranted()) {
        try { await loadAdSenseScript('ca-pub-2276892930727265') } catch {}
      }
    }
    maybeLoad()
    dispose = onConsentChange((status) => {
      if (status === 'accepted') maybeLoad()
    })
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
