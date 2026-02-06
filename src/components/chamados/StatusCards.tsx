import { cn } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Truck,
  Loader2,
} from "lucide-react";
import { callTowingStatusLabels } from "@/services/calls.service";

interface StatusCount {
  status: string;
  count: number;
}

interface StatusCardsProps {
  statusCounts: StatusCount[];
  activeStatus: string;
  onStatusClick: (status: string) => void;
  loading?: boolean;
}

// Ícones e cores por status
const statusConfig: Record<string, { icon: any; color: string; bgColor: string }> = {
  waiting_driver_accept: {
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10 border-warning/20",
  },
  waiting_driver_access_app_after_call_accepted: {
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10 border-warning/20",
  },
  waiting_arrival_to_checkin: {
    icon: Truck,
    color: "text-info",
    bgColor: "bg-info/10 border-info/20",
  },
  in_checking: {
    icon: CheckCircle2,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
  },
  waiting_arrival_to_checkout: {
    icon: Truck,
    color: "text-info",
    bgColor: "bg-info/10 border-info/20",
  },
  in_checkout: {
    icon: CheckCircle2,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
  },
  waiting_in_shed: {
    icon: Clock,
    color: "text-muted-foreground",
    bgColor: "bg-muted border-border",
  },
  waiting_add_towing_delivery_call_trip: {
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10 border-destructive/20",
  },
  finished: {
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10 border-success/20",
  },
  cancelled: {
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10 border-destructive/20",
  },
};

// Labels curtos para os cards
const shortLabels: Record<string, string> = {
  waiting_driver_accept: "Aguardando Aceite",
  waiting_driver_access_app_after_call_accepted: "Aguardando App",
  waiting_arrival_to_checkin: "A caminho (Checkin)",
  in_checking: "Em Checkin",
  waiting_arrival_to_checkout: "A caminho (Checkout)",
  in_checkout: "Em Checkout",
  waiting_in_shed: "Na Garagem",
  waiting_add_towing_delivery_call_trip: "Aguardando Viagem",
  finished: "Finalizados",
  cancelled: "Cancelados",
};

export function StatusCards({ statusCounts, activeStatus, onStatusClick, loading }: StatusCardsProps) {
  const totalCount = statusCounts.reduce((acc, curr) => acc + curr.count, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* Card "Todos" */}
        <button
          onClick={() => onStatusClick("todos")}
          className={cn(
            "flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200",
            "hover:shadow-md hover:-translate-y-0.5",
            activeStatus === "todos"
              ? "bg-primary text-primary-foreground border-primary shadow-md"
              : "bg-card border-border/50 hover:border-primary/30"
          )}
        >
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg",
            activeStatus === "todos" ? "bg-white/20" : "bg-primary/10"
          )}>
            <span className={cn(
              "text-sm font-bold",
              activeStatus === "todos" ? "text-primary-foreground" : "text-primary"
            )}>
              {totalCount}
            </span>
          </div>
          <span className="text-sm font-medium whitespace-nowrap">Todos</span>
        </button>

        {/* Cards de Status */}
        {statusCounts.map(({ status, count }) => {
          const config = statusConfig[status] || {
            icon: AlertCircle,
            color: "text-muted-foreground",
            bgColor: "bg-muted border-border",
          };
          const Icon = config.icon;
          const isActive = activeStatus === status;
          const label = shortLabels[status] || callTowingStatusLabels[status] || status;

          return (
            <button
              key={status}
              onClick={() => onStatusClick(status)}
              className={cn(
                "flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200",
                "hover:shadow-md hover:-translate-y-0.5",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : cn("bg-card hover:border-primary/30", config.bgColor)
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg",
                isActive ? "bg-white/20" : "bg-white/50"
              )}>
                <Icon className={cn(
                  "h-4 w-4",
                  isActive ? "text-primary-foreground" : config.color
                )} />
              </div>
              <div className="flex flex-col items-start">
                <span className={cn(
                  "text-lg font-bold leading-none",
                  isActive ? "text-primary-foreground" : "text-foreground"
                )}>
                  {count}
                </span>
                <span className={cn(
                  "text-[10px] font-medium whitespace-nowrap leading-tight mt-0.5",
                  isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
