import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import Meta from '@/components/Meta.jsx';
import { Link } from 'react-router-dom';
const VideoIcon = lazy(() => import('lucide-react/dist/esm/icons/video'));
const ImageIcon = lazy(() => import('lucide-react/dist/esm/icons/image'));
const ScissorsIcon = lazy(() => import('lucide-react/dist/esm/icons/scissors'));
const TypeIcon = lazy(() => import('lucide-react/dist/esm/icons/type'));
const ZapIcon = lazy(() => import('lucide-react/dist/esm/icons/zap'));
const Share2Icon = lazy(() => import('lucide-react/dist/esm/icons/share-2'));
const SmartphoneIcon = lazy(() => import('lucide-react/dist/esm/icons/smartphone'));
const MonitorIcon = lazy(() => import('lucide-react/dist/esm/icons/monitor'));

function LazyIcon({ icon: Icon, className }) {
  return (
    <Suspense fallback={<div className={className} />}>
      <Icon className={className} />
    </Suspense>
  );
}

export default function Help() {
  const helpCategories = [
    {
      icon: <LazyIcon icon={VideoIcon} className="h-6 w-6 text-blue-600" />,
      title: 'Video to GIF Conversion',
      description: 'Learn how to convert videos into high-quality GIFs',
      link: '/blog/how-to-make-gifs-from-videos'
    },
    {
      icon: <LazyIcon icon={ImageIcon} className="h-6 w-6 text-green-600" />,
      title: 'GIF Creation from Images',
      description: 'Create animated GIFs from multiple static images',
      link: '/gif-maker'
    },
    {
      icon: <LazyIcon icon={ScissorsIcon} className="h-6 w-6 text-purple-600" />,
      title: 'GIF Cropping & Resizing',
      description: 'Crop and resize your GIFs for different platforms',
      link: '/crop'
    },
    {
      icon: <LazyIcon icon={TypeIcon} className="h-6 w-6 text-orange-600" />,
      title: 'Adding Text to GIFs',
      description: 'Add captions, watermarks, and text overlays',
      link: '/add-text'
    },
    {
      icon: <LazyIcon icon={ZapIcon} className="h-6 w-6 text-red-600" />,
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
      icon: <LazyIcon icon={Share2Icon} className="h-5 w-5" />,
      tips: [
        'Twitter: Keep under 5MB, use 15fps',
        'Instagram: Square format (1:1 ratio) works best',
        'Facebook: 16:9 ratio, under 8MB',
        'Discord: Any size under 8MB'
      ]
    },
    {
      platform: 'Websites',
      icon: <LazyIcon icon={MonitorIcon} className="h-5 w-5" />,
      tips: [
        'Use 640x480 resolution for fast loading',
        'Keep file size under 2MB',
        'Optimize for mobile viewing',
        'Test on different devices'
      ]
    },
    {
      platform: 'Mobile',
      icon: <LazyIcon icon={SmartphoneIcon} className="h-5 w-5" />,
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
        <Meta
          title="Help & Tutorials | EasyGIFMaker Support Center"
          description="Comprehensive help guides, tutorials, and troubleshooting for EasyGIFMaker tools. Learn how to create, edit, and optimize GIFs effectively."
          url="/help"
          image="https://easygifmaker.com/og-image.png"
          imageAlt="EasyGIFMaker Help"
        />
        <Helmet>
          <meta property="og:type" content="website" />
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

        {/* New comprehensive sections */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Understanding GIF Technology and Formats</h2>
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">GIF Format Fundamentals</h3>
                <p className="text-gray-700 mb-4">
                  The Graphics Interchange Format (GIF) was developed by CompuServe in 1987 and remains one of the most widely supported image formats. 
                  GIFs use lossless compression and support up to 256 colors per frame, making them ideal for simple animations and graphics.
                </p>
                <p className="text-gray-700 mb-4">
                  Modern GIFs benefit from advanced optimization techniques including color palette reduction, frame differencing, and intelligent compression. 
                  Understanding these technical aspects helps you make better decisions when creating content.
                </p>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Technical Specifications:</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Maximum image dimensions: 65,535 × 65,535 pixels</li>
                  <li>Color depth: 1-8 bits per pixel (2-256 colors)</li>
                  <li>Compression: LZW lossless compression</li>
                  <li>Animation: Supports multiple frames with timing</li>
                  <li>Transparency: Single transparent color support</li>
                  <li>Disposal methods: 4 different frame disposal options</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Optimization Principles</h3>
                <p className="text-gray-700 mb-4">
                  Effective GIF optimization balances file size with visual quality through strategic color reduction, frame rate adjustment, and resolution optimization. 
                  Understanding these trade-offs enables creation of content that loads quickly while maintaining visual impact.
                </p>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Optimization Strategies:</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Reduce color palette to essential colors only</li>
                  <li>Use dithering sparingly to maintain file size</li>
                  <li>Optimize frame rates for content type</li>
                  <li>Crop unnecessary areas to reduce dimensions</li>
                  <li>Use frame disposal methods efficiently</li>
                  <li>Consider temporal compression opportunities</li>
                  <li>Test across different viewing conditions</li>
                  <li>Balance quality with loading performance</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Professional Workflow Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Pre-Production Planning</h3>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Content Strategy:</h4>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Define clear objectives for your GIF content</li>
                <li>Identify target audience and viewing context</li>
                <li>Choose appropriate source material quality</li>
                <li>Plan for platform-specific requirements</li>
                <li>Consider accessibility and inclusive design</li>
                <li>Establish brand consistency guidelines</li>
              </ul>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Technical Preparation:</h4>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Ensure stable lighting in source videos</li>
                <li>Use appropriate camera settings and resolution</li>
                <li>Plan for seamless loop points when possible</li>
                <li>Consider final file size requirements</li>
                <li>Test equipment and software beforehand</li>
                <li>Backup source materials and project files</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Post-Production Optimization</h3>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Quality Control:</h4>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Review content frame-by-frame for quality</li>
                <li>Test on multiple devices and browsers</li>
                <li>Verify loading performance on slow connections</li>
                <li>Check accessibility features and compatibility</li>
                <li>Validate file size meets platform requirements</li>
                <li>Ensure consistent branding and messaging</li>
              </ul>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Distribution Preparation:</h4>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Create multiple versions for different platforms</li>
                <li>Prepare alternative formats when needed</li>
                <li>Document technical specifications for team use</li>
                <li>Set up tracking and analytics where appropriate</li>
                <li>Plan distribution timeline and coordination</li>
                <li>Prepare backup plans for technical issues</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Advanced Creative Techniques</h2>
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Cinemagraph Creation</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-4">
                    Cinemagraphs combine the best of photography and video by animating only select portions of an otherwise static image. 
                    This technique creates mesmerizing content that captures attention through subtle, continuous motion.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Planning Your Cinemagraph:</h4>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Identify compelling motion within static scenes</li>
                    <li>Choose elements that can loop seamlessly</li>
                    <li>Plan camera stability and consistent lighting</li>
                    <li>Consider the emotional impact of the motion</li>
                    <li>Test different loop lengths for optimal effect</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Technical Execution:</h4>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                    <li>Use tripod-mounted cameras for stability</li>
                    <li>Shoot longer sequences to find perfect loops</li>
                    <li>Isolate moving elements through careful masking</li>
                    <li>Blend motion boundaries seamlessly</li>
                    <li>Optimize color palettes for the animated areas</li>
                    <li>Test loop points for smooth transitions</li>
                  </ul>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Common Applications:</h4>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Product photography with subtle movement</li>
                    <li>Architectural images with environmental motion</li>
                    <li>Portrait photography with hair or clothing movement</li>
                    <li>Nature scenes with water or foliage motion</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Typography and Text Animation</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-4">
                    Animated typography in GIFs serves both functional and aesthetic purposes, providing information while contributing to overall visual impact. 
                    Effective text animation enhances readability and engagement without overwhelming the core message.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Typography Best Practices:</h4>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Choose fonts that remain legible at small sizes</li>
                    <li>Use high contrast ratios for accessibility</li>
                    <li>Allow sufficient time for reading comprehension</li>
                    <li>Consider platform viewing contexts and devices</li>
                    <li>Test with different color palettes and backgrounds</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Animation Techniques:</h4>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                    <li>Kinetic typography that emphasizes meaning</li>
                    <li>Revealing animations that build suspense</li>
                    <li>Color transitions that highlight key information</li>
                    <li>Scale changes that create visual hierarchy</li>
                    <li>Position shifts that guide viewer attention</li>
                  </ul>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Technical Considerations:</h4>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Font selection for GIF compression compatibility</li>
                    <li>Color choices that maintain cross-frame readability</li>
                    <li>Timing that balances engagement with comprehension</li>
                    <li>Mobile optimization for smaller screens</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Accessibility and Inclusive Design</h2>
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <p className="text-gray-700 mb-6">
              Creating accessible GIFs ensures your content can be enjoyed by all users, including those with disabilities. 
              This approach not only expands your audience but often results in better content for everyone.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Visual Accessibility</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                  <li>Maintain sufficient color contrast ratios (minimum 4.5:1)</li>
                  <li>Avoid relying solely on color to convey information</li>
                  <li>Provide alternative text descriptions for screen readers</li>
                  <li>Use clear, legible fonts at appropriate sizes</li>
                  <li>Test content with color blindness simulators</li>
                  <li>Consider low vision and magnification requirements</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Seizure and Motion Safety</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Avoid flashing content faster than 3 times per second</li>
                  <li>Limit high-contrast pattern animations</li>
                  <li>Provide user controls for animation playback</li>
                  <li>Respect reduced-motion preferences</li>
                  <li>Test with photosensitive epilepsy guidelines</li>
                  <li>Offer static alternatives for animated content</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Cognitive Accessibility</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                  <li>Keep content simple and focused on key messages</li>
                  <li>Use consistent visual patterns and timing</li>
                  <li>Provide clear visual hierarchy and organization</li>
                  <li>Allow users to control animation speed and replaying</li>
                  <li>Avoid overwhelming users with too much information</li>
                  <li>Use familiar icons and symbols when possible</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Implementation</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Include descriptive alt text for all GIF content</li>
                  <li>Use semantic markup for web-embedded GIFs</li>
                  <li>Implement keyboard navigation for interactive elements</li>
                  <li>Test with actual assistive technology users</li>
                  <li>Document accessibility features and limitations</li>
                  <li>Provide feedback channels for accessibility concerns</li>
                </ul>
              </div>
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
