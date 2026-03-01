import { cn } from "@/lib/utils/cn";

const statusStyles = {
  // User statuses
  ACTIVE:
    "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200 shadow-sm",
  INACTIVE:
    "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-600 border border-slate-200",
  BLOCKED:
    "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200 shadow-sm",
  SUSPENDED:
    "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border border-orange-200 shadow-sm",

  // Order statuses
  COMPLETED:
    "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200 shadow-sm",
  COMPLETE:
    "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200 shadow-sm",
  READY:
    "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200 shadow-sm",
  PROCESSING:
    "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200 shadow-sm",
  PENDING:
    "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border border-orange-200 shadow-sm",

  // Product statuses
  AVAILABLE:
    "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200 shadow-sm",
  SOLD: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200 shadow-sm",

  // Conditions
  NEW: "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 shadow-sm",
  USED: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200 shadow-sm",
};

export const StatusBadge = ({
  status,
  variant = "default",
  className = "",
  size = "md",
}) => {
  const normalizedStatus = status?.toUpperCase();
  const style =
    statusStyles[normalizedStatus] ||
    "bg-slate-100 text-slate-600 border border-slate-200";

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full transition-all",
        sizeClasses[size],
        style,
        className,
      )}
    >
      <span className="w-2 h-2 rounded-full bg-current opacity-80 mr-1.5" />
      {status}
    </span>
  );
};

// Colored dot badge
export const DotBadge = ({ status, className = "" }) => {
  const normalizedStatus = status?.toUpperCase();
  const dotColors = {
    ACTIVE: "bg-emerald-500",
    INACTIVE: "bg-slate-400",
    BLOCKED: "bg-red-500",
    SUSPENDED: "bg-orange-500",
    COMPLETED: "bg-emerald-500",
    READY: "bg-blue-500",
    PROCESSING: "bg-amber-500",
    PENDING: "bg-orange-500",
    AVAILABLE: "bg-emerald-500",
    SOLD: "bg-red-500",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "w-2.5 h-2.5 rounded-full animate-pulse",
          dotColors[normalizedStatus] ?? "bg-slate-400",
        )}
      />
      <span className="text-sm font-medium text-slate-600">{status}</span>
    </div>
  );
};
