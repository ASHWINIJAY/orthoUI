import React, { useEffect, useState } from 'react';
import {
  FaHome, FaSignOutAlt, FaCapsules,
  FaClinicMedical, FaUserShield, FaCheckDouble, FaBars, FaSyncAlt
} from 'react-icons/fa';
import './TopNavbar.css'; // Ensure this path matches your file structure

function TopNavbar({ onNavigate }) {
  const [role, setRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem('roles')?.toLowerCase();
    setRole(storedRole);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigate = (label, path) => {
    onNavigate(label, path);
    setIsMenuOpen(false); // Close menu on mobile after click
  };

  return (
    <nav className="top-navbar">
      <div className="navbar-header">
        <button className="hamburger-btn" onClick={toggleMenu}>
          <FaBars />
        </button>
      </div>
      <div className={`nav-buttons ${isMenuOpen ? 'open' : ''}`}>
        <button onClick={() => handleNavigate('Dashboard', '/dashboard')}>
          <FaHome className="icon" /> Dashboard
        </button>

        {role === 'rep' && (
          <button onClick={() => handleNavigate('Rep', '/form')}>
            <FaCapsules className="icon" /> Rep
          </button>
        )}

        {role === 'repclerk' && (
          <button onClick={() => handleNavigate('Receiving Clerk', '/RepClerk')}>
            <FaClinicMedical className="icon" /> Receiving Clerk
          </button>
        )}

        {role !== 'rep' && role !== 'repclerk' && (
          <>
            <button onClick={() => handleNavigate('Rep', '/form')}>
              <FaCapsules className="icon" /> Rep
            </button>
            <button onClick={() => handleNavigate('Receiving Clerk', '/RepClerk')}>
              <FaClinicMedical className="icon" /> Receiving Clerk
            </button>
            <button onClick={() => handleNavigate('Review DN', '/ReviewDN')}>
              <FaCheckDouble className="icon" /> Review DN
            </button>
            <button onClick={() => handleNavigate('Create User', '/create-user')}>
              <FaUserShield className="icon" /> Administration
            </button>
            <button onClick={() => handleNavigate('Update Status', '/UpdateStatus')}>
              <FaSyncAlt className="icon" /> Update Status
            </button>
          </>
        )}

        <button onClick={() => window.location.href = '/'}>
          <FaSignOutAlt className="icon" /> Sign Out
        </button>
      </div>
    </nav>
  );
}

export default TopNavbar;
