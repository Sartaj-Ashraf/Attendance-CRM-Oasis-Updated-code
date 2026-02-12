import axios from "axios";
import { toast } from "sonner"; // ✅ MISSING IMPORT

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // 🍪 cookie-based auth
});

// 🔥 GLOBAL RESPONSE INTERCEPTOR
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error?.response?.status;
//     const code = error?.response?.data?.code;
//     const message = error?.response?.data?.message;

//     // 🔐 AUTH / FORCE LOGOUT HANDLING
//     if (status === 401) {
//       if (code === "FORCE_LOGOUT") {
//         toast.error(
//           message || "You were logged out by admin for security reasons"
//         );
//       } else {
//         toast.warning(message || "Session expired. Please login again.");
//       }

//       // Optional: clear cookie on backend
//       // api.post("/auth/logout").catch(() => {});

//       // ⏳ Delay so toast is visible
//       setTimeout(() => {
//         window.location.href = "/login";
//       }, 1200);
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
