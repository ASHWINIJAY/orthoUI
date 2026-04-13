import React, { useEffect, useState } from 'react';
import {
  FaHome, FaSignOutAlt, FaCapsules,FaChevronDown,
  FaClinicMedical, FaUserShield, FaCheckDouble, FaBars, FaPrint, FaUserEdit, FaMailchimp, FaSyncAlt
} from 'react-icons/fa';
import './TopNavbar.css';

function TopNavbar({ onNavigate }) {
  const [role, setRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem('roles')?.toLowerCase();
    setRole(storedRole);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

const toggleAdminMenu = () => {
  setIsAdminMenuOpen(prev => !prev);
};
  const handleSignOut = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('roles');
    // optionally clear other session values here
    onNavigate('Login', '/login');
  };
  const handleNavigate = (label, path) => {
    onNavigate(label, path);
    setIsMenuOpen(false);        // Close the mobile menu
    setIsAdminMenuOpen(false);   // Close the admin dropdown menu
  };

  return (
    <nav className="top-navbar">
      <div className="navbar-header">
        <button className="hamburger-btn" onClick={toggleMenu}>
          <FaBars />
        </button>
      </div>
      <div className={`nav-buttons ${isMenuOpen ? 'open' : ''}`}>
        {/* <button onClick={() => handleNavigate('Dashboard', '/dashboard')}>
          <FaHome className="icon" /> Dashboard
        </button> */}

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
            <button onClick={() => handleNavigate('View Orders Processed', '/ReviewDN')}>
              <FaCheckDouble className="icon" /> View Orders Processed
            </button>
            
            {/* Admin Dropdown */}
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={toggleAdminMenu}>
        <FaChevronDown className="icon" /> Admin
      </button>
      {isAdminMenuOpen && (
        <div className="dropdown-menu">
          <button onClick={() => handleNavigate('Create User', '/create-user')}>
            <FaUserShield className="icon" /> User Creation
          </button>
          <hr className="dropdown-divider" />
          <button onClick={() => handleNavigate('User Management', '/Users')}>
            <FaUserEdit className="icon" /> User Management
          </button>
          <hr className="dropdown-divider" />
          <button onClick={() => handleNavigate('Update Status', '/UpdateStatus')}>
            <FaSyncAlt className="icon" /> Update Status
          </button>
          <hr className="dropdown-divider" />
          <button onClick={() => handleNavigate('Email Setting', '/EmailSettings')}>
            <FaMailchimp className="icon" /> Email Setting
          </button>
        </div>
      )}
    </div>
          </>
        )}
<button onClick={() => handleNavigate('Print', '/PrintDN')}>
              <FaPrint className="icon" /> Print
            </button>
<button onClick={handleSignOut}>
  <FaSignOutAlt className="icon" /> Sign Out
</button>
      </div>
    </nav>
  );
}

export default TopNavbar;
