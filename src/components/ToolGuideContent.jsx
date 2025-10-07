import React from 'react'
import { Link } from 'react-router-dom'
import { toolContent } from '@/data/toolContent.js'

const ToolGuideContent = ({ toolKey }) => {
  if (!toolKey) {
    return null
  }

  const content = toolContent[toolKey]
  if (!content) {
    return null
  }

  const {
    introHeading,
    intro,
    useCases = [],
    tips = [],
    privacy,
    relatedLinks = [],
    altTools = [],
    guide = {}
  } = content

  const {
    quickFeatures = [],
    steps = [],
    limits = {},
    faqs = [],
    troubleshooting = {},
    sharing
  } = guide

  const { issues = [], quickFixes = [] } = troubleshooting || {}

  const hasLimits = Boolean(
    (limits?.formats && limits.formats.length > 0) ||
    limits?.maxResolution ||
    limits?.maxFrames ||
    limits?.maxFps ||
    limits?.recommendedDuration ||
    limits?.notes
  )

  return (
    <section className="mt-12 space-y-10">
      {(introHeading || intro || useCases.length > 0) && (
        <div className="space-y-3">
          {introHeading && (
            <h2 className="text-2xl font-semibold text-slate-900">{introHeading}</h2>
          )}
          {intro && (
            <p className="text-slate-600">{intro}</p>
          )}
          {useCases.length > 0 && (
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              {useCases.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {quickFeatures.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">What this tool handles well</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-slate-600">
            {quickFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-xl leading-none">{feature.emoji || '•'}</span>
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {steps.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Guided steps</h3>
          <ol className="mt-3 space-y-3 text-slate-600 list-decimal pl-5">
            {steps.map((step, index) => (
              <li key={step.title || index}>
                {step.title && <p className="font-medium text-slate-800">{step.title}</p>}
                {step.description && <p className="mt-1 text-sm text-slate-600">{step.description}</p>}
              </li>
            ))}
          </ol>
        </div>
      )}

      {hasLimits && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Key limits</h3>
          <dl className="mt-3 grid gap-4 sm:grid-cols-2 text-slate-600">
            {limits?.formats?.length > 0 && (
              <div>
                <dt className="font-medium text-slate-800">Supported inputs</dt>
                <dd className="mt-1 text-sm">{limits.formats.join(', ')}</dd>
              </div>
            )}
            {limits?.maxResolution && (
              <div>
                <dt className="font-medium text-slate-800">Max resolution</dt>
                <dd className="mt-1 text-sm">{limits.maxResolution}</dd>
              </div>
            )}
            {limits?.maxFrames && (
              <div>
                <dt className="font-medium text-slate-800">Frame guidance</dt>
                <dd className="mt-1 text-sm">{limits.maxFrames}</dd>
              </div>
            )}
            {limits?.maxFps && (
              <div>
                <dt className="font-medium text-slate-800">Frame rate</dt>
                <dd className="mt-1 text-sm">{limits.maxFps}</dd>
              </div>
            )}
            {limits?.recommendedDuration && (
              <div>
                <dt className="font-medium text-slate-800">Recommended duration</dt>
                <dd className="mt-1 text-sm">{limits.recommendedDuration}</dd>
              </div>
            )}
            {limits?.notes && (
              <div className="sm:col-span-2">
                <dt className="font-medium text-slate-800">Good to know</dt>
                <dd className="mt-1 text-sm">{limits.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {tips.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Quick tips</h3>
          <ul className="mt-3 space-y-2 text-slate-600 list-disc pl-5">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {faqs.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">FAQs</h3>
          <div className="mt-3 space-y-3">
            {faqs.map((faq, index) => (
              <details key={faq.question || index} className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                <summary className="cursor-pointer font-medium text-slate-800">{faq.question}</summary>
                {faq.answer && <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>}
              </details>
            ))}
          </div>
        </div>
      )}

      {(issues.length > 0 || quickFixes.length > 0) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-amber-900">Troubleshooting</h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {issues.length > 0 && (
              <div>
                <p className="font-medium text-amber-900">Common issues</p>
                <ul className="mt-2 space-y-2 text-sm text-amber-900 list-disc pl-5">
                  {issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            {quickFixes.length > 0 && (
              <div>
                <p className="font-medium text-amber-900">Quick fixes</p>
                <ul className="mt-2 space-y-2 text-sm text-amber-900 list-disc pl-5">
                  {quickFixes.map((fix, index) => (
                    <li key={index}>{fix}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {privacy && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Privacy & safety</h3>
          <p className="mt-2 text-sm text-slate-600">{privacy}</p>
        </div>
      )}

      {(relatedLinks.length > 0 || altTools.length > 0) && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2">
            {relatedLinks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Recommended reads</h3>
                <ul className="mt-3 space-y-2 text-slate-600">
                  {relatedLinks.map((link) => (
                    <li key={link.href}>
                      <Link to={link.href} className="text-sky-600 hover:text-sky-700">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {altTools.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Related tools</h3>
                <ul className="mt-3 space-y-2 text-slate-600">
                  {altTools.map((tool) => (
                    <li key={tool.href}>
                      <Link to={tool.href} className="text-sky-600 hover:text-sky-700">
                        {tool.label}
                      </Link>
                      {tool.desc && <p className="text-xs text-slate-500">{tool.desc}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {sharing && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-sky-900">{sharing.title}</h3>
          <p className="mt-2 text-sm text-sky-900/80">{sharing.description}</p>
        </div>
      )}
    </section>
  )
}

export default ToolGuideContent

