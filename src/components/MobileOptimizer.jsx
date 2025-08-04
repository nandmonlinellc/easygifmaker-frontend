import React, { useState, useEffect } from 'react';

// Hook to detect mobile devices and optimize rendering
export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Detect slow connections
      if ('connection' in navigator) {
        const connection = navigator.connection;
        setIsLowBandwidth(connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isLowBandwidth };
};

// Component to conditionally render optimized content
export const MobileOptimizedContent = ({ mobile, desktop, children }) => {
  const { isMobile } = useMobileOptimization();
  
  if (isMobile && mobile) {
    return mobile;
  }
  
  if (!isMobile && desktop) {
    return desktop;
  }
  
  return children;
};

// Optimized image component
export const OptimizedImage = ({ src, alt, mobileSrc, ...props }) => {
  const { isMobile, isLowBandwidth } = useMobileOptimization();
  
  const imageSrc = isMobile && mobileSrc ? mobileSrc : src;
  const loading = isLowBandwidth ? 'lazy' : 'eager';
  
  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      loading={loading}
      decoding="async"
      {...props}
    />
  );
};
