import { ShimmerBase } from "../Skeleton";

export const LegalSkeleton = () => (
  <div className="min-h-screen bg-white flex flex-col items-center p-6 md:p-12">
    {/* Header Ghost */}
    <div className="w-full max-w-225 mb-10 text-center flex flex-col items-center space-y-3">
      <ShimmerBase className="h-10 w-64 bg-slate-200 rounded-lg" />
      <ShimmerBase className="h-4 w-96 bg-slate-100 rounded-lg" />
    </div>

    {/* Editor Ghost */}
    <div className="w-full max-w-225">
      <div className="w-full mb-6 p-4 border border-gray-100 rounded-2xl shadow-sm">
        {/* Toolbar Ghost */}
        <div className="flex gap-4 mb-6 pb-4 border-b border-gray-50">
          <ShimmerBase className="h-8 w-8 rounded bg-slate-100" />
          <ShimmerBase className="h-8 w-8 rounded bg-slate-100" />
          <ShimmerBase className="h-8 w-8 rounded bg-slate-100" />
          <div className="ml-auto flex gap-2">
             <ShimmerBase className="h-8 w-20 rounded bg-slate-100" />
          </div>
        </div>
        
        {/* Content Lines Ghost */}
        <div className="space-y-4">
          <ShimmerBase className="h-4 w-full bg-slate-50" />
          <ShimmerBase className="h-4 w-[95%] bg-slate-50" />
          <ShimmerBase className="h-4 w-[98%] bg-slate-50" />
          <ShimmerBase className="h-4 w-[40%] bg-slate-50" />
          <div className="pt-4 space-y-4">
            <ShimmerBase className="h-4 w-full bg-slate-50" />
            <ShimmerBase className="h-4 w-[92%] bg-slate-50" />
          </div>
        </div>
      </div>

      {/* Button Ghost */}
      <div className="w-full mt-8">
        <ShimmerBase className="h-16 w-full rounded-2xl bg-slate-200" />
      </div>
    </div>
  </div>
);