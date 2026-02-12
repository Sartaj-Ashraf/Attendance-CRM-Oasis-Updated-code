import React, { useEffect, useMemo, useState } from "react";
import api from "../axios/axios.js";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const OwnerReplaceManagerModal = ({ open, onClose, manager, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ================= FETCH DEPARTMENT USERS ================= */
  useEffect(() => {
    if (!open || !manager?.department?._id) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);

        const res = await api.get("/owner/getAllUsers", {
          params: {
            department: manager.department._id,
          },
        });

        // ✅ FRONTEND-ONLY FILTER
        // 1. Email verified
        // 2. NOT current manager
        const filteredUsers = (res.data?.data || []).filter(
          (user) => user.isEmailVerified === true && user._id !== manager._id
        );

        setUsers(filteredUsers);
      } catch (error) {
        toast.error("Failed to load department users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [open, manager]);

  /* ================= SEARCH FILTER ================= */
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  /* ================= REPLACE MANAGER ================= */
  const handleReplaceManager = async () => {
    if (!selectedUser) {
      return toast.error("Please select a new manager");
    }

    try {
      await api.patch(
        `/owner/manager/replace/${selectedUser}`,
        {},
        { withCredentials: true }
      );

      toast.success("Manager replaced successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to replace manager");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6">
        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800">Replace Manager</h2>

        <p className="text-sm text-gray-500 mt-1">
          Current manager:{" "}
          <span className="font-medium text-gray-800">{manager.username}</span>
        </p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mt-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Users List */}
        <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
          {loading ? (
            <p className="text-center text-gray-500">Loading users...</p>
          ) : paginatedUsers.length === 0 ? (
            <p className="text-center text-gray-500">No verified users found</p>
          ) : (
            paginatedUsers.map((user) => (
              <label
                key={user._id}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedUser === user._id ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <input
                  type="radio"
                  name="manager"
                  checked={selectedUser === user._id}
                  onChange={() => setSelectedUser(user._id)}
                />
                <div>
                  <p className="font-medium text-gray-800">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </label>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleReplaceManager}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Replace Manager
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerReplaceManagerModal;
