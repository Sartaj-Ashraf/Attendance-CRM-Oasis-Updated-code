import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import api from "../../../axios/axios";
import SearchFilter from "../../../components/filters/SearchFilter";
import ConfirmModal from "../../../components/confrim/ConfirmModal";
import AddUser from "../onwer/AddUser";
import EditEmployee from "../../../components/EditEmployee";

const ManagerEmployees = () => {
  /* ================= STATE ================= */
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departmentId, setDepartmentId] = useState(null);

  // add / edit
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // confirm modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmUser, setConfirmUser] = useState(null);
  const [confirmType, setConfirmType] = useState(null); // block | resend

  /* ================= FETCH LOGGED-IN MANAGER ================= */
  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const res = await api.get("/api/isAuth");
        const deptId = res.data?.user?.department?._id;

        if (!deptId) {
          toast.error("Department not found for this manager");
          return;
        }

        setDepartmentId(deptId);
      } catch {
        toast.error("Failed to load user info");
      }
    };

    fetchAuthUser();
  }, []);

  /* ================= FETCH EMPLOYEES ================= */
  useEffect(() => {
    if (departmentId) fetchEmployees();
  }, [departmentId]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/owner/getAllUsers", {
        params: { department: departmentId },
      });
      setEmployees(res.data?.data || []);
    } catch {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.username?.toLowerCase().includes(search.toLowerCase()) ||
        emp.email?.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        !statusFilter ||
        (statusFilter === "active" && emp.isActive) ||
        (statusFilter === "blocked" && !emp.isActive);

      return matchSearch && matchStatus;
    });
  }, [employees, search, statusFilter]);

  /* ================= CONFIRM HANDLER ================= */
  const openConfirm = (user, type) => {
    setConfirmUser(user);
    setConfirmType(type);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!confirmUser || !confirmType) return;

    try {
      setLoading(true);

      if (confirmType === "resend") {
        await api.post(`/auth/resend-confirmation/${confirmUser._id}`);
        toast.success("Verification email sent");
      }

      if (confirmType === "block") {
        await api.patch(`/owner/disableaccount/${confirmUser._id}`);
        toast.warning("Employee blocked");
      }

      fetchEmployees();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Action failed"
      );
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setConfirmUser(null);
      setConfirmType(null);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-6">
      {/* ADD USER */}
      {showAddUser ? (
        <AddUser
          departmentId={departmentId}
          onClose={() => {
            setShowAddUser(false);
            fetchEmployees();
          }}
        />
      ) : (
        <>
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Team</h1>

            <SearchFilter
              searchValue={search}
              onSearchChange={setSearch}
              selectValue={statusFilter}
              onSelectChange={setStatusFilter}
              searchPlaceholder="Search employee..."
              selectOptions={[
                { label: "Active", value: "active" },
                { label: "Blocked", value: "blocked" },
              ]}
            />

            <button
              onClick={() => setShowAddUser(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add employee
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white shadow rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6">
                      Loading...
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp._id} className="border-b">
                      <td className="px-6 py-4">{emp.username} <sub>   {emp.isEmailVerified  ? (
                          <span className="text-green-600 font-medium">
                            Verified
                          </span>
                        ) : (
                          <span className="text-orange-600 font-medium">
                            Unverified
                          </span>
                        )}</sub></td>
                      <td className="px-6 py-4">{emp.email}</td>
                      <td className="px-6 py-4">{emp.role}</td>
                      <td className="px-6 py-4">
                     {emp.payment}
                      </td>

                      <td className="px-6 py-4 space-x-2">
                        {/* EDIT */}
                        <button
                          onClick={() => {
                            setEditUser(emp);
                            setShowEditUser(true);
                          }}
                          className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                        >
                          Edit
                        </button>

                        {/* RESEND ONLY IF UNVERIFIED */}
                        {!emp.isEmailVerified  && (
                          <button
                            onClick={() => openConfirm(emp, "resend")}
                            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
                          >
                            Send Verification
                          </button>
                        )}

                        {/* BLOCK */}
                        {emp.isActive && (
                          <button
                            onClick={() => openConfirm(emp, "block")}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                          >
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <ConfirmModal
          title="Confirm Action"
          message={`Are you sure you want to ${confirmType} ${confirmUser?.username}?`}
          loading={loading}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* EDIT MODAL */}
      {showEditUser && editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <EditEmployee
            user={editUser}
            managerDepartmentId={departmentId}
            onClose={() => {
              setShowEditUser(false);
              setEditUser(null);
            }}
            onSuccess={() => {
              setShowEditUser(false);
              setEditUser(null);
              fetchEmployees();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ManagerEmployees;
