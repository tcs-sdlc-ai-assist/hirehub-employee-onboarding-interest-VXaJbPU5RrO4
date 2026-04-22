import React from 'react';
import PropTypes from 'prop-types';
import { isAdminAuthenticated } from '../utils/auth';
import AdminLogin from '../pages/AdminLogin';

function ProtectedRoute({ children }) {
  const isAuthenticated = isAdminAuthenticated();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;