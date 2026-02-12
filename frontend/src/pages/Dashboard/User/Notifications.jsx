// import React, { useEffect, useState } from "react";
// import api from "../../../axios/axios";
// import { toast } from "sonner";

// const Notifications = () => {
//   const [loading, setLoading] = useState(true);
//   const [notifications, setNotifications] = useState([]);

//   /* ================= FETCH ================= */
//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/notifications");
//       setNotifications(res.data?.data || []);
//     } catch {
//       toast.error("Failed to load notifications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   /* ================= MARK READ ================= */
//   const markAsRead = async (id) => {
//     try {
//       await api.patch(`/notifications/read/${id}`);

//       setNotifications((prev) =>
//         prev.map((n) =>
//           n._id === id ? { ...n, isRead: true } : n
//         )
//       );
//     } catch {
//       toast.error("Failed to update notification");
//     }
//   };

//   const badgeColor = (type) => {
//     switch (type) {
//       case "leave":
//         return "bg-blue-100 text-blue-700";
//       case "attendance":
//         return "bg-green-100 text-green-700";
//       case "salary":
//         return "bg-purple-100 text-purple-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto space-y-6">
//       {/* HEADER */}
//       <h1 className="text-2xl font-bold text-gray-800">
//         Notifications
//       </h1>

//       {/* LIST */}
//       <div className="bg-white rounded-xl shadow-lg border border-gray-200 divide-y">
//         {loading ? (
//           <p className="p-6 text-center text-gray-500">
//             Loading notifications...
//           </p>
//         ) : notifications.length === 0 ? (
//           <p className="p-6 text-center text-gray-500">
//             No notifications available
//           </p>
//         ) : (
//           notifications.map((n) => (
//             <div
//               key={n._id}
//               className={`p-5 flex gap-4 items-start transition ${
//                 n.isRead ? "bg-white" : "bg-blue-50"
//               }`}
//             >
//               {/* DOT */}
//               {!n.isRead && (
//                 <span className="w-2 h-2 mt-2 bg-blue-600 rounded-full"></span>
//               )}

//               {/* CONTENT */}
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-1">
//                   <h3 className="text-sm font-semibold text-gray-800">
//                     {n.title}
//                   </h3>

//                   <span
//                     className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor(
//                       n.type
//                     )}`}
//                   >
//                     {n.type}
//                   </span>
//                 </div>

//                 <p className="text-sm text-gray-600">
//                   {n.message}
//                 </p>

//                 <p className="text-xs text-gray-400 mt-1">
//                   {new Date(n.createdAt).toLocaleString()}
//                 </p>
//               </div>

//               {/* ACTION */}
//               {!n.isRead && (
//                 <button
//                   onClick={() => markAsRead(n._id)}
//                   className="text-xs text-blue-600 hover:underline"
//                 >
//                   Mark as read
//                 </button>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Notifications;
import React, { useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Leave Approved",
      message: "Your leave request for 2 days has been approved.",
      type: "leave",
      isRead: false,
      createdAt: "2025-10-02T09:30:00",
    },
    {
      id: 2,
      title: "Attendance Marked",
      message: "Your attendance has been marked as Present today.",
      type: "attendance",
      isRead: false,
      createdAt: "2025-10-02T09:00:00",
    },
    {
      id: 3,
      title: "Salary Credited",
      message: "Your September salary has been credited successfully.",
      type: "salary",
      isRead: true,
      createdAt: "2025-10-01T18:00:00",
    },
    {
      id: 4,
      title: "Leave Rejected",
      message: "Your leave request was rejected due to workload.",
      type: "leave",
      isRead: true,
      createdAt: "2025-09-28T11:15:00",
    },
  ]);

  /* ================= MARK AS READ ================= */
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  };

  const badgeColor = (type) => {
    switch (type) {
      case "leave":
        return "bg-blue-100 text-blue-700";
      case "attendance":
        return "bg-green-100 text-green-700";
      case "salary":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-gray-800">
        Notifications
      </h1>

      {/* LIST */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 divide-y">
        {notifications.length === 0 ? (
          <p className="p-6 text-center text-gray-500">
            No notifications available
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 flex gap-4 items-start transition ${
                n.isRead ? "bg-white" : "bg-blue-50"
              }`}
            >
              {/* UNREAD DOT */}
              {!n.isRead && (
                <span className="w-2 h-2 mt-2 bg-blue-600 rounded-full"></span>
              )}

              {/* CONTENT */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {n.title}
                  </h3>

                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor(
                      n.type
                    )}`}
                  >
                    {n.type}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  {n.message}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              {/* ACTION */}
              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
