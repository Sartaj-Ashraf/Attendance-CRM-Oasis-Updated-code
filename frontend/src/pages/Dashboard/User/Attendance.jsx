import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import api from "../../../axios/axios";
import useAttendanceSummary from "../../../hooks/useAttendanceSummary";

import MonthRangeFilter from "../../../components/filters/MonthRangeFilter";
import AttendanceSummary from "../../../components/attendence/AttendanceSummary";
import AttendanceTable from "../../../components/AttendanceTable";

/* ================= HELPERS ================= */

const getCurrentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const getMonthRange = (month) => {
  const [year, m] = month.split("-");
  return {
    from: new Date(year, m - 1, 1).toISOString().split("T")[0],
    to: new Date(year, m, 0).toISOString().split("T")[0],
  };
};

/* ================= COMPONENT ================= */

const Attendance = () => {
  const { userId } = useParams(); // owner viewing employee

  const [fromMonth, setFromMonth] = useState(getCurrentMonth());
  const [toMonth, setToMonth] = useState(getCurrentMonth());

  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 30;
  const [pagination, setPagination] = useState(null);

  const { data: summary, loading, fetchSummary } = useAttendanceSummary();

  /* ================= FETCH ================= */

  const handleFetch = useCallback(
    async (pageNumber = 1) => {
      try {
        const { from } = getMonthRange(fromMonth);
        const { to } = getMonthRange(toMonth);

        // ✅ summary (self OR owner)
        await fetchSummary({ from, to, userId });

        const endpoint = userId
          ? `/user/getCurrentUserdata/${userId}` // owner
          : "/user/getCurrentUserdata"; // self

        const res = await api.get(endpoint, {
          params: { from, to, page: pageNumber, limit },
        });

        setTableData(res.data.data);
        setPagination(res.data.pagination);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load attendance");
      }
    },
    [fromMonth, toMonth, userId, fetchSummary],
  );

  /* ================= FILTER CHANGE ================= */

  useEffect(() => {
    setPage(1);
    handleFetch(1);
  }, [fromMonth, toMonth, userId, handleFetch]);

  /* ================= PAGE CHANGE ================= */

  useEffect(() => {
    handleFetch(page);
  }, [page, handleFetch]);

  /* ================= MONTH SUBMIT ================= */

  const handleMonthSubmit = () => {
    setPage(1);
    handleFetch(1);
  };

  /* ================= RENDER ================= */

  return (
    <>
      <Toaster position="top-right" />

      <div className="space-y-8">
        {loading && (
          <div className="flex justify-center items-center gap-3 text-gray-600">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Loading attendance...</p>
          </div>
        )}

        <MonthRangeFilter
          fromMonth={fromMonth}
          toMonth={toMonth}
          onFromChange={setFromMonth}
          onToChange={setToMonth}
          onSubmit={handleMonthSubmit}
        />

        {/* ✅ SUMMARY VISIBLE FOR OWNER & USER */}
        <AttendanceSummary summary={summary} />

        <AttendanceTable data={tableData} />

        {pagination && (
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages} •{" "}
              {pagination.total} records
            </div>

            <div className="flex gap-2">
              <button
                disabled={!pagination.hasPrev}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 border rounded disabled:opacity-40"
              >
                ← Previous
              </button>

              <button
                disabled={!pagination.hasNext}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border rounded disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Attendance;
