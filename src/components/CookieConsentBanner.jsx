import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('egm_cookie_consent')
      if (!stored) {
        setVisible(true)
        // Default deny non-essential until choice
        if (window.gtag) {
          window.gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
            functionality_storage: 'granted',
            security_storage: 'granted'
          })
        }
      }
      setInitialized(true)
    } catch (e) {
      setVisible(true)
      setInitialized(true)
    }
  }, [])

  // Allow reopening the banner from anywhere (e.g., footer "Cookie Settings")
  useEffect(() => {
    const openHandler = () => {
      setVisible(true)
      setInitialized(true)
    }
    window.addEventListener('egm:open-cookie-settings', openHandler)
    // Also expose a tiny helper on window for convenience
    window.egmOpenCookieSettings = openHandler
    return () => {
      window.removeEventListener('egm:open-cookie-settings', openHandler)
      try { delete window.egmOpenCookieSettings } catch (_) {}
    }
  }, [])

  const acceptAll = () => {
    try { localStorage.setItem('egm_cookie_consent', 'accepted') } catch (e) {}
    if (window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted'
      })
    }
  try { window.dispatchEvent(new CustomEvent('egm:consent', { detail: 'accepted' })) } catch {}
    setVisible(false)
  }

  const declineNonEssential = () => {
    try { localStorage.setItem('egm_cookie_consent', 'declined') } catch (e) {}
    if (window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'denied'
      })
    }
  try { window.dispatchEvent(new CustomEvent('egm:consent', { detail: 'declined' })) } catch {}
    setVisible(false)
  }

  if (!initialized || !visible) return null

  return (
    <div role="dialog" aria-live="polite" aria-label="Cookie consent" className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-5xl m-4 p-4 md:p-5 rounded-2xl shadow-2xl border border-blue-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm md:text-base text-gray-800">
            We use cookies for essential features, analytics, and ads to improve your experience. See our{' '}
            <Link to="/cookie-policy" className="text-blue-700 hover:underline">Cookie Policy</Link> and{' '}
            <Link to="/privacy-policy" className="text-blue-700 hover:underline">Privacy Policy</Link>.
          </div>
          <div className="flex gap-2 md:gap-3 justify-end">
            <button onClick={declineNonEssential} className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm md:text-base">
              Decline non‑essential
            </button>
            <button onClick={acceptAll} className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm md:text-base">
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
