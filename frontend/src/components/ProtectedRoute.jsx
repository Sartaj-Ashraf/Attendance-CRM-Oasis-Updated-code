import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../ContextApi/isAuth";
import toast, { Toaster } from "react-hot-toast";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuth, loading, user } = useContext(AuthContext);

  // 🔔 Toast feedback
  useEffect(() => {
    if (!loading && !isAuth) {
      toast.error("Please login to access this page");
    }

    if (
      !loading &&
      isAuth &&
      allowedRoles &&
      !allowedRoles.includes(user?.role)
    ) {
      toast.error("You are not authorized to access this page");
    }
  }, [loading, isAuth, allowedRoles, user]);

  // 1️⃣ Auth loading state
  if (loading) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
          <div className="flex flex-col items-center gap-4 text-white">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium tracking-wide">
              Checking authentication...
            </p>
            <p className="text-sm text-gray-400">Please wait</p>
          </div>
        </div>
      </>
    );
  }

  // 2️⃣ Not logged in
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Role not allowed
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4️⃣ Authorized
  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  );
};

export default ProtectedRoute;
