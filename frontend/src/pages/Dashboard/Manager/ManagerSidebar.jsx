// import { NavLink, useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import api from "../../../axios/axios";
// import { AuthContext } from "../../../ContextApi/isAuth";

// const ManagerSidebar = () => {
//   const { user, setIsAuth, setUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const logoutHandler = async () => {
//     try {
//       await api.post("/user/logout");
//       setIsAuth(false);
//       setUser(null);
//       navigate("/login");
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   // console.log(user)

//   return (
//     <aside className="w-64 h-screen bg-gray-100 p-4">
//       <div className="bg-white h-full rounded-2xl shadow-lg flex flex-col">
//         <div className="px-6 py-5 border-b">
//             <h2 className="text-xl font-bold text-gray-800 tracking-wide">
//              <NavLink
//             to="/manager">
//                Manager Home
//           </NavLink>
//           </h2>
//         </div>
//         <nav className="flex-1 px-4 py-6 space-y-2">
//           <NavLink
//             to="/manager/employees"
//             className={({ isActive }) =>
//               `block bg-blue-50 px-4 py-3 rounded-lg text-sm font-medium transition ${
//                 isActive
//                   ? "bg-blue-600 text-white"
//                   : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
//               }`
//             }
//           >
//             Users
//           </NavLink>
//           <NavLink
//             to="/test3"
//             className={({ isActive }) =>
//               `block bg-blue-50 px-4 py-3 rounded-lg text-sm font-medium transition ${
//                 isActive
//                   ? "bg-blue-600 text-white"
//                   : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
//               }`
//             }
//           >
//             Managers
//           </NavLink>

//           <NavLink
//             to="/manager/attendance"
//             className={({ isActive }) =>
//               `block bg-blue-50 px-4 py-3 rounded-lg text-sm font-medium transition ${
//                 isActive
//                   ? "bg-blue-600 text-white"
//                   : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
//               }`
//             }
//           >
//             Attendance
//           </NavLink>
//           <NavLink
//             to="/owner/block-users"
//             className={({ isActive }) =>
//               `block bg-blue-50 px-4 py-3 rounded-lg text-sm font-medium transition ${
//                 isActive
//                   ? "bg-blue-600 text-white"
//                   : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
//               }`
//             }
//           >
//             Blocked Users
//           </NavLink>
//         </nav>

//         {/* ===== BOTTOM (logout always visible) ===== */}
//         <div className="px-5 py-4 border-t bg-gray-50 rounded-b-2xl">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
//               {user?.username?.charAt(0).toUpperCase()}
//             </div>

//             {/* User info */}
//             <div className="leading-tight">
//               <p className="text-sm font-medium text-gray-800">
//                 {user?.username}
//               </p>
//               <p className="text-xs text-gray-500">
//                 {`${user?.role} (${user?.department?.name})`}
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={logoutHandler}
//             className="w-full text-sm px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition font-medium"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default ManagerSidebar;


// import { NavLink, useNavigate } from "react-router-dom";
// import { useContext, useState, useEffect } from "react";
// import api from "../../../axios/axios";
// import { AuthContext } from "../../../ContextApi/isAuth";

// const ManagerSidebar = () => {
//   const { user, setIsAuth, setUser } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [leaves, setLeaves] = useState(0);
//   const logoutHandler = async () => {
//     try {
//       await api.post("/user/logout");
//       setIsAuth(false);
//       setUser(null);
//       navigate("/login");
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   const leaveCount = async () => {
//     try {
//       const res = await api.get("/leaves/pending-leaves");
//       setLeaves(res.data.pendingLeaves);
//     } catch (error) {
//       console.error(error);
//     } finally {
//     }
//   };

//   useEffect(() => {
//     leaveCount();
//   }, []);
//   const navItem =
//     "nav-link flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:translate-x-1";

//   const activeNav = "bg-blue-600 text-white shadow-md";
//   const inactiveNav =
//     "bg-blue-50 text-gray-700 hover:bg-blue-100 hover:text-blue-600";

//   return (
//     <aside className="fixed left-0 top-0 w-60 h-screen">
//       <div className="bg-white h-full rounded-2xl shadow-lg flex flex-col overflow-hidden">
//         {/* ===== HEADER ===== */}
//         <div className="px-6 py-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
//           <h2
//             onClick={() => navigate("/manager")}
//             className="text-xl font-bold text-gray-800 cursor-pointer flex items-center gap-2"
//           >
//             <i className="fas fa-crown text-blue-600"></i>
//             Admin Home
//           </h2>
//         </div>

//         {/* ===== NAVIGATION ===== */}
//         <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
//           <NavLink
//             to="/owner"
//             end
//             className={({ isActive }) =>
//               `${navItem} ${isActive ? activeNav : inactiveNav}`
//             }
//           >
//             <i className="fas fa-home text-blue-500"></i>
//             Home
//           </NavLink>
//               <NavLink
//             to="/manager/employees"
//             className={({ isActive }) =>
//               `block bg-blue-50 px-4 py-3 rounded-lg text-sm font-medium transition ${
//                 isActive
//                   ? "bg-blue-600 text-white"
//                   : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
//               }`
//             }
//           >
//             Users
//            </NavLink>
           
//           <NavLink
//             end
//             to="/manager/attendance"
//             className={({ isActive }) =>
//               `${navItem} ${isActive ? activeNav : inactiveNav}`
//             }
//           >
//             <i className="fas fa-calendar-check text-purple-500"></i>
//             Attendance
//           </NavLink>

//           <NavLink
//             end
//             to="/manager/department"
//             className={({ isActive }) =>
//               `${navItem} ${isActive ? activeNav : inactiveNav}`
//             }
//           >
//             <i className="fas fa-building text-orange-500"></i>
//             Departments
//           </NavLink>

//           <NavLink
//             end
//             to="/owner/block-users"
//             className={({ isActive }) =>
//               `${navItem} ${isActive ? activeNav : inactiveNav}`
//             }
//           >
//             <i className="fas fa-user-slash text-red-500"></i>
//             Blocked Users
//           </NavLink>
//           <NavLink
//             end
//             to="/manager/manage-leaves"
//             className={({ isActive }) =>
//               `${navItem} ${isActive ? activeNav : inactiveNav}`
//             }
//           >
//             <i className="fas fa-clipboard-list text-green-500"></i>
//             Manage Leave
//             {leaves > 0 && (
//               <sup className="ml-1 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
//                 {leaves}
//               </sup>
//             )}
//           </NavLink>

//           {/* ===== EXTRA SECTION ===== */}
//           <div className="pt-4 mt-4 border-t">
//             <NavLink
//               end
//               to="/owner/reports"
//               className={({ isActive }) =>
//                 `${navItem} ${isActive ? activeNav : inactiveNav}`
//               }
//             >
//               <i className="fas fa-chart-bar text-indigo-500"></i>
//               Reports
//             </NavLink>

//             <NavLink
//               end
//               to="/owner/settings"
//               className={({ isActive }) =>
//                 `${navItem} ${isActive ? activeNav : inactiveNav}`
//               }
//             >
//               <i className="fas fa-cog text-gray-500"></i>
//               Settings
//             </NavLink>
//           </div>
//         </nav>

//         {/* ===== USER PROFILE + LOGOUT ===== */}
//         <div className="px-5 py-4 border-t bg-gradient-to-t from-gray-50 to-white rounded-b-2xl">
//           <div className="flex items-center gap-3 mb-3">
//             {/* Avatar */}
//             <div className="relative">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm shadow-lg">
//                 {user?.username?.charAt(0).toUpperCase()}
//               </div>
//               <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
//             </div>

//             {/* User Info */}
//             <div className="leading-tight">
//               <p className="text-sm font-semibold text-gray-800">
//                 {user?.username}
//               </p>
//               <p className="text-xs text-gray-500 flex items-center gap-1">
//                 <i className="fas fa-shield-alt text-blue-500"></i>
//                 {user?.role}
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={logoutHandler}
//             className="w-full text-sm px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition font-medium shadow-md hover:shadow-lg"
//           >
//             <i className="fas fa-sign-out-alt mr-2"></i>
//             Logout
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default ManagerSidebar;


import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import api from "../../../axios/axios";
import { AuthContext } from "../../../ContextApi/isAuth";

const ManagerSidebar = () => {
  const { user, setIsAuth, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pendingLeaves, setPendingLeaves] = useState(0);

  /* ================= LOGOUT ================= */
  const logoutHandler = async () => {
    try {
      await api.post("/user/logout");
      setIsAuth(false);
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FETCH PENDING LEAVES ================= */
  useEffect(() => {
    const fetchPendingLeaves = async () => {
      try {
        const res = await api.get("/manager/leaves/pending-count");
        setPendingLeaves(res.data.count || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPendingLeaves();
  }, []);

  const baseLink =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all";
  const active =
    "bg-blue-600 text-white shadow";
  const inactive =
    "text-gray-700 hover:bg-blue-50 hover:text-blue-600";

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-white shadow-xl z-40">
      <div className="h-full flex flex-col">

        {/* ================= HEADER ================= */}
        <div
          onClick={() => navigate("/manager/dashboard")}
          className="px-6 py-5 border-b cursor-pointer"
        >
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <i className="fas fa-user-tie text-blue-600"></i>
            Manager Panel
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Department Dashboard
          </p>
        </div>

        {/* ================= NAV ================= */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavLink
            to="/manager"
            end
            className={({ isActive }) =>
              `${baseLink} ${isActive ? active : inactive}`
            }
          >
            <i className="fas fa-home"></i>
            Home
          </NavLink>

          <NavLink
            to="/manager/employees"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? active : inactive}`
            }
          >
            <i className="fas fa-users"></i>
            My Employees
          </NavLink>

          <NavLink
            to="/manager/attendance"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? active : inactive}`
            }
          >
            <i className="fas fa-calendar-check"></i>
            Attendance
          </NavLink>

          <NavLink
            to="/manager/manage-leaves"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? active : inactive}`
            }
          >
            <i className="fas fa-clipboard-list"></i>
            Leave Requests
            {pendingLeaves > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingLeaves}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/manager/department"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? active : inactive}`
            }
          >
            <i className="fas fa-building"></i>
             Departments
          </NavLink>
          <NavLink
            to="/manager/profile"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? active : inactive}`
            }
          >
            <i className="fas fa-user "></i>
             My Profile
          </NavLink>
          
        </nav>

        {/* ================= USER FOOTER ================= */}
        <div className="px-5 py-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {user?.username?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500">
                {user?.department?.name}
              </p>
            </div>
          </div>

          <button
            onClick={logoutHandler}
            className="w-full py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ManagerSidebar;
