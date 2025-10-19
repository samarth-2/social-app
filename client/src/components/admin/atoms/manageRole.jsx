import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchRoles,
  fetchPermissions,
  createRole,
  updateRole,
  deleteRole,
} from "../../../redux/slice/admin/roleSlice";

export default function ManageRole() {
  const dispatch = useDispatch();
  const { roles, permissions, loading } = useSelector((state) => state.admin.roles);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    permission_level: "#",
    permissions: [],
  });

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
  }, [dispatch]);

  const filtered = roles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        permission_level: role.permission_level,
        permissions: role.permissions.map((p) => p._id),
      });
    } else {
      setEditingRole(null);
      setFormData({ name: "", permission_level: "#", permissions: [] });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return alert("Role name required");
    const selectedPerms = permissions.filter((p) =>
      formData.permissions.includes(p._id)
    );

    const roleData = {
      ...formData,
      permissions: selectedPerms.map((p) => p._id),
    };

    if (editingRole) dispatch(updateRole({ _id: editingRole._id, ...roleData }));
    else dispatch(createRole(roleData));

    setShowModal(false);
  };

  const togglePermission = (id) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter((pid) => pid !== id)
        : [...prev.permissions, id],
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Manage Roles</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + New Role
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search roles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Permission Level</th>
              <th className="p-3 border-b">Permissions</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filtered.length ? (
              filtered.map((role) => (
                <tr key={role._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{role.name}</td>
                  <td className="p-3 border-b">
                    {role.permission_level === "*" ? "All Access" : "Restricted"}
                  </td>
                  <td className="p-3 border-b">
                    {role.permission_level === "#" && role.permissions.length ? (
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((p) => (
                          <span
                            key={p._id}
                            className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md"
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="p-3 border-b text-center">
                    <button
                      onClick={() => handleOpenModal(role)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch(deleteRole(role._id))}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6">
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <Dialog.Title className="text-lg font-semibold mb-4">
              {editingRole ? "Edit Role" : "Create New Role"}
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Permission Level
                </label>
                <select
                  value={formData.permission_level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      permission_level: e.target.value,
                    })
                  }
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="#">Restricted</option>
                  <option value="*">All Access</option>
                </select>
              </div>

              {formData.permission_level === "#" && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Permissions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {permissions.map((perm) => (
                      <button
                        key={perm._id}
                        onClick={() => togglePermission(perm._id)}
                        className={`px-3 py-1 rounded-md text-xs border transition ${
                          formData.permissions.includes(perm._id)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        }`}
                      >
                        {perm.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
