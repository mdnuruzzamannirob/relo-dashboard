import { useState } from "react";
import {
  TrendingUp,
  Users,
  Package,
  DollarSign,
  ArrowUpRight,
  ShoppingCart,
} from "lucide-react";
import {
  useGetAdminOverviewQuery,
  useGetGrowthStatisticQuery,
  useGetAllOrdersQuery,
} from "@/store/apis/adminApi";
import {
  OverviewStatSkeleton,
  OverviewChartSkeleton,
  OverviewTableSkeleton,
} from "@/components/skeletons/DashboardSkeletons";
import { cn } from "@/lib/utils/cn";

const CURRENT_YEAR = new Date().getFullYear();
const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

const normaliseCounts = (data = []) => {
  const map = new Map(data.map((d) => [d.month, d.count]));
  return MONTHS.map((m) => map.get(m) ?? 0);
};

const buildPolylinePoints = (counts, viewW = 345, viewH = 145) => {
  const max = Math.max(...counts, 1);
  return counts
    .map((c, i) => {
      const x = (i * viewW) / 11;
      const y = viewH - (c / max) * (viewH * 0.85) - viewH * 0.05;
      return `${x},${y}`;
    })
    .join(" ");
};

const buildAreaPath = (counts, viewW = 345, viewH = 145) => {
  const max = Math.max(...counts, 1);
  const pts = counts.map((c, i) => [
    (i * viewW) / 11,
    viewH - (c / max) * (viewH * 0.85) - viewH * 0.05,
  ]);
  const line = pts.map((p) => `L ${p[0]} ${p[1]}`).join(" ");
  return `M ${pts[0][0]} ${pts[0][1]} ${line} L ${pts[pts.length - 1][0]} ${viewH + 10} L ${pts[0][0]} ${viewH + 10} Z`;
};

const StatCard = ({ label, value, icon: Icon, bgColor, iconColor }) => (
  <div className="bg-white rounded-lg border border-slate-200 p-6 transition-all hover:shadow-md">
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2 rounded-lg ${bgColor}`}>
        <Icon className={iconColor} size={20} />
      </div>
      <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
        <ArrowUpRight size={12} />
        Live
      </div>
    </div>
    <p className="text-gray-500 text-xs mb-1">{label}</p>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const s = status?.toUpperCase();
  const colours = {
    COMPLETE: "bg-emerald-50 text-emerald-700",
    COMPLETED: "bg-emerald-50 text-emerald-700",
    PROCESSING: "bg-yellow-50 text-yellow-700",
    READY: "bg-blue-50 text-blue-700",
  };
  return (
    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", colours[s] ?? "bg-slate-100 text-slate-600")}>
      {status}
    </span>
  );
};

const ErrorBlock = ({ message }) => (
  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
    {message || "Failed to load data. Please try again."}
  </div>
);

const Overview = () => {
  const [userYear, setUserYear] = useState(CURRENT_YEAR);
  const [revenueYear, setRevenueYear] = useState(CURRENT_YEAR);

  const { data: overviewData, isLoading: overviewLoading, isError: overviewError } =
    useGetAdminOverviewQuery();

  const { data: userGrowthData, isLoading: userGrowthLoading, isError: userGrowthError } =
    useGetGrowthStatisticQuery({ type: "user", year: userYear });

  const { data: revenueGrowthData, isLoading: revenueGrowthLoading, isError: revenueGrowthError } =
    useGetGrowthStatisticQuery({ type: "revenue", year: revenueYear });

  const { data: recentOrdersData, isLoading: ordersLoading, isError: ordersError } =
    useGetAllOrdersQuery({ page: 1, limit: 5, sortOrder: "desc" });

  const overview = overviewData?.data ?? {};
  const userCounts = normaliseCounts(userGrowthData?.data ?? []);
  const revenueCounts = normaliseCounts(revenueGrowthData?.data ?? []);
  const recentOrders = recentOrdersData?.data?.result ?? [];
  const maxRevenue = Math.max(...revenueCounts, 1);

  const stats = [
    { label: "Total Users",    value: overview.userCount?.toLocaleString()    ?? "—", icon: Users,        bgColor: "bg-blue-50",    iconColor: "text-blue-600"    },
    { label: "Total Products", value: overview.productCount?.toLocaleString() ?? "—", icon: Package,      bgColor: "bg-purple-50",  iconColor: "text-purple-600"  },
    { label: "Total Orders",   value: overview.orderCount?.toLocaleString()   ?? "—", icon: ShoppingCart, bgColor: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Total Revenue",  value: overview.totalRevenue != null ? `$${overview.totalRevenue.toLocaleString()}` : "—", icon: DollarSign, bgColor: "bg-orange-50", iconColor: "text-orange-600" },
  ];

  const yearOptions = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Welcome back! Here&apos;s your dashboard performance at a glance.</p>
      </div>

      {/* Stats */}
      {overviewError ? (
        <ErrorBlock message="Failed to load overview stats." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {overviewLoading
            ? Array.from({ length: 4 }).map((_, i) => <OverviewStatSkeleton key={i} />)
            : stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" /> Total Users
            </h2>
            <select
              value={userYear}
              onChange={(e) => setUserYear(Number(e.target.value))}
              className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-600 focus:outline-none cursor-pointer"
            >
              {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {userGrowthError ? (
            <ErrorBlock message="Failed to load user growth data." />
          ) : userGrowthLoading ? (
            <OverviewChartSkeleton />
          ) : (
            <svg viewBox="0 0 380 180" className="w-full h-48">
              {[30, 60, 90, 120, 150].map((y) => (
                <line key={y} x1="25" y1={y} x2="375" y2={y} stroke="#e2e8f0" strokeWidth="1" />
              ))}
              <defs>
                <linearGradient id="userGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={buildAreaPath(userCounts)} transform="translate(25,10)" fill="url(#userGrad)" />
              <polyline points={buildPolylinePoints(userCounts)} transform="translate(25,10)" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
              {userCounts.map((c, i) => {
                const max = Math.max(...userCounts, 1);
                const x = 25 + (i * 345) / 11;
                const y = 10 + 145 - (c / max) * (145 * 0.85) - 145 * 0.05;
                return c > 0 ? <circle key={i} cx={x} cy={y} r="3" fill="#3b82f6" /> : null;
              })}
              {MONTHS.map((m, i) => (
                <text key={m} x={25 + (i * 345) / 11} y="172" textAnchor="middle" fontSize="10" fill="#64748b">{m}</text>
              ))}
            </svg>
          )}
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <DollarSign size={18} className="text-orange-500" /> Revenue Overview
            </h2>
            <select
              value={revenueYear}
              onChange={(e) => setRevenueYear(Number(e.target.value))}
              className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-600 focus:outline-none cursor-pointer"
            >
              {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {revenueGrowthError ? (
            <ErrorBlock message="Failed to load revenue data." />
          ) : revenueGrowthLoading ? (
            <OverviewChartSkeleton />
          ) : (
            <div className="flex items-end justify-around h-48 gap-1 pb-5 px-1">
              {revenueCounts.map((val, i) => {
                const barH = (val / maxRevenue) * 130;
                return (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full flex justify-center">
                      <div
                        className="bg-slate-800 rounded-t transition-all hover:opacity-70 w-5"
                        style={{ height: `${Math.max(barH, 2)}px` }}
                        title={`$${val}`}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">{MONTHS[i]}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      {ordersError ? (
        <ErrorBlock message="Failed to load recent orders." />
      ) : ordersLoading ? (
        <OverviewTableSkeleton />
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
            <a href="/orders" className="text-sm font-semibold text-brand-500 hover:text-brand-600">View All ?</a>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-center py-8 text-slate-500 text-sm">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {["Order ID","Buyer","Seller","Locker","Status","Amount"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-700 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-all">
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">{order.orderId}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{order.buyer?.name ?? "—"}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{order.seller?.name ?? "—"}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{order.location?.title ?? "—"}</td>
                      <td className="px-4 py-4"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">${order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Overview;
