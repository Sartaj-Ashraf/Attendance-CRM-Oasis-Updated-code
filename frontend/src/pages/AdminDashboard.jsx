"use client";

import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./Dashboard/onwer/AdminSidebar";
import Topbar from "./Dashboard/Topbar";

/**
 * AdminDashboard Layout
 * Features:
 * - Fixed Sidebar & Topbar architecture
 * - Responsive content masking
 * - Fluid transitions for sidebar state changes
 */

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex w-full selection:bg-indigo-100 selection:text-indigo-700">
      {/* ===== FIXED SIDEBAR ===== */}
      {/* Ensure AdminSidebar has a fixed width of 240px (w-60) and z-index 50 */}
      <AdminSidebar />

      {/* ===== MAIN CONTENT WRAPPER ===== */}
      <div
        className="
          relative
          flex 
          flex-col 
          flex-1 
          min-h-screen 
          w-full
          transition-all 
          duration-500 
          ease-in-out
          ml-0 
          sm:ml-60
        "
      >
        {/* ===== TOP NAVIGATION ===== */}
        {/* Topbar should have backdrop-blur and a sticky position */}
        <Topbar />

        {/* ===== MAIN PAGE STAGE ===== */}
        <main
          className="
            flex-1 
            relative 
            z-0 
            overflow-x-hidden 
            overflow-y-auto 
            p-4 
            md:p-8 
            lg:p-10
          "
        >
          {/* This decorative background element ensures that 
              even when pages are short, the dashboard feels high-end.
          */}
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-200/40 to-transparent -z-10 pointer-events-none" />

          {/* PAGE CONTENT CONTAINER */}
          <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
            <Outlet />
          </div>

          {/* FOOTER SPACING */}
          <footer className="py-10 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
              Management System • Secure Environment
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
