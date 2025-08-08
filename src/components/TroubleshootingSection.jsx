import React from 'react'
import { AlertTriangle, Lightbulb } from 'lucide-react'

export default function TroubleshootingSection({ 
  title = "Troubleshooting",
  commonIssues = [],
  quickFixes = []
}) {
  
  // Default issues if none provided
  const defaultIssues = [
    {
      color: "bg-yellow-500",
      text: "If you're experiencing issues, try refreshing the page and uploading your file again."
    },
    {
      color: "bg-orange-500", 
      text: "Check that your file format is supported and the file size is within limits."
    },
    {
      color: "bg-red-500",
      text: "Still having issues? Contact us for help.",
      link: "/contact"
    }
  ]

  const defaultFixes = [
    {
      icon: "🔧",
      text: "Try different settings for optimal results"
    },
    {
      icon: "📏", 
      text: "Check file dimensions and format requirements"
    },
    {
      icon: "⚡",
      text: "Ensure stable internet connection for uploads"
    }
  ]

  // Use provided data or defaults
  const issues = commonIssues.length > 0 ? commonIssues : defaultIssues
  const fixes = quickFixes.length > 0 ? quickFixes : defaultFixes

  return (
    <section className="bg-gradient-to-br from-yellow-50/80 to-orange-50/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-6 flex items-center gap-3 mobile-white-text">
        <span className="text-2xl">🔧</span>
        {title}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Common Issues & Solutions */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            Common Issues & Solutions
          </h3>
          <ul className="space-y-3 text-sm text-gray-800 dark:text-gray-200 ">
            {issues.map((issue, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className={`w-3 h-3 ${issue.color} rounded-full mt-2 flex-shrink-0 flex items-center justify-center`}><span className="text-white text-xs font-bold">•</span></span>
                <div>
                  {issue.link ? (
                    <span>
                      {issue.text} <a href={issue.link} className="text-blue-600 hover:text-blue-800 underline">Contact us</a> for help.
                    </span>
                  ) : (
                    issue.text
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Fixes */}
        <div className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-gray-800/70 dark:to-gray-900/70 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="font-semibold text-black dark:text-white mb-3 flex items-center gap-2 mobile-white-text">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            Quick Fixes
          </h3>
          <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-200 mobile-white-text">
      <style>{`
        @media (max-width: 768px) {
          .mobile-white-text { color: #fff !important; }
        }
      `}</style>
            {fixes.map((fix, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-lg">{fix.icon}</span>
                <span>{fix.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
} 