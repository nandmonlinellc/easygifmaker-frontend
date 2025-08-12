import React from 'react';

export default function FeatureCard({ icon, title, description, bgColor = 'bg-gray-100', children }) {
  return (
    <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className={`flex justify-center items-center mb-4 w-12 h-12 rounded-lg ${bgColor}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 md:text-lg sm:text-base">{title}</h3>
      <p className="text-gray-600 dark:text-gray-200 text-base md:text-sm">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
} 