import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BookOpen, Video, Image, Scissors, Type, Zap, Download, Share2, Smartphone, Monitor } from 'lucide-react';

export default function Help() {
  const helpCategories = [
    {
      icon: <Video className="h-6 w-6 text-blue-600" />,
      title: 'Video to GIF Conversion',
      description: 'Learn how to convert videos into high-quality GIFs',
      link: '/blog/how-to-make-gifs-from-videos'
    },
    {
      icon: <Image className="h-6 w-6 text-green-600" />,
      title: 'GIF Creation from Images',
      description: 'Create animated GIFs from multiple static images',
      link: '/gif-maker'
    },
    {
      icon: <Scissors className="h-6 w-6 text-purple-600" />,
      title: 'GIF Cropping & Resizing',
      description: 'Crop and resize your GIFs for different platforms',
      link: '/crop'
    },
    {
      icon: <Type className="h-6 w-6 text-orange-600" />,
      title: 'Adding Text to GIFs',
      description: 'Add captions, watermarks, and text overlays',
      link: '/add-text'
    },
    {
      icon: <Zap className="h-6 w-6 text-red-600" />,
      title: 'GIF Optimization',
      description: 'Optimize GIFs for faster loading and better quality',
      link: '/optimize'
    }
  ];

  const troubleshootingTopics = [
    {
      title: 'File Upload Issues',
      problems: [
        'Video file too large (max 100MB)',
        'Unsupported file format',
        'Slow upload speed',
        'Browser compatibility issues'
      ],
      solutions: [
        'Compress your video before uploading',
        'Convert to MP4, MOV, or WebM format',
        'Use a stable internet connection',
        'Try a different browser (Chrome, Firefox, Safari)'
      ]
    },
    {
      title: 'GIF Quality Problems',
      problems: [
        'GIF appears blurry or pixelated',
        'Colors look washed out',
        'File size is too large',
        'Motion appears choppy'
      ],
      solutions: [
        'Use higher resolution source videos',
        'Adjust color settings in optimization tool',
        'Reduce frame rate or resolution',
        'Increase frame rate to 20-25fps'
      ]
    },
    {
      title: 'Download Issues',
      problems: [
        'GIF won\'t download',
        'Downloaded file is corrupted',
        'File size is 0 bytes',
        'Browser blocks download'
      ],
      solutions: [
        'Check your internet connection',
        'Try downloading again',
        'Clear browser cache and cookies',
        'Allow downloads in browser settings'
      ]
    }
  ];

  const platformGuides = [
    {
      platform: 'Social Media',
      icon: <Share2 className="h-5 w-5" />,
      tips: [
        'Twitter: Keep under 5MB, use 15fps',
        'Instagram: Square format (1:1 ratio) works best',
        'Facebook: 16:9 ratio, under 8MB',
        'Discord: Any size under 8MB'
      ]
    },
    {
      platform: 'Websites',
      icon: <Monitor className="h-5 w-5" />,
      tips: [
        'Use 640x480 resolution for fast loading',
        'Keep file size under 2MB',
        'Optimize for mobile viewing',
        'Test on different devices'
      ]
    },
    {
      platform: 'Mobile',
      icon: <Smartphone className="h-5 w-5" />,
      tips: [
        'Use 320x240 resolution for messaging',
        'Keep under 2MB for reliable sharing',
        'Test on both iOS and Android',
        'Consider data usage for mobile users'
      ]
    }
  ];

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white py-12 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <Helmet>
          <title>Help & Tutorials | EasyGIFMaker Support Center</title>
          <meta name="description" content="Comprehensive help guides, tutorials, and troubleshooting for EasyGIFMaker tools. Learn how to create, edit, and optimize GIFs effectively." />
          <link rel="canonical" href="https://easygifmaker.com/help" />
        </Helmet>

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">Help & Tutorials</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about creating, editing, and optimizing GIFs with EasyGIFMaker. 
            From basic tutorials to advanced techniques, we've got you covered.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Quick Start Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  {category.icon}
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">{category.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <Link to={category.link} className="text-blue-600 hover:text-blue-800 font-semibold">
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Troubleshooting Guide</h2>
          <div className="space-y-8">
            {troubleshootingTopics.map((topic, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{topic.title}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-red-700 mb-3">Common Problems:</h4>
                    <ul className="list-disc pl-6 text-gray-700">
                      {topic.problems.map((problem, pIndex) => (
                        <li key={pIndex} className="mb-2">{problem}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 mb-3">Solutions:</h4>
                    <ul className="list-disc pl-6 text-gray-700">
                      {topic.solutions.map((solution, sIndex) => (
                        <li key={sIndex} className="mb-2">{solution}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Platform-Specific Optimization</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {platformGuides.map((platform, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  {platform.icon}
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">{platform.platform}</h3>
                </div>
                <ul className="list-disc pl-6 text-gray-700">
                  {platform.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="mb-2">{tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Advanced Techniques</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Creating Professional GIFs</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Choose high-quality source material (1080p or higher)</li>
                <li>Select meaningful moments that tell a complete story</li>
                <li>Ensure your content makes sense without audio</li>
                <li>Use appropriate frame rates for your content type</li>
                <li>Test your GIFs on multiple platforms before sharing</li>
                <li>Consider your audience and platform requirements</li>
                <li>Add branding or watermarks for business use</li>
                <li>Optimize for both desktop and mobile viewing</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">File Size Optimization</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Use 10-15fps for most content (saves 50% file size)</li>
                <li>Reduce resolution for social media sharing</li>
                <li>Keep clips under 6 seconds for optimal performance</li>
                <li>Use our optimization tool to reduce colors</li>
                <li>Choose appropriate aspect ratios for your platform</li>
                <li>Test different settings to find the perfect balance</li>
                <li>Consider your audience's internet connection</li>
                <li>Use progressive loading for large GIFs</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">What video formats are supported?</h3>
              <p className="text-gray-700">We support all major video formats including MP4, MOV, AVI, WebM, MKV, and FLV. For best results, use MP4 (H.264) or MOV files.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How long can my GIF be?</h3>
              <p className="text-gray-700">While there's no strict limit, we recommend keeping GIFs under 10 seconds for optimal performance. Most successful GIFs are between 2-6 seconds.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Are my files stored on your servers?</h3>
              <p className="text-gray-700">No, we never store your files. All uploads are processed and automatically deleted after conversion for your privacy and security.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">What's the maximum file size for uploads?</h3>
              <p className="text-gray-700">We support video files up to 100MB. For larger files, consider trimming your video before uploading or using our URL input feature.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How do I make my GIFs load faster?</h3>
              <p className="text-gray-700">Use our optimization tools to reduce file size, choose lower frame rates (10-15fps), and keep clips short. Smaller files load faster on all platforms.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Can I convert YouTube videos to GIFs?</h3>
              <p className="text-gray-700">Yes! Simply paste the YouTube URL into our tool. However, please ensure you have the right to use the content and respect copyright laws.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Best Practices for Different Use Cases</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Social Media Marketing</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Keep file sizes under 5MB for Twitter</li>
                <li>Use square format for Instagram</li>
                <li>Add your brand colors and logos</li>
                <li>Include clear calls-to-action</li>
                <li>Test on mobile devices</li>
                <li>Use trending hashtags in captions</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Educational Content</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Use higher frame rates (20-25fps)</li>
                <li>Include step-by-step instructions</li>
                <li>Add text overlays for clarity</li>
                <li>Keep content focused and concise</li>
                <li>Use consistent branding</li>
                <li>Optimize for both desktop and mobile</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Demonstrations</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Show key features clearly</li>
                <li>Use high-quality source material</li>
                <li>Keep demonstrations under 8 seconds</li>
                <li>Add product branding</li>
                <li>Include pricing or contact info</li>
                <li>Test on multiple platforms</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
            <p className="text-lg mb-6">Can't find what you're looking for? Our support team is here to help.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Contact Support
              </Link>
              <Link to="/blog" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Browse Tutorials
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
