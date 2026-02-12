import React, { useState } from "react";
import api from "../axios/axios.js";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Resetpassword = () => {
  const navigate = useNavigate();
  const [data, setData] = useState("");

  const changeHandler = (e) => {
    setData(e.target.value);
  };

  const submitHandler = async () => {
    const toastId = toast.loading("Sending reset link to provided email...");

    try {
      const response = await api.post("user/resetpassword", {
        email: data,
      });

      toast.success(response.data.msg, { id: toastId });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.msg || "Something went wrong";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Reset Password
          </h2>

          <input
            type="email"
            placeholder="Enter your email"
            value={data}
            onChange={changeHandler}
            className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={submitHandler}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Resetpassword;
