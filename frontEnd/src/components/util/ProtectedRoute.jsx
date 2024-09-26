import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ allowedRoles, userRole }) => {
  if (allowedRoles.includes(userRole)) {
    return <Outlet />;
  } else {
    return <Navigate to="/unauthorized" />;
  }
};
