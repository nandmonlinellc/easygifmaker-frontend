import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import Meta from '@/components/Meta.jsx';
import { Link } from 'react-router-dom';
const GiftIcon = lazy(() => import('lucide-react/dist/esm/icons/gift'));
const ShieldIcon = lazy(() => import('lucide-react/dist/esm/icons/shield'));
const SmileIcon = lazy(() => import('lucide-react/dist/esm/icons/smile'));
const ZapIcon = lazy(() => import('lucide-react/dist/esm/icons/zap'));
import { Button } from '@/components/ui/button';

export default function About() {
  const features = [
    {
      icon: (
        <Suspense fallback={<div className="h-8 w-8" />}>
          <GiftIcon className="h-8 w-8 text-blue-600" />
        </Suspense>
      ),
      title: 'Comprehensive Tools',
      description: 'From video conversion to adding text, we provide a full suite of tools to bring your GIFs to life.'
    },
    {
      icon: (
        <Suspense fallback={<div className="h-8 w-8" />}>
          <ShieldIcon className="h-8 w-8 text-green-600" />
        </Suspense>
      ),
      title: 'Privacy First',
      description: 'We never store your files. Everything you upload is processed securely and deleted automatically.'
    },
    {
      icon: (
        <Suspense fallback={<div className="h-8 w-8" />}>
          <SmileIcon className="h-8 w-8 text-purple-600" />
        </Suspense>
      ),
      title: 'Simple & User-Friendly',
      description: 'Our tools are designed to be intuitive and easy to use for everyone, no technical skills required.'
    },
    {
      icon: (
        <Suspense fallback={<div className="h-8 w-8" />}>
          <ZapIcon className="h-8 w-8 text-orange-600" />
        </Suspense>
      ),
      title: 'Free & Fast',
      description: 'Enjoy unlimited access to all our tools for free, with fast processing and no watermarks.'
    }
  ];

  return (
    <>
      <Meta
        title="About EasyGIFMaker | Our Mission and Story"
        description="Learn about EasyGIFMaker's mission to provide the best free, private, and easy-to-use online tools for creating and editing GIFs."
        url="/about"
        image="https://easygifmaker.com/og-image.png"
        imageAlt="About EasyGIFMaker"
      />
      <Helmet>
        <meta property="og:type" content="website" />
      </Helmet>
      <main className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white py-12 px-4" aria-label="About EasyGIFMaker">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100">
        <header className="text-center" aria-label="About Header">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">Making GIF Creation Easy for Everyone</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our mission is to provide the most powerful, intuitive, and privacy-respecting GIF tools on the web—completely free of charge.
          </p>
        </header>
        <section className="my-12 border-t border-b border-blue-100 py-12" aria-label="Key Features">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center items-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-6 text-gray-800 text-left" aria-label="Our Story">
          <h2 className="text-3xl font-bold text-blue-700 text-center">Our Story</h2>
          <p>
            EasyGIFMaker was born from a simple idea: creating and editing GIFs shouldn't be complicated or compromise your privacy. We saw a need for a tool that was as powerful as professional software but as easy to use as a social media app. We were tired of sites that were slow, covered in ads, or stored user files indefinitely.
          </p>
          <p>
            So, we built the solution we wanted to use. A platform where anyone can quickly convert a video, add a funny caption, or optimize a GIF for sharing, all without worrying about their data. We are committed to keeping our tools free, accessible on any device, and constantly improving them based on user feedback. For more details on our commitment to your privacy, please read our <Link to="/privacy-policy" className="text-blue-600 hover:underline" aria-label="Read our Privacy Policy">Privacy Policy</Link>.
          </p>
          
          <h3 className="text-2xl font-bold text-blue-700 mt-8">The Evolution of GIF Technology</h3>
          <p>
            The Graphics Interchange Format (GIF) has undergone tremendous evolution since its introduction in 1987. What started as a simple image format has become the cornerstone of digital communication, memes, and creative expression. Today's GIFs are more sophisticated, with advanced compression algorithms, better color palettes, and optimized file sizes that make them perfect for modern web usage.
          </p>
          <p>
            At EasyGIFMaker, we've invested heavily in understanding these technological advances. Our tools leverage modern web technologies including HTML5 Canvas API, WebAssembly for high-performance processing, and advanced compression algorithms to deliver professional-quality results. We continuously monitor developments in image processing, machine learning for optimization, and web standards to ensure our platform remains at the cutting edge.
          </p>

          <h3 className="text-2xl font-bold text-blue-700 mt-8">Our Technical Excellence</h3>
          <p>
            Behind every simple click on our platform lies sophisticated technology. Our GIF processing engine utilizes advanced algorithms for color quantization, ensuring your GIFs maintain visual quality while achieving optimal file sizes. We implement adaptive frame rate optimization, intelligent dithering techniques, and smart loop detection to create GIFs that look perfect across all devices and platforms.
          </p>
          <p>
            Our video-to-GIF conversion process employs temporal sampling algorithms that analyze motion patterns to select the most representative frames. This ensures smooth animation while minimizing file size. For text overlay features, we use advanced typography rendering engines that maintain crisp text quality even after GIF compression. Our cropping and resizing tools utilize bicubic interpolation and edge-preserving algorithms to maintain image clarity at any dimension.
          </p>

          <h3 className="text-2xl font-bold text-blue-700 mt-8">Privacy by Design</h3>
          <p>
            Privacy isn't an afterthought at EasyGIFMaker – it's fundamental to our architecture. We implement a zero-storage policy where all uploaded files are processed in memory and automatically purged within minutes of processing completion. Our servers are configured with encrypted storage, secure transmission protocols, and strict access controls that ensure your creative content never leaves our secure processing environment.
          </p>
          <p>
            We've designed our system to operate without requiring user accounts, cookies for tracking, or persistent data collection. Your IP address is anonymized in our logs, and we don't build user profiles or track behavior across sessions. This commitment to privacy extends to our third-party integrations – we carefully vet all external services and ensure they meet our strict privacy standards before integration.
          </p>

          <h3 className="text-2xl font-bold text-blue-700 mt-8">Supporting Creative Communities</h3>
          <p>
            EasyGIFMaker serves diverse creative communities including digital marketers who need quick visual content, educators creating engaging learning materials, content creators developing social media assets, and everyday users preserving and sharing memorable moments. We understand that each community has unique needs, which is why we've developed specialized tools and workflows.
          </p>
          <p>
            Our platform supports professional workflows with batch processing capabilities, custom quality settings, and advanced optimization options. For educators, we provide tools that help create accessible content with proper alt text support and screen reader compatibility. Social media managers benefit from our platform-specific optimization presets that ensure GIFs perform well on Instagram, Twitter, Facebook, and other platforms.
          </p>

          <h3 className="text-2xl font-bold text-blue-700 mt-8">Innovation and Future Development</h3>
          <p>
            We're constantly pushing the boundaries of what's possible with web-based GIF creation. Our development roadmap includes AI-powered optimization that will automatically adjust compression settings based on content analysis, advanced motion detection for smarter frame selection, and collaborative features that allow teams to work together on GIF projects.
          </p>
          <p>
            We're also exploring integration with emerging web standards like WebCodecs API for native browser video processing, Progressive Web App capabilities for offline functionality, and WebGL shaders for real-time effects processing. Our commitment to innovation ensures that EasyGIFMaker will continue to evolve with changing user needs and technological capabilities.
          </p>
        </section>
        <section className="mt-12 text-center" aria-label="Join Our Community">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-6">
            Thousands of creators, marketers, and meme-lovers use EasyGIFMaker every day. Have an idea for a new feature or need help? We'd love to hear from you!
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
            <a href="https://x.com/NMToolbox" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" aria-label="EasyGIFMaker X">Follow us on X (@NMToolbox)</a>
            <a href="https://www.reddit.com/user/LegitimateNight2501" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" aria-label="EasyGIFMaker Reddit">Join us on Reddit (u/LegitimateNight2501)</a>
          </div>
          <Button asChild size="lg">
            <Link to="/contact" aria-label="Contact Us">Get In Touch</Link>
          </Button>
        </section>
      </div>
    </main>
    </>
  );
}
