import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/axios.js";
import { AuthContext } from "../ContextApi/isAuth.jsx";
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FlipWordsDemo } from "../components/welcome.jsx";

const Login = () => {
  const { setUser, setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showWelcome, setshowWelcome] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });

  const [showEye, setShowEye] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const lastClickRef = useRef(0);

  const changeHandler = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const submitDetails = async () => {
    const now = Date.now();
    if (now - lastClickRef.current < 800 || loading) return;
    lastClickRef.current = now;

    if (!formdata.email || !formdata.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/user/login", formdata);

      setIsAuth(true);
      setUser(data.user);
      setUserRole(data.user.role);

      setSuccess(true);
      toast.success("Login successful");
      setshowWelcome(true);

      setTimeout(() => setshowWelcome(false), 5000);

      setTimeout(() => {
        if (data.user.role === "employee") navigate("/dashboard");
        if (data.user.role === "manager") navigate("/manager");
        if (data.user.role === "owner") navigate("/owner");
      }, 4500);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submitDetails();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-4">

      <AnimatePresence>
        {showWelcome && userRole && (
          <motion.div
            className="relative z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <FlipWordsDemo role={userRole} />
          </motion.div>
        )}
      </AnimatePresence>

      {!showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold text-white text-center mb-2">
            Welcome Back
          </h2>

          <p className="text-sm text-gray-300 text-center mb-6">
            Attendance & Workforce System
          </p>

          {/* Email */}
          <input
            className="w-full mb-4 px-4 py-3 text-sm rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email"
            name="email"
            value={formdata.email}
            onChange={changeHandler}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          {/* Password */}
          <div className="relative mb-4">
            <input
              className="w-full px-4 py-3 pr-12 text-sm rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              type={showEye ? "text" : "password"}
              name="password"
              value={formdata.password}
              onChange={changeHandler}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => setShowEye(!showEye)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
            >
              {showEye ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Button */}
          <motion.button
            onClick={submitDetails}
            disabled={loading}
            whileHover={!loading ? { scale: 1.03 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
            className="w-full py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <AnimatePresence mode="wait">
              {loading && (
                <motion.span key="loading" className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Signing in
                </motion.span>
              )}

              {!loading && success && (
                <motion.span key="success" className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  Success
                </motion.span>
              )}

              {!loading && !success && (
                <motion.span key="idle">Sign In</motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Forgot Password */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-indigo-300 hover:text-white transition"
            >
              Forgot Password?
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
