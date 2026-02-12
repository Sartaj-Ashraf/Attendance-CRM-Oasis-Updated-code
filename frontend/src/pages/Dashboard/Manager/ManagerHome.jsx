//   import React from "react";
// import { useNavigate } from "react-router-dom";
// import Card from "../../../components/Statecard";

// const ManagerHome = () => {
//   const navigate = useNavigate();

//   // 🔹 Later replace with API data
//   const stats = {
//     totalEmployees: 25,
//     present: 20,
//     absent: 3,
//     late: 2,
//   };

//   return (
//     <div className="ml-5 min-h-screen bg-gray-50 px-8 py-6">
//       {/* ===== PAGE HEADER ===== */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-800">
//           Manager Dashboard
//         </h1>
//         <p className="text-sm text-gray-500 mt-1">
//           Overview of your department activity
//         </p>
//       </div>

//       {/* ===== STATS ===== */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card title="Total Employees" value={stats.totalEmployees} />
//         <Card title="Present Today" value={stats.present} color="green" />
//         <Card title="Absent Today" value={stats.absent} color="red" />
//         <Card title="Late Today" value={stats.late} color="yellow" />
//       </div>

//       {/* ===== QUICK ACTIONS ===== */}
//       <div className="mt-10 bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-lg font-semibold text-gray-800">
//             Quick Actions
//           </h2>
//           <p className="text-sm text-gray-500">
//             Frequently used manager actions
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={() => navigate("/manager/attendance")}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
//           >
//             Mark Attendance
//           </button>

//           <button
//             onClick={() => navigate("/manager/manage-leaves")}
//             className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
//           >
//             Review Leaves
//           </button>
//         </div>
//       </div>

//       {/* ===== OPTIONAL SECTION (PLACEHOLDER) ===== */}
//       <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl shadow p-6">
//           <h3 className="text-md font-semibold text-gray-800 mb-2">
//             Pending Tasks
//           </h3>
//           <p className="text-sm text-gray-500">
//             Leave approvals, attendance submissions, and alerts will appear here.
//           </p>
//         </div>

//         <div className="bg-white rounded-xl shadow p-6">
//           <h3 className="text-md font-semibold text-gray-800 mb-2">
//             Department Summary
//           </h3>
//           <p className="text-sm text-gray-500">
//             Monthly attendance and performance summary (coming soon).
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagerHome;

import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/Statecard";

const ManagerHome = () => {
  const navigate = useNavigate();

  // 🔹 Replace later with real API stats
  const stats = {
    totalEmployees: 25,
    present: 20,
    absent: 3,
    late: 2,
    pendingLeaves: 4,
  };

  return (
    <div className=" min-h-screen bg-gray-100 px-8 py-8">
      {/* ===== HEADER ===== */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manager Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Control and monitor your department
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex gap-3">
          <button
            onClick={() => navigate("/manager/attendance")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow transition"
          >
            Mark Attendance
          </button>

          <button
            onClick={() => navigate("/manager/manage-leaves")}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium shadow transition"
          >
            Review Leaves
          </button>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <Card title="Total Employees" value={stats.totalEmployees} />
        <Card title="Present Today" value={stats.present} color="green" />
        <Card title="Absent Today" value={stats.absent} color="red" />
        <Card title="Late Today" value={stats.late} color="yellow" />
        <Card
          title="Pending Leaves"
          value={stats.pendingLeaves}
          color="purple"
        />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== LEFT: TASKS ===== */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Manager Tasks
          </h2>

          <div className="space-y-4">
            <TaskItem
              title="Review Leave Requests"
              description="Pending leave approvals from employees"
              action={() => navigate("/manager/manage-leaves")}
              color="green"
            />

            <TaskItem
              title="Submit Attendance"
              description="Mark or update today’s attendance"
              action={() => navigate("/manager/attendance")}
              color="blue"
            />

            <TaskItem
              title="Manage Employees"
              description="Add or block employees from your department"
              action={() => navigate("/manager/employees")}
              color="indigo"
            />
          </div>
        </div>

        {/* ===== RIGHT: INSIGHTS ===== */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Department Insights
          </h2>

          <ul className="space-y-3 text-sm text-gray-600">
            <li>• Attendance submission pending for today</li>
            <li>• 3 employees absent today</li>
            <li>• 2 late arrivals this week</li>
            <li>• 4 leave requests awaiting action</li>
          </ul>

          <div className="mt-6 text-xs text-gray-400">
            * Insights update daily
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;

/* ===== TASK ITEM COMPONENT ===== */
const TaskItem = ({ title, description, action, color }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    indigo: "bg-indigo-100 text-indigo-700",
  };

  return (
    <div
      onClick={action}
      className="cursor-pointer flex items-center justify-between p-4 rounded-xl border hover:shadow transition bg-gray-50"
    >
      <div>
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <span
        className={`px-3 py-1 text-xs rounded-full font-medium ${colors[color]}`}
      >
        Open
      </span>
    </div>
  );
};

