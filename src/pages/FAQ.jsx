import React from 'react';
import { Helmet } from 'react-helmet';

export default function FAQ() {
  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
      <Helmet>
        <title>FAQ | EasyGIFMaker Frequently Asked Questions</title>
        <meta name="description" content="Find answers to common questions about EasyGIFMaker's GIF and video editing tools, features, and troubleshooting." />
        <meta name="keywords" content="adobe mov to gif, ahegao gif, animated gif converter, animated gif to mp4, animated gif to video, birthday sex gif, change video to gif, convert a mov to gif, convert a mp4 to gif, convert animated gif to mp4, convert animated gif to video, convert from gif to mp4, convert from mov to gif, convert gif in video, convert gif to mp4, convert gif to video, convert mov to gif, convert movie to gif, convert mp4 to animated gif, convert mp4 to gif, convert video to animated gif, converting a video to gif, create animated gif from video, create gif from video, download tweet gif, gif converter, gif convertir, gif dancing funny, gif generator from video, gif recording, gif to mp4, gif to video, gif tweet downloader, gifv to mp4, make a gif from video, make video in gif, mov to animated gif, mov to gif, movie to gif converter, mp4 to animated gif, mp4 to gif, quicktime to gif, tiktok gif, turn gif into video, turn mov into gif, turn mp4 into gif, turn video into animated gif, turn video into gif, video as gif, video clip to gif, video in gif converter, video in to gif, video to animated gif, video to gif, video to gif converter, webm to gif, www gifyoutube, youtube gif maker, youtube to gif, youtube video to gif" />
        <link rel="canonical" href="https://easygifmaker.com/faq" />
      </Helmet>
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-4">Frequently Asked Questions</h1>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-1">Is EasyGIFMaker free?</h2>
            <p className="mb-2 text-gray-700">Yes, EasyGIFMaker is completely free to use for all users.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-1">Do you store my files?</h2>
            <p className="mb-2 text-gray-700">No, we do not store your files. All processing is done securely and files are deleted after processing.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-1">Can I use EasyGIFMaker on mobile?</h2>
            <p className="mb-2 text-gray-700">Yes, our website is mobile-friendly and works on all modern devices.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-1">Who can I contact for support?</h2>
            <p className="mb-2 text-gray-700">Contact us at <a href="mailto:nandmonlinellc@gmail.com" className="text-blue-600 underline">nandmonlinellc@gmail.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
