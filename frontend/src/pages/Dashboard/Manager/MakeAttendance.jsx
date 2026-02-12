"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, Calendar, CheckCircle2, Lock, Info } from "lucide-react"; // Suggested: npm install lucide-react
import api from "../../../axios/axios.js";
import ConfirmModal from "../../../components/confrim/ConfirmModal.jsx";

const STATUS = ["present", "absent", "late", "leave"];

const MakeAttendance = () => {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [authUser, setAuthUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});

  const [attendanceLoaded, setAttendanceLoaded] = useState(false);
  const [isHolidayMarked, setIsHolidayMarked] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const isSunday = new Date(date).getDay() === 0;

  /* ================= FETCH LOGIC (UNCHANGED) ================= */
  const fetchEmployees = async (user) => {
    try {
      const res =
        user.role === "owner"
          ? await api.get("/owner/getAllEmployeesForAttendance")
          : await api.get("/owner/getAllUsers", {
              params: { department: user.department?._id },
            });
      setEmployees(res.data?.data || []);
    } catch {
      toast.error("Failed to load employees");
    }
  };

  const fetchAttendanceByDate = async (selectedDate) => {
    try {
      const res = await api.get("/api/GetAttendanceByDate", {
        params: { date: selectedDate },
      });
      const map = {};
      res.data?.data?.forEach((row) => {
        if (!row.user?._id) return;
        map[row.user._id] = {
          status: row.status,
          note: row.note || "",
          isLocked: row.isLocked || false,
        };
      });
      employees.forEach((emp) => {
        if (!map[emp._id]) {
          map[emp._id] = { status: null, note: "", isLocked: false };
        }
      });
      setAttendance(map);
    } catch {
      toast.error("Failed to load attendance");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/isAuth");
        setAuthUser(res.data.user);
        await fetchEmployees(res.data.user);
      } catch {
        toast.error("Authentication failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!authUser || employees.length === 0) return;
    fetchAttendanceByDate(date);
    setAttendanceLoaded(true);
    setIsHolidayMarked(false);
  }, [authUser, employees, date]);

  useEffect(() => {
    if (!isSunday || !attendanceLoaded || isHolidayMarked) return;
    const holidayMap = {};
    employees.forEach((emp) => {
      holidayMap[emp._id] = {
        status: "holiday",
        note: "Sunday Holiday",
        isLocked: true,
      };
    });
    setAttendance(holidayMap);
    setIsHolidayMarked(true);
  }, [isSunday, attendanceLoaded, employees, isHolidayMarked]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((e) =>
      e.username?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [employees, search]);

  const markAttendance = (userId, status) => {
    if (isSunday || attendance[userId]?.isLocked) return;
    setAttendance((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], status },
    }));
  };

  const updateNote = (userId, note) => {
    if (attendance[userId]?.isLocked) return;
    setAttendance((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], note },
    }));
  };

  const submitAttendance = async () => {
    const records = Object.entries(attendance)
      .filter(([_, v]) => v.status)
      .map(([userId, v]) => ({
        userId,
        status: v.status,
        note: v.note || "",
        isLocked: v.isLocked || false,
      }));

    if (!records.length) {
      toast.error("Please mark at least one employee");
      return;
    }

    try {
      await api.post("/owner/attendance/bulk", { date, records });
      toast.success("Attendance saved successfully");
      setShowSubmitConfirm(false);
      fetchAttendanceByDate(date);
    } catch {
      toast.error("Attendance submission failed");
    }
  };

  /* ================= UI HELPERS ================= */
  const getStatusStyles = (currentStatus, s) => {
    const isActive = currentStatus === s;
    if (!isActive)
      return "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50";

    switch (s) {
      case "present":
        return "bg-emerald-500 text-white border-emerald-600 shadow-sm";
      case "absent":
        return "bg-rose-500 text-white border-rose-600 shadow-sm";
      case "late":
        return "bg-amber-500 text-white border-amber-600 shadow-sm";
      case "leave":
        return "bg-sky-500 text-white border-sky-600 shadow-sm";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading records...</p>
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#f8fafc] min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Attendance Management
          </h1>
          <p className="text-slate-500 text-sm">
            Mark and track daily employee presence
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full md:w-64"
            />
          </div>

          {!isSunday && (
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              Submit
            </button>
          )}
        </div>
      </div>

      {/* SUNDAY BANNER */}
      {isSunday && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-center gap-3 text-amber-800">
          <Info className="w-5 h-5" />
          <p className="text-sm font-medium">
            Today is Sunday. Attendance is automatically marked as Holiday and
            locked.
          </p>
        </div>
      )}

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status & Remarks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => {
                const current = attendance[emp._id] || {};
                const isLocked = current.isLocked || isSunday;

                return (
                  <tr
                    key={emp._id}
                    className={`transition-colors ${isLocked ? "bg-slate-50/50" : "hover:bg-blue-50/30"}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700">
                          {emp.username}
                        </span>
                        <span className="text-xs text-slate-400">
                          {emp.department?.name || "No Department"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap gap-2">
                          {isSunday ? (
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Holiday
                            </span>
                          ) : (
                            STATUS.map((s) => (
                              <button
                                key={s}
                                disabled={isLocked}
                                onClick={() => markAttendance(emp._id, s)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize border transition-all duration-200 ${getStatusStyles(current.status, s)} ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                              >
                                {s}
                              </button>
                            ))
                          )}
                          {current.isLocked && !isSunday && (
                            <span className="text-slate-400 flex items-center gap-1 text-xs">
                              <Lock className="w-3 h-3" /> Locked
                            </span>
                          )}
                        </div>

                        {current.status &&
                          current.status !== "present" &&
                          current.status !== "holiday" && (
                            <div className="relative max-w-md">
                              <textarea
                                rows={1}
                                maxLength={120}
                                placeholder="Add a reason or note..."
                                value={current.note}
                                disabled={isLocked}
                                onChange={(e) =>
                                  updateNote(emp._id, e.target.value)
                                }
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none disabled:bg-transparent disabled:border-transparent disabled:italic"
                              />
                            </div>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td
                    colSpan="2"
                    className="px-6 py-10 text-center text-slate-400 italic"
                  >
                    No employees found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showSubmitConfirm && (
        <ConfirmModal
          title="Confirm Submission"
          message="This will save the attendance records for the selected date. Proceed?"
          onCancel={() => setShowSubmitConfirm(false)}
          onConfirm={submitAttendance}
        />
      )}
    </div>
  );
};

export default MakeAttendance;
