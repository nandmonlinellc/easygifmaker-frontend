import React from 'react'
import { Lightbulb, HelpCircle, BookOpen } from 'lucide-react'

export default function TipsFaqsBestPracticesSection({ 
  title = "Tips, FAQs & Best Practices",
  proTips = [],
  faqs = [],
  relatedResources = []
}) {
  
  // Default tips if none provided
  const defaultTips = [
    {
      color: "bg-blue-500",
      text: "Start with recommended settings for best results."
    },
    {
      color: "bg-green-500", 
      text: "Test different options to find what works best for your needs."
    },
    {
      color: "bg-purple-500",
      text: "Consider your target platform when choosing settings."
    },
    {
      color: "bg-orange-500",
      text: "Always preview your results before finalizing."
    }
  ]

  const defaultFaqs = [
    {
      question: "What file formats are supported?",
      answer: "We support GIF, MP4, and most common image formats."
    },
    {
      question: "Is there a file size limit?",
      answer: "Yes, please keep files under 50MB for optimal performance."
    },
    {
      question: "How long does processing take?",
      answer: "Usually 30 seconds to 2 minutes depending on file size and complexity."
    },
    {
      question: "Can I use this tool for any GIF?",
      answer: "Yes, our tool works with all GIF files regardless of size or complexity."
    }
  ]

  const defaultResources = [
    {
      href: "/blog/how-to-make-gifs-from-videos",
      icon: "📹",
      text: "How to Make GIFs from Videos"
    },
    {
      href: "/blog/top-5-gif-optimization-tips", 
      icon: "⚡",
      text: "Top 5 GIF Optimization Tips"
    }
  ]

  // Use provided data or defaults
  const tips = proTips.length > 0 ? proTips : defaultTips
  const questions = faqs.length > 0 ? faqs : defaultFaqs
  const resources = relatedResources.length > 0 ? relatedResources : defaultResources

  return (
    <section className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-6 flex items-center gap-3 ">
        <span className="text-2xl">💡</span>
        {title}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pro Tips */}
        <div className="space-y-4">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4">
            <h3 className="font-semibold text-black dark:text-white mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              Pro Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className={`w-3 h-3 ${tip.color} rounded-full mt-2 flex-shrink-0 flex items-center justify-center`}><span className="text-white text-xs font-bold">•</span></span>
                  <span>{tip.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4">
            <h3 className="font-semibold text-black dark:text-white mb-2 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              Frequently Asked Questions
            </h3>
            <ul className="space-y-3 text-sm text-gray-800 dark:text-gray-200 ">
              {questions.map((faq, index) => (
                <li key={index}>
                  <strong className="text-black dark:text-white">{faq.question}</strong>
                  <p className="mt-1">{faq.answer}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Related Resources */}
      <div className="mt-6 bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-gray-800/70 dark:to-gray-900/70 backdrop-blur-sm rounded-2xl p-4">
        <h3 className="font-semibold text-black dark:text-white mb-2 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-purple-600" />
          Related Resources
        </h3>
        <div className="flex flex-wrap gap-3">
          {resources.map((resource, index) => (
            <a 
              key={index}
              href={resource.href} 
              className="inline-flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-full text-sm text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-400 transition-colors"
            >
              <span>{resource.icon}</span>
              {resource.text}
            </a>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .mobile-white-text { color: #fff !important; }
        }
      `}</style>
    </section>
  )
} 