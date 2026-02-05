import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import ButtonComp from "@/components/common/ButtonComp";
import Logo from "@/components/common/Logo";
import { loginSchema } from "@/utils/validationSchemas";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "@/store/apis/authApi";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading: isLoginIn, isSuccess }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const isLoading = isLoginIn || isSubmitting;

  // Handle successful login
  useEffect(() => {
    if (isSuccess) {
      navigate("/overview", { replace: true });
    }
  }, [isSuccess, navigate]);

  const onSubmit = async (formData) => {
    const payload = {
      email: formData.email,
      password: formData.password,
    };
    login(payload);
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-500"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register("email")}
                type="email"
                id="email"
                placeholder="you@example.com"
                disabled={isLoading}
                className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.email && (
                <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={14} />
                  {errors.email.message}
                </div>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-500"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-primary text-xs font-medium transition hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                disabled={isLoading}
                className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
              />

              {/* toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-2.5 p-1 text-slate-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              {errors.password && (
                <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={14} />
                  {errors.password.message}
                </div>
              )}
            </div>
          </div>

          {/* Sign In */}
          <ButtonComp
            type="submit"
            loading={isLoading}
            loadingText="Logging in..."
            size="lg"
            disabled={isLoading}
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
