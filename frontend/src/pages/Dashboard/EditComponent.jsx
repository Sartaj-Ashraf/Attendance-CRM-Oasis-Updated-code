import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from '../../axios/axios';

const EditUser = ({ user, departments = [], onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    role: "employee",
    department: "",
    payment: "paid",
  });

  /* ================= PREFILL DATA ================= */
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "employee",
        department: user.department?._id || "",
        payment: user.payment || "paid",
      });
    }
  }, [user]);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/owner/updateUser/${user._id}`, {
        username: form.username,
        phone: form.phone,
        role: form.role,
        department: form.department,
        payment: form.payment,
      });

      toast.success("User updated successfully");

      onSuccess?.(); // refresh user list
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Edit Employee
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* USERNAME */}
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* EMAIL (READ ONLY) */}
            <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* PHONE */}
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* DEPARTMENT */}
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded-lg bg-white"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>

          {/* PAYMENT */}
          <select
            name="payment"
            value={form.payment}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border rounded-lg bg-white"
          >
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Saving..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
