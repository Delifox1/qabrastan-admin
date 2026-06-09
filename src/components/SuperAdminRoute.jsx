import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SuperAdminRoute({
  children,
}) {
  const { user } = useAuth();

  if (!user) {
    return (
      <Navigate
        to="/login"
      />
    );
  }

  if (
    user.role !==
    "super_admin"
  ) {
    return (
      <Navigate
        to="/"
      />
    );
  }

  return children;
}

export default SuperAdminRoute;