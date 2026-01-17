import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Simple logic to generate page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center mt-12 gap-2 text-sm text-gray-400 font-medium">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center mr-2 text-slate-800 font-bold hover:-translate-x-1 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} className="mr-1" /> Prev
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            currentPage === page 
            ? 'bg-slate-800 text-white shadow-lg shadow-slate-200' 
            : 'hover:text-slate-800 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}

      {totalPages > 5 && <span className="px-2">...</span>}

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center ml-2 text-slate-800 font-bold hover:translate-x-1 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  );
};