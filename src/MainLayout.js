import React, { useState,useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import './MainLayout.css';

function MainLayout() {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState([{ label: 'Home', path: '/dashboard' }]);
  const [activeTab, setActiveTab] = useState('/dashboard');
  useEffect(() => {
    const token = localStorage.getItem("jwt_token"); // or sessionStorage
    if (!token) {
      navigate("/login"); 
    }
  }, [navigate]);
  const openTab = (label, path) => {
    if (!tabs.some(tab => tab.path === path)) {
      setTabs([...tabs, { label, path }]);
    }
    setActiveTab(path);
    navigate(path);
  };

  const closeTab = (pathToClose) => {
    const updatedTabs = tabs.filter(tab => tab.path !== pathToClose);
    setTabs(updatedTabs);
    if (activeTab === pathToClose && updatedTabs.length > 0) {
      setActiveTab(updatedTabs[0].path);
      navigate(updatedTabs[0].path);
    }
  };
 
  return (
    <div className="main-layout" style={{ flexDirection: 'column', height: '100vh' }}>
      <TopNavbar onNavigate={openTab} />
      <div className="tabs" style={{ backgroundColor: '#dee2e6', display: 'flex', padding: '0rem' }}>
        {tabs.map(tab => (
          <div
            key={tab.path}
            className={`tab ${activeTab === tab.path ? 'active' : ''}`}
            onClick={() => openTab(tab.label, tab.path)}
            style={{ cursor: 'pointer', marginRight: 5, padding: '8px 16px', borderRadius: '6px 6px 0 0', backgroundColor: activeTab === tab.path ? '#fff' : '#ced4da', color: activeTab === tab.path ? '#007bff' : '#343a40', fontWeight: activeTab === tab.path ? 'bold' : '500', border: activeTab === tab.path ? '1px solid #ccc' : 'none', borderBottom: activeTab === tab.path ? 'none' : '' }}
          >
            {tab.label} <span onClick={(e) => { e.stopPropagation(); closeTab(tab.path); }} style={{ marginLeft: 8, color: '#dc3545', cursor: 'pointer' }}>✕</span>
          </div>
        ))}
      </div>
      <div className="tab-content" style={{ flex: 1, padding: '1rem', overflowY: 'auto', backgroundColor: '#fff', border: '1px solid #ccc', borderTop: 'none' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
