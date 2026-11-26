import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRole: "ADMIN" | "CLUB";
}

export default function ProtectedRoute({
  allowedRole,
}: ProtectedRouteProps) {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    return (
      <Navigate
        to={role === "ADMIN" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return <Outlet />;
}