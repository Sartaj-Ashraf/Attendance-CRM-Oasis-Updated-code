"use client";

import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { 
  Calendar, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  User
} from "lucide-react"; 
import api from "../../axios/axios.js";
import SearchFilter from "../../components/filters/SearchFilter";

const AttendanceReportWidget = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState(null);

  /* ================= FETCH LOGIC (UNCHANGED) ================= */
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/GetAttendanceByDate", {
        params: { date, page, limit },
      });
      setData(res.data.data || []);
      setMeta(res.data.meta || null);
    } catch (error) {
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/department/get");
      setDepartments(res.data.data);
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  useEffect(() => { fetchAttendance(); }, [date, page]);
  useEffect(() => { fetchDepartments(); }, []);
  useEffect(() => { setPage(1); }, [date]);

  /* ================= MINIMALIST HELPERS ================= */
  const getStatusClasses = (status) => {
    switch (status) {
      case "present": return "text-emerald-600 bg-emerald-50/50 border-emerald-100";
      case "absent": return "text-rose-600 bg-rose-50/50 border-rose-100";
      case "late": return "text-amber-600 bg-amber-50/50 border-amber-100";
      case "leave": return "text-blue-600 bg-blue-50/50 border-blue-100";
      default: return "text-slate-500 bg-slate-50 border-slate-100";
    }
  };

  const stats = useMemo(() => {
    return {
      present: data.filter((d) => d.status === "present").length,
      absent: data.filter((d) => d.status === "absent").length,
      total: data.length
    };
  }, [data]);

  const filteredData = useMemo(() => {
    return data
      .filter((row) => row.user)
      .filter((row) => {
        const username = row.user?.username?.toLowerCase() || "";
        const email = row.user?.email?.toLowerCase() || "";
        const matchesSearch = username.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
        const matchesDepartment = !departmentFilter || row.user?.department?._id === departmentFilter;
        return matchesSearch && matchesDepartment;
      });
  }, [data, searchTerm, departmentFilter]);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      
      {/* HEADER: Minimal & Clean */}
      <div className="p-6 border-b border-slate-50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Attendance Report</h2>
            <p className="text-slate-400 text-sm">Quick daily summary</p>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
            <Calendar size={14} className="text-slate-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-600 outline-none cursor-pointer"
            />
          </div>
        </div>

      </div>

      <div className="p-6">
        {/* SIMPLE SEARCH FILTER */}
        <div className="mb-6 opacity-80 hover:opacity-100 transition-opacity">
          <SearchFilter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            selectValue={departmentFilter}
            onSelectChange={setDepartmentFilter}
            selectOptions={departments}
            optionLabel="name"
            optionValue="_id"
            searchPlaceholder="Search by name..."
          />
        </div>

        {/* CLEAN TABLE */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-50">
              <tr>
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-tight">Employee</th>
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-tight text-center">Department</th>
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-tight text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/50">
              {loading ? (
                <tr><td colSpan="3" className="py-12 text-center text-slate-300 text-sm">Loading records...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="3" className="py-12 text-center text-slate-300 text-sm italic">No entries found</td></tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row._id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                          <User size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 text-base">{row.user.username}</span>
                          <span className="text-[11px] text-slate-400">{row.user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-xs text-slate-500">{row.user.department?.name || "—"}</span>
                    </td>
                    <td className="py-4 text-right">
                      <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-md border uppercase ${getStatusClasses(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MINIMAL PAGINATION */}
        {meta && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {meta.page} / {meta.totalPages}
            </span>

            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!meta.hasPrev}
                className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-20 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!meta.hasNext}
                className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-20 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReportWidget;