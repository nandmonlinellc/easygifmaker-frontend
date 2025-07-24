import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Image, Video, Crop, RotateCw, Type, Zap, Users, Shield, Rocket, Smile, ArrowRight, BookOpen, Upload, Edit3, Download } from 'lucide-react';
import TestimonialSection from '@/components/TestimonialSection';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>EasyGIFMaker - Free Online GIF Maker, Video to GIF Converter & Editor</title>
        <meta name="description" content="Create, edit and optimize GIFs online for free. Convert videos to GIF, resize, crop, add text and more. Support for MP4, YouTube, and all major formats. No registration required." />
        <meta name="keywords" content="gif maker, video to gif, mp4 to gif, gif converter, gif editor, youtube to gif, make gif, create gif, gif tools, online gif maker, free gif maker" />
        <meta property="og:title" content="EasyGIFMaker - Free Online GIF Maker & Video to GIF Converter" />
        <meta property="og:description" content="Create, edit and optimize GIFs online for free. Convert videos to GIF, resize, crop, add text and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://easygifmaker.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EasyGIFMaker - Free Online GIF Maker" />
        <meta name="twitter:description" content="Create, edit and optimize GIFs online for free. Convert videos to GIF, resize, crop, add text and more." />
        <link rel="canonical" href="https://easygifmaker.com" />
      </Helmet>
      <main className="from-blue-50 to-purple-100 min-h-screen">
        {/* Hero Section */}
        <section className="relative text-center py-20 bg-gradient-to-br from-blue-500 to-purple-500 text-white overflow-hidden">
          {/* Background GIF */}
          <img src="/blog/magical-gif.gif" alt="Magical Animation" className="absolute inset-0 w-full h-full object-cover opacity-40 z-0" style={{ pointerEvents: 'none' }} />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/80 to-purple-400/80 z-0" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">Create GIFs Instantly</h1>
            <p className="text-2xl mb-4">Turn your videos and images into stunning GIFs in seconds. Free, fast, and privacy-focused.</p>
            <p className="mb-8 text-lg text-blue-100">EasyGIFMaker is your all-in-one solution for making, editing, and optimizing GIFs. No registration, no watermarks, and your files are never stored. Join thousands of creators and marketers who trust us for their GIF needs!</p>
            <div className="flex justify-center mb-8">
              <Video className="w-24 h-24 text-white bg-blue-500 rounded-full p-4 shadow-lg" />
            </div>
            <Link to="/gif-maker" className="px-8 py-4 bg-white text-blue-700 font-bold rounded-full shadow-lg hover:bg-blue-100 transition">Try GIF Maker</Link>
          </div>
        </section>

        {/* Tools Showcase */}
        <section className="py-16 container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">Our GIF Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition">
              <Image className="w-16 h-16 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">GIF Maker</h3>
              <p className="text-gray-600 mb-4 text-center">Combine multiple images or video clips to create animated GIFs with custom timing, looping, and effects. Perfect for memes, tutorials, and social media posts. No design skills needed!</p>
              <Link to="/gif-maker" className="mt-auto px-6 py-2 bg-blue-600 text-white rounded-full font-bold shadow hover:bg-blue-700 transition flex items-center gap-2">Try Now <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition">
              <Video className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Video to GIF</h3>
              <p className="text-gray-600 mb-4 text-center">Convert any video (MP4, YouTube, and more) into a high-quality GIF. Trim, crop, and adjust settings to capture the perfect moment. Great for sharing highlights, reactions, and more.</p>
              <Link to="/video-to-gif" className="mt-auto px-6 py-2 bg-green-600 text-white rounded-full font-bold shadow hover:bg-green-700 transition flex items-center gap-2">Try Now <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition">
              <RotateCw className="w-16 h-16 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Resize GIF</h3>
              <p className="text-gray-600 mb-4 text-center">Easily change the dimensions of your GIFs while maintaining quality. Optimize for different platforms, reduce file size, or fit your GIF to any space—no technical knowledge required.</p>
              <Link to="/resize" className="mt-auto px-6 py-2 bg-purple-600 text-white rounded-full font-bold shadow hover:bg-purple-700 transition flex items-center gap-2">Try Now <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition">
              <Crop className="w-16 h-16 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Crop GIF</h3>
              <p className="text-gray-600 mb-4 text-center">Crop your GIFs to focus on what matters. Use custom dimensions or aspect ratios to remove unwanted areas and highlight the best parts of your animation.</p>
              <Link to="/crop" className="mt-auto px-6 py-2 bg-orange-600 text-white rounded-full font-bold shadow hover:bg-orange-700 transition flex items-center gap-2">Try Now <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition">
              <Zap className="w-16 h-16 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Optimize GIF</h3>
              <p className="text-gray-600 mb-4 text-center">Reduce GIF file size and compress for faster loading and sharing. Our optimizer uses advanced techniques to keep your GIFs looking great while saving bandwidth.</p>
              <Link to="/optimize" className="mt-auto px-6 py-2 bg-yellow-500 text-white rounded-full font-bold shadow hover:bg-yellow-600 transition flex items-center gap-2">Try Now <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition">
              <Type className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Add Text to GIF</h3>
              <p className="text-gray-600 mb-4 text-center">Add custom text, captions, and watermarks to your GIFs. Personalize your animations, create memes, or add branding in just a few clicks.</p>
              <Link to="/add-text" className="mt-auto px-6 py-2 bg-red-500 text-white rounded-full font-bold shadow hover:bg-red-600 transition flex items-center gap-2">Try Now <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-blue-50">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-10">
            <div className="flex flex-col items-center max-w-xs">
              <Upload className="w-16 h-16 text-blue-500 mb-2" />
              <h4 className="font-bold text-lg mb-1">1. Upload</h4>
              <p className="text-gray-700 text-center">
                Start by uploading your video or images, or simply paste a URL from YouTube or other platforms. We support all major formats, and your files are processed securely in your browser for maximum privacy.
              </p>
            </div>
            <div className="flex flex-col items-center max-w-xs">
              <Edit3 className="w-16 h-16 text-green-500 mb-2" />
              <h4 className="font-bold text-lg mb-1">2. Edit</h4>
              <p className="text-gray-700 text-center">
                Use our intuitive editor to trim, crop, resize, and add text or captions to your GIF. Preview your changes in real time and fine-tune every detail for the perfect result—no design skills required!
              </p>
            </div>
            <div className="flex flex-col items-center max-w-xs">
              <Download className="w-16 h-16 text-purple-500 mb-2" />
              <h4 className="font-bold text-lg mb-1">3. Download</h4>
              <p className="text-gray-700 text-center">
                Instantly download your optimized GIF or MP4. Share it on social media, in chats, or anywhere you like. No watermarks, no waiting, and your files are never stored on our servers.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Highlights */}
        <section className="py-16 container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">From Our Blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col hover:scale-105 transition">
              <BookOpen className="w-16 h-16 text-blue-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">How to Make GIFs from Videos Instantly</h3>
              <p className="text-gray-600 mb-4">Learn how to turn your favorite video moments into GIFs with our step-by-step guide. Discover tips for perfect timing, quality, and sharing on any platform.</p>
              <Link to="/blog/how-to-make-gifs-from-videos" className="mt-auto px-6 py-2 bg-blue-600 text-white rounded-full font-bold shadow hover:bg-blue-700 transition flex items-center gap-2">Read More <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col hover:scale-105 transition">
              <BookOpen className="w-16 h-16 text-green-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Top 5 Tips for Optimizing GIFs for Social Media</h3>
              <p className="text-gray-600 mb-4">Discover the best practices for creating fast-loading, high-quality GIFs that stand out on every platform. Learn how to optimize file size, dimensions, and more.</p>
              <Link to="/blog/top-5-gif-optimization-tips" className="mt-auto px-6 py-2 bg-green-600 text-white rounded-full font-bold shadow hover:bg-green-700 transition flex items-center gap-2">Read More <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col hover:scale-105 transition">
              <BookOpen className="w-16 h-16 text-red-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Adding Text and Captions to GIFs: A Complete Guide</h3>
              <p className="text-gray-600 mb-4">Make your GIFs more engaging with custom text overlays, captions, and branding. See how EasyGIFMaker makes it easy to personalize your animations.</p>
              <Link to="/blog/add-text-to-gifs-guide" className="mt-auto px-6 py-2 bg-red-500 text-white rounded-full font-bold shadow hover:bg-red-600 transition flex items-center gap-2">Read More <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>

        {/* SEO/Feature Section */}
        <section className="py-16 container mx-auto bg-blue-50">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">Why Choose EasyGIFMaker?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Shield className="w-16 h-16 text-blue-500 mb-2" />
              <h4 className="font-bold text-lg mb-1">Privacy First</h4>
              <p className="text-gray-700 text-center">We never store your files. Everything is processed securely and deleted automatically. Your privacy is our top priority, so you can create and share GIFs with confidence.</p>
            </div>
            <div className="flex flex-col items-center">
              <Rocket className="w-16 h-16 text-green-500 mb-2" />
              <h4 className="font-bold text-lg mb-1">Blazing Fast</h4>
              <p className="text-gray-700 text-center">Enjoy unlimited access to all our tools for free, with fast processing and no watermarks. Our platform is optimized for speed, so you can create GIFs in seconds—even with large files.</p>
            </div>
            <div className="flex flex-col items-center">
              <Smile className="w-16 h-16 text-purple-500 mb-2" />
              <h4 className="font-bold text-lg mb-1">Easy to Use</h4>
              <p className="text-gray-700 text-center">Our tools are designed to be intuitive and easy to use for everyone, no technical skills required. Whether you’re a meme creator, marketer, or just having fun, EasyGIFMaker is for you.</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">What Our Users Say</h2>
          <p className="text-center text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Loved by creators, marketers, and meme-makers worldwide. Here’s what some of our users have to say about EasyGIFMaker:</p>
          <TestimonialSection />
        </section>
      </main>
    </>
  );
}

