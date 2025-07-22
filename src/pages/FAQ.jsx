import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function FAQ() {
  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100">
      <Helmet>
        <title>FAQ | EasyGIFMaker Frequently Asked Questions</title>
        <meta name="description" content="Find answers to common questions about EasyGIFMaker's GIF and video editing tools, features, and troubleshooting." />
        <link rel="canonical" href="https://easygifmaker.com/faq" />
      </Helmet>
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-8 text-center">Frequently Asked Questions</h1>
        
        <div className="space-y-8 text-gray-800">
          {/* General Questions */}
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">General Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Is EasyGIFMaker really free to use?</h3>
                <p className="text-gray-700 mt-1">Yes, all our tools are 100% free. We support our service through on-site advertising, which allows us to keep everything accessible to you without any charges.</p>
              </div>
              <div>
                <h3 className="font-semibold">Do I need to create an account?</h3>
                <p className="text-gray-700 mt-1">No, you can use all our tools without signing up. Just upload your file and start creating right away.</p>
              </div>
              <div>
                <h3 className="font-semibold">What is the maximum file size I can upload?</h3>
                <p className="text-gray-700 mt-1">You can upload files up to 200MB. This allows for high-quality video and image processing.</p>
              </div>
              <div>
                <h3 className="font-semibold">What file formats do you support?</h3>
                <p className="text-gray-700 mt-1">We support a wide range of formats! For videos, we accept MP4, WebM, AVI, MOV, and more. For images, we support GIF, JPG, PNG, WebP, and many others. Each tool page lists the specific formats it supports.</p>
              </div>
              <div>
                <h3 className="font-semibold">Can I use EasyGIFMaker on my phone or tablet?</h3>
                <p className="text-gray-700 mt-1">Absolutely! Our website is fully responsive and designed to work seamlessly on all modern devices, including desktops, tablets, and smartphones.</p>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">Privacy & Security</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Are my uploaded files safe? Do you store them?</h3>
                <p className="text-gray-700 mt-1">Your privacy and security are our top priorities. We do not store, view, or share your files. All uploaded files are processed securely and are automatically and permanently deleted from our servers within a few hours. You can read more in our <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.</p>
              </div>
            </div>
          </div>

          {/* Tool-Specific Questions */}
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">Tool-Specific Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Can I convert a video from a URL like YouTube?</h3>
                <p className="text-gray-700 mt-1">Yes! Our Video to GIF tool supports URLs from popular sites. Just paste the video URL, and our tool will fetch it for you to edit.</p>
              </div>
              <div>
                <h3 className="font-semibold">I converted a video, but the GIF has no sound. Why?</h3>
                <p className="text-gray-700 mt-1">The GIF file format does not support audio. However, our Video to GIF tool gives you the option to "Include Audio," which will generate a downloadable MP4 file with sound in addition to your GIF. If the original video has no audio, only a GIF will be created.</p>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">Troubleshooting</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">My file upload failed. What should I do?</h3>
                <p className="text-gray-700 mt-1">Please check that your file is under the 200MB size limit and is one of our supported formats. A slow or unstable internet connection can also cause issues. Try uploading the file again, and if the problem persists, feel free to <Link to="/contact" className="text-blue-600 hover:underline">contact us</Link>.</p>
              </div>
              <div>
                <h3 className="font-semibold">I have another question. How can I get in touch?</h3>
                <p className="text-gray-700 mt-1">We'd love to hear from you! For any other questions, feedback, or support, please visit our <Link to="/contact" className="text-blue-600 hover:underline">Contact</Link> page.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
