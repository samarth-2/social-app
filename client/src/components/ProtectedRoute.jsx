import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAuthPage = ["/signin", "/signup"].includes(location.pathname);

  if (!token) {
    return isAuthPage ? <Outlet /> : <Navigate to="/signin" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      return <Navigate to="/signin" replace />;
    }
    if (isAuthPage) {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/signin" replace />;
  }
}
