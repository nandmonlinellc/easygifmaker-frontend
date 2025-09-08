import React from 'react'

export default function LimitsTable({
  title = 'Limits & Supported Formats',
  maxFileSize = '200MB',
  acceptedFormats = [],
  maxFps = '30 FPS',
  maxFrames = '~300 frames (safety cap)',
  maxResolution = 'Up to ~800×800 px equivalent (complex ops)',
  recommendedDuration = 'Keep clips ≤ 15s for shareable sizes',
  whatIfFails = [
    'Reduce duration, FPS, or resolution',
    'Try a different browser or clear cache',
    'Verify file format and size are supported',
  ],
  className = '',
  faqHref = '/faq',
  showFaqLink = true,
}) {
  return (
    <section className={`bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm ${className}`}>
      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-t first:border-t-0">
              <td className="py-2 pr-4 text-gray-600">Max file size</td>
              <td className="py-2 text-gray-900 font-medium">{maxFileSize}</td>
            </tr>
            {acceptedFormats?.length > 0 && (
              <tr className="border-t">
                <td className="py-2 pr-4 text-gray-600">Accepted formats</td>
                <td className="py-2 text-gray-900 font-medium">{acceptedFormats.join(', ')}</td>
              </tr>
            )}
            {maxFps && (
              <tr className="border-t">
                <td className="py-2 pr-4 text-gray-600">FPS</td>
                <td className="py-2 text-gray-900 font-medium">{maxFps}</td>
              </tr>
            )}
            {maxFrames && (
              <tr className="border-t">
                <td className="py-2 pr-4 text-gray-600">Frames</td>
                <td className="py-2 text-gray-900 font-medium">{maxFrames}</td>
              </tr>
            )}
            {maxResolution && (
              <tr className="border-t">
                <td className="py-2 pr-4 text-gray-600">Resolution</td>
                <td className="py-2 text-gray-900 font-medium">{maxResolution}</td>
              </tr>
            )}
            {recommendedDuration && (
              <tr className="border-t">
                <td className="py-2 pr-4 text-gray-600">Recommended duration</td>
                <td className="py-2 text-gray-900 font-medium">{recommendedDuration}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {(whatIfFails?.length > 0 || showFaqLink) && (
        <div className="mt-3 text-sm">
          {whatIfFails?.length > 0 && (
            <>
              <div className="text-gray-700 font-semibold mb-1">If it fails:</div>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {whatIfFails.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </>
          )}
          {showFaqLink && (
            <div className="mt-2">
              <a href={faqHref} className="text-blue-700 hover:underline font-medium">View full limits</a>
            </div>
          )}
        </div>
      )}
    </section>
  )}
