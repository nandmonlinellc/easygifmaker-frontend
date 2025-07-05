import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-2">Your privacy is important to us. EasyGIFMaker does not store your files or personal data. All file processing is performed securely and is deleted after processing.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <p className="mb-2">We do not collect or store any personal information or uploaded files. Usage analytics may be collected in aggregate to improve our service, but this data is anonymized.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Services</h2>
      <p className="mb-2">We may use third-party analytics tools (such as Google Analytics) to understand usage patterns. These tools do not collect personal data.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p>For privacy-related questions, contact us at <a href="mailto:nandmonlinellc@gmail.com" className="text-blue-600 underline">nandmonlinellc@gmail.com</a>.</p>
    </div>
  );
}
