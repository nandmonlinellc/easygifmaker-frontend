// Lightweight AdSense helper: loads the script once after consent and exposes utilities

let loaderPromise = null

export function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export function isProd() {
  // Vite sets import.meta.env.PROD in production builds
  try { return Boolean(import.meta.env && import.meta.env.PROD) } catch { return false }
}

export function isConsentGranted() {
  if (!isBrowser()) return false
  try {
    return localStorage.getItem('egm_cookie_consent') === 'accepted'
  } catch {
    return false
  }
}

export function loadAdSenseScript(client) {
  if (!isBrowser()) return Promise.resolve()
  if (loaderPromise) return loaderPromise

  const existing = document.querySelector('script[data-egm="adsbygoogle"]')
  if (existing) {
    loaderPromise = Promise.resolve()
    return loaderPromise
  }

  loaderPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`
    s.crossOrigin = 'anonymous'
    s.dataset.egm = 'adsbygoogle'
    s.onload = () => resolve()
    s.onerror = (e) => reject(e)
    document.head.appendChild(s)
  })
  return loaderPromise
}

export function pushAd() {
  if (!isBrowser()) return
  try {
    // eslint-disable-next-line no-unused-expressions
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch {
    // ignore
  }
}

export function onConsentChange(cb) {
  if (!isBrowser()) return () => {}
  const handler = (e) => {
    try {
      const status = e && e.detail ? e.detail : localStorage.getItem('egm_cookie_consent')
      cb(status)
    } catch {
      cb(undefined)
    }
  }
  window.addEventListener('egm:consent', handler)
  // storage events don't fire in the same tab, but keep for completeness
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener('egm:consent', handler)
    window.removeEventListener('storage', handler)
  }
}
