import { Navigate, Outlet } from "react-router-dom";
import React from "react";

export const ProtectedRoute = ({ allowedRoles, user }) => {
  if (!user) return <Navigate to="/login" />;

  if (allowedRoles.includes(user.role)) {
    return <Outlet />;
  } else {
    return <Navigate to="/forbidden" />;
  }
};
