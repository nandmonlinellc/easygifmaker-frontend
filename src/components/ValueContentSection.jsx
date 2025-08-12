import React from 'react';
import { Link } from 'react-router-dom';

export default function ValueContentSection({
  toolTitle,
  relatedLinks = [],
  altTools = []
}) {
  return (
    <section className="mt-10 border-t pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-700">Practical ways to use {toolTitle}</h2>
            <p className="text-gray-700 mt-2">
              {toolTitle} helps creators, marketers, and casual users share ideas faster. Popular use cases include
              social posts, product demos, bug reports, quick tutorials, and fun reactions. Keep clips short (3–10s),
              add clear captions, and export at the smallest size that still looks sharp.
            </p>
            <ul className="list-disc pl-6 mt-3 text-gray-700 space-y-1">
              <li>Social media: eye‑catching posts, Stories, and replies</li>
              <li>Product and support: tiny demos, feature highlights, bug repros</li>
              <li>Education: step guides, visual notes, before/after visuals</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-blue-700">Tips for best results</h3>
            <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
              <li>Keep duration tight and focus on one idea; aim for 480–640px width for social.</li>
              <li>Prefer 12–20 FPS for smooth motion without heavy file sizes.</li>
              <li>Use text overlays for context; high‑contrast colors improve readability.</li>
              <li>Optimize before sharing—smaller GIFs load faster and rank better for UX.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-blue-700">Privacy and safety</h3>
            <p className="text-gray-700 mt-2">
              We don’t keep your files longer than needed for processing. Avoid uploading sensitive
              information, and prefer MP4 for longer clips to reduce size. See our{' '}
              <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>{' '}for details.
            </p>
          </div>

          {relatedLinks?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-blue-700">Recommended reads</h3>
              <ul className="list-disc pl-6 mt-2 text-blue-700 space-y-1">
                {relatedLinks.map((l) => (
                  <li key={l.href}>
                    <Link to={l.href} className="hover:underline">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="bg-blue-50/60 rounded-2xl p-5 border border-blue-100 h-fit">
          <h4 className="text-lg font-semibold text-blue-700">Other helpful tools</h4>
          <ul className="mt-3 space-y-2">
            {altTools.map((t) => (
              <li key={t.href}>
                <Link to={t.href} className="text-blue-700 hover:underline">
                  {t.label}
                </Link>
                <p className="text-sm text-gray-600">{t.desc}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xs text-gray-500">No watermarks. Free to use.</div>
        </aside>
      </div>
    </section>
  )
}
