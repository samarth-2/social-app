import { NavLink } from "react-router-dom";

export default function LeftSidebar() {
  const links = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/profile", label: "Profile", icon: "👤" },
    { to: "/chat", label: "Chat", icon: "💬" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-6 sticky top-6 h-fit">
      <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md transition ${
                isActive ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-100"
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
