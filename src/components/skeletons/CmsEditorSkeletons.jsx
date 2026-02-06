import { Skeleton } from "../ui/skeleton";

const CmsEditorSkeletons = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-9 w-55" /> {/* title */}
          <Skeleton className="h-4 w-105" /> {/* desc line 1 */}
          <Skeleton className="h-4 w-80" /> {/* desc line 2 */}
        </div>

        {/* Right action (Edit button placeholder) */}
        <Skeleton className="h-10 w-27.5 rounded-lg" />
      </div>

      {/* Content Card */}
      <div className="p-6 rounded-xl border border-brand-100">
        {/* content blocks mimic tiptap viewer */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[82%]" />
          <Skeleton className="h-4 w-[76%]" />
          <Skeleton className="h-4 w-[88%]" />
          <Skeleton className="h-4 w-[70%]" />

          <div className="pt-4">
            <Skeleton className="h-4 w-[92%]" />
            <Skeleton className="mt-3 h-4 w-[85%]" />
            <Skeleton className="mt-3 h-4 w-[78%]" />
          </div>

          <div className="pt-6">
            <Skeleton className="h-40 w-full rounded-lg" /> {/* big block */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsEditorSkeletons;
