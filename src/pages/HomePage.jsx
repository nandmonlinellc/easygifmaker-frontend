import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Video, Image, RotateCw, Crop, Zap, Type, ArrowRight, Upload, Edit3, Download, Shield, Sparkles } from 'lucide-react';
import { MobileOptimizedImage, PreloadCriticalImages } from '../components/MobileImageOptimizer';

export default function HomePage() {
  // Structured data for homepage
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "EasyGIFMaker",
    "description": "Create, edit, and optimize GIFs online for free. Convert videos to GIFs, resize, crop, add text, and more. No registration required.",
    "url": "https://easygifmaker.com",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "EasyGIFMaker"
    },
    "publisher": {
      "@type": "Organization",
      "name": "EasyGIFMaker",
      "url": "https://easygifmaker.com"
    },
    "featureList": [
      "GIF Maker - Create animated GIFs from images",
      "Video to GIF Converter - Convert videos to GIFs",
      "GIF Resizer - Resize and scale GIFs",
      "GIF Cropper - Crop and trim GIFs",
      "GIF Optimizer - Compress and optimize GIFs",
      "Add Text to GIF - Add captions and text overlays"
    ]
  };

  return (
    <>
      <Helmet>
        <title>EasyGIFMaker - Create, Edit and Optimize GIFs Online for Free</title>
        <meta name="description" content="Create, edit and optimize GIFs online for free. Convert videos to GIF, resize, crop, add text and more. No registration required." />
        <meta name="keywords" content="gif maker, gif, free gif maker, online gif maker, gif creator, video to gif, mp4 to gif, turn video into gif, make a gif from video, video to gif converter, gif editor, create gif from video, animated gif maker, convert mp4 to gif, gif maker app, make a gif from photos, make your own gif, high quality gif maker, gifs on iphone, create your own gif, create gif from images, gif converter, free gif maker app, gif creator online, custom gif, create a gif from pictures, make my own gif, gif builder, video to animated gif, gif kiss, video to gif high quality" />
        <meta property="og:title" content="EasyGIFMaker - Create, Edit and Optimize GIFs Online for Free" />
        <meta property="og:description" content="Create, edit and optimize GIFs online for free. Convert videos to GIF, resize, crop, add text and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://easygifmaker.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EasyGIFMaker - Create, Edit and Optimize GIFs Online for Free" />
        <meta name="twitter:description" content="Create, edit and optimize GIFs online for free. Convert videos to GIF, resize, crop, add text and more." />
        <link rel="canonical" href="https://easygifmaker.com" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(homepageStructuredData)}
        </script>
        
        {/* Critical CSS for mobile */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 768px) {
              .hero-section { min-height: 60vh !important; padding: 1rem !important; }
              .bg-gradient-to-br { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important; }
              .text-5xl { font-size: 2.5rem !important; }
              .text-6xl { font-size: 3rem !important; }
              .py-20 { padding-top: 2rem !important; padding-bottom: 2rem !important; }
              .p-8 { padding: 1rem !important; }
              .hover\\:scale-105 { transform: none !important; }
            }
          `
        }} />
      </Helmet>
      
      <PreloadCriticalImages />
      
      <main className="from-blue-50 to-purple-100 min-h-screen">
        {/* Hero Section - Mobile Optimized */}
        <section className="hero-section relative text-center py-20 bg-gradient-to-br from-blue-500 to-purple-500 text-white overflow-hidden">
          {/* Ultra-simplified background for mobile */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">Create GIFs Instantly</h1>
            <p className="text-xl md:text-2xl mb-4">Turn your videos and images into stunning GIFs in seconds.</p>
            <p className="mb-8 text-lg text-white">Free, fast, and privacy-focused.</p>
            <div className="flex justify-center mb-8">
              <Video className="w-20 h-20 md:w-24 md:h-24 text-white bg-blue-500 rounded-full p-4 shadow-lg" />
            </div>
            <Link to="/gif-maker" className="px-6 py-3 md:px-8 md:py-4 bg-white text-blue-700 font-bold rounded-full shadow-lg hover:bg-blue-100 transition text-lg">
              Try GIF Maker
            </Link>
          </div>
        </section>

        {/* Tools Showcase - Mobile Optimized */}
        <section className="py-12 md:py-16 container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10 text-blue-700">Our GIF Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 flex flex-col items-center">
              <Image className="w-12 h-12 md:w-16 md:h-16 text-blue-500 mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">GIF Maker</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4 text-center">Combine multiple images or video clips to create animated GIFs.</p>
              <Link to="/gif-maker" className="mt-auto px-4 py-2 md:px-6 md:py-2 bg-blue-700 text-white rounded-full font-bold shadow hover:bg-blue-800 transition flex items-center gap-2 text-sm">
                Try Now <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 flex flex-col items-center">
              <Video className="w-12 h-12 md:w-16 md:h-16 text-green-500 mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Video to GIF</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4 text-center">Convert any video into a high-quality GIF.</p>
              <Link to="/video-to-gif" className="mt-auto px-4 py-2 md:px-6 md:py-2 bg-green-700 text-white rounded-full font-bold shadow hover:bg-green-800 transition flex items-center gap-2 text-sm">
                Try Now <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 flex flex-col items-center">
              <RotateCw className="w-12 h-12 md:w-16 md:h-16 text-purple-500 mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Resize GIF</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4 text-center">Easily change the dimensions of your GIFs.</p>
              <Link to="/resize" className="mt-auto px-4 py-2 md:px-6 md:py-2 bg-purple-700 text-white rounded-full font-bold shadow hover:bg-purple-800 transition flex items-center gap-2 text-sm">
                Try Now <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 flex flex-col items-center">
              <Crop className="w-12 h-12 md:w-16 md:h-16 text-orange-500 mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Crop GIF</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4 text-center">Crop your GIFs to focus on what matters.</p>
              <Link to="/crop" className="mt-auto px-4 py-2 md:px-6 md:py-2 bg-orange-700 text-white rounded-full font-bold shadow hover:bg-orange-800 transition flex items-center gap-2 text-sm">
                Try Now <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 flex flex-col items-center">
              <Zap className="w-12 h-12 md:w-16 md:h-16 text-yellow-500 mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Optimize GIF</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4 text-center">Reduce GIF file size and compress for faster loading.</p>
              <Link to="/optimize" className="mt-auto px-4 py-2 md:px-6 md:py-2 bg-yellow-700 text-white rounded-full font-bold shadow hover:bg-yellow-800 transition flex items-center gap-2 text-sm">
                Try Now <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 flex flex-col items-center">
              <Type className="w-12 h-12 md:w-16 md:h-16 text-red-500 mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Add Text to GIF</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4 text-center">Add custom text, captions, and watermarks to your GIFs.</p>
              <Link to="/add-text" className="mt-auto px-4 py-2 md:px-6 md:py-2 bg-red-700 text-white rounded-full font-bold shadow hover:bg-red-800 transition flex items-center gap-2 text-sm">
                Try Now <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works - Mobile Optimized */}
        <section className="py-12 md:py-16 bg-blue-50">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10 text-blue-700">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 px-4">
            <div className="flex flex-col items-center max-w-xs">
              <Upload className="w-12 h-12 md:w-16 md:h-16 text-blue-500 mb-2" />
              <h3 className="font-bold text-base md:text-lg mb-1">1. Upload</h3>
              <p className="text-sm md:text-base text-gray-700 text-center">
                Start by uploading your video or images, or simply paste a URL.
              </p>
            </div>
            <div className="flex flex-col items-center max-w-xs">
              <Edit3 className="w-12 h-12 md:w-16 md:h-16 text-green-500 mb-2" />
              <h3 className="font-bold text-base md:text-lg mb-1">2. Edit</h3>
              <p className="text-sm md:text-base text-gray-700 text-center">
                Use our intuitive editor to trim, crop, resize, and add text.
              </p>
            </div>
            <div className="flex flex-col items-center max-w-xs">
              <Download className="w-12 h-12 md:w-16 md:h-16 text-purple-500 mb-2" />
              <h3 className="font-bold text-base md:text-lg mb-1">3. Download</h3>
              <p className="text-sm md:text-base text-gray-700 text-center">
                Instantly download your optimized GIF or MP4.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section - Mobile Optimized */}
        <section className="py-12 md:py-16 container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10 text-blue-700">Why Choose EasyGIFMaker?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm md:text-base text-gray-600">Process your GIFs in seconds with our optimized algorithms.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2">100% Private</h3>
              <p className="text-sm md:text-base text-gray-600">Your files are processed locally and never uploaded to our servers.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2">Free Forever</h3>
              <p className="text-sm md:text-base text-gray-600">No watermarks, no registration, no hidden fees.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2">High Quality</h3>
              <p className="text-sm md:text-base text-gray-600">Get professional-quality GIFs with our advanced optimization.</p>
            </div>
          </div>
        </section>

        {/* Blog Section - Mobile Optimized */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10 text-blue-700">Latest Blog Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">How to Make GIFs from Videos</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4">Learn the best practices for converting videos to high-quality GIFs with our step-by-step guide.</p>
                  <Link to="/blog/how-to-make-gifs-from-videos" className="text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base flex items-center gap-1">
                    Read More <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 4v2h6V4M9 4v2h6V4" />
                  </svg>
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">Add Text to GIFs Guide</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4">Discover how to add captions, watermarks, and text overlays to your GIFs for better engagement.</p>
                  <Link to="/blog/add-text-to-gifs-guide" className="text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base flex items-center gap-1">
                    Read More <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 5 GIF Optimization Tips</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4">Expert tips to optimize your GIFs for faster loading and better quality across all platforms.</p>
                  <Link to="/blog/top-5-gif-optimization-tips" className="text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base flex items-center gap-1">
                    Read More <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="text-center mt-8 md:mt-10">
              <Link to="/blog" className="px-6 py-3 md:px-8 md:py-4 bg-blue-700 text-white font-bold rounded-full shadow-lg hover:bg-blue-800 transition text-base md:text-lg">
                View All Blog Posts
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section - Mobile Optimized */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Create Amazing GIFs?</h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8">Join thousands of creators who trust EasyGIFMaker.</p>
            <Link to="/gif-maker" className="px-6 py-3 md:px-8 md:py-4 bg-white text-blue-700 font-bold rounded-full shadow-lg hover:bg-blue-100 transition text-base md:text-lg">
              Start Creating Now
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
