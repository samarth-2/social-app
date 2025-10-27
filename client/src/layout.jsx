import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, UserCircle } from "lucide-react";
import SocketEventHandler from "./utils/socketEventsHandler";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "./redux/slice/authSlice";
import { authAxios } from "./api/axios";

export default function Layout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await authAxios.post("/user/logout");
    } catch (e) {
    }
    dispatch(clearAuth());
    if (location.pathname !== "/signin") navigate("/signin");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SocketEventHandler/>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <nav className="flex sticky top-0 z-50 p-4 bg-white shadow gap-6 justify-between items-center">
        <div className="flex gap-6">
          <Link to="/" className="text-blue-600 hover:underline font-semibold">
            Social App
          </Link>
          {isLoggedIn && <div>Hi, {user.username}</div>}
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <div>
                <Link
                  to="/chat"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Chat
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/signin"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <UserCircle className="w-6 h-6" />
              Sign In
            </Link>
          )}
        </div>
      </nav>

      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>

      <footer className="bg-gray-200 text-center p-4">
        Social App
      </footer>
    </div>
  );
}
