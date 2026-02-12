"use client";

import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Building2, 
  UserPlus, 
  X,
  ShieldCheck 
} from "lucide-react"; // npm install lucide-react
import api from "../../../axios/axios";
import { AuthContext } from "../../../ContextApi/isAuth";

const AddUser = ({ onClose }) => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AuthContext not found. Wrap app with AuthProvider.");
  }

  const { user } = auth;
  const isManager = user?.role === "manager";

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    payment: "",
    department: "",
  });

  /* ================= FETCH DEPARTMENTS (OWNER ONLY) ================= */
  useEffect(() => {
    if (!isManager) {
      fetchDepartments();
    }
  }, [isManager]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/department/get");
      setDepartments(res.data?.data || []);
    } catch (error) {
      toast.error("Failed to load departments");
    }
  };

  /* ================= FORCE MANAGER DEPARTMENT ================= */
  useEffect(() => {
    if (isManager && user?.department?._id) {
      setForm((prev) => ({
        ...prev,
        department: user.department._id,
      }));
    }
  }, [isManager, user]);

  /* ================= CHANGE HANDLER ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, phone, payment, department } = form;

    if (!username || !email || !phone || !payment || !department) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);
      const payload = { username, email, phone, payment, department };
      await api.post("/owner/addUser", payload);
      toast.success("Employee added successfully");
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-xl w-full border border-slate-100 animate-in fade-in zoom-in duration-300">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
            <UserPlus size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Onboard Staff</h2>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Employee Registration</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* USERNAME */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              name="username"
              placeholder="e.g. Umaid Hamid"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              type="email"
              name="email"
              placeholder="umaid@oasisascend.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PHONE */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                name="phone"
                placeholder="10 Digits"
                value={form.phone}
                onChange={handleChange}
                required
                maxLength={10}
                pattern="[0-9]{10}"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
              />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Payroll Status</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <select
                name="payment"
                value={form.payment}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-slate-700 font-medium appearance-none"
              >
                <option value="">Select Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </div>

        {/* DEPARTMENT */}
        <div className="space-y-1">
          <div className="flex items-center justify-between ml-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assigned Department</label>
            {isManager && (
              <span className="flex items-center gap-1 text-[10px] text-blue-600 font-black uppercase">
                <ShieldCheck size={12} /> Auto-Locked
              </span>
            )}
          </div>

          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            {isManager ? (
              <input
                type="text"
                value={user?.department?.name || "Your Assigned Unit"}
                disabled
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border-2 border-slate-100 rounded-2xl text-slate-400 font-bold cursor-not-allowed italic"
              />
            ) : (
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-slate-700 font-medium appearance-none"
              >
                <option value="">Choose Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-[2] py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                Processing...
              </>
            ) : (
              "Add Employee"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;