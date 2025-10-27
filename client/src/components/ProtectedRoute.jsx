import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setAuth, clearAuth } from "../redux/slice/authSlice";
import { authAxios } from "../api/axios";

export default function ProtectedRoute() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await authAxios.get("/user/check-auth", { withCredentials: true });
        if (res.data?.user) {
          dispatch(setAuth({ user: res.data.user }));
        } else {
          dispatch(clearAuth());
        }
      } catch {
        dispatch(clearAuth());
      } finally {
        setCheckingAuth(false);
      }
    };
    verifyAuth();
  }, [dispatch]);

  if (checkingAuth) return null;

  const isAuthPage = ["/signin", "/signup"].includes(location.pathname);
  const isAdminPage = ["/admin", "/admin/dashboard"].includes(location.pathname);

  if (!user) {
    return isAuthPage ? <Outlet /> : <Navigate to="/signin" replace />;
  }

  if (isAuthPage) {
    return <Navigate to="/" replace />;
  }

  if (isAdminPage && user?.roleName !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
