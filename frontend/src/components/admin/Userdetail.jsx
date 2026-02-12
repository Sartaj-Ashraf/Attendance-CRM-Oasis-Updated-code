"use client";

import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Edit3, 
  Trash2, 
  Ban, 
  RefreshCw, 
  ExternalLink, 
  Mail, 
  Phone, 
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  User
} from "lucide-react";

/**
 * Enhanced UserRow Component
 * Includes: 
 * - Live Status Pulse for verified users
 * - Modern Glassmorphism touch for desktop rows
 * - Improved Mobile Card with high-density information layout
 */

const UserRow = ({ user, onEdit, onBlock, onDelete, onResendVerification }) => {
  const initials = user.username?.substring(0, 2).toUpperCase() || "??";

  return (
    <>
      {/* ================= DESKTOP TABLE ROW ================= */}
      <tr className="hidden md:table-row border-b border-slate-100 hover:bg-slate-50/80 transition-all group">
        
        {/* NAME & AVATAR WITH LIVE PULSE */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-[12px] font-bold text-indigo-600 border border-indigo-100 shadow-sm">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              {/* Active Indicator */}
              {user.isActive && (
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-700 leading-none mb-1.5 group-hover:text-blue-600 transition-colors">
                {user.username}
              </span>
              
              {user.isEmailVerified ? (
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-tighter">
                  <Clock size={10} className="animate-pulse" /> Pending Setup
                </span>
              )}
            </div>
          </div>
        </td>

        {/* EMAIL SECTION */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="p-1.5 bg-slate-100 rounded-md">
              <Mail size={12} className="text-slate-400" />
            </div>
            <span className="truncate max-w-[180px] font-medium">{user.email}</span>
          </div>
        </td>

        {/* PHONE SECTION */}
        <td className="px-6 py-4 text-sm text-slate-500 font-medium">
          {user.phone ? (
            <div className="flex items-center gap-2">
              <Phone size={12} className="text-slate-300" />
              {user.phone}
            </div>
          ) : (
             <span className="text-slate-300 italic text-xs">No phone</span>
          )}
        </td>

        {/* DEPARTMENT BADGE */}
        <td className="px-6 py-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px] font-bold shadow-sm">
            <Building2 size={12} className="text-indigo-400" />
            {user.department?.name || "General"}
          </div>
        </td>

        {/* SMART ACTIONS */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-1 translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
            <button
              onClick={() => onEdit(user)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              title="Edit Profile"
            >
              <Edit3 size={16} />
            </button>

            {user.isActive ? (
              <button
                onClick={() => onBlock(user)}
                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                title="Disable Account"
              >
                <Ban size={16} />
              </button>
            ) : (
              <button
                className="p-2 text-emerald-600 bg-emerald-50 rounded-xl"
                title="Account Disabled"
              >
                <ShieldCheck size={16} />
              </button>
            )}

            {!user.isEmailVerified && (
              <button
                onClick={() => onResendVerification(user)}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                title="Resend Invite"
              >
                <RefreshCw size={16} />
              </button>
            )}

            <button
              onClick={() => onDelete(user)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Terminate"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>

        {/* VIEW DETAILS */}
        <td className="px-6 py-4 text-right">
          <NavLink
            to={`/owner/see-employee-attendance/${user._id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-xl hover:bg-blue-600 transition-all shadow-md shadow-slate-200 active:scale-95"
          >
            <ExternalLink size={12} />
            View
          </NavLink>
        </td>
      </tr>

      {/* ================= MOBILE PROFILE CARD ================= */}
      <div className="md:hidden bg-white border border-slate-200 rounded-[24px] p-5 mb-4 shadow-sm relative overflow-hidden">
        {/* Accent Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${user.isEmailVerified ? 'bg-emerald-500' : 'bg-amber-400'}`} />

        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">{user.username}</h3>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                {user.department?.name || "General Staff"}
              </span>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
            user.isEmailVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}>
            {user.isEmailVerified ? "Verified" : "Invite Sent"}
          </div>
        </div>

        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <Mail size={14} className="text-slate-300" /> {user.email}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <Phone size={14} className="text-slate-300" /> {user.phone || "No contact linked"}
          </div>
        </div>

        <div className="flex gap-2">
           <NavLink
            to={`/owner/see-employee-attendance/${user._id}`}
            className="flex-[2] flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-2xl text-xs font-bold"
          >
            <ExternalLink size={14} /> View Attendance
          </NavLink>
          
          <button
            onClick={() => onEdit(user)}
            className="flex-1 flex items-center justify-center bg-slate-100 text-slate-600 py-3 rounded-2xl text-xs font-bold"
          >
            Edit
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2">
           {user.isActive && (
              <button onClick={() => onBlock(user)} className="py-2.5 border border-slate-100 text-amber-600 rounded-xl text-[10px] font-bold uppercase">Block</button>
           )}
           {!user.isEmailVerified && (
              <button onClick={() => onResendVerification(user)} className="py-2.5 border border-slate-100 text-indigo-600 rounded-xl text-[10px] font-bold uppercase">Resend</button>
           )}
           <button onClick={() => onDelete(user)} className="py-2.5 border border-rose-50 text-rose-500 rounded-xl text-[10px] font-bold uppercase hover:bg-rose-50">Delete</button>
        </div>
      </div>
    </>
  );
};

export default UserRow;