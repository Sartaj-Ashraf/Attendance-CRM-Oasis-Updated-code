import React from "react";

const ConfirmDeleteModal = ({
  open,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmValue,        // optional text to type (e.g. username)
  inputValue,          // current typed value
  onInputChange,       // setter for input
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!open) return null;

  const requiresTyping =
    confirmValue !== undefined && confirmValue !== null;

  const isDisabled =
    requiresTyping && confirmValue !== inputValue;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
        {/* Title */}
        <h2 className="text-xl font-bold text-red-600 mb-3">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-4">
          {message}
        </p>

        {/* Optional confirmation input */}
        {requiresTyping && (
          <input
            type="text"
            value={inputValue || ""}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={`Type "${confirmValue}" to confirm`}
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isDisabled || loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : confirmText}
          </button>

          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
