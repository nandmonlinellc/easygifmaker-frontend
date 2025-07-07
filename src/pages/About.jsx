import React from 'react';
import { Helmet } from 'react-helmet';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>About EasyGIFMaker | GIF & Video Editing Tools</title>
        <meta name="description" content="Learn about EasyGIFMaker, our mission, and the team behind the best free online GIF and video editing tools." />
        <meta name="keywords" content="adobe mov to gif, ahegao gif, animated gif converter, animated gif to mp4, animated gif to video, birthday sex gif, change video to gif, convert a mov to gif, convert a mp4 to gif, convert animated gif to mp4, convert animated gif to video, convert from gif to mp4, convert from mov to gif, convert gif in video, convert gif to mp4, convert gif to video, convert mov to gif, convert movie to gif, convert mp4 to animated gif, convert mp4 to gif, convert video to animated gif, converting a video to gif, create animated gif from video, create gif from video, download tweet gif, gif converter, gif convertir, gif dancing funny, gif generator from video, gif recording, gif to mp4, gif to video, gif tweet downloader, gifv to mp4, make a gif from video, make video in gif, mov to animated gif, mov to gif, movie to gif converter, mp4 to animated gif, mp4 to gif, quicktime to gif, tiktok gif, turn gif into video, turn mov into gif, turn mp4 into gif, turn video into animated gif, turn video into gif, video as gif, video clip to gif, video in gif converter, video in to gif, video to animated gif, video to gif, video to gif converter, webm to gif, www gifyoutube, youtube gif maker, youtube to gif, youtube video to gif" />
        <link rel="canonical" href="https://easygifmaker.com/about" />
      </Helmet>
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
  );
}
