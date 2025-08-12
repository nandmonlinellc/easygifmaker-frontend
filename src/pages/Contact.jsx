import React from 'react';
import { Helmet } from 'react-helmet-async';
import Meta from '@/components/Meta.jsx';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [status, setStatus] = React.useState({ type: 'idle', note: '' })

  async function onSubmit(e) {
    e.preventDefault()
    setStatus({ type: 'submitting', note: '' })
    // simple client validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ type: 'error', note: 'Please fill out all fields.' })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ type: 'error', note: 'Please enter a valid email.' })
      return
    }
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'https://easygifmaker-api.fly.dev'
      const res = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to send message')
      }
      setStatus({ type: 'success', note: 'Thanks! Your message has been sent.' })
      setName(''); setEmail(''); setMessage('')
    } catch (err) {
      setStatus({ type: 'error', note: err.message || 'Something went wrong.' })
    }
  }

  return (
    <>
      <Meta
        title="Contact EasyGIFMaker | Support, Partnerships, and Feedback"
        description="Get in touch with EasyGIFMaker for support, feedback, or partnership inquiries. We're here to help you create, optimize, and share stunning GIFs."
        url="/contact"
        image="https://easygifmaker.com/og-image.png"
        imageAlt="Contact EasyGIFMaker"
      />
      <Helmet>
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact EasyGIFMaker",
            "description": "Support, partnerships, and feedback for EasyGIFMaker.",
            "url": "https://easygifmaker.com/contact",
            "publisher": {
              "@type": "Organization",
              "name": "EasyGIFMaker"
            },
            "contactPoint": [{
              "@type": "ContactPoint",
              "contactType": "customer support",
              "email": "nandmonlinellc@gmail.com",
              "availableLanguage": ["English"],
              "areaServed": "Worldwide"
            }],
            "sameAs": [
              "https://x.com/NMToolbox",
              "https://www.reddit.com/user/LegitimateNight2501"
            ]
          })}
        </script>
      </Helmet>
      <main className="min-h-[70vh] bg-gradient-to-b from-blue-50 via-white to-white py-12 px-4" aria-label="Contact EasyGIFMaker">
      <div className="w-full max-w-3xl mx-auto">
        <nav className="mb-6 text-sm text-blue-700">
          <Link to="/" className="hover:underline">← Home</Link>
        </nav>
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-blue-100">
          <header aria-label="Contact Header">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-2">Contact Us</h1>
            <p className="mb-6 text-gray-700">Have questions, feedback, or partnership requests? We usually respond within 2 business days.</p>
          </header>
          <section className="mb-8" aria-label="Contact Methods">
            <dl className="divide-y divide-blue-50">
              <div className="py-3 grid grid-cols-4 gap-4 items-center">
                <dt className="font-semibold text-gray-800 col-span-1">Email</dt>
                <dd className="col-span-3">
                  <a href="mailto:nandmonlinellc@gmail.com" className="text-blue-600 hover:underline" aria-label="Email EasyGIFMaker">nandmonlinellc@gmail.com</a>
                </dd>
              </div>
              <div className="py-3 grid grid-cols-4 gap-4 items-center">
                <dt className="font-semibold text-gray-800 col-span-1">X</dt>
                <dd className="col-span-3">
                  <a href="https://x.com/NMToolbox" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" aria-label="EasyGIFMaker X">@NMToolbox</a>
                </dd>
              </div>
              <div className="py-3 grid grid-cols-4 gap-4 items-center">
                <dt className="font-semibold text-gray-800 col-span-1">Reddit</dt>
                <dd className="col-span-3">
                  <a href="https://www.reddit.com/user/LegitimateNight2501" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" aria-label="EasyGIFMaker Reddit">u/LegitimateNight2501</a>
                </dd>
              </div>
            </dl>
          </section>
          <section className="mb-8" aria-label="Contact Form">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Send us a message</h2>
            <form onSubmit={onSubmit} noValidate>
              <div className="grid gap-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700">Name</span>
                  <input value={name} onChange={(e)=>setName(e.target.value)} required className="mt-1 block w-full rounded-md border border-blue-200 focus:border-blue-400 focus:ring-blue-400 px-3 py-2" name="name" autoComplete="name" />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700">Email</span>
                  <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="mt-1 block w-full rounded-md border border-blue-200 focus:border-blue-400 focus:ring-blue-400 px-3 py-2" name="email" autoComplete="email" />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700">Message</span>
                  <textarea value={message} onChange={(e)=>setMessage(e.target.value)} required rows={5} className="mt-1 block w-full rounded-md border border-blue-200 focus:border-blue-400 focus:ring-blue-400 px-3 py-2" name="message" />
                </label>
                <div className="flex items-center gap-3">
                  <button disabled={status.type==='submitting'} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-60">
                    {status.type==='submitting' ? 'Sending…' : 'Send message'}
                  </button>
                  {status.type==='error' && <p className="text-sm text-red-600" role="alert">{status.note}</p>}
                  {status.type==='success' && <p className="text-sm text-green-700" role="status">{status.note}</p>}
                </div>
              </div>
            </form>
          </section>
          <section className="mb-8" aria-label="Support Hours and Response Time">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Support Hours</h2>
            <p className="text-gray-700">Monday–Friday, 9:00 AM – 5:00 PM (GMT)</p>
            <p className="text-gray-600 mt-1">We aim to reply within 24–48 hours. Complex issues may take longer.</p>
          </section>
          <section className="mb-8" aria-label="Trust and Privacy">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Privacy & Trust</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>We only use your contact details to respond to your inquiry.</li>
              <li>No data is sold or shared with third parties.</li>
              <li>See our <a href="/privacy-policy" className="underline text-blue-600">Privacy Policy</a> for details.</li>
            </ul>
          </section>
          <footer className="text-sm text-gray-500">
            Prefer self-serve? Visit the <Link to="/help" className="underline text-blue-600">Help Center</Link> or our <Link to="/faq" className="underline text-blue-600">FAQ</Link>.
          </footer>
        </div>
      </div>
      </main>
    </>
  );
}
