import React from 'react'
import { useState,useEffect } from 'react';
import api from '../../../axios/axios';
import toast from 'react-hot-toast';

export const ViewManagers = () => {

      const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchManagers = async () => {
    try {
      const res = await api.get("/owner/getManagers");
      setManagers(res.data.data);
    } catch (err) {
      toast.error("Failed to load managers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Managers</h1>
        <p className="text-gray-500">List of all department managers</p>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  Loading managers...
                </td>
              </tr>
            ) : managers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  No managers found
                </td>
              </tr>
            ) : (
              managers.map((manager) => (
                <tr
                  key={manager._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {manager.username}
                  </td>

                  <td className="px-6 py-4 text-gray-600">{manager.email}</td>

                  <td className="px-6 py-4 text-gray-600">
                    {manager.department?.name || "Not Assigned"}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        manager.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {manager.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

