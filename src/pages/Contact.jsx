import React from 'react';
import { Helmet } from 'react-helmet';

export default function Contact() {
  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
      <Helmet>
        <title>Contact EasyGIFMaker | Support & Feedback</title>
        <meta name="description" content="Contact EasyGIFMaker for support, feedback, or partnership inquiries. We're here to help you with all your GIF and video editing needs." />
        <meta name="keywords" content="adobe mov to gif, ahegao gif, animated gif converter, animated gif to mp4, animated gif to video, birthday sex gif, change video to gif, convert a mov to gif, convert a mp4 to gif, convert animated gif to mp4, convert animated gif to video, convert from gif to mp4, convert from mov to gif, convert gif in video, convert gif to mp4, convert gif to video, convert mov to gif, convert movie to gif, convert mp4 to animated gif, convert mp4 to gif, convert video to animated gif, converting a video to gif, create animated gif from video, create gif from video, download tweet gif, gif converter, gif convertir, gif dancing funny, gif generator from video, gif recording, gif to mp4, gif to video, gif tweet downloader, gifv to mp4, make a gif from video, make video in gif, mov to animated gif, mov to gif, movie to gif converter, mp4 to animated gif, mp4 to gif, quicktime to gif, tiktok gif, turn gif into video, turn mov into gif, turn mp4 into gif, turn video into animated gif, turn video into gif, video as gif, video clip to gif, video in gif converter, video in to gif, video to animated gif, video to gif, video to gif converter, webm to gif, www gifyoutube, youtube gif maker, youtube to gif, youtube video to gif" />
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
