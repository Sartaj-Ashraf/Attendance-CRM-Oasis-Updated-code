import React, { useEffect, useMemo, useState } from "react";
import api from "../../../axios/axios";
import { toast } from "sonner";

const AttendanceHistory = () => {
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [records, setRecords] = useState([]);

  /* ================= FETCH HISTORY ================= */
  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);

      const res = await api.get("/attendance/history", {
        params: { month },
      });

      setRecords(res.data?.data || []);
    } catch {
      toast.error("Failed to fetch attendance history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceHistory();
  }, [month]);

  /* ================= SUMMARY ================= */
  const summary = useMemo(() => {
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      leave: 0,
      holiday: 0,
      total: records.length,
    };

    records.forEach((r) => {
      if (stats[r.status] !== undefined) {
        stats[r.status]++;
      }
    });

    return stats;
  }, [records]);

  const badgeColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700";
      case "absent":
        return "bg-red-100 text-red-700";
      case "late":
        return "bg-yellow-100 text-yellow-700";
      case "leave":
        return "bg-blue-100 text-blue-700";
      case "holiday":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Attendance History
        </h1>

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          ["Present", summary.present, "bg-green-50"],
          ["Absent", summary.absent, "bg-red-50"],
          ["Late", summary.late, "bg-yellow-50"],
          ["Leave", summary.leave, "bg-blue-50"],
          ["Holiday", summary.holiday, "bg-purple-50"],
          ["Total", summary.total, "bg-gray-50"],
        ].map(([label, value, bg]) => (
          <div
            key={label}
            className={`rounded-xl border border-gray-200 p-4 ${bg}`}
          >
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-800">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Day</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Note</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-8 text-gray-500"
                >
                  Loading attendance...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-8 text-gray-500"
                >
                  No attendance records found
                </td>
              </tr>
            ) : (
              records.map((r) => {
                const dateObj = new Date(r.date);

                return (
                  <tr key={r._id}>
                    <td className="px-6 py-4">
                      {dateObj.toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {dateObj.toLocaleDateString("en-IN", {
                        weekday: "long",
                      })}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${badgeColor(
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {r.note || "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceHistory;
