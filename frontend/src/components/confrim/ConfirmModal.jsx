// src/components/common/ConfirmModal.jsx
import React, { useEffect } from "react";

const ConfirmModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  /* ================= ENTER KEY HANDLER ================= */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !loading) {
        onConfirm();
      }

      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onConfirm, onCancel, loading]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-xl font-semibold mb-3">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            disabled={loading}
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            autoFocus
            className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
          >
            {loading ? "Sending..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
