import React from "react";

/* ================= HELPERS ================= */
const formatStatus = (status = "") =>
  status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";

const getStatusColor = (status) => {
  switch (status) {
    case "present":
      return "text-green-600";
    case "absent":
      return "text-red-600";
    case "late":
      return "text-yellow-600";
    case "leave":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* ================= COMPONENT ================= */
const AttendanceTable = ({ data = [] }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Note</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center py-6 text-gray-500">
                No attendance records found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item._id || `${item.user}-${item.date}`}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-6 py-4">{formatDate(item.date)}</td>

                <td
                  className={`px-6 py-4 font-semibold ${getStatusColor(
                    item.status
                  )}`}
                >
                  {formatStatus(item.status)}
                </td>

                <td className="px-6 py-4 text-gray-600">{item.note || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
