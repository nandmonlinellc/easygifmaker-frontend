import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const EzoicAd = ({ placeholderId }) => {
  const location = useLocation();

  useEffect(() => {
    try {
      if (typeof window.ezstandalone?.showAds === 'function') {
        window.ezstandalone.cmd.push(function () {
          const placeholder = document.getElementById(`ezoic-pub-ad-placeholder-${placeholderId}`);
          if (placeholder) {
            window.ezstandalone.showAds(placeholderId);
          }
        });
      }
    } catch (error) {
      // Ezoic ad error
    }
  }, [location.pathname, placeholderId]); // Reload ad on path change

  return <div id={`ezoic-pub-ad-placeholder-${placeholderId}`} />;
};

export default EzoicAd;