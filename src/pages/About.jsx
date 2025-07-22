import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Zap, Shield, Smile, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function About() {
  const features = [
    {
      icon: <Gift className="h-8 w-8 text-blue-600" />,
      title: 'Comprehensive Tools',
      description: 'From video conversion to adding text, we provide a full suite of tools to bring your GIFs to life.'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: 'Privacy First',
      description: 'We never store your files. Everything you upload is processed securely and deleted automatically.'
    },
    {
      icon: <Smile className="h-8 w-8 text-purple-600" />,
      title: 'Simple & User-Friendly',
      description: 'Our tools are designed to be intuitive and easy to use for everyone, no technical skills required.'
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      title: 'Free & Fast',
      description: 'Enjoy unlimited access to all our tools for free, with fast processing and no watermarks.'
    }
  ];

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white py-12 px-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100">
        <Helmet>
          <title>About EasyGIFMaker | Our Mission and Story</title>
          <meta name="description" content="Learn about EasyGIFMaker's mission to provide the best free, private, and easy-to-use online tools for creating and editing GIFs." />
          <link rel="canonical" href="https://easygifmaker.com/about" />
        </Helmet>

        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">Making GIF Creation Easy for Everyone</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our mission is to provide the most powerful, intuitive, and privacy-respecting GIF tools on the web—completely free of charge.
          </p>
        </div>

        <div className="my-12 border-t border-b border-blue-100 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center items-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 text-gray-800 text-left">
          <h2 className="text-3xl font-bold text-blue-700 text-center">Our Story</h2>
          <p>
            EasyGIFMaker was born from a simple idea: creating and editing GIFs shouldn't be complicated or compromise your privacy. We saw a need for a tool that was as powerful as professional software but as easy to use as a social media app. We were tired of sites that were slow, covered in ads, or stored user files indefinitely.
          </p>
          <p>
            So, we built the solution we wanted to use. A platform where anyone can quickly convert a video, add a funny caption, or optimize a GIF for sharing, all without worrying about their data. We are committed to keeping our tools free, accessible on any device, and constantly improving them based on user feedback. For more details on our commitment to your privacy, please read our <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-6">
            Thousands of creators, marketers, and meme-lovers use EasyGIFMaker every day. Have an idea for a new feature or need help? We'd love to hear from you!
          </p>
          <Button asChild size="lg">
            <Link to="/contact">Get In Touch</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
