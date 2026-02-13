
"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Inbox,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../axios/axios.js";

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedReason, setExpandedReason] = useState(null);
  const [editedDays, setEditedDays] = useState({});

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState(null);

  /* ================= FETCH ================= */
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

  /* ================= ACTIONS ================= */

  const approveLeave = async (leaveId, isPaid, days) => {
    if (!days || days <= 0)
      return toast.error("Days must be greater than 0");

    const toastId = toast.loading("Processing approval...");
    try {
      setActionLoading(leaveId);

      await api.patch(`/leaves/approve/${leaveId}`, {
        isPaid,
        days,
      });

      setLeaves((prev) =>
        prev.map((l) =>
          l._id === leaveId
            ? { ...l, status: "approved", isPaid, days }
            : l
        )
      );

      toast.success("Leave approved", { id: toastId });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to approve",
        { id: toastId }
      );
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
          l._id === leaveId
            ? { ...l, status: "rejected", isPaid: false }
            : l
        )
      );

      toast.success("Leave rejected", { id: toastId });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to reject",
        { id: toastId }
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* ================= STATUS BADGE ================= */

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
        <p className="text-slate-500 font-medium animate-pulse">
          Loading requests...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto p-4 md:p-8 space-y-8 bg-[#fdfdfd] min-h-screen">

      <h1 className="text-2xl font-bold text-slate-800">
        Leave Requests
      </h1>

      {/* ================= TABLE ================= */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold">
                Employee
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold">
                Subject & Days
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {leaves.map((leave) => (
              <tr
                key={leave._id}
                className={`${actionLoading === leave._id ? "opacity-40" : ""
                  }`}
              >
                <td className="px-6 py-5">
                  {leave.user?.username}
                </td>

                <td className="px-6 py-5">
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold">
                      {leave.subject}
                    </span>

                    {leave.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <input
                          type="number"
                          min="1"
                          value={
                            editedDays[leave._id] ?? leave.days
                          }
                          onChange={(e) =>
                            setEditedDays((prev) => ({
                              ...prev,
                              [leave._id]: Number(
                                e.target.value
                              ),
                            }))
                          }
                          className="w-16 px-2 py-1 text-xs border rounded-md"
                        />
                        <span className="text-xs text-slate-400">
                          Day(s)
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">
                        {leave.days} Day(s)
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-5">
                  {getStatusBadge(
                    leave.status,
                    leave.isPaid
                  )}
                </td>

                <td className="px-6 py-5 text-right">
                  {leave.status === "pending" ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          approveLeave(
                            leave._id,
                            true,
                            editedDays[leave._id] ??
                            leave.days
                          )
                        }
                        className="px-3 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                      >
                        PAID
                      </button>

                      <button
                        onClick={() =>
                          approveLeave(
                            leave._id,
                            false,
                            editedDays[leave._id] ??
                            leave.days
                          )
                        }
                        className="px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        UNPAID
                      </button>

                      <button
                        onClick={() =>
                          rejectLeave(leave._id)
                        }
                        className="px-3 py-1.5 text-xs font-bold bg-rose-500 text-white rounded-md hover:bg-rose-600"
                      >
                        REJECT
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-300 text-xs">
                      Processed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}

      {pagination && (
        <div className="flex justify-between items-center pt-4">
          <span className="text-xs text-slate-500">
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => {
                const prev = page - 1;
                setPage(prev);
                fetchLeaves(prev);
              }}
              className="px-3 py-1 text-xs border rounded"
            >
              Previous
            </button>

            <button
              disabled={!pagination.hasNext}
              onClick={() => {
                const next = page + 1;
                setPage(next);
                fetchLeaves(next);
              }}
              className="px-3 py-1 text-xs border rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLeaves;