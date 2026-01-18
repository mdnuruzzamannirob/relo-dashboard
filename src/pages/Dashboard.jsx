import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  FileText,
  Layout,
  ChevronDown,
  Upload,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  useGetAdminDashboardStatsQuery,
  useGetHeroBannerQuery,
  useUpdateHeroBannerMutation,
} from "../services/allApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DashboardPage = () => {
  // Global stats fetch
  const { data: globalStats, isLoading: isGlobalLoading } =
    useGetAdminDashboardStatsQuery({
      type: "book",
      year: 2026,
    });

  // --- API INTEGRATION STARTS HERE ---
  const { data: heroBannerData, isLoading: isHeroLoading } =
    useGetHeroBannerQuery();
  const [updateHeroBanner, { isLoading: isUpdating }] =
    useUpdateHeroBannerMutation();

  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Pre-fill form when data is fetched
  useEffect(() => {
    if (heroBannerData?.data) {
      setHeadline(heroBannerData.data.title || "");
      setDescription(heroBannerData.data.description || "");
      setPreviewUrl(heroBannerData.data.image || null);
    }
  }, [heroBannerData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => { 
 
  };

  // --- API INTEGRATION ENDS HERE ---

  return (
    <div className="min-h-screen p-8 font-sans text-slate-800 ">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Welcome back! Here's what's happening with your marketplace.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm text-xs font-medium text-slate-600 w-fit transition-all hover:shadow-md">
          <Sparkles size={14} className="text-amber-500" />
          System Updated: 2026 Active
        </div>
      </header>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {isGlobalLoading ? (
          [...Array(4)].map((_, i) => <SkeletonStatCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={globalStats?.totalBooks || 1230}
              Icon={BookOpen}
            />
            <StatCard
              title="Active Listing"
              value={globalStats?.totalCharacters || 600}
              Icon={Users}
            />
            <StatCard
              title="Total Orders"
              value={globalStats?.totalBlogs || 250}
              Icon={FileText}
            />
            <StatCard
              title="Revenue"
              value={globalStats?.totalThemes || "$2230"}
              Icon={Layout}
            />
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <IndependentChartCard
          title="Total User"
          type="book"
          dataKey="bookGrowth"
          chartType="area"
        />
        <IndependentChartCard
          title="Revenue Overview"
          type="blog"
          dataKey="blogGrowth"
          chartType="bar"
        />
      </div>

     

      {/* Hero Section Form */}
      {/* Hero Section Form */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
        <div className="border-b border-slate-100 p-6 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">Hero Section</h2>
          <p className="text-sm text-slate-500">
            Update the main landing area of your creative universe.
          </p>
        </div>
        <div className="p-8">
          <div className="w-full space-y-6">
            <div className="w-full">
              <label className="block text-sm font-semibold mb-2 text-slate-700">
                Headline Title
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g., Welcome to the Broken World"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-semibold mb-2 text-slate-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your universe..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-32 resize-none focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-semibold mb-2 text-slate-700">
                Cover Image
              </label>
              <div className="group relative border-2 border-dashed border-slate-200 rounded-2xl min-h-50 transition-all hover:border-slate-400 hover:bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                {/* PREVIEW LOGIC: Show selected file OR existing API image */}
                {previewUrl ? (
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={previewUrl}
                      alt="Hero Preview"
                      className="w-full h-full object-cover opacity-30 transition-opacity group-hover:opacity-20"
                    />
                  </div>
                ) : null}

                <div className="relative z-10 flex flex-col items-center p-8">
                  <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
                    <Upload size={24} className="text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-600 font-medium">
                    {selectedFile
                      ? selectedFile.name
                      : "Click to change hero image"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PNG, JPG, or WEBP up to 10MB
                  </p>
                </div>

                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => {
                  // Reset to original data
                  setHeadline(heroBannerData?.data?.title || "");
                  setDescription(heroBannerData?.data?.description || "");
                  setPreviewUrl(heroBannerData?.data?.image || null);
                  setSelectedFile(null);
                }}
                className="px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSubmit}
                disabled={isUpdating}
                className="bg-slate-900 text-white px-10 py-3 rounded-xl font-semibold shadow-lg shadow-slate-200 hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Publishing..." : "Publish Changes"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ... Rest of your existing components (IndependentChartCard, StatCard, Skeletons) remain exactly the same
const IndependentChartCard = ({ title, type, dataKey, chartType }) => {
  const [year, setYear] = useState(2026);
  const { data, isFetching } = useGetAdminDashboardStatsQuery({ type, year });

  const startYear = 2024;
  const endYear = 2050;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  );

  const chartData =
    data?.[dataKey]?.map((item) => ({
      name: item.month.substring(0, 3),
      count: item.count,
    })) || [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative transition-all hover:shadow-md group">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-slate-800 text-lg group-hover:text-slate-900 transition-colors">
          {title}
        </h3>

        <div className="relative group/select">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 transition-all duration-200 hover:border-slate-400 hover:bg-white focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:border-slate-900 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 border-r border-slate-200 pr-2">
              Year
            </span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="appearance-none bg-transparent outline-none text-xs font-bold text-slate-800 cursor-pointer z-10"
            >
              {years.map((y) => (
                <option key={y} value={y} className="text-base">
                  {y}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover/select:text-slate-900 transition-colors">
              <ChevronDown size={14} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        {isFetching ? (
          <SkeletonChart />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id={`color${type}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#0f172a"
                  strokeWidth={3}
                  fill={`url(#color${type})`}
                />
              </AreaChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#0f172a"
                  radius={[4, 4, 0, 0]}
                  barSize={12}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, Icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start transition-all hover:shadow-md hover:-translate-y-1 group">
    <div>
      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 leading-tight">
        {title}
      </p>
      <h3 className="text-3xl font-black text-slate-800 tracking-tight">
        {value}
      </h3>
    </div>
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
      <Icon size={22} className="transition-colors" />
    </div>
  </div>
);

const SkeletonStatCard = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-3">
        <div className="h-3 w-20 bg-slate-100 rounded"></div>
        <div className="h-8 w-12 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="h-12 w-12 bg-slate-100 rounded-xl"></div>
    </div>
  </div>
);

const SkeletonChart = () => (
  <div className="w-full h-full flex flex-col justify-end gap-4 animate-pulse pt-4">
    <div className="flex items-end justify-between gap-2 h-full px-2">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-slate-100 w-full rounded-t-md"
          style={{ height: `${Math.random() * 60 + 20}%` }}
        ></div>
      ))}
    </div>
    <div className="h-4 w-full bg-slate-50 rounded"></div>
  </div>
);

export default DashboardPage;
