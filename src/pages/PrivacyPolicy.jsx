import React from 'react';
import { Helmet } from 'react-helmet';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
      <Helmet>
        <title>Privacy Policy | EasyGIFMaker</title>
        <meta name="description" content="Read the Privacy Policy for EasyGIFMaker. Learn how we protect your data and privacy when using our GIF and video editing tools." />
        <meta name="keywords" content="adobe mov to gif, ahegao gif, animated gif converter, animated gif to mp4, animated gif to video, birthday sex gif, change video to gif, convert a mov to gif, convert a mp4 to gif, convert animated gif to mp4, convert animated gif to video, convert from gif to mp4, convert from mov to gif, convert gif in video, convert gif to mp4, convert gif to video, convert mov to gif, convert movie to gif, convert mp4 to animated gif, convert mp4 to gif, convert video to animated gif, converting a video to gif, create animated gif from video, create gif from video, download tweet gif, gif converter, gif convertir, gif dancing funny, gif generator from video, gif recording, gif to mp4, gif to video, gif tweet downloader, gifv to mp4, make a gif from video, make video in gif, mov to animated gif, mov to gif, movie to gif converter, mp4 to animated gif, mp4 to gif, quicktime to gif, tiktok gif, turn gif into video, turn mov into gif, turn mp4 into gif, turn video into animated gif, turn video into gif, video as gif, video clip to gif, video in gif converter, video in to gif, video to animated gif, video to gif, video to gif converter, webm to gif, www gifyoutube, youtube gif maker, youtube to gif, youtube video to gif" />
        <link rel="canonical" href="https://easygifmaker.com/privacy-policy" />
      </Helmet>
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-4">Privacy Policy</h1>
        <p className="mb-4 text-gray-700">Your privacy is important to us. EasyGIFMaker does not store your files or personal data. All file processing is performed securely and is deleted after processing.</p>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-1">Information We Collect</h2>
            <p className="mb-2 text-gray-700">We do not collect or store any personal information or uploaded files. Usage analytics may be collected in aggregate to improve our service, but this data is anonymized.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-1">Third-Party Services</h2>
            <p className="mb-2 text-gray-700">We may use third-party analytics tools (such as Google Analytics) to understand usage patterns. These tools do not collect personal data.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-1">Contact</h2>
            <p className="mb-2 text-gray-700">For privacy-related questions, contact us at <a href="mailto:nandmonlinellc@gmail.com" className="text-blue-600 underline">nandmonlinellc@gmail.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
