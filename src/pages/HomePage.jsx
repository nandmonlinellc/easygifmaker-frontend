import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Image, Video, Crop, RotateCw, Type, Zap, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const tools = [
    {
      id: 'gif-maker',
      title: 'GIF Maker',
      description: 'Create animated GIFs from multiple images with custom timing and loop settings',
      icon: Image,
      color: 'bg-blue-500',
      path: '/gif-maker',
      keywords: 'make gif, create gif, gif maker, images to gif'
    },
    {
      id: 'video-to-gif',
      title: 'Video to GIF',
      description: 'Convert videos from YouTube, MP4, and other formats into high-quality GIFs',
      icon: Video,
      color: 'bg-green-500',
      path: '/video-to-gif',
      keywords: 'video to gif, mp4 to gif, youtube to gif, convert video'
    },
    {
      id: 'resize',
      title: 'Resize GIF',
      description: 'Resize your GIFs to any dimensions while maintaining quality',
      icon: RotateCw,
      color: 'bg-purple-500',
      path: '/resize',
      keywords: 'resize gif, gif resizer, change gif size'
    },
    {
      id: 'crop',
      title: 'Crop GIF',
      description: 'Crop GIFs with precision using custom dimensions or aspect ratios',
      icon: Crop,
      color: 'bg-orange-500',
      path: '/crop',
      keywords: 'crop gif, gif cropper, trim gif'
    },
    {
      id: 'optimize',
      title: 'Optimize GIF',
      description: 'Reduce GIF file size and compress for faster loading and sharing',
      icon: Zap,
      color: 'bg-yellow-500',
      path: '/optimize',
      keywords: 'optimize gif, compress gif, reduce gif size, gif optimizer'
    },
    {
      id: 'add-text',
      title: 'Add Text to GIF',
      description: 'Add custom text, captions, and watermarks to your GIFs',
      icon: Type,
      color: 'bg-red-500',
      path: '/add-text',
      keywords: 'add text to gif, gif text, gif captions, gif watermark'
    }
  ]

  const features = [
    'Free online GIF tools',
    'No registration required',
    'Privacy-focused - files not stored',
    'Support for multiple formats',
    'High-quality output',
    'Mobile-friendly interface'
  ]

  return (
    <>
      <Helmet>
        <title>EasyGIFMaker - Free Online GIF Maker, Video to GIF Converter & Editor</title>
        <meta 
          name="description" 
          content="Create, edit and optimize GIFs online for free. Convert videos to GIF, resize, crop, add text and more. Support for MP4, YouTube, and all major formats. No registration required." 
        />
        <meta 
          name="keywords" 
          content="gif maker, video to gif, mp4 to gif, gif converter, gif editor, youtube to gif, make gif, create gif, gif tools, online gif maker, free gif maker" 
        />
        <meta property="og:title" content="EasyGIFMaker - Free Online GIF Maker & Video to GIF Converter" />
        <meta property="og:description" content="Create, edit and optimize GIFs online for free. Convert videos to GIF, resize, crop, add text and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://easygifmaker.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EasyGIFMaker - Free Online GIF Maker" />
        <meta name="twitter:description" content="Create, edit and optimize GIFs online for free. Convert videos to GIF, resize, crop, add text and more." />
        <link rel="canonical" href="https://easygifmaker.com" />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="relative text-center mb-16">
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
            <div className="w-full h-48 bg-gradient-to-b from-blue-100/60 via-white/0 to-white/0 blur-2xl rounded-b-3xl"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-4 drop-shadow-sm tracking-tight">
            Free Online GIF Maker & Video to GIF Converter
          </h1>
          <p className="text-2xl text-gray-700 mb-8 max-w-2xl mx-auto font-medium">
            Create, edit, and optimize GIFs online with our powerful, privacy-focused tools. No registration required—completely free.<br/>
            <span className="block mt-2 text-lg text-blue-800 font-semibold">Turn your videos, images, and ideas into stunning animated GIFs in seconds!</span>
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-base text-blue-700 font-semibold mb-6">
            {features.map((feature, index) => (
              <span key={index} className="flex items-center px-4 py-2 bg-blue-50 rounded-full shadow-sm border border-blue-100">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {feature}
              </span>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Link to="/gif-maker" className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-colors text-lg">
              Get Started
            </Link>
          </div>
        </section>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool) => {
            const IconComponent = tool.icon
            return (
              <Link key={tool.id} to={tool.path} className="group">
                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-blue-200">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {tool.title}
                        </CardTitle>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {tool.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* SEO Content Section (moved below main content) */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose EasyGIFMaker?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Powerful GIF Creation Tools</h3>
              <p className="text-gray-600 mb-4">
                Our comprehensive suite of GIF tools lets you create professional-quality animated GIFs from videos, 
                images, or URLs. Convert MP4 to GIF, YouTube videos to GIF, or create GIFs from image sequences 
                with full control over timing, quality, and dimensions.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Video to GIF converter with YouTube support</li>
                <li>• Multi-image GIF maker with custom timing</li>
                <li>• Advanced cropping and resizing tools</li>
                <li>• Text overlay and watermark features</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Privacy & Performance</h3>
              <p className="text-gray-600 mb-4">
                We prioritize your privacy and don't store your files. All processing happens securely in your browser 
                or on our servers temporarily. Files are automatically deleted after processing, ensuring your content 
                remains private and secure.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• No file storage or data collection</li>
                <li>• Fast processing and high-quality output</li>
                <li>• Support for large files up to 200MB</li>
                <li>• Mobile-optimized interface</li>
              </ul>
            </div>
          </div>
        </div>
        {/* How it Works, Use Cases, etc. (moved below main content) */}
        <div className="text-left bg-blue-50 border border-blue-200 rounded-xl p-8 shadow mb-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-3">How EasyGIFMaker Works</h2>
          <ol className="list-decimal pl-6 text-lg text-blue-900 space-y-2 mb-4">
            <li><b>Upload</b> your video, images, or paste a URL from YouTube, Dailymotion, and more.</li>
            <li><b>Edit</b> with our interactive timeline, cropping, resizing, and text overlay tools.</li>
            <li><b>Preview</b> your GIF in real time and adjust settings for quality, size, and animation speed.</li>
            <li><b>Download</b> your optimized GIF or MP4 instantly—ready to share anywhere!</li>
          </ol>
          <h3 className="text-xl font-semibold text-blue-700 mt-6 mb-2">Why Use EasyGIFMaker?</h3>
          <ul className="list-disc pl-6 text-blue-900 space-y-1">
            <li>Perfect for social media, marketing, memes, tutorials, and more</li>
            <li>Supports 15+ formats including MP4, GIF, WebP, APNG, and YouTube links</li>
            <li>Advanced privacy—your files are never stored or shared</li>
            <li>Mobile-friendly and blazing fast, even for large files up to 200MB</li>
            <li>SEO-optimized, ad-friendly, and trusted by creators worldwide</li>
          </ul>
          <div className="mt-6 text-blue-800 text-base">
            <b>Popular Use Cases:</b> <br/>
            <span className="block mt-1">• Create viral memes and reaction GIFs for Twitter, Instagram, and TikTok</span>
            <span className="block">• Convert YouTube highlights to GIFs for sharing in blogs and chats</span>
            <span className="block">• Make animated banners, tutorials, and product demos for your website</span>
            <span className="block">• Add captions, watermarks, or branding to your GIFs in seconds</span>
          </div>
        </div>

        {/* Popular Keywords Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular GIF Tools & Converters</h2>
          <p className="text-gray-600 mb-6">
            Discover our most popular tools for creating and editing GIFs online
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {[
              'MP4 to GIF', 'Video to GIF', 'YouTube to GIF', 'GIF Maker', 'GIF Converter',
              'Resize GIF', 'Crop GIF', 'Optimize GIF', 'Add Text to GIF', 'GIF Editor',
              'Make GIF', 'Create GIF', 'GIF Tools', 'Free GIF Maker', 'Online GIF Converter'
            ].map((keyword, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors cursor-pointer"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

