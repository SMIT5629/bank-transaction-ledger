import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from './Layout';

const ProtectedRoute = ({
  isAuthenticated,
  userRole,
  allowedRoles,
  onLogout,
  children,
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout userRole={userRole} onLogout={onLogout}>
      {children}
    </Layout>
  );
};

export default ProtectedRoute;
