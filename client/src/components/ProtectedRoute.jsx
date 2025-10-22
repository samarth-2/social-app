import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setAuth, clearAuth } from "../redux/slice/authSlice";

export default function ProtectedRoute() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (storedToken && storedUser) {
        try {
          const decoded = jwtDecode(storedToken);
          if (decoded.exp > Date.now() / 1000) {
            dispatch(setAuth({ user: JSON.parse(storedUser), token: storedToken }));
          } else {
            dispatch(clearAuth());
          }
        } catch {
         dispatch(clearAuth());
        }
      }
    }
  }, [token, dispatch]);

  const isAuthPage = ["/signin", "/signup"].includes(location.pathname);
  const isAdminPage = ["/admin", "/admin/dashboard"].includes(location.pathname);

  if (!token) {
    return isAuthPage ? <Outlet /> : <Navigate to="/signin" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.exp < Date.now() / 1000) {
      dispatch(clearAuth());
      return <Navigate to="/signin" replace />;
    }


    if (isAuthPage) {
      return <Navigate to="/" replace />;
    }

    if (isAdminPage && user?.roleName !== "admin") {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch {
    dispatch(clearAuth());
    return <Navigate to="/signin" replace />;
  }
}
