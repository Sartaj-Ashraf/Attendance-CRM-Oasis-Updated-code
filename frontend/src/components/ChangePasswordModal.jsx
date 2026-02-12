import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import api from "../axios/axios.js";

const ChangePasswordModal = ({ onClose }) => {
  /* ================= STATE ================= */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  /* ================= HANDLER ================= */
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success("Password changed successfully");
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        {/* HEADER */}
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Change Password</h3>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {/* CURRENT PASSWORD */}
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrent}
            toggle={() => setShowCurrent((v) => !v)}
          />

          {/* NEW PASSWORD */}
          <PasswordField
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            toggle={() => setShowNew((v) => !v)}
          />

          {/* CONFIRM PASSWORD */}
          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirm}
            toggle={() => setShowConfirm((v) => !v)}
          />

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-5 py-2 border rounded-xl">
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={handleChangePassword}
              className="px-5 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= PASSWORD FIELD ================= */
const PasswordField = ({ label, value, onChange, show, toggle }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>

    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-2 pr-10"
      />

      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

export default ChangePasswordModal;
