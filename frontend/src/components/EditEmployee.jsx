"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../axios/axios.js";

const EditEmployee = ({ user, onClose, onSuccess }) => {
  const [authUser, setAuthUser] = useState(null);
  const [role, setRole] = useState(null);

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    email: "",
    department: "",
    payment: "paid",
  });

  /* ================= GET AUTH USER (ROLE SOURCE) ================= */
  useEffect(() => {
    fetchAuthUser();
  }, []);

  const fetchAuthUser = async () => {
    try {
      const res = await api.get("/api/isAuth");
      setAuthUser(res.data.user);
      setRole(res.data.user.role);
    } catch (error) {
      toast.error("Authentication failed");
      onClose();
    }
  };

  /* ================= FETCH DEPARTMENTS (OWNER ONLY) ================= */
  useEffect(() => {
    if (role === "owner") {
      fetchDepartments();
    }
  }, [role]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/department/get");
      setDepartments(res.data?.data || []);
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  /* ================= PREFILL FORM ================= */
  useEffect(() => {
    if (!user || !role || !authUser) return;

    setForm({
      email: user.email || "",
      department:
        role === "manager"
          ? authUser.department?._id // 🔒 manager forced
          : user.department?._id || "",
      payment: user.payment || "paid",
    });
  }, [user, role, authUser]);

  /* ================= CHANGE HANDLER ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🔒 MANAGER CANNOT CHANGE DEPARTMENT
    if (name === "department" && role === "manager") return;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.payment) {
      return toast.error("Required fields missing");
    }

    try {
      setLoading(true);

      await api.put(`/owner/updateUser/${user._id}`, {
        email: form.email,
        department:
          role === "manager" ? authUser.department?._id : form.department,
        payment: form.payment,
      });

      toast.success("Employee updated successfully");

      if (form.email !== user.email) {
        toast.info("Email change requires verification");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!authUser || !role) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">Edit Employee</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          {/* DEPARTMENT */}
          <div>
            <label className="text-sm font-medium">Department</label>

            {role === "manager" ? (
              <input
                disabled
                value={authUser.department?.name || ""}
                className="w-full border px-4 py-2 rounded-lg bg-gray-100"
              />
            ) : (
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded-lg"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* PAYMENT */}
          <div>
            <label className="text-sm font-medium">Payment</label>
            <select
              name="payment"
              value={form.payment}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Saving..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
