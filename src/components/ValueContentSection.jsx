import React from 'react';
import { Link } from 'react-router-dom';

export default function ValueContentSection({
  content
}) {
  if (!content) {
    return null
  }

  const {
    introHeading,
    intro,
    useCases = [],
    tipsHeading = 'Tips for best results',
    tips = [],
    privacyHeading = 'Privacy and safety',
    privacy,
    relatedLinks = [],
    altTools = [],
    footnote
  } = content

  return (
    <section className="mt-10 border-t pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {(introHeading || intro) && (
            <div>
              {introHeading && (
                <h2 className="text-2xl font-bold text-blue-700">{introHeading}</h2>
              )}
              {intro && (
                <p className="text-gray-700 mt-2">{intro}</p>
              )}
              {useCases.length > 0 && (
                <ul className="list-disc pl-6 mt-3 text-gray-700 space-y-1">
                  {useCases.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tips.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-blue-700">{tipsHeading}</h3>
              <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {privacy && (
            <div>
              <h3 className="text-xl font-semibold text-blue-700">{privacyHeading}</h3>
              <p className="text-gray-700 mt-2">{privacy}</p>
            </div>
          )}

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
          <div className="mt-4 text-xs text-gray-500">{footnote || 'No watermarks. Free to use.'}</div>
        </aside>
      </div>
    </section>
  )
}
