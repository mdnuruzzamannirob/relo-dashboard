import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import ButtonComp from "@/components/common/ButtonComp";
import Logo from "@/components/common/Logo";
import { forgotPasswordSchema } from "@/utils/validationSchemas";
import { AlertCircle } from "lucide-react";
import { useForgotPasswordMutation } from "@/store/apis/authApi";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [forgotPassword, { isLoading, isSuccess }] =
    useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  // Handle successful OTP send
  useEffect(() => {
    if (isSuccess) {
      navigate("/verify-otp", { replace: true });
    }
  }, [isSuccess, navigate]);

  const onSubmit = async (formData) => {
    const payload = {
      email: formData.email,
    };

    forgotPassword(payload);
  };

  return (
    <div className="flex min-h-dvh items-center justify-center py-14">
      <div className="border-brand-100 w-full max-w-120 rounded-xl border p-8 shadow-sm">
        <div className="mb-5 flex flex-col items-center text-center">
          <Logo />
          <h2 className="text-primary mt-3 text-2xl font-semibold">
            Forgot password
          </h2>
          <p className="text-sm text-slate-500">
            Enter your email to receive an OTP
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                disabled={isLoading || isSubmitting}
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

          <ButtonComp
            type="submit"
            loading={isLoading || isSubmitting}
            loadingText="Sending..."
            size="lg"
            disabled={isLoading || isSubmitting}
            className="h-11 w-full"
          >
            Send OTP
          </ButtonComp>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-primary font-medium transition hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
