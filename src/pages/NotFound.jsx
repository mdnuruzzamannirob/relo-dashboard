import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-6xl font-bold text-brand-500 sm:text-7xl md:text-9xl">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-semibold text-slate-800 sm:text-3xl">
          Page Not Found
        </h2>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/overview"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-brand-600 sm:w-auto sm:text-base"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-200 bg-white px-6 py-3 text-sm font-medium text-brand-600 transition-all hover:bg-brand-50 sm:w-auto sm:text-base"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
