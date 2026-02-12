"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  UserPlus, 
  MoreHorizontal, 
  Trash2, 
  UserX, 
  Mail, 
  Phone, 
  Briefcase, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Users as UsersIcon
} from "lucide-react"; // npm install lucide-react
import api from "../../../axios/axios";

import UserRow from "../../../components/admin/Userdetail";
import ConfirmModal from "../../../components/confrim/ConfirmModal";
import AddUser from "./AddUser";
import SearchFilter from "../../../components/filters/SearchFilter";
import EditEmployee from "../../../components/EditEmployee";

const Users = () => {
  /* ================= STATE ================= */
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [confirmUser, setConfirmUser] = useState(null);
  const [confirmType, setConfirmType] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [verification, setVerification] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 30;

  /* ================= FETCH LOGIC (UNCHANGED) ================= */
  useEffect(() => { fetchDepartments(); }, []);
  const fetchDepartments = async () => {
    try {
      const res = await api.get("/department/get");
      setDepartments(res.data.data || []);
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  useEffect(() => { setPage(1); }, [search, department, verification]);
  useEffect(() => { fetchUsers(); }, [page, search, department, verification]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/owner/getAllEmployee", {
        params: {
          page, limit,
          search: search || undefined,
          department: department || undefined,
          verification: verification !== "all" ? verification : undefined,
        },
      });
      setUsers(res.data.data || []);
      setTotalPages(res.data.meta?.totalPages || 1);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const openConfirm = (type, user) => {
    setConfirmType(type);
    setConfirmUser(user);
  };

  const handleConfirm = async () => {
    if (!confirmUser) return;
    try {
      setLoading(true);
      if (confirmType === "resend") {
        await api.post(`/auth/resend-confirmation/${confirmUser._id}`);
        toast.success("Set password email sent");
      }
      if (confirmType === "delete") {
        await api.post(`/owner/deleteUser/${confirmUser._id}`);
        toast.success("User deleted");
      }
      if (confirmType === "block") {
        await api.patch(`/owner/disableaccount/${confirmUser._id}`);
        toast.warning("User blocked");
      }
      fetchUsers();
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setLoading(false);
      setConfirmUser(null);
      setConfirmType(null);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-4 md:p-8 bg-[#f9fafb] min-h-screen">
      {/* HEADER & CONTROLS */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <UsersIcon className="text-blue-600" /> Employee Directory
            </h1>
            <p className="text-slate-500 text-sm mt-1">Manage personnel, roles, and department assignments</p>
          </div>

          <button
            onClick={() => setShowAddUser(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            <UserPlus size={18} />
            <span>Add Employee</span>
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <SearchFilter
            searchValue={search}
            onSearchChange={setSearch}
            selectValue={department}
            onSelectChange={setDepartment}
            selectOptions={departments}
            optionLabel="name"
            optionValue="_id"
            verificationValue={verification}
            onVerificationChange={setVerification}
            searchPlaceholder="Search name or email..."
            debounceDelay={500}
          />
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden sm:block bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Name & Bio</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Phone</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center text-slate-400">
                      <UsersIcon size={48} className="mb-4 opacity-20" />
                      <p className="font-medium">No employees found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <UserRow
                    key={user._id}
                    user={user}
                    onEdit={(u) => {
                      setEditUser(u);
                      setShowEditUser(true);
                    }}
                    onDelete={(u) => openConfirm("delete", u)}
                    onBlock={(u) => openConfirm("block", u)}
                    onResendVerification={(u) => openConfirm("resend", u)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="sm:hidden grid gap-4">
          {users.length === 0 ? (
             <div className="py-10 text-center text-slate-400">No users found.</div>
          ) : (
            users.map((user) => (
              <div key={user._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800">{user.username}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <Mail size={12} /> {user.email}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase">
                    {user.department?.name || "Unassigned"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl">
                   <div className="text-slate-500 flex items-center gap-1">
                      <Phone size={10} /> {user.phone || "N/A"}
                   </div>
                   <div className="text-slate-500 flex items-center gap-1">
                      <Briefcase size={10} /> Employee
                   </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  <button onClick={() => { setEditUser(user); setShowEditUser(true); }} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">Edit</button>
                  <button onClick={() => openConfirm("resend", user)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200">Resend</button>
                  <button onClick={() => openConfirm("block", user)} className="px-3 py-2 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold"><UserX size={14}/></button>
                  <button onClick={() => openConfirm("delete", user)} className="px-3 py-2 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold"><Trash2 size={14}/></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 px-2 gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing Page <span className="text-slate-900">{page}</span> of <span className="text-slate-900">{totalPages}</span>
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {confirmUser && (
        <ConfirmModal
          title="Confirm Action"
          message={`Are you sure you want to ${confirmType} ${confirmUser.email}?`}
          loading={loading}
          onCancel={() => setConfirmUser(null)}
          onConfirm={handleConfirm}
        />
      )}

      {/* MODAL OVERLAYS */}
      {showAddUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <div class  ame="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
           
            <div className="p-1">
              <AddUser
                departments={departments}
                onClose={() => {
                  setShowAddUser(false);
                  fetchUsers();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {showEditUser && editUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
           <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
              <EditEmployee
                user={editUser}
                onClose={() => {
                  setShowEditUser(false);
                  setEditUser(null);
                }}
                onSuccess={() => {
                  setShowEditUser(false);
                  setEditUser(null);
                  fetchUsers();
                }}
              />
           </div>
        </div>
      )}
    </div>
  );
};

export default Users;