"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Inbox, Calendar, User, Briefcase, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../axios/axios.js";

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedReason, setExpandedReason] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState(null);

  /* ================= FETCH LOGIC (UNCHANGED) ================= */
  const fetchLeaves = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await api.get("/leaves/all", {
        params: { page: pageNumber, limit },
      });
      setLeaves(res.data.data || []);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves(1);
  }, []);

  const approveLeave = async (leaveId, isPaid, days) => {
    if (!days || days <= 0) return toast.error("Days must be greater than 0");
    const toastId = toast.loading("Processing approval...");
    try {
      setActionLoading(leaveId);
      await api.patch(`/leaves/approve/${leaveId}`, { isPaid, days });
      setLeaves((prev) =>
        prev.map((l) =>
          l._id === leaveId ? { ...l, status: "approved", isPaid, days } : l
        )
      );
      toast.success("Leave approved", { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to approve", { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  const rejectLeave = async (leaveId) => {
    const toastId = toast.loading("Processing rejection...");
    try {
      setActionLoading(leaveId);
      await api.patch(`/leaves/reject/${leaveId}`);
      setLeaves((prev) =>
        prev.map((l) =>
          l._id === leaveId ? { ...l, status: "rejected", isPaid: false } : l
        )
      );
      toast.success("Leave rejected", { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reject", { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  /* ================= UI HELPERS ================= */
  const getStatusBadge = (status, isPaid) => {
    switch (status) {
      case "approved":
        return (
          <div className="flex flex-col items-end sm:items-start">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
              <CheckCircle size={12} /> Approved
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">
              {isPaid ? "• Paid Leave" : "• Unpaid Leave"}
            </span>
          </div>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto p-4 md:p-8 space-y-8 bg-[#fdfdfd] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Leave Requests
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage employee absences and departmental availability
          </p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-lg">
           <span className="text-indigo-700 font-semibold text-sm">
             Total Requests: {pagination?.totalItems || 0}
           </span>
        </div>
      </div>

      {/* MOBILE LIST */}
      <div className="grid gap-4 sm:hidden">
        {leaves.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <Inbox className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">No leave applications yet</p>
          </div>
        ) : (
          leaves.map((leave) => (
            <div key={leave._id} className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 ${actionLoading === leave._id ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 leading-none">{leave.user?.username}</h3>
                    <span className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">{leave.user?.department?.name}</span>
                  </div>
                </div>
                {getStatusBadge(leave.status, leave.isPaid)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded-lg">
                <div className="text-slate-500">Subject: <span className="text-slate-800 font-medium block">{leave.subject}</span></div>
                <div className="text-slate-500">Days: <span className="text-slate-800 font-medium block">{leave.days} Day(s)</span></div>
              </div>

              <div className="text-sm text-slate-600 bg-white border border-slate-100 p-3 rounded-lg italic">
                "{expandedReason === leave._id ? leave.reason : `${leave.reason.slice(0, 60)}...`}"
                {leave.reason.length > 60 && (
                  <button onClick={() => setExpandedReason(expandedReason === leave._id ? null : leave._id)} className="text-indigo-600 font-semibold ml-1 underline text-xs">
                    {expandedReason === leave._id ? "Show less" : "Read more"}
                  </button>
                )}
              </div>

              {leave.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <button onClick={() => approveLeave(leave._id, true, leave.days)} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">Paid</button>
                  <button onClick={() => approveLeave(leave._id, false, leave.days)} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">Unpaid</button>
                  <button onClick={() => rejectLeave(leave._id)} className="flex-1 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-all">Reject</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Employee Details</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Type & Duration</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Reason for Leave</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leaves.map((leave) => (
              <tr key={leave._id} className={`hover:bg-slate-50/80 transition-colors ${actionLoading === leave._id ? "opacity-40" : ""}`}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 text-xs font-bold">
                      {leave.user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 text-sm">{leave.user?.username}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{leave.user?.department?.name}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-slate-700">{leave.subject}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar size={12} /> {leave.days} Day(s)
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 max-w-xs">
                  <p className="text-sm text-slate-600 line-clamp-2 italic">"{leave.reason}"</p>
                </td>
                <td className="px-6 py-5">
                  {getStatusBadge(leave.status, leave.isPaid)}
                </td>
                <td className="px-6 py-5 text-right">
                  {leave.status === "pending" ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => approveLeave(leave._id, true, leave.days)} className="px-3 py-1.5 text-[11px] font-bold bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-all shadow-sm">PAID</button>
                      <button onClick={() => approveLeave(leave._id, false, leave.days)} className="px-3 py-1.5 text-[11px] font-bold bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all shadow-sm">UNPAID</button>
                      <button onClick={() => rejectLeave(leave._id)} className="px-3 py-1.5 text-[11px] font-bold bg-white text-rose-600 border border-rose-200 rounded-md hover:bg-rose-50 transition-all">REJECT</button>
                    </div>
                  ) : (
                    <span className="text-slate-300 text-xs font-medium">— processed —</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Page {pagination.page} <span className="mx-1">of</span> {pagination.totalPages}
          </p>

          <div className="flex gap-3">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => {
                const prev = page - 1;
                setPage(prev);
                fetchLeaves(prev);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <button
              disabled={!pagination.hasNext}
              onClick={() => {
                const next = page + 1;
                setPage(next);
                fetchLeaves(next);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLeaves;