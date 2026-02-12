import { Outlet } from "react-router-dom";
// import Topbar from "../../../components/Topbar";
import Topbar from "./Dashboard/Topbar";
import ManagerSidebar from "./Dashboard/Manager/ManagerSidebar";
const ManagerDashboard = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <ManagerSidebar />

      <div className="ml-64 w-full min-h-screen bg-gray-50">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
};

export default ManagerDashboard;
