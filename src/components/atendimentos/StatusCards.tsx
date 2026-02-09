import { cn } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";

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

// Ícones e cores por status de atendimento
const statusConfig: Record<string, { icon: any; color: string; bgColor: string }> = {
  waiting_identification: {
    icon: AlertCircle,
    color: "text-warning",
    bgColor: "bg-warning/10 border-warning/20",
  },
  waiting_request_reason: {
    icon: AlertCircle,
    color: "text-warning",
    bgColor: "bg-warning/10 border-warning/20",
  },
  answering_service_form: {
    icon: Clock,
    color: "text-info",
    bgColor: "bg-info/10 border-info/20",
  },
  waiting_understanding_wpp_flow: {
    icon: Clock,
    color: "text-muted-foreground",
    bgColor: "bg-muted border-border",
  },
  waiting_origin_location: {
    icon: MapPin,
    color: "text-warning",
    bgColor: "bg-warning/10 border-warning/20",
  },
  waiting_destination_location: {
    icon: MapPin,
    color: "text-warning",
    bgColor: "bg-warning/10 border-warning/20",
  },
  transferred: {
    icon: CheckCircle2,
    color: "text-info",
    bgColor: "bg-info/10 border-info/20",
  },
  finished: {
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10 border-success/20",
  },
};

// Labels curtos para os cards
const shortLabels: Record<string, string> = {
  waiting_identification: "Identificação",
  waiting_request_reason: "Motivo",
  answering_service_form: "Formulário",
  waiting_understanding_wpp_flow: "Fluxo WPP",
  waiting_origin_location: "Local Origem",
  waiting_destination_location: "Local Destino",
  transferred: "Transferido",
  finished: "Finalizados",
};

export function StatusCards({ statusCounts, activeStatus, onStatusClick, loading }: StatusCardsProps) {
  // Lista de todos os status possíveis (na ordem de exibição)
  const allStatuses = [
    "waiting_identification",
    "waiting_request_reason",
    "answering_service_form",
    "waiting_understanding_wpp_flow",
    "waiting_origin_location",
    "waiting_destination_location",
    "transferred",
    "finished",
  ];

  // Criar mapa de contagens
  const countsMap = new Map(statusCounts.map(s => [s.status, s.count]));

  // Criar array completo com todos os status (incluindo os com count 0)
  const completeStatusCounts = allStatuses.map(status => ({
    status,
    count: countsMap.get(status) || 0,
  }));

  const totalCount = statusCounts.reduce((acc, curr) => acc + curr.count, 0);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Drag to scroll state
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const DRAG_THRESHOLD = 5; // Pixels before considering it a drag

  // Scroll to active status when it changes
  useEffect(() => {
    const activeButton = buttonRefs.current.get(activeStatus);
    if (activeButton && containerRef.current) {
      activeButton.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeStatus]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsMouseDown(true);
    setHasDragged(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    // Reset hasDragged after a short delay to allow click to process
    setTimeout(() => setHasDragged(false), 0);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isMouseDown || !containerRef.current) return;

    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX;

    // Only start dragging if we've moved past the threshold
    if (Math.abs(walk) > DRAG_THRESHOLD) {
      setHasDragged(true);
      e.preventDefault();
      containerRef.current.scrollLeft = scrollLeft - walk * 1.5;
    }
  }, [isMouseDown, startX, scrollLeft]);

  const handleStatusClick = (status: string) => {
    // Only trigger click if not dragging (to prevent accidental clicks while scrolling)
    if (!hasDragged) {
      onStatusClick(status);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div
        ref={containerRef}
        className={cn(
          "flex gap-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth select-none",
          isMouseDown ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {/* Card "Todos" */}
        <button
          ref={(el) => {
            if (el) buttonRefs.current.set("todos", el);
          }}
          onClick={() => handleStatusClick("todos")}
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
        {completeStatusCounts.map(({ status, count }) => {
          const config = statusConfig[status] || {
            icon: AlertCircle,
            color: "text-muted-foreground",
            bgColor: "bg-muted border-border",
          };
          const Icon = config.icon;
          const isActive = activeStatus === status;
          const label = shortLabels[status] || status;

          return (
            <button
              key={status}
              ref={(el) => {
                if (el) buttonRefs.current.set(status, el);
              }}
              onClick={() => handleStatusClick(status)}
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
