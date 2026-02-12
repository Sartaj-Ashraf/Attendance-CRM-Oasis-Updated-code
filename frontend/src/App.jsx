import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Toaster } from "sonner";

import Login from "./pages/Login.jsx";
import { FlipWordsDemo } from "./components/welcome.jsx";
import Resetpassword from "./pages/Resetpassword";
import Verify from "./pages/Verify";
import ProtectedRoute from "./components/ProtectedRoute";
import Userdashboard from "./pages/Userdashboard";
import Attendance from "./pages/Dashboard/User/Attendance";
import AdminHome from "./pages/Dashboard/onwer/AdminHome.jsx";
import AddUser from "./pages/Dashboard/onwer/AddUser.jsx";
import AttendanceReportWidget from "./pages/Dashboard/AttendanceReportWidget.jsx";
import Users from "./pages/Dashboard/onwer/Users.jsx";
import AdminAttendance from "./pages/Dashboard/onwer/AdminAttendance.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import ManagerHome from "./pages/Dashboard/Manager/ManagerHome.jsx";
import ManagerEmployees from "./pages/Dashboard/Manager/Employees.jsx";
import MakeAttendance from "./pages/Dashboard/Manager/MakeAttendance.jsx";
import UserHomeDashboard from "./pages/Dashboard/User/UserHome.jsx";
import Departments from "./pages/Dashboard/onwer/Departments.jsx";
import AttendanceDetails from "./pages/Dashboard/onwer/AttendanceDetails.jsx";
import Allmanagers from "./pages/Dashboard/onwer/Allmanagers.jsx";
import BlockedUsers from "./pages/Dashboard/onwer/BlockedUsers.jsx";
import Navbar from "./components/Navbar.jsx";
import { ViewManagers } from "./pages/Dashboard/Manager/ViewManagers.jsx";
import OwnerSettings from "./pages/OwnerSettings.jsx";
import UserSettings from "./pages/UserSettings.jsx";
import ApplyLeave from "./components/ApplyLeave.jsx";
import ManageLeaves from "./components/ManageLeaves.jsx";
import EditComponent from "./pages/Dashboard/EditComponent.jsx";
import TopBar from "./pages/Dashboard/Topbar.jsx";
import Profile from "./components/profile/Profile.jsx";
import AttendanceHistory from "./pages/Dashboard/User/AttendanceHistory.jsx";
import Notifications from "./pages/Dashboard/User/Notifications.jsx";
import Salary from "./pages/Dashboard/User/Salary.jsx";
const router = createBrowserRouter([
  {
    path: "/test5",
    element: <Profile />,
  },
  {
    path: "/test4",
    element: <EditComponent />,
  },
  {
    path: "/test",
    element: <ManageLeaves />,
  },
  {
    path: "/test2",
    element: <FlipWordsDemo />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <Resetpassword />,
  },
  {
    path: "/set-password",
    element: <Verify />,
  },
  {
    path: "/resetpassword",
    element: <Resetpassword />,
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["employee"]}>
        <Userdashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <UserHomeDashboard />,
      },
      {
        path: "attendance",
        element: <Attendance />,
      },
      {
        path: "leave",
        element: <ApplyLeave />,
      },
      {
        path: "salary",
        element: <Salary />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "history",
        element: <AttendanceHistory />,
      },
      {
        path: "settings",
        element: <UserSettings />,
      },
    ],
  },
  {
    path: "/manager",
    element: (
      <ProtectedRoute allowedRoles={["manager"]}>
        <ManagerDashboard />
      </ProtectedRoute>
    ),

    children: [
      {
        index: true,
        element: <ManagerHome />,
      },
      {
        path: "attendance",
        element: <MakeAttendance />,
      },
      {
        path: "manage-leaves",
        element: <ManageLeaves />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "department",
        element: <Departments />,
      },
      {
        path: "employees",
        element: <ManagerEmployees />,
      },
      {
        path: "settings",
        element: <UserSettings />,
      },
    ],
  },

  {
    path: "/owner",
    element: (
      <ProtectedRoute allowedRoles={["owner"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminHome />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "attendance",
        element: <MakeAttendance />,
      },
      {
        path: "managers",
        element: <Allmanagers />,
      },
      {
        path: "department",
        element: <Departments />,
      },
      {
        path: "block-users",
        element: <BlockedUsers />,
      },
      { path: "reports", element: <AttendanceReportWidget /> },
      {
        path: "settings",
        element: <OwnerSettings />,
      },
      {
        path: "manage-leaves",
        element: <ManageLeaves />,
      },
      {
        path: "see-employee-attendance/:userId", // ✅ NO slash
        element: <Attendance />,
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <div className="">
        <Toaster richColors position="top-right" />

        <RouterProvider router={router} />
      </div>
    </>
  );
};

export default App;
