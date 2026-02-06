import { cn } from "@/lib/utils/cn";
import { Link } from "react-router-dom";

const Logo = ({ className }) => {
  return (
    <Link
      to="/"
      className={cn("w-fit shrink-0 -space-y-1.5 text-left", className)}
    >
      <p className="text-primary text-3xl font-bold tracking-tighter">CAYRE</p>
      <p className="text-[10px] font-medium text-slate-500 uppercase">
        Cayman Resellers
      </p>
    </Link>
  );
};

export default Logo;
