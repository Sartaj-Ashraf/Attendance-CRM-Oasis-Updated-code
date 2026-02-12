import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axios/axios.js";
import { AuthContext } from "../../ContextApi/isAuth.jsx";

const Topbar = () => {
  const { user, isAuth, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  if (!user) {
    return null;
  }
  console.log(user.email);
  const LogoutHandler = async () => {
    try {
      await api.post("/user/logout");
      setTimeout(() => navigate("/login"), 1000);
    } catch (e) {
      alert(e.error());
    }
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-xl  mt-6 px-10 py-4 flex items-center justify-between  ">
      <h3 className="text-lg font-semibold text-gray-800">
        Welcome,{" "}
        <span className="text-blue-600 text-2xl">
          {user.username || "User"}
        </span>
      </h3>

      <div className="flex items-center gap-4">
        <div className="flex flex-col text-center">
          <span className="text-2xl text-gray-500">👤</span>
          <span>{user.email}</span>
        </div>

        <button
          onClick={LogoutHandler}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;





