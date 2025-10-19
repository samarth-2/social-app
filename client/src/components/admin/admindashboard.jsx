import { useState } from "react";
import ManageComment from "./atoms/manageComment";
import ManagePermission from "./atoms/managePermission";
import ManagePost from "./atoms/managePost";
import ManageRole from "./atoms/manageRole";
import ManageUser from "./atoms/manageUser";


export default function AdminDashboard() {
  const [item, setItem] = useState("");

  const menuItems = [
    { id: "role", label: "Roles" },
    { id: "permission", label: "Permissions" },
    { id: "user", label: "Users" },
  ];

  return (
    <div className="flex h-[calc(100vh-160px)] overflow-hidden gap-5">
      <div className="w-1/6 rounded-lg bg-white shadow overflow-y-auto flex flex-col py-6">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">
          Manage
        </h2>

        <div className="flex flex-col">
          {menuItems.map((menu) => (
            <button
              key={menu.id}
              onClick={() => setItem(menu.id)}
              className={`text-left px-5 py-3 text-gray-600 font-medium transition-all
                hover:bg-blue-50 hover:text-blue-700
                ${
                  item === menu.id
                    ? "border-r-4 border-blue-600 bg-blue-50 text-blue-700"
                    : "border-r-4 border-transparent"
                }
              `}
            >
              {menu.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col rounded-lg bg-white shadow overflow-y-auto p-6">
        {item=="role" && <ManageRole/>}
        {item=="permission" && <ManagePermission/>}
        {item=="user" && <ManageUser/>}
      </div>
    </div>
  );
}
