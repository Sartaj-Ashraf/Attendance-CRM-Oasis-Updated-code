"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "../../../axios/axios.js";
import toast from "react-hot-toast";
import { Search, UserMinus, UserCheck, ShieldAlert, Mail, MapPin, Users } from "lucide-react"; // npm install lucide-react
import useDebounce from "../../../hooks/Debouncing";
import OwnerReplaceManagerModal from "../../../components/OwnerReplaceManagerModal";

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  const debouncedSearch = useDebounce(search, 600);

  /* ================= FETCH LOGIC (UNCHANGED) ================= */
  const fetchManagers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/owner/getManagers");
      setManagers(res.data.data || []);
    } catch {
      toast.error("Failed to load managers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const filteredManagers = useMemo(() => {
    return managers.filter((manager) =>
      manager?.username?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [managers, debouncedSearch]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              <Users size={16} />
              <span>Administration</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Management Directory
            </h1>
            <p className="text-slate-500 font-medium">
              View and manage access levels for department leads.
            </p>
          </div>

          <div className="relative group w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Manager</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Contact Info</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-8"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                  </tr>
                ))
              ) : filteredManagers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center text-slate-400">
                      <ShieldAlert size={40} className="mb-2 opacity-20" />
                      <p className="font-medium">No managers found matching "{search}"</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredManagers.map((manager) => (
                  <tr key={manager._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {manager.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-700">{manager.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Mail size={14} className="text-slate-300" />
                        {manager.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">
                        <MapPin size={12} />
                        {manager.department?.name || "Unassigned"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        manager.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}>
                        {manager.isActive ? <UserCheck size={12} /> : <UserMinus size={12} />}
                        {manager.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => { setSelectedManager(manager); setShowReplaceModal(true); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-rose-50 text-rose-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-600 hover:text-white border border-rose-200"
                      >
                        Demote
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="md:hidden space-y-4">
          {filteredManagers.map((manager) => (
            <div key={manager._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    {manager.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{manager.username}</h3>
                    <p className="text-xs text-slate-400">{manager.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter ${
                  manager.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                }`}>
                  {manager.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Department</span>
                <span className="text-xs font-semibold text-slate-700">{manager.department?.name || "—"}</span>
              </div>

              <button
                onClick={() => { setSelectedManager(manager); setShowReplaceModal(true); }}
                className="w-full flex items-center justify-center gap-2 bg-rose-500 text-white py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-rose-200 active:scale-[0.98] transition-all"
              >
                <UserMinus size={16} />
                Demote to Employee
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <OwnerReplaceManagerModal
        open={showReplaceModal}
        manager={selectedManager}
        onClose={() => {
          setShowReplaceModal(false);
          setSelectedManager(null);
        }}
        onSuccess={fetchManagers}
      />
    </div>
  );
};

export default Managers;