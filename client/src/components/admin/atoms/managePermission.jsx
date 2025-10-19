import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "../../../redux/slice/admin/permissionSlice";

export default function ManagePermission() {
  const dispatch = useDispatch();
  const { permissions, loading } = useSelector((state) => state.admin.permissions);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    routes: [{ path: "", method: "GET" }],
  });

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  const filtered = permissions.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (permission = null) => {
    if (permission) {
      setEditingPermission(permission);
      setFormData({
        name: permission.name,
        description: permission.description,
        routes: permission.routes.length
          ? permission.routes
          : [{ path: "", method: "GET" }],
      });
    } else {
      setEditingPermission(null);
      setFormData({
        name: "",
        description: "",
        routes: [{ path: "", method: "GET" }],
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return alert("Permission name is required");
    if (editingPermission) {
      dispatch(updatePermission({ ...formData, _id: editingPermission._id }));
    } else {
      dispatch(createPermission(formData));
    }
    setShowModal(false);
  };

  const handleAddRoute = () => {
    setFormData((prev) => ({
      ...prev,
      routes: [...prev.routes, { path: "", method: "GET" }],
    }));
  };

  const handleRemoveRoute = (index) => {
    setFormData((prev) => ({
      ...prev,
      routes: prev.routes.filter((_, i) => i !== index),
    }));
  };

  const handleRouteChange = (index, field, value) => {
    const newRoutes = [...formData.routes];
    newRoutes[index][field] = value;
    setFormData({ ...formData, routes: newRoutes });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Manage Permissions</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + New Permission
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search permissions..."
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
              <th className="p-3 border-b">Description</th>
              <th className="p-3 border-b">Routes</th>
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
              filtered.map((permission) => (
                <tr key={permission._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{permission.name}</td>
                  <td className="p-3 border-b text-gray-700">{permission.description}</td>
                  <td className="p-3 border-b">
                    {permission.routes?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {permission.routes.map((r, i) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md"
                          >
                            {r.method} {r.path}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="p-3 border-b text-center">
                    <button
                      onClick={() => handleOpenModal(permission)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch(deletePermission(permission._id))}
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
                  No permissions found.
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
              {editingPermission ? "Edit Permission" : "Create New Permission"}
            </Dialog.Title>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Permission name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Routes
                </label>
                {formData.routes.map((r, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <select
                      value={r.method}
                      onChange={(e) => handleRouteChange(index, "method", e.target.value)}
                      className="border rounded-md p-2"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                    <input
                      type="text"
                      placeholder="/api/path"
                      value={r.path}
                      onChange={(e) => handleRouteChange(index, "path", e.target.value)}
                      className="flex-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      onClick={() => handleRemoveRoute(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddRoute}
                  className="text-blue-600 hover:underline text-sm"
                >
                  + Add Route
                </button>
              </div>
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
