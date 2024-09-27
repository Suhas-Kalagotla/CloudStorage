import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ allowedRoles, user }) => {
  let userRole = null;
  if (user) userRole = user.role;
  else <Navigate to="/forbidden" />;
  if (allowedRoles.includes(userRole)) {
    return <Outlet />;
  } else {
    return <Navigate to="/unauthorized" />;
  }
};
