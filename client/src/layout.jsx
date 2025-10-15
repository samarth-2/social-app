import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, UserCircle } from "lucide-react";
import {jwtDecode} from "jwt-decode";

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp > now) {
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    } catch (err) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/signin");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="flex sticky top-0 z-50 p-4 bg-white shadow gap-6 justify-between items-center">
        <div className="flex gap-6">
          <Link to="/" className="text-blue-600 hover:underline font-semibold">
            Social App
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          ) : (
            <Link
              to="/signin"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <UserCircle className="w-6 h-6" />
              Signin
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
