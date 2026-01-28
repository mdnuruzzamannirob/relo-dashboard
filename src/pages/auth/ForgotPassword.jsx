import ButtonComp from "@/components/common/ButtonComp";
import Logo from "@/components/common/Logo";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const isLoading = false;

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/verify-otp");
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

        <form onSubmit={handleSubmit} className="space-y-5">
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
              className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
            />
          </div>

          <ButtonComp
            type="submit"
            loading={isLoading}
            loadingText="Sending..."
            size="lg"
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
