"use client";

import { useEffect, useState } from "react";
import api from "../../axios/axios";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  Lock,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Save,
  Clock,
  XCircle,
  Key,
} from "lucide-react";

import ChangeEmailModal from "./ChangeEmailModal";
import ChangePasswordModal from "../ChangePasswordModal.jsx";

const MyProfile = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailModalMode, setEmailModalMode] = useState("change");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(true);

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
    department: "",
  });

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/isAuth");
        const user = res.data.user;

        setProfile({
          username: user.username,
          email: user.email,
          phone: user.phone || "",
          role: user.role,
          department: user.department?.name || "",
        });

        if (user.pendingEmail) {
          setPendingEmail(user.pendingEmail);
          setEmailVerified(false);
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  /* ================= VERIFY PASSWORD ================= */
  const verifyPassword = async () => {
    if (!password) return toast.error("Enter your password");
    try {
      setSaving(true);
      await api.post("/auth/verify-password", { password });
      toast.success("Identity verified");
      setPasswordVerified(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Incorrect password");
    } finally {
      setSaving(false);
    }
  };

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    try {
      setSaving(true);
      await api.put("/user/updateProfile", {
        username: profile.username,
        phone: profile.phone,
      });
      toast.success("Profile updated");
      setIsEditing(false);
      setPasswordVerified(false);
      setPassword("");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-20 animate-pulse text-slate-400">
        <Clock className="mr-2 animate-spin" /> Loading secure profile...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* ================= HERO HEADER ================= */}
        <div className="relative bg-slate-900 px-8 py-12 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-black shadow-2xl">
                {profile.username?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-xl border-4 border-slate-900">
                <ShieldCheck size={16} />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tight">
                {profile.username}
              </h2>
              <p className="text-blue-300 font-medium uppercase text-xs tracking-[0.2em] mt-1">
                {profile.role} • {profile.department || "General"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* ================= PASSWORD CONFIRMATION MODAL-LIKE VIEW ================= */}
          {isEditing && !passwordVerified && (
            <div className="max-w-sm mx-auto py-10 space-y-6 text-center animate-in fade-in zoom-in duration-300">
              <div className="mx-auto w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                <Lock size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Verify Identity
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Please enter your password to unlock profile editing.
                </p>
              </div>

              <input
                type="password"
                placeholder="Enter current password"
                value={password}
                autoFocus
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500 transition-all text-center font-bold tracking-widest"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyPassword}
                  disabled={saving}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all"
                >
                  {saving ? "Checking..." : "Verify"}
                </button>
              </div>
            </div>
          )}

          {/* ================= PROFILE FORM ================= */}
          {(!isEditing || passwordVerified) && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field
                  label="Display Name"
                  icon={User}
                  value={profile.username}
                  disabled={!passwordVerified}
                  onChange={(v) => setProfile({ ...profile, username: v })}
                />

                {/* EMAIL FIELD WITH CUSTOM LOGIC */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    <Mail size={14} /> Email Address
                  </label>
                  <div className="relative group">
                    <input
                      value={pendingEmail || profile.email}
                      disabled
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 pr-32 text-slate-500 font-medium cursor-not-allowed"
                    />

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {passwordVerified && (
                        <button
                          onClick={() => {
                            setEmailModalMode("change");
                            setShowEmailModal(true);
                          }}
                          className="px-3 py-1.5 bg-white text-blue-600 text-xs font-bold rounded-xl border border-slate-200 hover:border-blue-200 shadow-sm"
                        >
                          Update
                        </button>
                      )}

                      {!emailVerified && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-xl border border-amber-100">
                          <AlertCircle size={12} /> Unverified
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Field
                  label="Contact Phone"
                  icon={Phone}
                  value={profile.phone}
                  placeholder="Not provided"
                  disabled={!passwordVerified}
                  onChange={(v) => setProfile({ ...profile, phone: v })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Role"
                    icon={ShieldCheck}
                    value={profile.role}
                    disabled
                    className="capitalize"
                  />
                  <Field
                    label="Dept."
                    icon={Building2}
                    value={profile.department}
                    disabled
                  />
                </div>
              </div>

              {/* ================= FOOTER ACTIONS ================= */}
              <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                <div className="hidden sm:block">
                  {passwordVerified ? (
                    <p className="text-blue-600 text-xs font-bold flex items-center gap-2">
                      <Lock size={14} /> You have active edit permissions.
                    </p>
                  ) : (
                    <p className="text-slate-400 text-xs font-medium">
                      Verify password to enable editing.
                    </p>
                  )}
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-[1.25rem] font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                      <Edit3 size={18} /> Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="flex-1 sm:flex-none flex items-center gap-2 px-6 py-3.5 bg-white border-2 border-slate-100 text-slate-700 rounded-[1.25rem] font-bold hover:bg-slate-50 transition-all"
                      >
                        <Key size={18} /> Security
                      </button>

                      <button
                        onClick={saveProfile}
                        disabled={saving}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-[1.25rem] font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
                      >
                        <Save size={18} />{" "}
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {showEmailModal && (
        <ChangeEmailModal
          mode={emailModalMode}
          defaultEmail={pendingEmail}
          onPendingEmail={(email) => {
            setPendingEmail(email);
            setEmailVerified(false);
          }}
          onClose={(verified, email) => {
            setShowEmailModal(false);
            if (verified) {
              setProfile((p) => ({ ...p, email }));
              setPendingEmail("");
              setEmailVerified(true);
            }
          }}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

/* ================= ENHANCED FIELD COMPONENT ================= */
const Field = ({
  label,
  value,
  disabled,
  onChange,
  icon: Icon,
  placeholder,
  className = "",
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
      {Icon && <Icon size={14} />} {label}
    </label>
    <input
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      className={`w-full border-2 rounded-2xl px-5 py-3.5 font-medium transition-all ${
        disabled
          ? "bg-slate-50 border-slate-50 text-slate-500 cursor-not-allowed shadow-inner"
          : "bg-white border-slate-100 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none"
      } ${className}`}
    />
  </div>
);

export default MyProfile;
