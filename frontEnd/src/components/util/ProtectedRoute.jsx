import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ allowedRoles, user }) => {
  if (!user) return <Navigate to="/unauthorized" />;

  if (allowedRoles.includes(user.role)) {
    return <Outlet />;
  } else {
    return <Navigate to="/forbidden" />;
  }
};
