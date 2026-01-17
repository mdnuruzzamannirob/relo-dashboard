import { ShimmerBase } from "../Skeleton";
export const ProfileSkeleton = () => (
  <div className="min-h-screen bg-white flex flex-col items-center p-6 md:pt-20">
    {/* Header Card Ghost */}
    <div className="w-full max-w-200 bg-[#333333] rounded-[2.5rem] p-8 mb-10 flex flex-col items-center shadow-xl">
      <ShimmerBase className="w-24 h-24 rounded-full bg-slate-600 border-4 border-slate-500" />
      <div className="mt-4 space-y-2 flex flex-col items-center">
        <ShimmerBase className="h-8 w-48 bg-slate-600" />
        <ShimmerBase className="h-4 w-32 bg-slate-600" />
      </div>
    </div>

    {/* Tabs Ghost */}
    <div className="flex gap-10 mb-8 w-full max-w-125 justify-center border-b border-gray-100">
      <ShimmerBase className="h-8 w-24 mb-2" />
      <ShimmerBase className="h-8 w-24 mb-2" />
    </div>

    {/* Form Ghost */}
    <div className="w-full max-w-125 space-y-6">
      <div className="flex flex-col items-center mb-4">
        <ShimmerBase className="h-6 w-40" />
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <ShimmerBase className="h-3 w-16" />
          <ShimmerBase className="h-14 w-full rounded-xl" />
        </div>
      ))}
      <ShimmerBase className="h-14 w-full rounded-2xl mt-4" />
    </div>
  </div>
);