import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../axios/axios";

/* ================= HELPERS (UNCHANGED) ================= */
const statusStyle = (status) => {
  switch (status) {
    case "present":
      return "bg-green-100 text-green-700";
    case "absent":
      return "bg-red-100 text-red-700";
    case "late":
      return "bg-yellow-100 text-yellow-700";
    case "leave":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const UserDashboardHome = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [todayAttendance, setTodayAttendance] = useState("—");
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    fetchDashboardAttendance();
  }, []);

  const fetchDashboardAttendance = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const res = await api.get("/user/getCurrentUserdata", {
        params: { page: 1, limit: 10 },
      });

      const records = res.data.data || [];
      const todayRecord = records.find((r) => r.date.split("T")[0] === today);
      setTodayAttendance(todayRecord?.status || "absent");
      setRecentAttendance(records.slice(0, 5));
    } catch (error) {
      console.error("Dashboard attendance error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Welcome back
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          {new Date().toDateString()}
        </p>
      </div>

      {/* ================= TOP CARDS (RESPONSIVE GRID) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Today's Attendance"
          value={todayAttendance.toUpperCase()}
          highlight
          badgeStyle={statusStyle(todayAttendance)}
          loading={loading}
        />
        {/* You can add more StatCards here; they will wrap automatically */}
      </div>

      {/* ================= MAIN CONTENT (STACKS ON MOBILE) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== RECENT ATTENDANCE (FULL WIDTH ON MOBILE) ===== */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm flex flex-col min-w-0">
          <div className="px-5 sm:px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-800">Recent Attendance</h3>
          </div>

          {loading ? (
            <div className="p-6 text-gray-500 text-sm">
              Loading attendance...
            </div>
          ) : recentAttendance.length === 0 ? (
            <div className="p-6 text-gray-500 text-sm">
              No attendance records found
            </div>
          ) : (
            <div className="divide-y overflow-hidden">
              {recentAttendance.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center px-5 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-600 font-medium">
                    {new Date(item.date).toLocaleDateString()}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${statusStyle(
                      item.status,
                    )}`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== QUICK ACTIONS (BOTTOM ON MOBILE) ===== */}
        <div className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6 h-fit">
          <h3 className="font-semibold text-gray-800 mb-4 sm:mb-5">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            <ActionButton
              label="Apply for Leave"
              onClick={() => navigate("/dashboard/leave")}
            />
            <ActionButton
              label="View Attendance"
              onClick={() => navigate("/dashboard/attendance")}
            />
            <div className="sm:col-span-2 lg:col-span-1">
              <ActionButton
                label="Edit Profile"
                onClick={() => navigate("/dashboard/profile")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, highlight, badgeStyle, loading }) => (
  <div
    className={`rounded-2xl border shadow-sm p-5 transition-all ${
      highlight
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
        : "bg-white"
    }`}
  >
    <p
      className={`text-xs sm:text-sm font-medium ${highlight ? "text-blue-100" : "text-gray-500"}`}
    >
      {title}
    </p>

    <div className="mt-3">
      {loading ? (
        <div className="w-24 h-6 bg-white/20 rounded animate-pulse" />
      ) : (
        <span
          className={`inline-block px-4 py-1 rounded-full text-xs sm:text-sm font-bold shadow-sm ${badgeStyle}`}
        >
          {value}
        </span>
      )}
    </div>
  </div>
);

const ActionButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold hover:bg-gray-50 active:bg-gray-100 transition shadow-sm bg-white"
  >
    {label}
  </button>
);

export default UserDashboardHome;
