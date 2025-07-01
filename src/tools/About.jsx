import React from 'react';

export default function About() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">About EasyGIFMaker</h1>
      <p className="mb-2">EasyGIFMaker is a simple, fast, and privacy-focused tool for converting videos and images into GIFs. Our mission is to make GIF creation accessible to everyone, with a user-friendly interface and robust features.</p>
      <p className="mb-2">We do not store your files or personal data. All processing happens securely and privately.</p>
      <p>For more information, visit our <a href="/help" className="text-blue-600 underline">Help & FAQs</a> page.</p>
    </div>
  );
}
