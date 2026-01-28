import ButtonComp from "@/components/common/ButtonComp";
import Logo from "@/components/common/Logo";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const isLoading = false;

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("isAuthenticated", "true");
    navigate("/overview");
  };

  return (
    <div className="flex min-h-dvh items-center justify-center py-14">
      <div className="border-brand-100 w-full max-w-120 rounded-xl border p-8 shadow-sm">
        {/* Title */}
        <div className="mb-5 flex flex-col items-center text-center">
          <Logo />
          <h2 className="text-primary mt-3 text-2xl font-semibold">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-500"
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-500"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
            />
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm">
            {/* Remember me */}
            <label className="flex cursor-pointer items-center gap-2 text-slate-500 select-none">
              <Checkbox
                id="remember"
                className="border-brand-100 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span>Remember me</span>
            </label>

            {/* Forgot password */}
            <Link
              to="/forgot-password"
              className="text-primary font-medium transition hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In */}
          <ButtonComp
            type="submit"
            loading={isLoading}
            loadingText="Logging in..."
            size="lg"
            className="h-11 w-full"
          >
            Login
          </ButtonComp>
        </form>
      </div>
    </div>
  );
};

export default Login;
