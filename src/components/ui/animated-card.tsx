import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedCard = ({ children, className, delay = 0 }: AnimatedCardProps) => {
  return (
    <div 
      className={cn(
        "glass-card rounded-2xl overflow-hidden transition-all duration-500",
        "hover:shadow-elevated hover:scale-105",
        "animate-fade-in",
        className
      )}
      style={{ 
        animationDelay: `${delay}s`,
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedCard; 