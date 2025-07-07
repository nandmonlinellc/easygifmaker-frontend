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
    { title: 'Help & FAQ', path: '/help' },
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
    <footer className="bg-gradient-to-t from-blue-50 via-white to-white border-t border-blue-200 shadow-inner mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand & About */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-extrabold">E</span>
                </div>
                <span className="text-2xl font-extrabold text-blue-700 tracking-tight">EasyGIFMaker</span>
              </div>
              <p className="text-base text-gray-700 mb-3">
                EasyGIFMaker is your all-in-one platform to create, edit, and optimize GIFs online. Our tools are fast, free, privacy-focused, and require no registration. Convert videos to GIF, make animated GIFs from images, resize, crop, add text, and more—all in your browser.
              </p>
              <ul className="text-xs text-gray-600 mb-4 space-y-1">
                <li className="font-semibold text-blue-700 mb-1">Why use EasyGIFMaker?</li>
                <li>• <span className="font-medium text-gray-800">100% free</span>, no sign-up, no watermark</li>
                <li>• <span className="font-medium text-gray-800">We never store your files or personal data</span></li>
                <li>• <span className="font-medium text-gray-800">Works on all devices</span>: desktop, tablet, and mobile</li>
                <li>• <span className="font-medium text-gray-800">High-quality GIFs</span> for web, social, and messaging</li>
                <li>• <span className="font-medium text-gray-800">Trusted by thousands</span> of creators worldwide</li>
                <li>• <span className="font-medium text-gray-800">Fast, privacy-focused, and always improving</span></li>
              </ul>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-gray-400">© {currentYear} EasyGIFMaker</span>
              <span className="text-xs text-gray-300">|</span>
              <a
                href="mailto:nandmonlinellc@gmail.com"
                className="text-xs text-blue-600 hover:underline"
              >
                nandmonlinellc@gmail.com
              </a>
            </div>
          </div>

          {/* Tool Links */}
          <div>
            <h3 className="text-base font-semibold text-blue-700 mb-3">GIF Tools</h3>
            <ul className="space-y-2">
              {toolLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-base font-semibold text-blue-700 mb-3">Help & Support</h3>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-base font-semibold text-blue-700 mb-3">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-blue-100 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-gray-400 mb-2 md:mb-0">
            Made with <span className="text-pink-500">❤️</span> for the GIF community
          </p>
          <div className="flex space-x-4">
            <a
              href="mailto:nandmonlinellc@gmail.com"
              className="text-xs text-blue-600 hover:underline"
            >
              Contact Support
            </a>
            <a
              href="https://twitter.com/easygifmaker"
              className="text-xs text-blue-600 hover:underline"
              target="_blank" rel="noopener noreferrer"
            >
              @easygifmaker
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
