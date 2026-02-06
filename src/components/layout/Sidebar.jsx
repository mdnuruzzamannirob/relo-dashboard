import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../common/Logo";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Lock,
  CreditCard,
  MessageSquare,
  LogOut,
  Info,
  Shield,
  FileText,
  Workflow,
  ShieldCheck,
  HelpCircle,
  TrendingUp,
  ShoppingBag,
  Layers,
  MapPin,
  UserCircle,
} from "lucide-react";

const menuItems = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    path: "/overview",
  },
  {
    label: "User",
    icon: Users,
    path: "/users",
  },
  {
    label: "Products",
    icon: Package,
    path: "/products",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    path: "/orders",
  },
  {
    label: "Payments",
    icon: CreditCard,
    path: "/payments",
  },
  {
    label: "Category",
    icon: Layers,
    path: "/category",
  },
  {
    label: "Locker",
    icon: MapPin,
    path: "/locker",
  },
  {
    label: "Message",
    icon: MessageSquare,
    path: "/message",
  },
];

const settingsSubMenu = [
  {
    label: "Profile",
    icon: UserCircle,
    path: "/profile",
  },
  {
    label: "About Us",
    icon: Info,
    path: "/about-us",
  },
  {
    label: "Privacy Policy",
    icon: Shield,
    path: "/privacy-policy",
  },
  {
    label: "Terms & Condition",
    icon: FileText,
    path: "/terms-condition",
  },
  {
    label: "How it Works",
    icon: Workflow,
    path: "/how-it-works",
  },
  {
    label: "Trust & safety",
    icon: ShieldCheck,
    path: "/trust-safety",
  },
  {
    label: "Help Center",
    icon: HelpCircle,
    path: "/help-center",
  },
  {
    label: "Selling guide",
    icon: TrendingUp,
    path: "/selling-guide",
  },
  {
    label: "Buying guide",
    icon: ShoppingBag,
    path: "/buying-guide",
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const isSettingsActive = settingsSubMenu.some(
    (item) => location.pathname === item.path,
  );

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "border-brand-100 fixed z-50 flex h-screen flex-col overflow-x-hidden border-r bg-white transition-all duration-300",
          // Mobile: always full width (w-64), show/hide with translate
          // Desktop: can collapse, always visible
          "w-64 lg:static lg:translate-x-0",
          collapsed && "lg:w-20",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="border-brand-100 relative flex h-16 items-center border-b px-4">
          <Logo
            className={cn(
              "transition-opacity duration-200",
              collapsed ? "lg:opacity-0" : "lg:opacity-100 lg:delay-75",
            )}
          />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "hidden h-9 w-9 items-center justify-center rounded-md p-0 transition-all duration-200 hover:scale-110 hover:bg-brand-50 lg:flex",
              collapsed
                ? "lg:absolute lg:left-1/2 lg:-translate-x-1/2"
                : "lg:ml-auto",
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 text-slate-500 transition-transform" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-slate-500 transition-transform" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-brand-50 hover:text-brand-600",
                )}
                title={collapsed ? item.label : ""}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span
                  className={cn(
                    "ml-3 whitespace-nowrap transition-opacity duration-200",
                    collapsed ? "lg:opacity-0" : "lg:opacity-100 lg:delay-75",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Settings with Submenu */}
          <div>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={cn(
                "flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                settingsOpen && !isSettingsActive
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-brand-50 hover:text-brand-600",
              )}
              title={collapsed ? "Settings" : ""}
            >
              <Settings className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  "ml-3 flex-1 text-left whitespace-nowrap transition-opacity duration-200",
                  collapsed ? "lg:opacity-0" : "lg:opacity-100 lg:delay-75",
                )}
              >
                Settings
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-all duration-200",
                  settingsOpen && "rotate-180",
                  collapsed ? "lg:opacity-0" : "lg:opacity-100 lg:delay-75",
                )}
              />
            </button>

            {/* Submenu */}
            {settingsOpen && (
              <div
                className={cn(
                  "ml-2 mt-1 space-y-1 border-l border-brand-100 pl-2",
                  collapsed && "lg:hidden",
                )}
              >
                {settingsSubMenu.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-brand-100 text-brand-600"
                          : "text-slate-500 hover:bg-brand-50 hover:text-slate-700",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-brand-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-red-50 hover:text-red-600"
            title={collapsed ? "Log out" : ""}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                "ml-3 whitespace-nowrap transition-opacity duration-200",
                collapsed ? "lg:opacity-0" : "lg:opacity-100 lg:delay-75",
              )}
            >
              Log out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
