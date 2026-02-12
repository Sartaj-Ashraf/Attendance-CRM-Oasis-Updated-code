import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../axios/axios.js";
import { useParams, useSearchParams } from "react-router-dom";
const SetPassword = ({ data }) => {
  const { userName, email } = data;
  // const { token } = useParams();

  // import { useSearchParams } from "react-router-dom";

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");


  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log(password);
      console.log(email);
      console.log(token);
      await api.patch("/user/setpassword", {
        email,
        token,
        password,
      });
      toast.success("Password updated successfully");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (e) {
      toast.error(e.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl flex flex-col gap-6"
      >
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {userName}
          </h2>
          <p className="text-sm text-gray-500 break-all">{email}</p>
        </div>

        <div className="h-px bg-gray-300" />

        <div className="text-center space-y-1">
          <h3 className="text-xl font-semibold text-gray-700">
            Set Your Password
          </h3>
          <p className="text-sm text-gray-500">
            Choose a strong and secure password
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              maxLength={10}
              placeholder="New Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            maxLength={10}
            placeholder="Confirm Password"
            className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2
              ${
                error
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-blue-600 text-white py-3 rounded-lg
                     hover:bg-blue-700 transition font-medium
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Setting Password..." : "Set Password"}
        </button>
      </form>
    </div>
  );
};

export default SetPassword;
