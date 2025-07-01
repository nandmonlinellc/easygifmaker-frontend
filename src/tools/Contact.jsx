import React from 'react';

export default function Contact() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-2">Have questions, feedback, or need support? Reach out to us!</p>
      <ul className="mb-2">
        <li>Email: <a href="mailto:support@easygifmaker.com" className="text-blue-600 underline">support@easygifmaker.com</a></li>
        <li>Twitter: <a href="https://twitter.com/easygifmaker" className="text-blue-600 underline">@easygifmaker</a></li>
      </ul>
      <p>We aim to respond to all inquiries within 2 business days.</p>
    </div>
  );
}
