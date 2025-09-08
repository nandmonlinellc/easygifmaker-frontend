import React from 'react'

export default function QuickFeaturesBox({ title = 'Quick features', features = [] }) {
  if (!features || features.length === 0) return null
  return (
    <section className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-4 md:p-5 mb-6">
      <h3 className="text-base md:text-lg font-bold text-blue-700 mb-2">{title}</h3>
      <ul className="grid sm:grid-cols-2 gap-2 text-sm text-blue-900">
        {features.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-base">{item.emoji || '•'}</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

