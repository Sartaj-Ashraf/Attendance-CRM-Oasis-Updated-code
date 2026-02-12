import React, { useEffect, useState } from "react";
import api from "../../../axios/axios";
import toast from "react-hot-toast";

const BlockedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unblockingId, setUnblockingId] = useState(null);

  // 🔹 Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch blocked users
  const fetchBlockedUsers = async () => {
    try {
      const res = await api.get("/owner/getBlockedUsers");
      setUsers(res.data.data || res.data);
    } catch (err) {
      toast.error("Failed to load blocked users");
    } finally {
      setLoading(false);
    }
  };

  // Open confirmation modal
  const openConfirmModal = (user) => {
    setSelectedUser(user);
    setConfirmOpen(true);
  };

  // Close modal
  const closeConfirmModal = () => {
    setSelectedUser(null);
    setConfirmOpen(false);
  };

  // Confirm unblock
  const confirmUnblock = async () => {
    if (!selectedUser) return;

    try {
      setUnblockingId(selectedUser._id);
      await api.put(`/owner/unblockUser/${selectedUser._id}`);
      toast.success("User unblocked successfully");
      fetchBlockedUsers();
    } catch (err) {
      toast.error("Failed to unblock user");
    } finally {
      setUnblockingId(null);
      closeConfirmModal();
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Blocked Users</h1>
        <p className="text-gray-500">View and manage all blocked users</p>
      </div>

      {/* Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Loading blocked users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  No blocked users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.department?.name || "Not Assigned"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                      Blocked
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => openConfirmModal(user)}
                      disabled={unblockingId === user._id}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      Unblock
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔴 Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800">Confirm Unblock</h2>

            <p className="text-gray-600 mt-3">
              Are you sure you want to unblock{" "}
              <span className="font-semibold">{selectedUser?.username}</span>?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmUnblock}
                disabled={unblockingId === selectedUser?._id}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {unblockingId === selectedUser?._id
                  ? "Unblocking..."
                  : "Yes, Unblock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockedUsers;
