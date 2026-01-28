"use client";

import { cn } from "@/utils/cn";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const ButtonComp = ({
  className,
  loadingText = "Processing...",
  children,
  loading,
  disabled = false,
  variant,
  size,
  ...props
}) => {
  return (
    <Button
      className={cn("items-center", className)}
      variant={variant}
      size={size}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default ButtonComp;
