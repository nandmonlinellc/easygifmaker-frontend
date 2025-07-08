import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Image, Video, Crop, RotateCw, Type, Zap, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const tools = [
    { id: 'gif-maker', title: 'GIF Maker', icon: Image, path: '/gif-maker' },
    { id: 'video-to-gif', title: 'Video to GIF', icon: Video, path: '/video-to-gif' },
    { id: 'resize', title: 'Resize', icon: RotateCw, path: '/resize' },
    { id: 'crop', title: 'Crop', icon: Crop, path: '/crop' },
    { id: 'optimize', title: 'Optimize', icon: Zap, path: '/optimize' },
    { id: 'add-text', title: 'Add Text', icon: Type, path: '/add-text' }
  ]

  const staticPages = [
    { title: 'About', path: '/about' },
    { title: 'Help', path: '/help' },
    { title: 'Contact', path: '/contact' }
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Image className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EasyGIFMaker</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Tools Dropdown */}
            <div className="relative group">
              <Button variant="ghost" className="flex items-center space-x-1">
                <span>Tools</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {tools.map((tool) => {
                  const IconComponent = tool.icon
                  return (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{tool.title}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Static Pages */}
            {staticPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === page.path ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {page.title}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500 px-2 py-1">Tools</div>
              {tools.map((tool) => {
                const IconComponent = tool.icon
                return (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className="flex items-center space-x-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tool.title}</span>
                  </Link>
                )
              })}
              <div className="border-t border-gray-200 my-2"></div>
              {staticPages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

