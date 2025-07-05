import React from 'react';

export default function FAQ() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions (FAQ)</h1>
      <h2 className="text-xl font-semibold mt-6 mb-2">Is EasyGIFMaker free?</h2>
      <p className="mb-2">Yes, EasyGIFMaker is completely free to use for all users.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Do you store my files?</h2>
      <p className="mb-2">No, we do not store your files. All processing is done securely and files are deleted after processing.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Can I use EasyGIFMaker on mobile?</h2>
      <p className="mb-2">Yes, our website is mobile-friendly and works on all modern devices.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Who can I contact for support?</h2>
      <p>Contact us at <a href="mailto:nandmonlinellc@gmail.com" className="text-blue-600 underline">nandmonlinellc@gmail.com</a>.</p>
    </div>
  );
}
