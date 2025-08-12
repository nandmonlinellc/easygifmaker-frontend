import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const legalLinks = [
    { title: 'Privacy Policy', path: '/privacy-policy' },
    { title: 'Terms of Service', path: '/terms' },
    { title: 'Cookie Policy', path: '/cookie-policy' }
  ]

  const helpLinks = [
    { title: 'Help', path: '/help' },
    {title:'FAQ', path: '/faq'},
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' }
  ]

  // Tool links for footer
  const toolLinks = [
    { title: 'Video to GIF', path: '/video-to-gif' },
    { title: 'GIF Maker', path: '/gif-maker' },
    { title: 'Resize GIF', path: '/resize' },
    { title: 'Crop GIF', path: '/crop' },
    { title: 'Optimize GIF', path: '/optimize' },
    { title: 'Add Text to GIF', path: '/add-text' }
  ]

  return (
    <footer className="bg-gradient-to-t from-blue-50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 border-t border-blue-200 dark:border-gray-800 shadow-inner mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand & About */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-700 dark:bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-extrabold">E</span>
                </div>
                <span className="text-2xl font-extrabold text-blue-700 dark:text-white tracking-tight">EasyGIFMaker</span>
              </div>
              <p className="text-base text-gray-700 dark:text-gray-200 mb-3">
                EasyGIFMaker is your all-in-one platform to create, edit, and optimize GIFs online. Our tools are fast, free, privacy-focused, and require no registration. Convert videos to GIF, make animated GIFs from images, resize, crop, add text, and more—all in your browser.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 mb-4 space-y-1">
                <li className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Why use EasyGIFMaker?</li>
                <li>• <span className="font-medium text-gray-800 dark:text-white">100% free</span>, no sign-up, no watermark</li>
                <li>• <span className="font-medium text-gray-800 dark:text-white">We never store your files or personal data</span></li>
                <li>• <span className="font-medium text-gray-800 dark:text-white">Works on all devices</span>: desktop, tablet, and mobile</li>
                <li>• <span className="font-medium text-gray-800 dark:text-white">High-quality GIFs</span> for web, social, and messaging</li>
                <li>• <span className="font-medium text-gray-800 dark:text-white">Trusted by thousands</span> of creators worldwide</li>
                <li>• <span className="font-medium text-gray-800 dark:text-white">Fast, privacy-focused, and always improving</span></li>
              </ul>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-gray-400 dark:text-gray-300">© {currentYear} EasyGIFMaker</span>
              <span className="text-xs text-gray-300 dark:text-gray-500">|</span>
              <a
                href="mailto:nandmonlinellc@gmail.com"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                nandmonlinellc@gmail.com
              </a>
            </div>
          </div>

          {/* Tool Links */}
          <div>
            <h3 className="text-base font-semibold text-blue-700 dark:text-blue-300 mb-3">GIF Tools</h3>
            <ul className="space-y-2">
              {toolLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-base font-semibold text-blue-700 dark:text-blue-300 mb-3">Help & Support</h3>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-base font-semibold text-blue-700 dark:text-blue-300 mb-3">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-blue-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-gray-400 dark:text-gray-300 mb-2 md:mb-0">
            Made with <span className="text-pink-500">❤️</span> for the GIF community
          </p>
          <div className="flex space-x-4">
            <a
              href="mailto:nandmonlinellc@gmail.com"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Contact Support
            </a>
            <button
              type="button"
              onClick={() => {
                const evt = new Event('egm:open-cookie-settings')
                window.dispatchEvent(evt)
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Cookie Settings
            </button>
            <a
              href="https://x.com/NMToolbox"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank" rel="noopener noreferrer"
            >
              @NMToolbox
            </a>
            <a
              href="https://www.reddit.com/user/LegitimateNight2501"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank" rel="noopener noreferrer"
            >
              Reddit
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
