import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, LogOut, Menu, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLogoutMutation } from "@/store/apis/authApi";
import { getInitials } from "@/utils/getInitials";

const Topbar = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { isLoading, user } = useAuth();

  const [logout, { isLoading: isLogoutLoading, isSuccess }] =
    useLogoutMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  return (
    <header className="border-brand-100 flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
      {/* Left Section - Mobile Menu & Search */}
      <div className="flex flex-1 items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="hover:bg-brand-50 rounded-lg p-2 transition-colors lg:hidden"
        >
          <Menu className="h-6 w-6 text-slate-600" />
        </button>

        {/* Search */}
        <div className="relative hidden w-full max-w-md sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="border-brand-100 h-10 w-full rounded-lg border bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications - Commented out for now */}
        {/* <button className="hover:bg-brand-50 relative rounded-lg p-2 transition-colors">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="bg-brand-500 absolute right-1.5 top-1.5 h-2 w-2 rounded-full"></span>
        </button> */}

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="hover:bg-brand-50 flex items-center gap-2 rounded-lg px-2 py-2 transition-colors sm:gap-3 sm:px-3"
          >
            <div className="hidden text-right sm:block ">
              <p className="text-sm font-medium text-slate-700">
                {" "}
                {user?.name}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="bg-brand-500 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white">
              {getInitials(user?.name)}
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full z-20 w-48 rounded-lg border border-brand-100 bg-white py-2 shadow-lg">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate("/profile");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-600 transition hover:bg-brand-50"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <hr className="border-brand-100 my-2" />
                <button
                  onClick={() => logout()}
                  disabled={isLogoutLoading}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
                >
                  {isLogoutLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="size-4" />
                      Logout
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
