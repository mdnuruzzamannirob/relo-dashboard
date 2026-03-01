// Reusable skeleton building block
const Pulse = ({ className = "" }) => (
  <div className={`animate-pulse rounded bg-slate-200 ${className}`} />
);

// ─── Overview ─────────────────────────────────────────────────────────────────

export const OverviewStatSkeleton = () => (
  <div className="bg-white rounded-lg border border-slate-200 p-6">
    <div className="flex items-start justify-between mb-3">
      <Pulse className="h-9 w-9 rounded-lg" />
      <Pulse className="h-4 w-12" />
    </div>
    <Pulse className="h-3 w-24 mb-2" />
    <Pulse className="h-7 w-20" />
  </div>
);

export const OverviewChartSkeleton = () => (
  <div className="bg-white rounded-lg border border-slate-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <Pulse className="h-5 w-32" />
      <Pulse className="h-7 w-16 rounded" />
    </div>
    <div className="flex items-end gap-2 h-48 px-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <Pulse
            className="w-full rounded-t"
            style={{ height: `${Math.random() * 60 + 30}%` }}
          />
          <Pulse className="h-3 w-5" />
        </div>
      ))}
    </div>
  </div>
);

export const OverviewTableSkeleton = ({ rows = 4 }) => (
  <div className="bg-white rounded-lg border border-slate-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <Pulse className="h-5 w-32" />
      <Pulse className="h-4 w-16" />
    </div>
    <div className="space-y-0">
      <div className="grid grid-cols-7 gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Pulse key={i} className="h-3 w-full" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-7 gap-4 border-b border-slate-100 px-4 py-4"
        >
          {Array.from({ length: 7 }).map((_, j) => (
            <Pulse key={j} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ─── Users ─────────────────────────────────────────────────────────────────────

export const UserStatCardSkeleton = () => (
  <div className="rounded-lg border border-slate-200 bg-white p-4">
    <Pulse className="h-4 w-28 mb-3" />
    <Pulse className="h-8 w-16" />
  </div>
);

export const UserTableSkeleton = ({ rows = 8 }) => (
  <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
    {/* header */}
    <div className="grid grid-cols-6 gap-4 bg-slate-50 px-4 py-3 border-b border-slate-200">
      {["User", "Email", "Location", "Status", "Joined", "Actions"].map((h) => (
        <Pulse key={h} className="h-3 w-full" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="grid grid-cols-6 gap-4 px-4 py-4 border-b border-slate-100 items-center"
      >
        <div className="flex items-center gap-3">
          <Pulse className="h-9 w-9 rounded-full shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Pulse className="h-3 w-24" />
            <Pulse className="h-2.5 w-20" />
          </div>
        </div>
        <Pulse className="h-3 w-full hidden sm:block" />
        <Pulse className="h-3 w-full hidden lg:block" />
        <Pulse className="h-5 w-16 rounded-full" />
        <Pulse className="h-3 w-20" />
        <div className="flex justify-end gap-2">
          <Pulse className="h-8 w-8 rounded" />
          <Pulse className="h-8 w-8 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Products ─────────────────────────────────────────────────────────────────

export const ProductCardSkeleton = () => (
  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
    <Pulse className="h-48 w-full" />
    <div className="p-4 space-y-3">
      <div>
        <Pulse className="h-4 w-36 mb-1.5" />
        <Pulse className="h-3 w-24" />
      </div>
      <div className="flex items-center justify-between">
        <Pulse className="h-6 w-20" />
        <Pulse className="h-5 w-16 rounded-full" />
      </div>
      <Pulse className="h-3 w-28" />
      <Pulse className="h-9 w-full rounded-md" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

// ─── Orders ───────────────────────────────────────────────────────────────────

export const OrderCardSkeleton = () => (
  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-4">
    <div className="flex gap-4">
      <Pulse className="h-24 w-24 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <div className="space-y-1.5">
            <Pulse className="h-4 w-32" />
            <Pulse className="h-3 w-24" />
          </div>
          <div className="space-y-1.5 text-right">
            <Pulse className="h-5 w-16" />
            <Pulse className="h-5 w-20 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-2">
          <div className="space-y-1">
            <Pulse className="h-3 w-12" />
            <Pulse className="h-3 w-20" />
          </div>
          <div className="space-y-1">
            <Pulse className="h-3 w-12" />
            <Pulse className="h-3 w-20" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-2">
          <div className="space-y-1">
            <Pulse className="h-3 w-16" />
            <Pulse className="h-3 w-20" />
          </div>
          <div className="space-y-1">
            <Pulse className="h-3 w-24" />
            <Pulse className="h-3 w-20" />
          </div>
        </div>
      </div>
    </div>
    <Pulse className="mt-4 h-9 w-full rounded-md" />
  </div>
);

export const OrderGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    {Array.from({ length: count }).map((_, i) => (
      <OrderCardSkeleton key={i} />
    ))}
  </div>
);

// ─── Stats Row (reused by Orders / Products) ──────────────────────────────────
export const StatsRowSkeleton = ({ count = 3 }) => (
  <div
    className={`grid grid-cols-1 gap-4 ${
      count === 3
        ? "sm:grid-cols-3"
        : count === 4
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : "sm:grid-cols-2"
    }`}
  >
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Pulse className="h-3 w-24" />
            <Pulse className="h-7 w-16" />
          </div>
          <Pulse className="h-12 w-12 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Payments ───────────────────────────────────────────────────────────────

export const PaymentTableSkeleton = ({ rows = 8 }) => (
  <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
    <div className="grid grid-cols-7 gap-4 bg-slate-50 px-4 py-3 border-b border-slate-200">
      {Array.from({ length: 7 }).map((_, i) => (
        <Pulse key={i} className="h-3 w-full" />
      ))}
    </div>

    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="grid grid-cols-7 gap-4 px-4 py-4 border-b border-slate-100 items-center"
      >
        <Pulse className="h-3 w-24" />
        <Pulse className="h-3 w-20" />
        <div className="space-y-1.5">
          <Pulse className="h-3 w-28" />
          <Pulse className="h-2.5 w-20" />
        </div>
        <Pulse className="h-4 w-16" />
        <div className="space-y-1.5">
          <Pulse className="h-3 w-20" />
          <Pulse className="h-2.5 w-16" />
        </div>
        <Pulse className="h-3 w-28" />
        <div className="flex justify-end">
          <Pulse className="h-8 w-16 rounded" />
        </div>
      </div>
    ))}
  </div>
);
