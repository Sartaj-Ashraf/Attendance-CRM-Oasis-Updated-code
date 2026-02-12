"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import api from "../axios/axios";
import JoditEditor from "jodit-react";

const LeaveDashboard = () => {
  const editor = useRef(null);

  /* ================= UI STATES ================= */
  const [showApply, setShowApply] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    startDate: "",
    days: "",
    subject: "",
    reason: "",
  });
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [pagination, setPagination] = useState(null);

  const config = useMemo(
    () => ({
      readonly: false,
      height: 280,
      placeholder: "Reason for leave...",
      toolbarAdaptive: false,
      toolbarSticky: false,
      buttons: ["bold", "italic", "ul", "ol", "undo", "redo"],
    }),
    [],
  );

  /* ================= FETCH LOGIC (UNCHANGED) ================= */
  const fetchMyLeaves = async (pageNumber = page) => {
    try {
      setHistoryLoading(true);
      const res = await api.get("/leaves/my", {
        params: { page: pageNumber, limit },
      });
      setLeaveHistory(res.data.data || []);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves(1);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitLeave = async (e) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      await api.post("/leaves/apply", { ...form, days: Number(form.days) });
      toast.success("Submitted");
      setForm({ startDate: "", days: "", subject: "", reason: "" });
      setShowApply(false);
      fetchMyLeaves(1);
    } catch (error) {
      toast.error("Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "approved":
        return "text-emerald-600 bg-emerald-50/50";
      case "rejected":
        return "text-rose-600 bg-rose-50/50";
      default:
        return "text-amber-600 bg-amber-50/50";
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6 md:p-10 space-y-12 bg-white min-h-screen font-sans antialiased text-slate-900">
      {/* ================= HEADER ================= */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-medium tracking-tight text-slate-900">
            Leaves
          </h1>
          <p className="text-slate-500 text-sm">
            Overview of your time-off requests.
          </p>
        </div>

        <button
          onClick={() => setShowApply(true)}
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all active:scale-95"
        >
          <Plus size={16} />
          Apply for leave
        </button>
      </header>

      {/* ================= STATS SECTION (MINIMAL) ================= */}
      <div className="grid grid-cols-3 gap-8 py-4 border-y border-slate-100">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Total
          </p>
          <p className="text-2xl font-light">{leaveHistory.length || 0}</p>
        </div>
        <div className="border-x border-slate-100 px-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1">
            Approved
          </p>
          <p className="text-2xl font-light">
            {leaveHistory.filter((l) => l.status === "approved").length}
          </p>
        </div>
        <div className="pl-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1">
            Pending
          </p>
          <p className="text-2xl font-light">
            {leaveHistory.filter((l) => l.status === "pending").length}
          </p>
        </div>
      </div>

      {/* ================= HISTORY TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="pb-4 font-bold">Date</th>
              <th className="pb-4 font-bold">Subject</th>
              <th className="pb-4 font-bold text-center">Days</th>
              <th className="pb-4 font-bold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {historyLoading ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-10 text-center text-slate-400 text-sm"
                >
                  Updating records...
                </td>
              </tr>
            ) : leaveHistory.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-10 text-center text-slate-400 text-sm italic"
                >
                  No records.
                </td>
              </tr>
            ) : (
              leaveHistory.map((leave) => (
                <tr
                  key={leave._id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-5 text-sm text-slate-600">
                    {new Date(leave.startDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-5 text-sm font-medium text-slate-900">
                    {leave.subject}
                  </td>
                  <td className="py-5 text-sm text-center text-slate-600">
                    {leave.days}
                  </td>
                  <td className="py-5 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight ${getStatusClasses(leave.status)}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {pagination && (
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 tracking-widest uppercase">
          <span>
            {pagination.page} — {pagination.totalPages}
          </span>
          <div className="flex gap-4">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => fetchMyLeaves(page - 1)}
              className="hover:text-slate-900 disabled:opacity-20 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              disabled={!pagination.hasNext}
              onClick={() => fetchMyLeaves(page + 1)}
              className="hover:text-slate-900 disabled:opacity-20 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showApply && (
        <div className="fixed inset-0 z-50 bg-white md:bg-slate-900/10 md:backdrop-blur-sm flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl h-full md:h-auto md:rounded-3xl border border-slate-100 shadow-2xl flex flex-col">
            <div className="p-6 md:p-8 flex justify-between items-center">
              <h2 className="text-xl font-medium">New Leave Request</h2>
              <button
                onClick={() => setShowApply(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                <MoreHorizontal />
              </button>
            </div>

            <form
              onSubmit={submitLeave}
              className="p-6 md:p-8 pt-0 space-y-6 overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Start
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Days
                  </label>
                  <input
                    type="number"
                    name="days"
                    value={form.days}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Vacation..."
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-slate-200"
                />
              </div>

              <div className="rounded-2xl border border-slate-100 overflow-hidden">
                <JoditEditor
                  ref={editor}
                  value={form.reason}
                  config={config}
                  onChange={(c) => setForm((f) => ({ ...f, reason: c }))}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all"
                >
                  {loading ? "Sending..." : "Submit request"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApply(false)}
                  className="px-6 py-3 text-slate-500 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveDashboard;
