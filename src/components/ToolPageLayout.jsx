import React from 'react';
import { Helmet } from 'react-helmet-async';

const ToolPageLayout = ({
  title,
  description,
  icon: Icon,
  seoProps,
  children
}) => {
  return (
    <>
      <Helmet>
        <title>{seoProps.title}</title>
        <meta name="description" content={seoProps.description} />
        <meta name="keywords" content={seoProps.keywords} />
        <link rel="canonical" href={seoProps.canonical} />
      </Helmet>
      
      <div className="min-h-[60vh] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-7xl bg-white/90 rounded-3xl shadow-xl p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Icon size={40} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 tracking-tight">
                {title}
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {description}
            </p>
          </div>

          {/* Tool-specific content */}
          {children}
        </div>
      </div>
    </>
  );
};

export default ToolPageLayout;
