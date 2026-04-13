// src/components/Report.jsx
import React, { useEffect } from 'react';
import './Report.css';

const Report = ({ show, onClose, children }) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="report-overlay" onClick={onClose}>
      <div className="report-content" onClick={(e) => e.stopPropagation()}>
        <button className="report-close" onClick={onClose}>
          &times;
        </button>
        <div className="report-body">{children}</div>
      </div>
    </div>
  );
};

export default Report;
