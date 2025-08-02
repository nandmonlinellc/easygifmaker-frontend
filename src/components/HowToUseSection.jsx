import React from 'react';

const HowToUseSection = ({ 
  title, 
  steps 
}) => {
  const gradientColors = [
    'from-blue-500 to-purple-500',
    'from-green-500 to-blue-500', 
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500'
  ];

  return (
    <section className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
        {title}
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {steps.slice(0, 2).map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`w-8 h-8 bg-gradient-to-r ${gradientColors[index]} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1`}>
                {index + 1}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {steps.slice(2, 4).map((step, index) => (
            <div key={index + 2} className="flex items-start gap-4">
              <div className={`w-8 h-8 bg-gradient-to-r ${gradientColors[index + 2]} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1`}>
                {index + 3}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUseSection; 