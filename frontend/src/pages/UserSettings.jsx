import React, { useEffect, useState } from "react";
import api from "../axios/axios";
import toast from "react-hot-toast";

const UserSettings = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    phone: "",
    email: "",
    role: "",
    department: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 🔹 Fetch logged-in user details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        const user = res.data.data;

        setForm({
          username: user.username,
          phone: user.phone,
          email: user.email,
          role: user.role,
          department: user.department?.name || "N/A",
        });
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Update profile
  const handleProfileUpdate = async () => {
    try {
      setLoading(true);

      await api.put("/user/update-profile", {
        username: form.username,
        phone: form.phone,
      });

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Change password
  const handlePasswordUpdate = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      await api.put("/user/change-password", passwords);

      toast.success("Password updated");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 🔹 Profile Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Settings </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="input"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="input"
          />

          <input
            value={form.email}
            disabled
            className="input bg-gray-100 cursor-not-allowed"
          />

          <input
            value={form.role}
            disabled
            className="input bg-gray-100 cursor-not-allowed"
          />

          <input
            value={form.department}
            disabled
            className="input bg-gray-100 cursor-not-allowed"
          />
        </div>

        <button
          onClick={handleProfileUpdate}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>

      {/* 🔹 Password Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Current Password"
            className="input"
          />

          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            placeholder="New Password"
            className="input"
          />

          <input
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm Password"
            className="input"
          />
        </div>

        <button
          onClick={handlePasswordUpdate}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default UserSettings;
