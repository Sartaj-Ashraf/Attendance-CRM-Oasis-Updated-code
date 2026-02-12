import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import api from "../../../axios/axios";
import { AuthContext } from "../../../ContextApi/isAuth";

const AdminSidebar = () => {
  const { user, setIsAuth, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState(0);

  // ✅ UI-only state for burger menu (no business logic impact)
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await api.post("/user/logout");
      setIsAuth(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const leaveCount = async () => {
    try {
      const res = await api.get("/leaves/pending-leaves");
      setLeaves(res.data.pendingLeaves);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    leaveCount();
  }, []);

  const navItem =
    "nav-link flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200";

  const activeNav = "bg-blue-600 text-white shadow-md";
  const inactiveNav =
    "bg-blue-50 text-gray-700 hover:bg-blue-100 hover:text-blue-600";

  return (
    <>
      {/* ===== BURGER BUTTON (MOBILE ONLY) ===== */}
      <button
        onClick={() => setOpen(true)}
        className="
          fixed top-4 left-4 z-50
          sm:hidden                        /* ✅ only on small devices */
          bg-white shadow-lg rounded-lg
          p-2.5
        "
      >
        <i className="fas fa-bars text-gray-700 text-lg"></i>
      </button>

      {/* ===== OVERLAY (MOBILE) ===== */}
      <div
        onClick={() => setOpen(false)}
   
  className={`
    fixed inset-0 bg-black/40
    transition-opacity
    ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
  `}
/>

   
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen
          w-64 md:w-60                     /* ✅ responsive width */
          transform transition-transform duration-300
          bg-transparent
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full sm:translate-x-0"
          }                                 /* ✅ slide-in on mobile */
        `}
      >
        <div className="bg-white h-full shadow-xl flex flex-col overflow-hidden">
          {/* ===== HEADER ===== */}
          <div className="px-6 py-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
            <h2
              onClick={() => {
                navigate("/owner");
                setOpen(false); // ✅ close on mobile navigation
              }}
              className="text-lg font-bold text-gray-800 cursor-pointer flex items-center gap-2"
            >
              <i className="fas fa-crown text-blue-600"></i>
              Admin Home
            </h2>

            {/* Close button (mobile only) */}
            <button
              onClick={() => setOpen(false)}
              className="sm:hidden text-gray-600"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          {/* ===== NAVIGATION ===== */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <NavLink
              to="/owner"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeNav : inactiveNav}`
              }
            >
              <i className="fas fa-home text-blue-500"></i>
              Home
            </NavLink>

            <NavLink
              to="/owner/users"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeNav : inactiveNav}`
              }
            >
              <i className="fas fa-users text-blue-500"></i>
              Employees
            </NavLink>

            <NavLink
              to="/owner/managers"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeNav : inactiveNav}`
              }
            >
              <i className="fas fa-user-tie text-green-500"></i>
              Managers
            </NavLink>

            <NavLink
              to="/owner/attendance"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeNav : inactiveNav}`
              }
            >
              <i className="fas fa-calendar-check text-purple-500"></i>
              Attendance
            </NavLink>

            <NavLink
              to="/owner/manage-leaves"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeNav : inactiveNav}`
              }
            >
              <i className="fas fa-clipboard-list text-green-500"></i>
              Manage Leave
              {leaves > 0 && (
                <sup className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                  {leaves}
                </sup>
              )}
            </NavLink>

            <div className="pt-3 mt-3 border-t">
              <NavLink
                to="/owner/settings"
                end
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${navItem} ${isActive ? activeNav : inactiveNav}`
                }
              >
                <i className="fas fa-cog text-gray-500"></i>
                Settings
              </NavLink>
            </div>
          </nav>

          {/* ===== USER / LOGOUT ===== */}
          <div className="px-5 py-4 border-t bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-semibold">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>

            <button
              onClick={logoutHandler}
              className="w-full text-sm px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
