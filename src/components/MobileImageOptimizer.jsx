import React, { useState, useEffect } from 'react';

// Hook to detect mobile devices and optimize images
export const useMobileImageOptimization = () => {
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

// Optimized image component for mobile
export const MobileOptimizedImage = ({ 
  src, 
  alt, 
  mobileSrc, 
  className = "",
  priority = false,
  ...props 
}) => {
  const { isMobile, isLowBandwidth } = useMobileImageOptimization();
  
  const imageSrc = isMobile && mobileSrc ? mobileSrc : src;
  const loading = priority ? 'eager' : (isLowBandwidth ? 'lazy' : 'eager');
  
  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      loading={loading}
      decoding="async"
      className={`${className} ${isMobile ? 'mobile-optimized' : ''}`}
      {...props}
    />
  );
};

// Preload critical images for mobile
export const PreloadCriticalImages = () => {
  const { isMobile } = useMobileImageOptimization();
  
  if (!isMobile) return null;
  
  return (
    <>
      <link rel="preload" as="image" href="/hero-mobile.webp" />
      <link rel="preload" as="image" href="/logo-mobile.webp" />
    </>
  );
};
