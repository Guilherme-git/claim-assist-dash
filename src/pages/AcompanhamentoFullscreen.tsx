import { User, Car, Calendar, Clock, Maximize2, Minimize2, Volume2, VolumeX, Loader2, AlertCircle, ChevronLeft, ChevronRight, MapPin as RouteIcon, Timer, Wrench, Building2 } from "lucide-react";
import { LayoutGrid, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { callsService, type OpenCall, type Pagination } from "@/services/calls.service";

type TimeStatus = "on_time" | "delayed" | "alert";

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
    case "on_time":
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
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [chamados, setChamados] = useState<OpenCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [summary, setSummary] = useState({ delayed: 0, alert: 0, on_time: 0 });
  const [previousDelayedCount, setPreviousDelayedCount] = useState(0);
  const [selectedAssociation, setSelectedAssociation] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'cards' | 'analytics'>('cards');
  const perPage = 20;

  // Buscar chamados da página atual e summary
  useEffect(() => {
    const fetchChamados = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await callsService.getOpenCalls(currentPage, perPage, selectedAssociation);
        setChamados(response.data);
        setPagination(response.pagination);
        setSummary(response.summary);
      } catch (err) {
        console.error("Erro ao buscar chamados:", err);
        setError("Não foi possível carregar os chamados");
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();

    // Atualizar a cada 10 segundos
    const interval = setInterval(fetchChamados, 10000);

    return () => clearInterval(interval);
  }, [currentPage, selectedAssociation]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.last_page) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Atualizar relógio
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Inicializar Web Audio API
  useEffect(() => {
    // Criar contexto de áudio
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.value = 0.3; // Volume 30%

    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;
    let isPlaying = false;

    // Função para criar som de sirene estilo "Wail" dramático
    const startSirene = () => {
      if (isPlaying) return;
      isPlaying = true;

      oscillator = audioContext.createOscillator();
      oscillator.type = 'triangle';

      gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(masterGain);

      const now = audioContext.currentTime;
      const cycleDuration = 2.5;
      const lowFreq = 500;
      const highFreq = 1200;

      const scheduleSirene = (startTime: number, cycles: number) => {
        if (!oscillator) return;

        for (let i = 0; i < cycles; i++) {
          const cycleStart = startTime + (i * cycleDuration);
          oscillator.frequency.setValueAtTime(lowFreq, cycleStart);
          oscillator.frequency.exponentialRampToValueAtTime(highFreq, cycleStart + cycleDuration / 2);
          oscillator.frequency.exponentialRampToValueAtTime(lowFreq, cycleStart + cycleDuration);
        }
      };

      oscillator.start(now);
      scheduleSirene(now, 200);

      setTimeout(() => {
        if (isPlaying && oscillator) {
          scheduleSirene(audioContext.currentTime, 200);
        }
      }, 450000);
    };

    const stopSirene = () => {
      if (!isPlaying) return;
      isPlaying = false;

      if (oscillator) {
        try {
          oscillator.stop();
          oscillator.disconnect();
        } catch (e) {}
        oscillator = null;
      }
      if (gainNode) {
        gainNode.disconnect();
        gainNode = null;
      }
    };

    // Armazenar funções de controle
    audioRef.current = {
      play: startSirene,
      pause: stopSirene,
      context: audioContext,
      gainNode: masterGain,
      isPlaying: () => isPlaying,
    } as any;

    // Cleanup ao desmontar
    return () => {
      stopSirene();
      audioContext.close();
    };
  }, []);

  // Controlar som baseado em chamados com status "delayed"
  useEffect(() => {
    const currentDelayed = summary.delayed;

    // Verificar se há um novo chamado atrasado (contador aumentou)
    const hasNewDelayed = currentDelayed > previousDelayedCount;

    if (audioRef.current && hasNewDelayed && !isMuted) {
      const audio = audioRef.current as any;

      try {
        // Tocar o som
        audio.play();

        // Parar após 2 segundos
        setTimeout(() => {
          if (audio.isPlaying()) {
            audio.pause();
          }
        }, 2000);
      } catch (error) {
        console.log("Não foi possível iniciar o som automaticamente.");
      }
    }

    // Atualizar o contador anterior
    setPreviousDelayedCount(currentDelayed);
  }, [summary.delayed, isMuted]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const audio = audioRef.current as any;
      const hasDelayed = summary.delayed > 0;

      if (isMuted) {
        // Ativar som
        if (audio.gainNode) {
          audio.gainNode.gain.value = 0.3;
        }
        // Só toca se tiver chamados atrasados
        if (hasDelayed && audio.play && !audio.isPlaying()) {
          audio.play();
        }
      } else {
        // Desativar som
        if (audio.gainNode) {
          audio.gainNode.gain.value = 0;
        }
        if (audio.pause && audio.isPlaying()) {
          audio.pause();
        }
      }
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const delayedCount = summary.delayed;
  const alertCount = summary.alert;
  const normalCount = summary.on_time;

  // Helper para formatar veículo
  const formatVehicle = (call: OpenCall): string => {
    if (!call.veiculo) return "Veículo não informado";
    const { brand, model, plate } = call.veiculo;
    return `${brand} ${model} - ${plate}`;
  };

  // Loading state
  if (loading && chamados.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando chamados...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && chamados.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-destructive font-semibold">{error}</p>
          <p className="text-muted-foreground text-sm">A página será atualizada automaticamente</p>
        </div>
      </div>
    );
  }

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

          {/* Toggle View Buttons */}
          <div className="flex items-center bg-muted rounded-xl p-1">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="rounded-lg gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              Cards
            </Button>
            <Button
              variant={viewMode === 'analytics' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('analytics')}
              className="rounded-lg gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Análise
            </Button>
          </div>

          <Button
            variant={isMuted ? "destructive" : "default"}
            size="icon"
            onClick={toggleMute}
            className="rounded-xl"
            title={isMuted ? "Ativar Som" : "Desativar Som"}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>

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

      {/* Filtro por Cliente */}
      {viewMode === 'analytics' ? (
        <AnalyticsView summary={summary} chamados={chamados} />
      ) : (
        <>
      <div className="mb-6">
        <Card className="p-4 rounded-2xl border-border/50 shadow-soft bg-gradient-to-br from-card to-card/50">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Filtrar por Cliente:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { value: 'todos', label: 'Todos', color: 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700' },
                { value: 'solidy', label: 'Solidy', color: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' },
                { value: 'nova', label: 'Nova', color: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' },
                { value: 'motoclub', label: 'Motoclub', color: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' },
                { value: 'aprovel', label: 'Aprovel', color: 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700' },
              ].map((association) => (
                <button
                  key={association.value}
                  onClick={() => {
                    setSelectedAssociation(association.value);
                    setCurrentPage(1); // Reset para primeira página ao mudar filtro
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 transform",
                    "border-2 shadow-md",
                    selectedAssociation === association.value
                      ? `${association.color} text-white border-transparent scale-105 shadow-lg`
                      : "bg-background/80 text-muted-foreground border-border/50 hover:border-border hover:bg-background"
                  )}
                >
                  {association.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {chamados.map((call) => {
          const styles = getStatusStyles(call.timeStatus as TimeStatus);
          
          return (
            <Card 
              key={call.id} 
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

                {/* Nome do Usuário */}
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    call.timeStatus === "delayed" ? "bg-red-100 dark:bg-red-900/30" :
                    call.timeStatus === "alert" ? "bg-amber-100 dark:bg-amber-900/30" :
                    "bg-primary/10"
                  )}>
                    <User className={cn(
                      "h-4 w-4",
                      call.timeStatus === "delayed" ? "text-red-600 dark:text-red-400" :
                      call.timeStatus === "alert" ? "text-amber-600 dark:text-amber-400" :
                      "text-primary"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Usuário</p>
                    <p className="font-semibold text-sm truncate">{call.associado?.name || "Usuário não informado"}</p>
                  </div>
                </div>

                {/* Cliente */}
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    call.timeStatus === "delayed" ? "bg-red-100 dark:bg-red-900/30" :
                    call.timeStatus === "alert" ? "bg-amber-100 dark:bg-amber-900/30" :
                    "bg-purple-500/10"
                  )}>
                    <Building2 className={cn(
                      "h-4 w-4",
                      call.timeStatus === "delayed" ? "text-red-600 dark:text-red-400" :
                      call.timeStatus === "alert" ? "text-amber-600 dark:text-amber-400" :
                      "text-purple-500"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Cliente</p>
                    <p className={cn(
                      "font-semibold text-sm truncate uppercase",
                      !call.associado?.association && "text-muted-foreground italic normal-case"
                    )}>
                      {call.associado?.association || "Não definida"}
                    </p>
                  </div>
                </div>

                {/* Nome do Usuário */}
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    call.timeStatus === "delayed" ? "bg-red-100 dark:bg-red-900/30" :
                    call.timeStatus === "alert" ? "bg-amber-100 dark:bg-amber-900/30" :
                    "bg-blue-500/10"
                  )}>
                    <User className={cn(
                      "h-4 w-4",
                      call.timeStatus === "delayed" ? "text-red-600 dark:text-red-400" :
                      call.timeStatus === "alert" ? "text-amber-600 dark:text-amber-400" :
                      "text-blue-500"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Atendente</p>
                    <p className="font-medium text-sm">{call.atendente?.name || "Sem atendente"}</p>
                  </div>
                </div>

                {/* Veículo */}
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    call.timeStatus === "delayed" ? "bg-red-100 dark:bg-red-900/30" :
                    call.timeStatus === "alert" ? "bg-amber-100 dark:bg-amber-900/30" :
                    "bg-orange-500/10"
                  )}>
                    <Car className={cn(
                      "h-4 w-4",
                      call.timeStatus === "delayed" ? "text-red-600 dark:text-red-400" :
                      call.timeStatus === "alert" ? "text-amber-600 dark:text-amber-400" :
                      "text-orange-500"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Veículo</p>
                    <p className="font-medium text-sm truncate">{formatVehicle(call)}</p>
                  </div>
                </div>

                {/* Datas */}
                <div className={cn(
                  "pt-3 border-t space-y-2",
                  call.timeStatus === "delayed" ? "border-red-200 dark:border-red-900/50" :
                  call.timeStatus === "alert" ? "border-amber-200 dark:border-amber-900/50" :
                  "border-border"
                )}>
                  <div className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground shrink-0">Início:</span>
                    <span className="font-medium truncate">{call.created_at}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground shrink-0">Prev. Chegada:</span>
                    <span className={cn(
                      "font-medium truncate",
                      !call.expected_arrival_date && "text-muted-foreground italic"
                    )}>
                      {call.expected_arrival_date || "Não definida"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground shrink-0">Prev. Conclusão:</span>
                    <span className={cn(
                      "font-medium truncate",
                      !call.expected_completion_date && "text-muted-foreground italic"
                    )}>
                      {call.expected_completion_date || "Não definida"}
                    </span>
                  </div>
                </div>

                {/* Métricas */}
                {(call.towing_distance_km || call.towing_arrival_time_minutes || call.service_duration) && (
                  <div className={cn(
                    "pt-3 border-t",
                    call.timeStatus === "delayed" ? "border-red-200 dark:border-red-900/50" :
                    call.timeStatus === "alert" ? "border-amber-200 dark:border-amber-900/50" :
                    "border-border"
                  )}>
                    <div className="grid grid-cols-3 gap-2">
                      {call.towing_distance_km && (
                        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                          <RouteIcon className="h-3.5 w-3.5 text-blue-500" />
                          <span className="text-xs font-semibold">{call.towing_distance_km} km</span>
                          <span className="text-[10px] text-muted-foreground">Distância</span>
                        </div>
                      )}
                      {call.towing_arrival_time_minutes !== null && call.towing_arrival_time_minutes !== undefined && (
                        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                          <Timer className="h-3.5 w-3.5 text-orange-500" />
                          <span className="text-xs font-semibold">{call.towing_arrival_time_minutes} min</span>
                          <span className="text-[10px] text-muted-foreground">Chegada</span>
                        </div>
                      )}
                      {call.service_duration && (
                        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                          <Wrench className="h-3.5 w-3.5 text-purple-500" />
                          <span className="text-xs font-semibold">{call.service_duration}</span>
                          <span className="text-[10px] text-muted-foreground">Serviço</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {chamados.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum chamado em acompanhamento no momento.
          </p>
        </div>
      )}

      {/* Paginação */}
      {pagination && chamados.length > 0 && (
        <div className="mt-8 flex items-center justify-between bg-card rounded-2xl border border-border/50 p-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium text-foreground">{pagination.from}</span> a{" "}
              <span className="font-medium text-foreground">{pagination.to}</span> de{" "}
              <span className="font-medium text-foreground">{pagination.total}</span> chamados
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || loading}
              className="rounded-xl gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            <div className="flex items-center gap-2 px-4">
              <span className="text-sm text-muted-foreground">
                Página <span className="font-medium text-foreground">{currentPage}</span> de{" "}
                <span className="font-medium text-foreground">{pagination.last_page}</span>
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === pagination.last_page || loading}
              className="rounded-xl gap-1"
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

// Componente de Visão Analítica
interface AnalyticsViewProps {
  summary: { delayed: number; alert: number; on_time: number };
  chamados: OpenCall[];
}

const AnalyticsView = ({ summary, chamados }: AnalyticsViewProps) => {
  const total = summary.delayed + summary.alert + summary.on_time;
  
  const pieData = [
    { name: 'Atrasados', value: summary.delayed, color: '#ef4444' },
    { name: 'Alertas', value: summary.alert, color: '#f59e0b' },
    { name: 'No Prazo', value: summary.on_time, color: '#10b981' },
  ];

  const barData = [
    { name: 'Atrasados', quantidade: summary.delayed, fill: '#ef4444' },
    { name: 'Alertas', quantidade: summary.alert, fill: '#f59e0b' },
    { name: 'No Prazo', quantidade: summary.on_time, fill: '#10b981' },
  ];

  // Agrupar por cliente
  const clienteData = chamados.reduce((acc, call) => {
    const cliente = call.associado?.association || 'Não definido';
    if (!acc[cliente]) {
      acc[cliente] = { delayed: 0, alert: 0, on_time: 0 };
    }
    if (call.timeStatus === 'delayed') acc[cliente].delayed++;
    else if (call.timeStatus === 'alert') acc[cliente].alert++;
    else acc[cliente].on_time++;
    return acc;
  }, {} as Record<string, { delayed: number; alert: number; on_time: number }>);

  const clienteBarData = Object.entries(clienteData).map(([name, data]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
    Atrasados: data.delayed,
    Alertas: data.alert,
    'No Prazo': data.on_time,
  }));

  return (
    <div className="space-y-6">
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border/50 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Chamados</p>
                <p className="text-3xl font-bold text-foreground">{total}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">Atrasados</p>
                <p className="text-3xl font-bold text-red-700 dark:text-red-300">{summary.delayed}</p>
                <p className="text-xs text-red-500">{total > 0 ? ((summary.delayed / total) * 100).toFixed(1) : 0}%</p>
              </div>
              <div className="p-3 rounded-xl bg-red-500/20">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 dark:text-amber-400">Alertas</p>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{summary.alert}</p>
                <p className="text-xs text-amber-500">{total > 0 ? ((summary.alert / total) * 100).toFixed(1) : 0}%</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/20">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">No Prazo</p>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{summary.on_time}</p>
                <p className="text-xs text-emerald-500">{total > 0 ? ((summary.on_time / total) * 100).toFixed(1) : 0}%</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Timer className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza */}
        <Card className="bg-card border-border/50 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Distribuição por Status</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Barras por Status */}
        <Card className="bg-card border-border/50 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quantidade por Status</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="quantidade" radius={[8, 8, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico por Cliente */}
      {clienteBarData.length > 0 && (
        <Card className="bg-card border-border/50 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Chamados por Cliente</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clienteBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Atrasados" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Alertas" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="No Prazo" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AcompanhamentoFullscreen;
