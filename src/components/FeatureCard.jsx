import React from 'react';

export default function FeatureCard({ icon, title, description, bgColor }) {
  return (
    <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className={`flex justify-center items-center mb-4 w-12 h-12 rounded-lg ${bgColor}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
} 