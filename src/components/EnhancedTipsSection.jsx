import React from 'react';

const EnhancedTipsSection = ({ 
  title, 
  tips 
}) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-gradient-to-r from-blue-500 to-purple-500'
  ];

  return (
    <div className="mt-8 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6">
      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-3">
        <span className="text-2xl">💡</span>
        {title}
      </h4>
      <ul className="space-y-3 text-sm text-gray-700">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className={`w-2 h-2 ${colors[index % colors.length]} rounded-full mt-2 flex-shrink-0`}></span>
            <div dangerouslySetInnerHTML={{ __html: tip }}></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EnhancedTipsSection; 