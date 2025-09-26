import React from 'react';
import AdsenseAd from './AdsenseAd'; // Import the ad component

const EnhancedTipsSection = ({
  title,
  tips = [],
  highlights = [],
  insights = []
}) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-gradient-to-r from-blue-500 to-purple-500'
  ];

  const bulletItems = tips.length ? tips : insights;

  return (
    <div className="mt-8 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm rounded-2xl p-6">
      <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3 md:text-lg sm:text-base">
        <span className="text-2xl">💡</span>
        {title}
      </h4>
      {highlights.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          {highlights.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="bg-white/70 dark:bg-white/10 border border-white/40 rounded-xl p-4 shadow-sm backdrop-blur-sm"
            >
              <p className="text-xs uppercase tracking-wide text-indigo-500 font-semibold mb-2">
                {item.label}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {bulletItems.length > 0 && (
        <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
          {bulletItems.map((tip, index) => (
            <React.Fragment key={index}>
              <li className="flex items-start gap-3">
                <span className={`w-2 h-2 ${colors[index % colors.length]} rounded-full mt-2 flex-shrink-0`}></span>
                <div dangerouslySetInnerHTML={{ __html: tip }}></div>
              </li>
              {index === 1 && (
                <li>
                  <AdsenseAd adSlot="8336674411" adFormat="fluid" adLayout="in-article" />
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EnhancedTipsSection; 
