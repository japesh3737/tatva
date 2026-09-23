import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F6EAD8] disabled:pointer-events-none disabled:opacity-50 cursor-pointer tracking-wider uppercase text-xs",
          {
            "bg-[#F6EAD8] text-[#4A0A00] hover:bg-[#ebded0] shadow-sm":
              variant === "default",
            "border border-[#F6EAD8]/30 text-[#F6EAD8] hover:bg-[#F6EAD8]/10 hover:border-[#F6EAD8]":
              variant === "outline",
            "text-[#F6EAD8] hover:bg-[#F6EAD8]/10": variant === "ghost",
            "text-[#F6EAD8] underline-offset-4 hover:underline":
              variant === "link",
          },
          {
            "h-10 px-5 py-2": size === "default",
            "h-8 px-3 text-[11px]": size === "sm",
            "h-12 px-8 text-sm": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
