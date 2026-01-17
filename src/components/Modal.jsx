import React from "react";
import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = "750px" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto py-10 px-4">
      <div 
        style={{ maxWidth }} 
        className="bg-white w-full rounded-3xl shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300 flex flex-col"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-8 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="p-8 border-t border-gray-50 flex justify-center">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};