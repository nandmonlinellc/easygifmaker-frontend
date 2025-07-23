import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Upload, Edit3, Download, HelpCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Help() {
  const gettingStartedSteps = [
    {
      icon: <Upload className="h-8 w-8 text-blue-600" />,
      title: '1. Upload Your File',
      description: 'Click "Choose File" on any tool page to upload a video or image from your device. You can also paste a URL from sites like YouTube.'
    },
    {
      icon: <Edit3 className="h-8 w-8 text-green-600" />,
      title: '2. Edit & Customize',
      description: 'Use our interactive tools to trim your video, crop your GIF, add text, or adjust settings like frame rate and quality. See your changes in the live preview.'
    },
    {
      icon: <Download className="h-8 w-8 text-purple-600" />,
      title: '3. Download & Share',
      description: 'Once you are happy with your creation, click the "Convert" or "Apply" button. Your new GIF will be generated in seconds, ready for you to download and share.'
    }
  ];

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100">
      <Helmet>
        <title>Help & Support | EasyGIFMaker</title>
        <meta name="description" content="Get help and support for using EasyGIFMaker's GIF and video editing tools. Find step-by-step guides and troubleshooting tips." />
        <link rel="canonical" href="https://easygifmaker.com/help" />
      </Helmet>

        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">Help & Support</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Welcome to EasyGIFMaker! Here’s a quick guide to get you started. If you have more questions, check out our FAQ or contact us directly.
          </p>
        </div>

        <div className="my-12">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">Getting Started in 3 Easy Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gettingStartedSteps.map((step, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-center items-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <HelpCircle className="h-10 w-10 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Have More Questions?</h3>
            <p className="text-gray-700 mb-4">
              Our FAQ page has detailed answers to common questions about file formats, privacy, and tool features.
            </p>
            <Button asChild>
              <Link to="/faq">Visit FAQ</Link>
            </Button>
          </div>
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <Mail className="h-10 w-10 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Need Direct Support?</h3>
            <p className="text-gray-700 mb-4">
              Can't find the answer you're looking for? Our support team is here to help. Get in touch with us.
            </p>
            <Button asChild variant="secondary">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
