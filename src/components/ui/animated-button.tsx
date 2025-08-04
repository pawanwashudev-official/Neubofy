import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const AnimatedButton = ({ 
  children, 
  className, 
  variant = "default",
  size = "default",
  onClick,
  disabled,
  type = "button"
}: AnimatedButtonProps) => {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        "hover:scale-105 active:scale-95",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
    </Button>
  );
};

export default AnimatedButton; 