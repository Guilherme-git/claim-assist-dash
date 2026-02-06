import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info" | "teal";
  delay?: number;
  compact?: boolean; // Reduz o espaço entre conteúdo e ícone
}

const variantStyles = {
  default: "bg-card border-border/50",
  primary: "bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground border-primary/20",
  success: "bg-gradient-to-br from-success via-success to-success/80 text-success-foreground border-success/20",
  warning: "bg-gradient-to-br from-warning via-warning to-warning/80 text-warning-foreground border-warning/20",
  danger: "bg-gradient-to-br from-destructive via-destructive to-destructive/80 text-destructive-foreground border-destructive/20",
  info: "bg-gradient-to-br from-info via-info to-info/80 text-info-foreground border-info/20",
  teal: "bg-gradient-to-br from-teal-500 via-teal-500 to-teal-600 text-white border-teal-400/20",
};

const iconBgStyles = {
  default: "bg-primary/10 text-primary",
  primary: "bg-white/20 text-white backdrop-blur-sm",
  success: "bg-white/20 text-white backdrop-blur-sm",
  warning: "bg-black/10 text-black/80 backdrop-blur-sm",
  danger: "bg-white/20 text-white backdrop-blur-sm",
  info: "bg-white/20 text-white backdrop-blur-sm",
  teal: "bg-white/20 text-white backdrop-blur-sm",
};

export function MetricCard({ title, value, icon: Icon, trend, variant = "default", delay = 0, compact = false }: MetricCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 border transition-all duration-500",
        "hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]",
        "animate-fade-in-up",
        variantStyles[variant]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Subtle gradient overlay */}
      {variant !== "default" && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5" />
      )}

      <div className={cn(
        "relative flex items-start",
        compact ? "gap-2" : "justify-between"
      )}>
        <div className={cn("space-y-3", compact ? "flex-1 min-w-0" : "")}>
          <p className={cn(
            "text-sm font-medium tracking-wide",
            variant === "default" ? "text-muted-foreground" : "text-white/80"
          )}>
            {title}
          </p>
          <p className={cn(
            "font-bold tracking-tight",
            compact ? "text-3xl" : "text-4xl"
          )}>{value}</p>
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
              variant === "default"
                ? trend.isPositive
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
                : "bg-white/20 text-white backdrop-blur-sm"
            )}>
              <span className="text-sm">{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}% vs ontem</span>
            </div>
          )}
        </div>
        <div className={cn(
          "rounded-2xl transition-transform duration-300 group-hover:scale-110 flex-shrink-0",
          "p-3",
          iconBgStyles[variant]
        )}>
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
