"use client";

import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import api from "../../../axios/axios";
import { AuthContext } from "../../../ContextApi/isAuth";
import { 
  Home, 
  CalendarCheck, 
  FileClock, 
  UserCircle, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";

const Sidebar = () => {
  const { user, setIsAuth, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await api.post("/user/logout");
      setIsAuth(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Original navItem base styles
  const navItem =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:translate-x-1";

  // Original Color Scheme
  const activeNav = "bg-blue-600 text-white shadow-md";
  const inactiveNav = "bg-blue-50 text-gray-700 hover:bg-blue-100 hover:text-blue-600";

  return (
    <>
      {/* MOBILE TRIGGER - Keeps the original Blue theme */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-white border border-blue-100 rounded-lg shadow-sm text-blue-600"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* SIDEBAR ASIDE */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40
        transition-all duration-300 ease-in-out
        w-60 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full flex flex-col">
          
          {/* HEADER - Original Gradient */}
          <div className="px-6 py-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div 
              onClick={() => { navigate("/dashboard"); setIsOpen(false); }}
              className="cursor-pointer"
            >
              <h2 className="text-xl font-bold text-gray-800">User Panel</h2>
              <p className="text-xs text-gray-500">Attendance Management</p>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <NavLink
              to="/dashboard"
              end
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `${navItem} ${isActive ? activeNav : inactiveNav}`}
            >
              <Home size={18} /> Home
            </NavLink>

            <NavLink
              to="/dashboard/attendance"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `${navItem} ${isActive ? activeNav : inactiveNav}`}
            >
              <CalendarCheck size={18} /> Attendance
            </NavLink>

            <NavLink
              to="/dashboard/leave"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `${navItem} ${isActive ? activeNav : inactiveNav}`}
            >
              <FileClock size={18} /> Leave Management
            </NavLink>

            <NavLink
              to="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `${navItem} ${isActive ? activeNav : inactiveNav}`}
            >
              <UserCircle size={18} /> My Profile
            </NavLink>
          </nav>

          {/* USER SECTION - Original Gray-50 Footer */}
          <div className="px-5 py-4 border-t bg-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shadow-sm">
                {user?.username?.[0]?.toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            <button
              onClick={logoutHandler}
              className="w-full flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-sm active:scale-95"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;