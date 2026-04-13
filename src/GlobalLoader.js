import React from 'react';
import { useLoader } from './LoaderContext';
import { Circles,CirclesWithBar } from 'react-loader-spinner'; // or your choice

import './GlobalLoader.css'; // for styling

const GlobalLoader = () => {
  const { loading } = useLoader();
// Disable mouse wheel changing number inputs globally
window.addEventListener('wheel', function(e) {
    if (document.activeElement.type === 'number') {
      e.preventDefault();
    }
  }, { passive: false });
  
  if (!loading) return null;

  return (
    <div className="global-loader-overlay">
      <CirclesWithBar
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="loading"
      />
    </div>
  );
};

export default GlobalLoader;
