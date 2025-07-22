import React from 'react';
import Meta from '../components/Meta';

export default function About() {
  return (
    <>
      <Meta
        title="About EasyGIFMaker"
        description="Learn about EasyGIFMaker, our mission, and the team behind the best free online GIF and video editing tools."
        url="/about"
      />
      <div className="container mx-auto px-4 py-12">
      <section className="relative text-center mb-12">
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <div className="w-full h-32 bg-gradient-to-b from-blue-100/60 via-white/0 to-white/0 blur-2xl rounded-b-3xl"></div>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-4 drop-shadow-sm tracking-tight">
          About EasyGIFMaker
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto font-medium">
          EasyGIFMaker is a simple, fast, and privacy-focused tool for converting videos and images into GIFs. Our mission is to make GIF creation accessible to everyone, with a user-friendly interface and robust features.
        </p>
      </section>
      <div className="max-w-3xl mx-auto bg-white/80 rounded-xl shadow-lg p-8 mb-10 border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-4">
          We believe everyone should be able to create and share GIFs easily, without worrying about privacy or technical barriers. EasyGIFMaker is built for creators, marketers, educators, and anyone who loves visual storytelling.
        </p>
        <ul className="text-sm text-gray-600 space-y-1 mb-6">
          <li>• 100% free and no sign-up required</li>
          <li>• No files or personal data stored</li>
          <li>• Works on desktop and mobile</li>
          <li>• High-quality output for web, social, and messaging</li>
          <li>• Trusted by thousands of creators worldwide</li>
        </ul>
        <h2 className="text-xl font-semibold text-blue-700 mb-2">How We Protect Your Privacy</h2>
        <p className="text-gray-700 mb-4">
          We do not store your files or personal data. All processing happens securely and privately, and files are deleted after processing.
        </p>
        <p className="text-gray-700">
          For more information, visit our <a href="/help" className="text-blue-600 underline">Help & FAQs</a> page.
        </p>
      </div>
      </div>
    </>
  );
}
