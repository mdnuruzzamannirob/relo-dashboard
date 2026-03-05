import { useState } from "react";
import {
  TrendingUp,
  Users,
  Package,
  DollarSign,
  ArrowUpRight,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
import { StatusBadge } from "@/components/common/StatusBadge";
import { cn } from "@/lib/utils/cn";

const CURRENT_YEAR = new Date().getFullYear();

// API returns full month names — keep both forms for label vs. key mapping
const MONTHS_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Transform API data to chart-friendly format
// API: [{ month: "January", year: 2026, count: 2 }, ...]
const transformChartData = (data = []) => {
  // Ensure all months are present, fill missing with 0
  const monthCountMap = {};
  data.forEach((d) => {
    monthCountMap[d.month] = d.count;
  });
  return MONTHS_FULL.map((fullMonth, index) => ({
    month: MONTHS_SHORT[index], // label on X-axis
    value: monthCountMap[fullMonth] ?? 0,
  }));
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  bgColor,
  iconColor,
  trend = "up",
  change = "—",
}) => (
  <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 group">
    <div className="flex items-start justify-between mb-3">
      <div
        className={`p-2 sm:p-3 rounded-lg ${bgColor} transition-transform group-hover:scale-110`}
      >
        <Icon className={`${iconColor} transition-colors`} size={20} />
      </div>
      <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
        <ArrowUpRight size={12} />
        <span className="hidden sm:inline">Live</span>
      </div>
    </div>
    <p className="text-slate-500 text-xs mb-2">{label}</p>
    <p className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{value}</p>
    <p className="text-emerald-600 text-xs font-medium">{change}</p>
  </div>
);

const ErrorToast = ({ message }) => {
  if (message) {
    setTimeout(() => toast.error(message), 100);
  }
  return null;
};

const Overview = () => {
  const [userYear, setUserYear] = useState(CURRENT_YEAR);
  const [revenueYear, setRevenueYear] = useState(CURRENT_YEAR);

  const {
    data: overviewData,
    isLoading: overviewLoading,
    isError: overviewError,
    error: overviewErrorMsg,
  } = useGetAdminOverviewQuery();

  const {
    data: userGrowthData,
    isLoading: userGrowthLoading,
    isError: userGrowthError,
    error: userGrowthErrorMsg,
  } = useGetGrowthStatisticQuery({ type: "user", year: userYear });

  const {
    data: revenueGrowthData,
    isLoading: revenueGrowthLoading,
    isError: revenueGrowthError,
    error: revenueGrowthErrorMsg,
  } = useGetGrowthStatisticQuery({ type: "revenue", year: revenueYear });

  const {
    data: recentOrdersData,
    isLoading: ordersLoading,
    isError: ordersError,
    error: ordersErrorMsg,
  } = useGetAllOrdersQuery({ page: 1, limit: 5, sortOrder: "desc" });

  const overview = overviewData?.data ?? {};
  const userChartData = transformChartData(userGrowthData?.data ?? []);
  const revenueChartData = transformChartData(revenueGrowthData?.data ?? []);
  const recentOrders = recentOrdersData?.data?.result ?? [];

  const stats = [
    {
      label: "Total Users",
      value: overview.userCount?.toLocaleString() ?? "—",
      icon: Users,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      change: "+5.2%",
    },
    {
      label: "Total Products",
      value: overview.productCount?.toLocaleString() ?? "—",
      icon: Package,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      change: "+2.1%",
    },
    {
      label: "Total Orders",
      value: overview.orderCount?.toLocaleString() ?? "—",
      icon: ShoppingCart,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      change: "+12.5%",
    },
    {
      label: "Total Revenue",
      value:
        overview.totalRevenue != null
          ? `$${overview.totalRevenue.toLocaleString()}`
          : "—",
      icon: DollarSign,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      change: "+8.3%",
    },
  ];

  const yearOptions = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

  return (
    <div className="space-y-6 pb-8">
      <Toaster position="top-right" richColors />

      {/* Error Toasts */}
      {overviewError && <ErrorToast message="Failed to load overview stats." />}
      {userGrowthError && (
        <ErrorToast message="Failed to load user growth data." />
      )}
      {revenueGrowthError && (
        <ErrorToast message="Failed to load revenue data." />
      )}
      {ordersError && <ErrorToast message="Failed to load recent orders." />}

      {/* Header */}
      <div className="space-y-1 px-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 text-sm">
          Welcome back! Here&apos;s your platform performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {overviewLoading || overviewError
          ? Array.from({ length: 4 }).map((_, i) => (
              <OverviewStatSkeleton key={i} />
            ))
          : stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" /> Total Users
            </h2>
            <select
              value={userYear}
              onChange={(e) => setUserYear(Number(e.target.value))}
              className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {userGrowthError ? (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-center gap-3">
              <AlertCircle className="text-red-600 shrink-0" size={20} />
              <p className="text-sm text-red-700">
                Failed to load user growth data
              </p>
            </div>
          ) : userGrowthLoading ? (
            <OverviewChartSkeleton />
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={userChartData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) => [`${value} users`, "Users"]}
                    labelFormatter={(label) => `${label} ${userYear}`}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Users"
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 transition-all hover:border-brand-300 hover:bg-slate-50">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <DollarSign size={18} className="text-orange-500" /> Revenue
              Overview
            </h2>
            <select
              value={revenueYear}
              onChange={(e) => setRevenueYear(Number(e.target.value))}
              className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer bg-white"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {revenueGrowthError ? (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-center gap-3">
              <AlertCircle className="text-red-600 shrink-0" size={20} />
              <p className="text-sm text-red-700">
                Failed to load revenue data
              </p>
            </div>
          ) : revenueGrowthLoading ? (
            <OverviewChartSkeleton />
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueChartData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                    labelFormatter={(label) => `${label} ${revenueYear}`}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    dataKey="value"
                    fill="#f97316"
                    name="Revenue"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      {ordersError ? (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 sm:p-6 flex items-center gap-3">
          <AlertCircle className="text-red-600 shrink-0" size={24} />
          <p className="text-sm text-red-700">Failed to load recent orders</p>
        </div>
      ) : ordersLoading ? (
        <OverviewTableSkeleton />
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 transition-all hover:border-brand-300 hover:bg-slate-50">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
            <a
              href="/orders"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All →
            </a>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {[
                      "Order ID",
                      "Buyer",
                      "Seller",
                      "Locker",
                      "Status",
                      "Amount",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-700 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-3 sm:px-4 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">
                        {order.orderId}
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-slate-600 truncate">
                        {order.buyer?.name ?? "—"}
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-slate-600 truncate hidden sm:table-cell">
                        {order.seller?.name ?? "—"}
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-slate-600 truncate hidden md:table-cell">
                        {order.location?.title ?? "—"}
                      </td>
                      <td className="px-3 sm:px-4 py-4">
                        <StatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">
                        ${order.amount}
                      </td>
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
