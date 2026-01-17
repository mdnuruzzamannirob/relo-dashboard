import React from "react";

export const InputGroup = ({ label, children }) => (
  <div className="mb-6 w-full">
    <label className="block text-xs font-bold text-slate-800 mb-2 ml-1">{label}</label>
    {children}
  </div>
);

export const Input = (props) => (
  <input
    {...props}
    className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-slate-300 outline-none text-sm placeholder:text-gray-400 transition-all"
  />
);

export const Textarea = (props) => (
  <textarea
    {...props}
    className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-slate-300 outline-none text-sm min-h-30 resize-none transition-all"
  />
);