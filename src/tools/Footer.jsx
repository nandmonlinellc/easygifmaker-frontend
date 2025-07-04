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
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">E</span>
              </div>
              <span className="text-lg font-bold text-gray-900">EasyGIFMaker</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Create, edit, and optimize GIFs online. Fast, free, and privacy-focused.
            </p>
            <p className="text-xs text-gray-500">
              © {currentYear} EasyGIFMaker. All rights reserved.
            </p>
          </div>

          {/* Tool Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">GIF Tools</h3>
            <ul className="space-y-2">
              {toolLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Help & Support</h3>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 mb-2 md:mb-0">
              Made with ❤️ for the GIF community
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:support@easygifmaker.com"
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                support@easygifmaker.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

