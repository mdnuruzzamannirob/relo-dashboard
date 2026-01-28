import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const Overview = () => {
  // Mock data
  const stats = [
    {
      label: "Total Users",
      value: "12,584",
      change: "+12.5%",
      icon: Users,
      trend: "up",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Products",
      value: "3,240",
      change: "+8.2%",
      icon: ShoppingCart,
      trend: "up",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Total Orders",
      value: "8,573",
      change: "+23.1%",
      icon: ShoppingCart,
      trend: "up",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Total Revenue",
      value: "$124,580",
      change: "-2.4%",
      icon: DollarSign,
      trend: "down",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const recentOrders = [
    {
      id: "#JD1N4",
      buyer: "John Smith",
      seller: "Emma Wilson",
      location: "123 Main St, New York",
      date: "28-01-2026",
      status: "Pending",
      price: "$130",
      statusColor: "bg-yellow-50 text-yellow-700",
    },
    {
      id: "#QJDHJM",
      buyer: "John Smith",
      seller: "Emma Wilson",
      location: "123 Main St, New York",
      date: "15-01-2026",
      status: "Completed",
      price: "$120",
      statusColor: "bg-emerald-50 text-emerald-700",
    },
    {
      id: "#SOJHM",
      buyer: "John Smith",
      seller: "Emma Wilson",
      location: "123 Main St, New York",
      date: "13-01-2026",
      status: "Pending",
      price: "$70",
      statusColor: "bg-yellow-50 text-yellow-700",
    },
    {
      id: "#SJCFT",
      buyer: "John Smith",
      seller: "Emma Wilson",
      location: "123 Main St, New York",
      date: "14-01-2026",
      status: "Completed",
      price: "$160",
      statusColor: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 text-sm">
          Welcome back! Here's your dashboard performance at a glance.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
          return (
            <div
              key={idx}
              className="bg-white rounded-lg border border-slate-200 p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`${stat.iconColor}`} size={20} />
                </div>
                <div
                  className={`flex items-center gap-0.5 text-xs font-semibold ${
                    stat.trend === "up" ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  <TrendIcon size={12} />
                  {stat.change}
                </div>
              </div>
              <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Total User Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Total User</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded transition-all">
                2025
              </button>
              <span className="text-xs text-slate-400">▼</span>
            </div>
          </div>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            {/* Grid lines */}
            {[20, 40, 60, 80].map((y) => (
              <line
                key={`grid-${y}`}
                x1="30"
                y1={y}
                x2="390"
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            ))}
            {/* Area chart */}
            <defs>
              <linearGradient
                id="areaGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#8b9dd4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8b9dd4" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 30 120 L 70 90 L 110 80 L 150 110 L 190 70 L 230 85 L 270 60 L 310 75 L 350 50 L 390 70 L 390 180 L 30 180 Z"
              fill="url(#areaGradient)"
            />
            <polyline
              points="30,120 70,90 110,80 150,110 190,70 230,85 270,60 310,75 350,50 390,70"
              fill="none"
              stroke="#8b9dd4"
              strokeWidth="2"
            />
            {/* X-axis labels */}
            {[
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
            ].map((month, idx) => (
              <text
                key={month}
                x={30 + idx * 36}
                y="195"
                textAnchor="middle"
                fontSize="11"
                fill="#64748b"
              >
                {month}
              </text>
            ))}
            {/* Y-axis labels */}
            {["0", "20", "40", "60", "80", "100"].map((val, idx) => (
              <text
                key={`y-${val}`}
                x="20"
                y={160 - idx * 32}
                textAnchor="end"
                fontSize="10"
                fill="#94a3b8"
              >
                {val}
              </text>
            ))}
          </svg>
        </div>

        {/* Revenue Overview Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Revenue Overview
            </h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded transition-all">
                2025
              </button>
              <span className="text-xs text-slate-400">▼</span>
            </div>
          </div>
          <div className="flex items-end justify-around h-48 gap-2 p-4">
            {[
              { label: "Jan", value: 35 },
              { label: "Feb", value: 45 },
              { label: "Mar", value: 25 },
              { label: "Apr", value: 55 },
              { label: "May", value: 40 },
              { label: "Jun", value: 60 },
              { label: "Jul", value: 50 },
              { label: "Aug", value: 65 },
              { label: "Sep", value: 45 },
              { label: "Oct", value: 55 },
              { label: "Nov", value: 70 },
              { label: "Dec", value: 80 },
            ].map((bar, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 flex-1"
              >
                <div className="w-full flex justify-center">
                  <div
                    className="bg-slate-800 rounded-t transition-all hover:opacity-80 w-6"
                    style={{ height: `${bar.value * 1.5}px` }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
          <a
            href="/orders"
            className="text-sm font-semibold text-brand-500 hover:text-brand-600"
          >
            View All →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                  Buyer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                  Seller
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                  Locker Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-all"
                >
                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                    {order.id}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {order.buyer}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {order.seller}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {order.location}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {order.date}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${order.statusColor}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-900 text-right">
                    {order.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
