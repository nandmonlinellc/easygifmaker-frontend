import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4" aria-label="Terms of Service">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100">
      <Helmet>
        <title>Terms of Service | EasyGIFMaker</title>
        <meta name="description" content="Read the Terms of Service for EasyGIFMaker. Understand the rules and guidelines for using our online GIF and video editing tools." />
        <link rel="canonical" href="https://easygifmaker.com/terms" />
      </Helmet>
        <header aria-label="Terms Header">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-4">Terms of Service</h1>
          <p className="text-gray-500 mb-6">Last updated: October 26, 2023</p>
        </header>
        <section className="space-y-8 text-gray-800" aria-label="Terms Content">
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">1. Use of Our Service</h2>
            <p>
              EasyGIFMaker provides a suite of online tools for creating and editing GIFs and videos. You agree to use our Service only for lawful purposes and in accordance with these Terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">2. User Conduct and Responsibilities</h2>
            <p>You are solely responsible for the content you upload, edit, and create using our Service. You agree not to use the Service to create, upload, or share any content that:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Infringes on any third party's copyright, patent, trademark, or other intellectual property rights.</li>
              <li>Is illegal, hateful, defamatory, obscene, or discriminatory.</li>
              <li>Contains viruses, malware, or any other harmful code.</li>
              <li>Violates any applicable local, state, national, or international law.</li>
            </ul>
            <p className="mt-2">We reserve the right to terminate your access to the Service for violating these rules.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">3. Intellectual Property</h2>
            <p>
              You retain all ownership rights to the content you upload to our Service. We do not claim any ownership of your files. Our Service, including our name, logo, and the content on our website (excluding user-uploaded content), is the property of EasyGIFMaker and is protected by copyright and trademark laws.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">4. Disclaimer of Warranties</h2>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, that the Service will be uninterrupted, error-free, or secure. We disclaim all warranties, including but not limited to, warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, EasyGIFMaker shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">6. Privacy</h2>
            <p>
              Your privacy is important to us. Our <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link> explains how we collect, use, and protect your information. By using our Service, you agree to the terms of our Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">8. Contact Us</h2>
            <p>If you have any questions about these Terms, please <Link to="/contact" className="text-blue-600 hover:underline">contact us</Link>.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
