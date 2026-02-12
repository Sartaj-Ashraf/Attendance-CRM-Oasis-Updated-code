import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddUser from "./AddUser";
import AttendanceReportWidget from "../AttendanceReportWidget";

const AdminHome = () => {
  const [showAddUser, setShowAddUser] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ===== WELCOME CARD ===== */}
      <div className="bg-white shadow-lg rounded-xl p-5 sm:p-6 md:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Welcome, Admin
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-2">
          Manage users, attendance, and system settings from here.
        </p>
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <ActionCard
            title="Add User"
            description="Create a new employee or admin account"
            color="border-blue-600"
            onClick={() => setShowAddUser(true)}
          />
          <ActionCard
            title="Manage Users"
            description="View, update, or deactivate users"
            color="border-green-600"
            onClick={() => navigate("/owner/users")}
          />
          <ActionCard
            title="Attendance"
            description="View and manage attendance records"
            color="border-purple-600"
            onClick={() => navigate("/owner/attendance")}
          />
          <ActionCard
            title="Manage Leaves"
            description="View and manage leave records"
            color="border-purple-600"
            onClick={() => navigate("/owner/manage-leaves")}
          />
        </div>
      </div>

      {/* ===== ADD USER MODAL ===== */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-3 right-3 text-gray-500 text-lg"
              onClick={() => setShowAddUser(false)}
            >
              ✕
            </button>
            <AddUser onClose={() => setShowAddUser(false)} />
          </div>
        </div>
      )}

      {/* ===== INFO SECTION ===== */}
      <div className="bg-white shadow rounded-xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
          Admin Capabilities
        </h2>
        <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600 space-y-1">
          <li>Add, edit, or deactivate users</li>
          <li>Monitor daily and monthly attendance</li>
          <li>Generate attendance reports</li>
          <li>Control roles and permissions</li>
        </ul>
      </div>

      {/* ===== ATTENDANCE WIDGET ===== */}
      <AttendanceReportWidget />
    </div>
  );
};

const ActionCard = ({ title, description, color, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white shadow rounded-xl
        p-4 sm:p-6
        border-l-4 ${color}
        cursor-pointer transition
        hover:shadow-xl active:scale-[0.98]
      `}
    >
      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 mt-2">
        {description}
      </p>
    </div>
  );
};

export default AdminHome;
