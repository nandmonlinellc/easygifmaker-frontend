import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function CookiePolicy() {
  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4" aria-label="Cookie Policy">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100">
      <Helmet>
        <title>Cookie Policy | EasyGIFMaker</title>
        <meta name="description" content="Read the Cookie Policy for EasyGIFMaker. Learn how we use cookies to enhance your experience with our GIF and video editing tools." />
        <link rel="canonical" href="https://easygifmaker.com/cookie-policy" />
      </Helmet>
        <header aria-label="Cookie Policy Header">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-4">Cookie Policy</h1>
          <p className="text-gray-500 mb-6">Last updated: October 26, 2023</p>
        </header>
        <section className="space-y-8 text-gray-800" aria-label="Cookie Policy Content">
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">1. What Are Cookies?</h2>
            <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">2. Why Do We Use Cookies?</h2>
            <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our website. Third parties serve cookies through our website for advertising, analytics, and other purposes.</p>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-1">Types of Cookies We Use:</h3>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                <strong>Strictly Necessary Cookies:</strong> These are essential for you to browse the website and use its features, such as accessing secure areas of the site.
              </li>
              <li>
                <strong>Performance and Analytics Cookies:</strong> These cookies collect information about how you use our website, like which pages you visited and which links you clicked on. This data is aggregated and anonymized, and is used to help us improve our services. We use Google Analytics for this purpose.
              </li>
              <li>
                <strong>Advertising Cookies:</strong> These cookies are used to make advertising messages more relevant to you. We partner with third-party advertising networks like Google AdSense and Ezoic, who may use cookies to collect information about your activities on this and other websites to provide you with targeted advertising.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">3. How Can You Control Cookies?</h2>
            <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your browser.</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                <strong>Browser Controls:</strong> You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.
              </li>
              <li>
                <strong>Opting Out of Targeted Advertising:</strong> To opt-out of interest-based advertising by our partners, you can visit:
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li><a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Digital Advertising Alliance (DAA)</a></li>
                  <li><a href="https://youradchoices.ca/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Digital Advertising Alliance of Canada (DAAC)</a></li>
                  <li><a href="http://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">European Interactive Digital Advertising Alliance (EDAA)</a></li>
                </ul>
              </li>
              <li>
                <strong>Google Ad Settings:</strong> You can opt out of personalized advertising from Google by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google's Ads Settings</a>.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">4. More Information</h2>
            <p>
              For more information about how we handle your data, please read our <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">5. Contact Us</h2>
            <p>If you have any questions about our use of cookies or other technologies, please email us at <a href="mailto:nandmonlinellc@gmail.com" className="text-blue-600 hover:underline">nandmonlinellc@gmail.com</a>.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
