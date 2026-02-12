import { useState, useCallback } from "react";
import api from "../axios/axios.js";

const useAttendanceSummary = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async ({ from, to, userId }) => {
    if (!from || !to) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/user/getAttendanceSummary", {
        params: {
          from,
          to,
          ...(userId && { userId }), // ✅ owner support
        },
      });

      setData(res.data.summary);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch attendance summary");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchSummary,
  };
};

export default useAttendanceSummary;
