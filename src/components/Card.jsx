import React from "react";

export const Card = ({ image, title, subtitle, children, actions }) => {
  return (
    <div
      className="
      bg-white rounded-3xl overflow-hidden border border-gray-100 flex flex-col h-full 
      transition-all duration-300 ease-out
      hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] 
      hover:border-blue-50/50 group
    "
    >
      {image && (
        <div className="h-48 w-full p-2 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-6 flex flex-col grow">
        {title && (
          <h3 className="text-lg font-bold text-slate-800 mb-1 transition-colors group-hover:text-blue-600">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-400 font-medium mb-3">{subtitle}</p>
        )}

        <div className="text-gray-500 text-sm leading-relaxed grow">
          {children}
        </div>

        {actions && (
          <div className="mt-6 pt-4 border-t border-gray-50 flex gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
