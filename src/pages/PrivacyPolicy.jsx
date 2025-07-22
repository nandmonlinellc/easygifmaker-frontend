import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100">
      <Helmet>
        <title>Privacy Policy | EasyGIFMaker</title>
        <meta name="description" content="Read the Privacy Policy for EasyGIFMaker. Learn how we protect your data and privacy when using our GIF and video editing tools." />
        <link rel="canonical" href="https://easygifmaker.com/privacy-policy" />
      </Helmet>
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-4">Privacy Policy</h1>
        <p className="text-gray-500 mb-6">Last updated: October 26, 2023</p>
        
        <p className="mb-6 text-gray-700">
          Welcome to EasyGIFMaker. Your privacy is critically important to us. This Privacy Policy outlines how we handle your information when you use our website and services. Our core privacy principle is simple: we do not store your files. All processing is done in real-time, and your uploaded content is deleted from our servers shortly after processing is complete.
        </p>

        <div className="space-y-8 text-gray-800">
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">1. Information We Collect</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">a. Files You Upload</h3>
            <p>We temporarily process the images, videos, or URLs you provide to our tools. These files are automatically and permanently deleted from our servers within a few hours of processing. We do not store, view, or share your files with any third parties.</p>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-1">b. Usage and Analytics Data</h3>
            <p>We collect non-personally identifiable information to understand how our services are used and to improve them. This includes:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Log Data:</strong> Anonymized information such as your browser type, operating system, referring URLs, and pages visited.</li>
              <li><strong>Usage Data:</strong> Information about which tools are used, the features accessed, and the frequency of use. This data is aggregated and cannot be tied back to an individual user.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-1">c. Information from Contact Forms</h3>
            <p>If you contact us via email or our contact form, we will collect your name, email address, and any other information you provide in your message to respond to your inquiry.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">2. How We Use Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>To Provide and Maintain Our Service:</strong> To operate our tools and provide you with the requested functionality.</li>
              <li><strong>To Improve Our Service:</strong> To analyze usage trends and optimize our tools for a better user experience.</li>
              <li><strong>To Communicate With You:</strong> To respond to your support requests, feedback, and inquiries.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">3. Cookies, Advertising, and Third-Party Services</h2>
            <p>We use cookies and similar technologies to operate our service and to support our business through advertising. Our partners may also use cookies to serve personalized ads.</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Google Analytics:</strong> We use this service to understand website traffic and usage patterns. You can learn about Google’s practices by going to <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.google.com/policies/privacy/partners/</a>.</li>
              <li><strong>Google AdSense & Ezoic:</strong> We partner with these services to display ads. They use cookies to serve ads based on a user's prior visits to our website or other websites. You can opt out of personalized advertising by visiting Ads Settings. For more information on how Ezoic uses data, please see their <a href="https://www.ezoic.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">privacy policy</a>.</li>
            </ul>
            <p className="mt-4">For more detailed information about the cookies we use, please see our <Link to="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</Link>.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">4. Data Security</h2>
            <p>We implement security measures to protect your data during processing. All file transfers are encrypted using SSL/TLS. As stated, we do not store your files long-term, which is the most effective security measure we can offer.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">5. Your Data Protection Rights (GDPR & CCPA)</h2>
            <p>Depending on your location, you may have certain rights regarding your personal data. Since we do not store personal data from the use of our tools, these rights primarily apply to information you provide when contacting us. These rights may include:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>The right to access, update, or delete the information we have on you.</li>
              <li>The right of rectification.</li>
              <li>The right to object to processing.</li>
              <li>The right of data portability.</li>
            </ul>
            <p className="mt-2">To exercise these rights, please contact us.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">6. Children's Privacy</h2>
            <p>Our service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you become aware that a child has provided us with personal information, please contact us.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">7. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, you can contact us:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>By email: <a href="mailto:nandmonlinellc@gmail.com" className="text-blue-600 hover:underline">nandmonlinellc@gmail.com</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
