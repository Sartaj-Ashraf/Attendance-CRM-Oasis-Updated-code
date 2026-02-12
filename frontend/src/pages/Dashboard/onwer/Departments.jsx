import React, { useEffect, useRef, useState, useContext } from "react";
import { toast } from "react-toastify";
import api from "../../../axios/axios.js";
import ConfirmDeleteModal from "../../../components/delete/ConfirmDelete.jsx";
import { AuthContext } from "../../../ContextApi/isAuth";

const Departments = () => {
  const { user } = useContext(AuthContext);
  const userRole = user?.role; // owner | manager

  const [departments, setDepartments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");

  const inputRef = useRef(null);

  /* ================= FETCH ================= */
  const fetchDepartments = async () => {
    try {
      const res = await api.get("/department/get");
      setDepartments(res.data?.data || []);
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  useEffect(() => {
    if (userRole) fetchDepartments();
  }, [userRole]);

  /* ================= CREATE ================= */
  const handleCreateDepartment = async () => {
    if (userRole !== "owner") {
      return toast.error("You are not allowed to create departments");
    }

    if (!newDepartmentName.trim()) {
      return toast.error("Enter department name");
    }

    try {
      await api.post("/department/create", { name: newDepartmentName });
      toast.success("Department created");
      setShowCreateModal(false);
      setNewDepartmentName("");
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  /* ================= DELETE ================= */
  const openDeleteModal = (dept) => {
    setDepartmentToDelete(dept);
    setDeleteConfirmName("");
    setShowDeleteModal(true);
  };

  const handleDeleteDepartment = async () => {
    if (userRole !== "owner") {
      return toast.error("You are not allowed to delete departments");
    }

    if (deleteConfirmName !== departmentToDelete.name) {
      return toast.error("Department name does not match");
    }

    try {
      await api.delete(`/department/delete/${departmentToDelete._id}`);
      toast.success("Department deleted");
      setShowDeleteModal(false);
      fetchDepartments();
    } catch {
      toast.error("Delete failed");
    }
  };
  console.log(departments.data)

  useEffect(() => {
    if (showCreateModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCreateModal]);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Departments</h1>

        {userRole === "owner" && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            + Create Department
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-left">Managers</th>
              <th className="px-6 py-3 text-left">Employees</th>
              {userRole === "owner" && <th className="px-6 py-3">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {departments.map((dept) => (
              <tr key={dept._id} className="border-b">
                <td className="px-6 py-4 font-medium">{dept.name}</td>

                <td className="px-6 py-4">
                  {dept.managers?.length ? (
                    dept.managers.map((m) => (
                      <span
                        key={m._id}
                        className="mr-2 px-2 py-1 text-xs bg-blue-100 rounded"
                      >
                        {m.username}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400"></span>
                  )}
                </td>

                <td className="px-6 py-4 font-semibold">
                  {dept.membersCount ?? 0}
                </td>

                {userRole === "owner" && (
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openDeleteModal(dept)}
                      className="px-4 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-lg font-bold mb-3">Create Department</h2>
            <input
              ref={inputRef}
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleCreateDepartment}
                className="flex-1 bg-green-600 text-white py-2 rounded"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-300 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        title="Delete Department"
        message={`Type "${departmentToDelete?.name}" to confirm deletion.`}
        inputValue={deleteConfirmName}
        onInputChange={setDeleteConfirmName}
        onConfirm={handleDeleteDepartment}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default Departments;
