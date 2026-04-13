import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RibbonForm from './RibbonForm';
import UserForm from './UserForm';
import MainLayout from './MainLayout';
import Dashboard from './Dashboard';
import RepClerk from './RepClerk';
import ReviewDN from './ReviewDN';
import PrintDN from './PrintDN';
import UserManagement from './UserManagement';
import EmailSettings from './EmailSettings';
import UpdateStatusForm from './UpdateStatusForm';

import { LoaderProvider } from './LoaderContext';
import GlobalLoader from './GlobalLoader';

function App() {
  const isAuthenticated = true; // You can update logic as needed

  return (
    <LoaderProvider>
      <Router>
        <GlobalLoader /> {/* Shows loader globally */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          {isAuthenticated ? (
            <Route path="/" element={<MainLayout />}>
              <Route path="form" element={<RibbonForm />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="create-user" element={<UserForm />} />
              <Route path="RepClerk" element={<RepClerk />} />
              <Route path="ReviewDN" element={<ReviewDN />} />
              <Route path="PrintDN" element={<PrintDN />} />
              <Route path="Users" element={<UserManagement />} />
              <Route path="EmailSettings" element={<EmailSettings />} />
              <Route path="UpdateStatus" element={<UpdateStatusForm />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/" />} />
          )}
        </Routes>
      </Router>
    </LoaderProvider>
  );
}

export default App;
