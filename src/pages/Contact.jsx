import React from 'react';
import { Helmet } from 'react-helmet';

export default function Contact() {
  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4" aria-label="Contact EasyGIFMaker">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
      <Helmet>
        <title>Contact EasyGIFMaker | Support & Feedback</title>
        <meta name="description" content="Contact EasyGIFMaker for support, feedback, or partnership inquiries. We're here to help you with all your GIF and video editing needs." />
        <link rel="canonical" href="https://easygifmaker.com/contact" />
      </Helmet>
        <header aria-label="Contact Header">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-4">Contact Us</h1>
          <p className="mb-4 text-gray-700">Have questions, feedback, or need support? We're here to help you with all your GIF and video editing needs.</p>
        </header>
        <section className="mb-4" aria-label="Contact Methods">
          <div className="flex items-center mb-2">
            <span className="font-semibold text-gray-800 w-20">Email:</span>
            <a href="mailto:nandmonlinellc@gmail.com" className="text-blue-600 hover:underline ml-2" aria-label="Email EasyGIFMaker">nandmonlinellc@gmail.com</a>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-gray-800 w-20">Twitter:</span>
            <a href="https://twitter.com/easygifmaker" className="text-blue-600 hover:underline ml-2" target="_blank" rel="noopener noreferrer" aria-label="EasyGIFMaker Twitter">@easygifmaker</a>
          </div>
        </section>
        <footer>
          <p className="text-sm text-gray-500">We aim to respond to all inquiries within 2 business days.</p>
          <p className="text-xs text-gray-400 mt-2">Your information will only be used to respond to your inquiry. See our <a href="/privacy" className="underline text-blue-600">Privacy Policy</a>.</p>
        </footer>
      </div>
    </main>
  );
}
