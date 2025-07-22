import React from 'react';
import { Helmet } from 'react-helmet';

export default function Contact() {
  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
      <Helmet>
        <title>Contact EasyGIFMaker | Support & Feedback</title>
        <meta name="description" content="Contact EasyGIFMaker for support, feedback, or partnership inquiries. We're here to help you with all your GIF and video editing needs." />
        <link rel="canonical" href="https://easygifmaker.com/contact" />
      </Helmet>
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-4">Contact Us</h1>
        <p className="mb-4 text-gray-700">Have questions, feedback, or need support? We're here to help you with all your GIF and video editing needs.</p>
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="font-semibold text-gray-800 w-20">Email:</span>
            <a href="mailto:nandmonlinellc@gmail.com" className="text-blue-600 hover:underline ml-2">nandmonlinellc@gmail.com</a>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-gray-800 w-20">Twitter:</span>
            <a href="https://twitter.com/easygifmaker" className="text-blue-600 hover:underline ml-2" target="_blank" rel="noopener noreferrer">@easygifmaker</a>
          </div>
        </div>
        <p className="text-sm text-gray-500">We aim to respond to all inquiries within 2 business days.</p>
      </div>
    </div>
  );
}
