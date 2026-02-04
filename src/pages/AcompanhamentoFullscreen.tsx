import { User, Car, Calendar, Clock, Maximize2, Minimize2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

type TimeStatus = "normal" | "alert" | "delayed";

interface AcompanhamentoItem {
  id: string;
  clientName: string;
  userName: string;
  vehicle: string;
  startDate: string;
  estimatedEndDate: string | null;
  timeStatus: TimeStatus;
}

// Dados mockados para demonstração com diferentes status
const mockAcompanhamentos: AcompanhamentoItem[] = [
  {
    id: "1",
    clientName: "ADELIA LUCAS PEREIRA",
    userName: "Thais Santos",
    vehicle: "Peugeot 206 SOLEIL - PRN8I07",
    startDate: "2026-02-04T08:55:48.000Z",
    estimatedEndDate: "2026-02-04T12:00:00.000Z",
    timeStatus: "delayed",
  },
  {
    id: "2",
    clientName: "LUIS FELIPE DIAS PAIM",
    userName: "Carlos Oliveira",
    vehicle: "VW Gol Trendline - QAH8441",
    startDate: "2026-02-04T09:30:00.000Z",
    estimatedEndDate: null,
    timeStatus: "alert",
  },
  {
    id: "3",
    clientName: "MARIANA BURCHIETTI",
    userName: "Ana Paula",
    vehicle: "VW Polo 1.0 - QAR3F15",
    startDate: "2026-02-04T10:15:00.000Z",
    estimatedEndDate: "2026-02-04T14:30:00.000Z",
    timeStatus: "normal",
  },
  {
    id: "4",
    clientName: "ROBERTO SILVA COSTA",
    userName: "Thais Santos",
    vehicle: "Fiat Uno Way - ABC1234",
    startDate: "2026-02-04T07:45:00.000Z",
    estimatedEndDate: "2026-02-04T11:00:00.000Z",
    timeStatus: "delayed",
  },
  {
    id: "5",
    clientName: "FERNANDA LIMA SANTOS",
    userName: "Pedro Henrique",
    vehicle: "Honda Civic - XYZ5678",
    startDate: "2026-02-04T11:00:00.000Z",
    estimatedEndDate: null,
    timeStatus: "normal",
  },
  {
    id: "6",
    clientName: "CARLOS EDUARDO MENDES",
    userName: "Maria Clara",
    vehicle: "Toyota Corolla - DEF4567",
    startDate: "2026-02-04T10:30:00.000Z",
    estimatedEndDate: "2026-02-04T13:00:00.000Z",
    timeStatus: "alert",
  },
  {
    id: "7",
    clientName: "PATRICIA ALVES SOUZA",
    userName: "João Pedro",
    vehicle: "Chevrolet Onix - GHI7890",
    startDate: "2026-02-04T09:00:00.000Z",
    estimatedEndDate: "2026-02-04T12:30:00.000Z",
    timeStatus: "normal",
  },
  {
    id: "8",
    clientName: "MARCOS ANTONIO LIMA",
    userName: "Ana Paula",
    vehicle: "Hyundai HB20 - JKL1234",
    startDate: "2026-02-04T08:00:00.000Z",
    estimatedEndDate: "2026-02-04T10:00:00.000Z",
    timeStatus: "delayed",
  },
];

const getStatusStyles = (status: TimeStatus) => {
  switch (status) {
    case "delayed":
      return {
        card: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900/50",
        badge: "bg-red-500 text-white",
        badgeText: "Atrasado",
      };
    case "alert":
      return {
        card: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50",
        badge: "bg-amber-500 text-white",
        badgeText: "Alerta",
      };
    case "normal":
    default:
      return {
        card: "bg-card border-border",
        badge: "bg-emerald-500 text-white",
        badgeText: "No prazo",
      };
  }
};

const AcompanhamentoFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const delayedCount = mockAcompanhamentos.filter(i => i.timeStatus === "delayed").length;
  const alertCount = mockAcompanhamentos.filter(i => i.timeStatus === "alert").length;
  const normalCount = mockAcompanhamentos.filter(i => i.timeStatus === "normal").length;

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Acompanhamento de Chamados</h1>
          <p className="text-muted-foreground mt-1">
            Atualizado em tempo real • {currentTime.toLocaleTimeString("pt-BR")}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Status summary */}
          <div className="flex items-center gap-3 mr-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm font-medium">{delayedCount} Atrasados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm font-medium">{alertCount} Alertas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium">{normalCount} No prazo</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            className="rounded-xl"
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {mockAcompanhamentos.map((item) => {
          const styles = getStatusStyles(item.timeStatus);
          
          return (
            <Card 
              key={item.id} 
              className={cn(
                "transition-all duration-300 hover:shadow-lg",
                styles.card
              )}
            >
              <CardContent className="p-5 space-y-4">
                {/* Badge de status */}
                <div className="flex justify-end">
                  <span className={cn(
                    "text-xs font-semibold px-2.5 py-1 rounded-full",
                    styles.badge
                  )}>
                    {styles.badgeText}
                  </span>
                </div>

                {/* Nome do Cliente */}
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    item.timeStatus === "delayed" ? "bg-red-100 dark:bg-red-900/30" :
                    item.timeStatus === "alert" ? "bg-amber-100 dark:bg-amber-900/30" :
                    "bg-primary/10"
                  )}>
                    <User className={cn(
                      "h-4 w-4",
                      item.timeStatus === "delayed" ? "text-red-600 dark:text-red-400" :
                      item.timeStatus === "alert" ? "text-amber-600 dark:text-amber-400" :
                      "text-primary"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Cliente</p>
                    <p className="font-semibold text-sm truncate">{item.clientName}</p>
                  </div>
                </div>

                {/* Nome do Usuário */}
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    item.timeStatus === "delayed" ? "bg-red-100 dark:bg-red-900/30" :
                    item.timeStatus === "alert" ? "bg-amber-100 dark:bg-amber-900/30" :
                    "bg-blue-500/10"
                  )}>
                    <User className={cn(
                      "h-4 w-4",
                      item.timeStatus === "delayed" ? "text-red-600 dark:text-red-400" :
                      item.timeStatus === "alert" ? "text-amber-600 dark:text-amber-400" :
                      "text-blue-500"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Atendente</p>
                    <p className="font-medium text-sm">{item.userName}</p>
                  </div>
                </div>

                {/* Veículo */}
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    item.timeStatus === "delayed" ? "bg-red-100 dark:bg-red-900/30" :
                    item.timeStatus === "alert" ? "bg-amber-100 dark:bg-amber-900/30" :
                    "bg-orange-500/10"
                  )}>
                    <Car className={cn(
                      "h-4 w-4",
                      item.timeStatus === "delayed" ? "text-red-600 dark:text-red-400" :
                      item.timeStatus === "alert" ? "text-amber-600 dark:text-amber-400" :
                      "text-orange-500"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Veículo</p>
                    <p className="font-medium text-sm truncate">{item.vehicle}</p>
                  </div>
                </div>

                {/* Datas */}
                <div className={cn(
                  "pt-3 border-t space-y-2",
                  item.timeStatus === "delayed" ? "border-red-200 dark:border-red-900/50" :
                  item.timeStatus === "alert" ? "border-amber-200 dark:border-amber-900/50" :
                  "border-border"
                )}>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Início:</span>
                    <span className="font-medium">{formatDateTime(item.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Previsão:</span>
                    <span className="font-medium">
                      {item.estimatedEndDate 
                        ? formatDateTime(item.estimatedEndDate) 
                        : "Não definida"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {mockAcompanhamentos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum chamado em acompanhamento no momento.
          </p>
        </div>
      )}
    </div>
  );
};

export default AcompanhamentoFullscreen;
