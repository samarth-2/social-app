import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/signin" replace />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      return <Navigate to="/signin" replace />;
    }
  } catch {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
