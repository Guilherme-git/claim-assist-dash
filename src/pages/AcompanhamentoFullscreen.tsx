import { User, Car, Calendar, Clock, Maximize2, Minimize2, Volume2, VolumeX, Loader2, AlertCircle, ChevronLeft, ChevronRight, MapPin as RouteIcon, Timer, Wrench, Building2, HelpCircle } from "lucide-react";
import { LayoutGrid, BarChart3, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { AreaChart, Area, RadialBarChart, RadialBar } from "recharts";
import { formatDateTime, cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
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
  const [summary, setSummary] = useState({
    delayed: 0,
    alert: 0,
    on_time: 0,
    by_association: {} as Record<string, { on_time: number; alert: number; delayed: number }>,
  });
  const [previousDelayedCount, setPreviousDelayedCount] = useState(0);
  const [selectedAssociation, setSelectedAssociation] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'cards' | 'analytics'>('cards');
  const perPage = 20;

  // Buscar chamados da página atual e summary
  useEffect(() => {
    // Não fazer polling no modo analytics (dados são buscados no próprio componente)
    if (viewMode === 'analytics') {
      setLoading(false);
      return; // Sai sem criar interval
    }

    const fetchChamados = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await callsService.getOpenCalls(
          currentPage,
          perPage,
          selectedAssociation
        );

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

    // Buscar dados imediatamente
    fetchChamados();

    // Criar interval de 10 segundos (só no modo cards)
    const interval = setInterval(fetchChamados, 10000);

    // Cleanup: limpar interval quando mudar de modo ou desmontar
    return () => {
      clearInterval(interval);
    };
  }, [currentPage, selectedAssociation, viewMode]);

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

        // Parar após 2.5 segundos
        setTimeout(() => {
          if (audio.isPlaying()) {
            audio.pause();
          }
        }, 2500);
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
            {/* Atrasados */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm font-medium">{delayedCount} Atrasados</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-0.5 hover:bg-muted rounded-full transition-colors">
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">🔴 Atrasados</p>
                    <p className="text-xs">
                      Chamados que ultrapassaram o prazo de conclusão.
                      Requerem atenção imediata.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Critério: Passou do horário previsto
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Alertas */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm font-medium">{alertCount} Alertas</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-0.5 hover:bg-muted rounded-full transition-colors">
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">⚠️ Alertas</p>
                    <p className="text-xs">
                      Chamados próximos ao prazo limite.
                      Devem ser monitorados com atenção.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Critério: Faltam entre 1 e 10 minutos para o prazo
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* No Prazo */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium">{normalCount} No prazo</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-0.5 hover:bg-muted rounded-full transition-colors">
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">✅ No Prazo</p>
                    <p className="text-xs">
                      Chamados dentro do tempo esperado de conclusão.
                      Operação normal.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Critério: Faltam mais de 10 minutos para o prazo
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
        <AnalyticsView />
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

      {/* Cards de Métricas por Associação */}
      {summary.by_association && Object.keys(summary.by_association).length > 0 && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['solidy', 'nova', 'motoclub', 'aprovel']
              .filter(association => summary.by_association[association])
              .map((association) => {
              const data = summary.by_association[association];
              const total = data.delayed + data.alert + data.on_time;
              const associationConfig = {
                solidy: { label: 'Solidy', color: 'from-green-500 to-green-600', border: 'border-green-500' },
                nova: { label: 'Nova', color: 'from-blue-500 to-blue-600', border: 'border-blue-500' },
                motoclub: { label: 'Motoclub', color: 'from-orange-500 to-orange-600', border: 'border-orange-500' },
                aprovel: { label: 'Aprovel', color: 'from-teal-500 to-teal-600', border: 'border-teal-500' },
              }[association] || { label: association, color: 'from-slate-500 to-slate-600', border: 'border-slate-500' };

              return (
                <Card
                  key={association}
                  className={cn(
                    "border-2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300",
                    associationConfig.border
                  )}
                >
                  <CardContent className="p-4">
                    {/* Header com nome da associação */}
                    <div className={cn(
                      "mb-3 pb-2 border-b-2",
                      associationConfig.border
                    )}>
                      <h3 className={cn(
                        "text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent",
                        associationConfig.color
                      )}>
                        {associationConfig.label}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Total: {total} {total === 1 ? 'chamado' : 'chamados'}
                      </p>
                    </div>

                    {/* Métricas */}
                    <div className="space-y-2">
                      {/* Atrasados */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-sm font-medium">Atrasados</span>
                        </div>
                        <span className="text-lg font-bold text-red-600 dark:text-red-400">
                          {data.delayed}
                        </span>
                      </div>

                      {/* Alertas */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-sm font-medium">Alertas</span>
                        </div>
                        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                          {data.alert}
                        </span>
                      </div>

                      {/* No Prazo */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-sm font-medium">No Prazo</span>
                        </div>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {data.on_time}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

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
                {/* Header com Badge de status e Ícone de Ajuda */}
                <div className="flex justify-between items-start">
                  {/* Ícone de Ajuda */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="p-1 hover:bg-muted rounded-full transition-colors">
                          <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs p-4">
                        <div className="space-y-2 text-xs">
                          <p className="font-semibold text-sm mb-2">Informações do Card</p>

                          <div>
                            <span className="font-semibold">Usuário:</span>
                            <span className="text-muted-foreground ml-1">Nome do associado/cliente que solicitou o atendimento</span>
                          </div>

                          <div>
                            <span className="font-semibold">Cliente:</span>
                            <span className="text-muted-foreground ml-1">Associação ou empresa responsável (Solidy, Nova, Motoclub, etc.)</span>
                          </div>

                          <div>
                            <span className="font-semibold">Atendente:</span>
                            <span className="text-muted-foreground ml-1">Responsável que está atendendo o chamado</span>
                          </div>

                          <div>
                            <span className="font-semibold">Veículo:</span>
                            <span className="text-muted-foreground ml-1">Informações do veículo (marca, modelo e placa)</span>
                          </div>

                          <div className="pt-2 border-t">
                            <span className="font-semibold">Início:</span>
                            <span className="text-muted-foreground ml-1">Data/hora que o chamado foi criado</span>
                          </div>

                          <div>
                            <span className="font-semibold">Prev. Chegada:</span>
                            <span className="text-muted-foreground ml-1">Previsão de chegada do guincho ao local</span>
                          </div>

                          <div>
                            <span className="font-semibold">Prev. Conclusão:</span>
                            <span className="text-muted-foreground ml-1">Previsão de conclusão total do atendimento</span>
                          </div>

                          <div className="pt-2 border-t">
                            <span className="font-semibold">Distância:</span>
                            <span className="text-muted-foreground ml-1">Distância em km até o local do chamado</span>
                          </div>

                          <div>
                            <span className="font-semibold">Chegada:</span>
                            <span className="text-muted-foreground ml-1">Tempo estimado de chegada em minutos</span>
                          </div>

                          <div>
                            <span className="font-semibold">Serviço:</span>
                            <span className="text-muted-foreground ml-1">Duração estimada para conclusão do serviço</span>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Badge de status */}
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

// Componente de Visão Analítica com design elegante
interface AnalyticsViewProps {}

const AnalyticsView = ({}: AnalyticsViewProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [analyticsData, setAnalyticsData] = useState<{
    delayed: number;
    alert: number;
    on_time: number;
    evolution_by_hour: Array<{ hour: string; on_time: number; alert: number; delayed: number }>;
    by_association: Record<string, { on_time: number; alert: number; delayed: number }>;
  }>({
    delayed: 0,
    alert: 0,
    on_time: 0,
    evolution_by_hour: [],
    by_association: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar com primeiro e último dia do mês vigente
  useEffect(() => {
    const hoje = new Date();
    setStartDate(startOfMonth(hoje));
    setEndDate(endOfMonth(hoje));
  }, []);

  // Buscar dados analíticos quando as datas mudarem
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const startByHour = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
        const endByHour = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;

        console.log('📊 Buscando dados analíticos:', { startByHour, endByHour });
        const response = await callsService.getAnalytics(startByHour, endByHour);
        console.log('📊 Resposta do endpoint analítico:', response);

        // A resposta do /analitico vem direto, sem wrapper "summary"
        if (response) {
          console.log('✅ Dados analíticos recebidos:', response);
          setAnalyticsData({
            delayed: response.delayed || 0,
            alert: response.alert || 0,
            on_time: response.on_time || 0,
            evolution_by_hour: response.evolution_by_hour || [],
            by_association: response.by_association || {},
          });
        } else {
          console.warn('⚠️ Resposta vazia:', response);
        }
      } catch (err) {
        console.error('❌ Erro ao buscar dados analíticos:', err);
        setError('Não foi possível carregar os dados analíticos. A página será atualizada automaticamente.');
        // Manter dados zerados em caso de erro
        setAnalyticsData({
          delayed: 0,
          alert: 0,
          on_time: 0,
          evolution_by_hour: [],
          by_association: {},
        });
      } finally {
        setLoading(false);
      }
    };

    // Só buscar se tiver as datas inicializadas
    if (startDate && endDate) {
      fetchAnalytics();
    }
  }, [startDate, endDate]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in bg-slate-50 dark:bg-background -mx-6 -mb-6 px-6 pb-6 pt-2 min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando dados analíticos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in bg-slate-50 dark:bg-background -mx-6 -mb-6 px-6 pb-6 pt-2 min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-semibold mb-2">Erro ao carregar dados analíticos</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Calcular dados apenas quando não está em loading ou erro
  const total = analyticsData.delayed + analyticsData.alert + analyticsData.on_time;

  // Dados de evolução por hora da API
  const evolutionData = analyticsData.evolution_by_hour?.map(item => ({
    hora: item.hour.substring(0, 2) + 'h', // "00:00" -> "00h"
    atrasados: item.delayed,
    alertas: item.alert,
    noPrazo: item.on_time,
  })) || [];

  // Dados por associação da API
  const associationData = analyticsData.by_association
    ? Object.entries(analyticsData.by_association).map(([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
        Atrasados: data.delayed,
        Alertas: data.alert,
        'No Prazo': data.on_time,
        total: data.delayed + data.alert + data.on_time,
      }))
    : [];

  // Cores do tema (inspirado na referência)
  const colors = {
    primary: '#2563eb', // Azul
    accent: '#ec4899', // Magenta/Rosa
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    gray: '#94a3b8',
  };

  return (
    <div className="space-y-6 animate-fade-in bg-slate-50 dark:bg-background -mx-6 -mb-6 px-6 pb-6 pt-2 min-h-[calc(100vh-200px)]">
      {/* Layout principal em grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Coluna de métricas à esquerda */}
        <div className="col-span-12 md:col-span-2 space-y-4">
          {/* Card Total */}
          <Card className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{total}</p>
              <p className="text-xs text-muted-foreground mt-1">Chamados</p>
            </CardContent>
          </Card>

          {/* Card Atrasados */}
          <Card className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold" style={{ color: colors.accent }}>{analyticsData.delayed}</p>
              <p className="text-xs text-muted-foreground mt-1">Atrasados</p>
            </CardContent>
          </Card>

          {/* Card Alertas */}
          <Card className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold" style={{ color: colors.warning }}>{analyticsData.alert}</p>
              <p className="text-xs text-muted-foreground mt-1">Alertas</p>
            </CardContent>
          </Card>

          {/* Card No Prazo */}
          <Card className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold" style={{ color: colors.success }}>{analyticsData.on_time}</p>
              <p className="text-xs text-muted-foreground mt-1">No Prazo</p>
            </CardContent>
          </Card>
        </div>

        {/* Área central com gráficos */}
        <div className="col-span-12 md:col-span-7 space-y-4">
          {/* Gráfico de Linha - Evolução */}
          <Card className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-xl shadow-sm">
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="text-base font-semibold text-foreground">Evolução por Hora</h3>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-8 w-[130px] justify-start text-left font-normal text-xs",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                        {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Data início"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
                      <CalendarPicker
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        locale={ptBR}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <span className="text-xs text-muted-foreground">até</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-8 w-[130px] justify-start text-left font-normal text-xs",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                        {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Data fim"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
                      <CalendarPicker
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        locale={ptBR}
                        disabled={(date) => startDate ? date < startDate : false}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {(startDate || endDate) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => {
                        setStartDate(undefined);
                        setEndDate(undefined);
                      }}
                    >
                      Limpar
                    </Button>
                  )}
                </div>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorNoPrazo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="hora" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Area type="monotone" dataKey="noPrazo" name="No Prazo" stroke={colors.primary} strokeWidth={2} fill="url(#colorNoPrazo)" />
                    <Area type="monotone" dataKey="alertas" name="Alertas" stroke={colors.warning} strokeWidth={2} fill="transparent" />
                    <Area type="monotone" dataKey="atrasados" name="Atrasados" stroke={colors.accent} strokeWidth={2} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
            </div>
            </CardContent>
          </Card>

          {/* Gráfico de Barras Horizontal - Por Cliente */}
          {/* Cards por Cliente */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {associationData.map((client) => {
              // Definir cor da borda baseado no nome do cliente
              const clientColors: Record<string, { border: string; accent: string }> = {
                'Solidy': { border: '#22c55e', accent: '#22c55e' },
                'Nova': { border: '#3b82f6', accent: '#3b82f6' },
                'Motoclub': { border: '#f97316', accent: '#f97316' },
                'Aprovel': { border: '#14b8a6', accent: '#14b8a6' },
              };
              const clientColor = clientColors[client.name] || { border: '#6366f1', accent: '#6366f1' };
              
              return (
                <Card 
                  key={client.name}
                  className="bg-white dark:bg-card overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  style={{ borderTop: `3px solid ${clientColor.border}` }}
                >
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="mb-3">
                      <h4 className="font-semibold text-foreground">{client.name}</h4>
                      <p className="text-xs text-muted-foreground">Total: {client.total} chamados</p>
                    </div>
                    
                    {/* Divider */}
                    <div 
                      className="h-0.5 mb-3 rounded-full"
                      style={{ backgroundColor: clientColor.border }}
                    />
                    
                    {/* Status Items */}
                    <div className="space-y-2">
                      {/* Atrasados - com destaque rosa */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-950/30">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-sm text-foreground">Atrasados</span>
                        </div>
                        <span className="text-sm font-semibold text-red-600 dark:text-red-400">{client.Atrasados}</span>
                      </div>
                      
                      {/* Alertas */}
                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-sm text-foreground">Alertas</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">{client.Alertas}</span>
                      </div>
                      
                      {/* No Prazo */}
                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-sm text-foreground">No Prazo</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">{client['No Prazo']}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Coluna direita com gráficos de rosca */}
        <div className="col-span-12 md:col-span-3 space-y-4">
          {/* Gráfico de Rosca - Total em Atrasos */}
          <Card className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-xl shadow-sm">
            <CardContent className="p-5">
              <h3 className="text-base font-semibold text-foreground mb-2">Total em Atrasos</h3>
              <div className="h-[180px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Atrasados', value: analyticsData.delayed },
                        { name: 'Outros', value: total - analyticsData.delayed },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill={colors.accent} />
                      <Cell fill="#e2e8f0" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: colors.accent }}>{analyticsData.delayed}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {total > 0 ? ((analyticsData.delayed / total) * 100).toFixed(0) : 0}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.accent }} />
                  <span className="text-xs text-muted-foreground">Atrasados</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="text-xs text-muted-foreground">Outros</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Rosca - Total no Prazo */}
          <Card className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-xl shadow-sm">
            <CardContent className="p-5">
              <h3 className="text-base font-semibold text-foreground mb-2">Total no Prazo</h3>
              <div className="h-[180px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'No Prazo', value: analyticsData.on_time },
                        { name: 'Outros', value: total - analyticsData.on_time },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill={colors.primary} />
                      <Cell fill="#e2e8f0" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: colors.primary }}>{analyticsData.on_time}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {total > 0 ? ((analyticsData.on_time / total) * 100).toFixed(0) : 0}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.primary }} />
                  <span className="text-xs text-muted-foreground">No Prazo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="text-xs text-muted-foreground">Outros</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AcompanhamentoFullscreen;
