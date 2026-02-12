import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AttendanceDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();


  // Month selector
  const [selectedMonth, setSelectedMonth] = useState("2025-12");

 
  const records = attendanceData[selectedMonth] || [];

  // Summary calculations
  const totalDays = records.length;
  const presentDays = records.filter(r => r.status === "Present").length;
  const absentDays = records.filter(r => r.status === "Absent").length;
  const lateDays = records.filter(r => r.status === "Late").length;
  const attendancePercent = totalDays
    ? Math.round((presentDays / totalDays) * 100)
    : 0;

  return (
    <div className="p-6">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Attendance Details
          </h1>
          <p className="text-sm text-gray-500">
            {employee.name} • {employee.department} • {employee.employeeId}
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          ← Back
        </button>
      </div>

      {/* ===== MONTH SELECT ===== */}
      <div className="mb-6">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ===== SUMMARY ===== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <SummaryCard title="Working Days" value={totalDays} color="blue" />
        <SummaryCard title="Present" value={presentDays} color="green" />
        <SummaryCard title="Absent" value={absentDays} color="red" />
        <SummaryCard title="Late" value={lateDays} color="orange" />
        <SummaryCard title="Attendance %" value={`${attendancePercent}%`} color="purple" />
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Day</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">In Time</th>
              <th className="px-6 py-3">Out Time</th>
              <th className="px-6 py-3">Remarks</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No attendance records found
                </td>
              </tr>
            ) : (
              records.map((rec, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{rec.date}</td>
                  <td className="px-6 py-4">{rec.day}</td>
                  <td className={`px-6 py-4 font-medium ${statusColor(rec.status)}`}>
                    {rec.status}
                  </td>
                  <td className="px-6 py-4">{rec.in}</td>
                  <td className="px-6 py-4">{rec.out}</td>
                  <td className="px-6 py-4">{rec.remark}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ===== REUSABLE COMPONENTS =====
const SummaryCard = ({ title, value, color }) => {
  const colors = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    orange: "text-orange-500",
    purple: "text-purple-600",
  };

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
};

const statusColor = (status) => {
  if (status === "Present") return "text-green-600";
  if (status === "Absent") return "text-red-600";
  if (status === "Late") return "text-orange-500";
  return "text-gray-600";
};

export default AttendanceDetails;
