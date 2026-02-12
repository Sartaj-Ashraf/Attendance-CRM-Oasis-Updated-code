import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/axios.js";
import { AuthContext } from "../ContextApi/isAuth.jsx";
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import Ballpit from "../animation/Ballpit.jsx";
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

  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour <= 6;

  return (
    <div className="relative min-h-screen overflow-hidden">
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
        <>
          {/* Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Ballpit
              count={isNight ? 120 : 140}
              gravity={isNight ? 0.35 : 0.6}
              friction={isNight ? 0.95 : 0.85}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 backdrop-blur-[2px]" />
          </div>

          {/* Centered container */}
          <div className="relative z-20 min-h-screen flex items-center justify-center px-4">
            <div
              className="
                w-full
                max-w-xs sm:max-w-sm            /* ✅ smaller card width */
                bg-white rounded-xl             /* ✅ softer radius */
                p-4 sm:p-5                      /* ✅ reduced padding */
                shadow-lg
              "
            >
              <h2
                className="
                  text-xl sm:text-2xl           /* ✅ smaller heading */
                  font-semibold
                  text-center
                  mb-1
                "
              >
                Welcome Back
              </h2>

              <p
                className="
                  text-[11px] sm:text-xs        /* ✅ compact subtitle */
                  text-center
                  text-gray-500
                  mb-4
                "
              >
                Attendance & Workforce System
              </p>

              <input
                className="
                  w-full
                  mb-3
                  px-3 py-2.5                   /* ✅ compact input */
                  text-sm
                  border rounded-md
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                "
                placeholder="Email"
                name="email"
                value={formdata.email}
                onChange={changeHandler}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />

              <div className="relative mb-3">
                <input
                  className="
                    w-full
                    px-3 py-2.5
                    pr-10
                    text-sm
                    border rounded-md
                    focus:outline-none focus:ring-2 focus:ring-indigo-500
                  "
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
                  className="
                    absolute right-2 top-1/2 -translate-y-1/2
                    p-1.5                        /* ✅ compact icon hitbox */
                    text-gray-500
                  "
                >
                  {showEye ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <motion.button
                onClick={submitDetails}
                disabled={loading}
                whileHover={!loading ? { scale: 1.03 } : {}}
                whileTap={!loading ? { scale: 0.96 } : {}}
                className="
                  w-full
                  py-2.5                         /* ✅ slimmer button */
                  rounded-lg
                  text-sm
                  font-medium
                  text-white
                  bg-gradient-to-r from-indigo-600 to-violet-600
                  flex items-center justify-center gap-2
                  disabled:opacity-70
                "
              >
                <AnimatePresence mode="wait">
                  {loading && (
                    <motion.span
                      key="loading"
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="animate-spin" size={16} />
                      Signing in
                    </motion.span>
                  )}

                  {!loading && success && (
                    <motion.span
                      key="success"
                      className="flex items-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Success
                    </motion.span>
                  )}

                  {!loading && !success && (
                    <motion.span key="idle">Sign In</motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
