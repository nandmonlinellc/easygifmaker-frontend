import React from 'react';

export default function Help() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Help & FAQs</h1>
      <h2 className="text-xl font-semibold mt-6 mb-2">How do I create a GIF?</h2>
      <p className="mb-2">Upload your video or images, adjust the settings, and click "Convert". Your GIF will be ready in seconds!</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Is my data safe?</h2>
      <p className="mb-2">Yes. We do not store your files or personal information. All processing is done securely and privately.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">What formats are supported?</h2>
      <p className="mb-2">We support popular video formats (MP4, MOV, AVI, etc.) and image formats (JPG, PNG, GIF, etc.).</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Need more help?</h2>
      <p>Contact us at <a href="mailto:support@easygifmaker.com" className="text-blue-600 underline">support@easygifmaker.com</a>.</p>
    </div>
  );
}
