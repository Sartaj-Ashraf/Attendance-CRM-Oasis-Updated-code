"use client";

import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Dashboard/User/Sidebar";
import TopBar from "./Dashboard/Topbar";

/**
 * Enhanced Dashboard Layout
 * - Adaptive margins for mobile/desktop
 * - Minimalist background and typography
 * - Smooth content transitions
 */

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex w-full selection:bg-slate-200">
      {/* FIXED SIDEBAR 
         Note: The Sidebar component now handles its own mobile toggle 
      */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div
        className="
          flex 
          flex-col 
          flex-1 
          min-h-screen 
          transition-all 
          duration-300 
          ease-in-out
          ml-0 
          lg:ml-64      /* Matches the Sidebar width on desktop */
        "
      >
        {/* TOP BAR - Sticky for easy access to actions */}
        <div className="sticky top-0 z-30">
          <TopBar />
        </div>

        {/* PAGE CONTENT */}
        <main
          className="
            flex-1 
            p-4 
            md:p-8 
            lg:p-10 
            animate-in 
            fade-in 
            duration-500
          "
        >
          {/* Max-width wrapper prevents content from stretching 
             too wide on ultra-wide monitors 
          */}
          <div className="max-w-6xl mx-auto space-y-6">
            <Outlet />
          </div>

          {/* MINIMAL FOOTER */}
          <footer className="mt-20 py-8 border-t border-slate-50 text-center">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
              Workforce Management System &bull; &copy; 2026
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
