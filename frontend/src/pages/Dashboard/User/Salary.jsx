import React, { useMemo, useState } from "react";

const Salary = () => {
  // 🔹 Dummy salary data
  const [salaryHistory] = useState([
    {
      id: 1,
      month: "September 2025",
      basic: 25000,
      bonus: 3000,
      deductions: 2000,
      total: 26000,
      status: "Paid",
      paidOn: "2025-10-01",
    },
    {
      id: 2,
      month: "August 2025",
      basic: 25000,
      bonus: 2000,
      deductions: 1500,
      total: 25500,
      status: "Paid",
      paidOn: "2025-09-01",
    },
    {
      id: 3,
      month: "July 2025",
      basic: 25000,
      bonus: 0,
      deductions: 3000,
      total: 22000,
      status: "Pending",
      paidOn: "-",
    },
  ]);

  const currentSalary = salaryHistory[0];

  const statusBadge = (status) => {
    return status === "Paid"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-gray-800">
        Salary
      </h1>

      {/* CURRENT SALARY SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Basic Salary</p>
          <p className="text-2xl font-bold text-gray-800">
            ₹{currentSalary.basic}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Bonus</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{currentSalary.bonus}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Deductions</p>
          <p className="text-2xl font-bold text-red-600">
            ₹{currentSalary.deductions}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Net Salary</p>
          <p className="text-2xl font-bold text-blue-600">
            ₹{currentSalary.total}
          </p>
        </div>
      </div>

      {/* PAYMENT STATUS */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Payment Status
          </p>
          <span
            className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${statusBadge(
              currentSalary.status
            )}`}
          >
            {currentSalary.status}
          </span>
        </div>

        <div className="text-sm text-gray-600">
          Paid On:{" "}
          <span className="font-medium text-gray-800">
            {currentSalary.paidOn}
          </span>
        </div>
      </div>

      {/* SALARY HISTORY */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-x-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">
            Salary History
          </h2>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">Month</th>
              <th className="px-6 py-3 text-left">Basic</th>
              <th className="px-6 py-3 text-left">Bonus</th>
              <th className="px-6 py-3 text-left">Deductions</th>
              <th className="px-6 py-3 text-left">Net Salary</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {salaryHistory.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4">{s.month}</td>
                <td className="px-6 py-4">₹{s.basic}</td>
                <td className="px-6 py-4 text-green-600">
                  ₹{s.bonus}
                </td>
                <td className="px-6 py-4 text-red-600">
                  ₹{s.deductions}
                </td>
                <td className="px-6 py-4 font-semibold">
                  ₹{s.total}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(
                      s.status
                    )}`}
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Salary;
