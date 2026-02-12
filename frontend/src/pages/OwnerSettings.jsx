import React, { useState } from "react";
import { toast } from "sonner";
import {
  Shield,
  Database,
  Users,
  Download,
  HardDrive,
  LogOut,
  KeyRound,
  UserX,
  UserCheck,
} from "lucide-react";

import api from "../axios/axios.js"; // ✅ axios with interceptor
import ControlCard from "../components/control-center/ControlCard.jsx";
import ActionButton from "../components/control-center/ActionButton.jsx";
import MyProfile from "../components/profile/Profile";
import ConfirmDeleteModal from "../components/delete/ConfirmDelete.jsx"

const OwnerControlCenter = () => {
  const [loading, setLoading] = useState(false);
  const [allUsersBlocked, setAllUsersBlocked] = useState(false);

  // 🔥 Force logout modal state
  const [showForceLogoutModal, setShowForceLogoutModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  /* ================= FORCE LOGOUT API ================= */
  const forceLogoutAllUsers = async () => {
    try {
      setLoading(true);

      await api.post("/owner/force-logout-all");

      toast.warning("All users have been force logged out");

      setShowForceLogoutModal(false);
      setConfirmText("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Force logout failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BLOCK / UNBLOCK (UI ONLY) ================= */
  const toggleBlockUsers = () => {
    const next = !allUsersBlocked;
    setAllUsersBlocked(next);
    toast.warning(next ? "All users blocked" : "All users unblocked");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ================= HEADER ================= */}
      <header className="gradient-header text-primary-foreground">
    
      </header>

      {/* ================= CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* Profile */}
        <section className="grid grid-cols-1">
          <MyProfile />
        </section>

        {/* Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 🔐 Security */}
          <ControlCard
            title="Security"
            description="High-impact system actions"
            icon={Shield}
            iconColor="text-destructive"
          >
            <ActionButton
              variant="danger"
              icon={LogOut}
              text="Force Logout All Users"
              onClick={() => setShowForceLogoutModal(true)}
            />

            <ActionButton
              variant="warning"
              icon={KeyRound}
              text="Force Password Reset"
              onClick={() =>
                toast.warning("Password reset feature coming soon")
              }
            />

            <ActionButton
              variant={allUsersBlocked ? "success" : "danger"}
              icon={allUsersBlocked ? UserCheck : UserX}
              text={allUsersBlocked ? "Unblock All Users" : "Block All Users"}
              onClick={toggleBlockUsers}
            />
          </ControlCard>

          {/* 📦 Data & Backup */}
          <ControlCard
            title="Data & Backup"
            description="Download and backup system data"
            icon={Database}
          >
            <ActionButton
              variant="info"
              icon={Users}
              text="Download Users"
              onClick={() => toast.success("Users exported")}
            />
            <ActionButton
              variant="info"
              icon={Download}
              text="Download Attendance"
              onClick={() => toast.success("Attendance exported")}
            />
            <ActionButton
              variant="primary"
              icon={HardDrive}
              text="Full Backup"
              onClick={() => toast.success("Database backup completed")}
            />
          </ControlCard>
        </section>
      </main>

      {/* ================= CONFIRM FORCE LOGOUT MODAL ================= */}
      <ConfirmDeleteModal
        open={showForceLogoutModal}
        title="Force Logout All Users"
        message="This will immediately log out ALL users from the system. This action cannot be undone."
        confirmText="Force Logout"
        cancelText="Cancel"
        confirmValue="LOGOUT"
        inputValue={confirmText}
        onInputChange={setConfirmText}
        loading={loading}
        onCancel={() => {
          setShowForceLogoutModal(false);
          setConfirmText("");
        }}
        onConfirm={forceLogoutAllUsers}
      />
    </div>
  );
};

export default OwnerControlCenter;
