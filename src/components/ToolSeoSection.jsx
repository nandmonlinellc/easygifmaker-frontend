import React from 'react';

const ToolSeoSection = ({ 
  icon: Icon, 
  title, 
  description1, 
  description2, 
  features1, 
  features2, 
  useCases 
}) => {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white rounded-3xl shadow-2xl p-8 mb-8 mt-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <Icon size={40} className="text-white drop-shadow" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-2xl sm:text-xl">{title}</h1>
        </div>
        <p className="text-lg font-medium mb-4 leading-relaxed text-white/90">
          {description1}
        </p>
        <p className="text-base mb-6 leading-relaxed">
          {description2}
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <ul className="space-y-3">
            {features1.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <span className="text-2xl">{feature.emoji}</span>
                <span className="text-base">{feature.text}</span>
              </li>
            ))}
          </ul>
          <ul className="space-y-3">
            {features2.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <span className="text-2xl">{feature.emoji}</span>
                <span className="text-base">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="font-bold text-lg mb-3">Popular Use Cases:</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {useCases.map((useCase, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className={`w-2 h-2 ${useCase.color} rounded-full`}></span>
                <span>{useCase.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolSeoSection; 