import React from "react";
import { Modal } from "./Modal";
import { Loader2 } from "lucide-react"; // Importing a spinner icon

/**
 * A reusable delete confirmation dialog
 * @param {boolean} isOpen - Control visibility
 * @param {function} onClose - Function to call when canceling
 * @param {function} onConfirm - Function to call when confirming delete
 * @param {string} itemName - The specific item name or type being deleted
 * @param {boolean} isLoading - To show loading state on the delete button
 */
export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = "this item",
  isLoading = false, // Added isLoading prop
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="380px">
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">
          Are you sure?
        </h3>
        <p className="text-gray-500 text-sm mb-10 px-6">
          Do you really want to delete{" "}
          <span className="font-semibold text-slate-700">{itemName}</span>? This
          action cannot be undone.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading} // Disable while deleting
            className="w-full py-3.5 bg-[#dc264e] hover:bg-[#c22043] text-white rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-pink-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>

          <button
            onClick={onClose}
            disabled={isLoading} // Prevent closing while deleting if preferred
            className="w-full py-3.5 bg-white border-2 border-gray-100 text-slate-600 hover:bg-gray-50 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            No, Keep it
          </button>
        </div>
      </div>
    </Modal>
  );
};
