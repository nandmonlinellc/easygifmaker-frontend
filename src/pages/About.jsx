import React from 'react';
import { Helmet } from 'react-helmet';

export default function About() {
  return (
    <div className="container mx-auto p-8">
      <Helmet>
        <title>About EasyGIFMaker | GIF & Video Editing Tools</title>
        <meta name="description" content="Learn about EasyGIFMaker, our mission, and the team behind the best free online GIF and video editing tools." />
        <meta name="keywords" content="adobe mov to gif, ahegao gif, animated gif converter, animated gif to mp4, animated gif to video, birthday sex gif, change video to gif, convert a mov to gif, convert a mp4 to gif, convert animated gif to mp4, convert animated gif to video, convert from gif to mp4, convert from mov to gif, convert gif in video, convert gif to mp4, convert gif to video, convert mov to gif, convert movie to gif, convert mp4 to animated gif, convert mp4 to gif, convert video to animated gif, converting a video to gif, create animated gif from video, create gif from video, download tweet gif, gif converter, gif convertir, gif dancing funny, gif generator from video, gif recording, gif to mp4, gif to video, gif tweet downloader, gifv to mp4, make a gif from video, make video in gif, mov to animated gif, mov to gif, movie to gif converter, mp4 to animated gif, mp4 to gif, quicktime to gif, tiktok gif, turn gif into video, turn mov into gif, turn mp4 into gif, turn video into animated gif, turn video into gif, video as gif, video clip to gif, video in gif converter, video in to gif, video to animated gif, video to gif, video to gif converter, webm to gif, www gifyoutube, youtube gif maker, youtube to gif, youtube video to gif" />
        <link rel="canonical" href="https://easygifmaker.com/about" />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">About EasyGIFMaker</h1>
      <p className="mb-2">EasyGIFMaker is a simple, fast, and privacy-focused tool for converting videos and images into GIFs. Our mission is to make GIF creation accessible to everyone, with a user-friendly interface and robust features.</p>
      <p className="mb-2">We do not store your files or personal data. All processing happens securely and privately.</p>
      <p>For more information, visit our <a href="/help" className="text-blue-600 underline">Help & FAQs</a> page.</p>
    </div>
  );
}
