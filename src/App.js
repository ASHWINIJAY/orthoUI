import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

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
import SysproLogs from './SysproLogs';

import { LoaderProvider } from './LoaderContext';
import GlobalLoader from './GlobalLoader';

function App() {
  const isAuthenticated = true; // Replace with actual auth check

  return (
    <LoaderProvider>
      <HashRouter>
        <GlobalLoader />

        <Routes>
          {/* Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          {isAuthenticated ? (
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="form" element={<RibbonForm />} />
              <Route path="create-user" element={<UserForm />} />
              <Route path="RepClerk" element={<RepClerk />} />
              <Route path="ReviewDN" element={<ReviewDN />} />
              <Route path="PrintDN" element={<PrintDN />} />
              <Route path="Users" element={<UserManagement />} />
              <Route path="EmailSettings" element={<EmailSettings />} />
              <Route path="UpdateStatus" element={<UpdateStatusForm />} />
              <Route path="SysproLogs" element={<SysproLogs />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </HashRouter>
    </LoaderProvider>
  );
}

export default App;