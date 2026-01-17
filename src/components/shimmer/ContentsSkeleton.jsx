import React from "react";

const BooksSkeleton = () => {
  // We create an array of 6 items to fill the grid during initial load
  const skeletonCards = Array(6).fill(null);

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 animate-pulse">
      {/* Header Section Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="h-10 w-64 bg-slate-200 rounded-lg mb-2"></div>
          <div className="h-4 w-48 bg-slate-100 rounded-md"></div>
        </div>
        <div className="h-12 w-44 bg-slate-200 rounded-xl"></div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="h-16 w-full bg-slate-50 border-2 border-slate-100 rounded-2xl mb-10"></div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skeletonCards.map((_, index) => (
          <div 
            key={index} 
            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm"
          >
            {/* Image Placeholder */}
            <div className="w-full h-48 bg-slate-200 rounded-2xl mb-6"></div>
            
            {/* Title & Subtitle */}
            <div className="h-6 w-3/4 bg-slate-200 rounded-md mb-3"></div>
            <div className="space-y-2 mb-6">
              <div className="h-3 w-full bg-slate-100 rounded"></div>
              <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
            </div>

            {/* Meta Items (Writer, Date, Status) */}
            <div className="flex flex-wrap gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl"></div>
                  <div className="space-y-1">
                    <div className="h-2 w-8 bg-slate-100 rounded"></div>
                    <div className="h-3 w-12 bg-slate-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-slate-100 rounded-xl"></div>
              <div className="w-14 h-12 bg-slate-50 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksSkeleton;