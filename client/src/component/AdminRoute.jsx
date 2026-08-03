import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function AdminRoute() {
  const token = localStorage.getItem('token');
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    user = null;
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Outlet />
      {/* children routes */}
    </div>
  );
}

export default AdminRoute;
