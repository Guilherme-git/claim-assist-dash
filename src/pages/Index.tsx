import { useState, useEffect, useCallback } from "react";
import { Headphones, PhoneCall, CheckCircle, Clock, Loader2, Truck, DollarSign, Receipt, CreditCard, CheckCircle2, AlertCircle, Star, Activity } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AttendanceTable } from "@/components/dashboard/AttendanceTable";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { useSidebar } from "@/contexts/SidebarContext";
import { dashboardService, type DashboardData, type DashboardFilters } from "@/services/dashboard.service";

const Index = () => {
  const { collapsed } = useSidebar();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters | undefined>(undefined);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getData(filters);
      setDashboardData(data);
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError('Não foi possível carregar os dados do dashboard');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboardData();

    // Atualizar dados a cada 30 segundos
    const interval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handleApplyFilter = (startDate: string, endDate: string) => {
    setFilters({ start_date: startDate, end_date: endDate });
  };

  const handleClearFilter = () => {
    setFilters(undefined);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className={`${collapsed ? 'ml-20' : 'ml-72'} transition-all duration-500`}>
          <Header />
          <div className="p-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Carregando dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className={`${collapsed ? 'ml-20' : 'ml-72'} transition-all duration-500`}>
          <Header />
          <div className="p-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="text-center">
              <p className="text-destructive mb-2">Erro ao carregar dashboard</p>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className={`${collapsed ? 'ml-20' : 'ml-72'} transition-all duration-500`}>
        <Header />

        <div className="p-8 space-y-8">
          {/* Filtro de Data */}
          <DateRangeFilter onFilter={handleApplyFilter} onClear={handleClearFilter} />

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Chamados Hoje"
              value={dashboardData.attendancesToday.toString()}
              icon={Headphones}
              variant="primary"
              delay={0}
            />
            <MetricCard
              title="Em Andamento"
              value={dashboardData.attendancesInProgress.toString()}
              icon={PhoneCall}
              variant="warning"
              delay={100}
            />
            <MetricCard
              title="Finalizados"
              value={dashboardData.attendancesFinished.toString()}
              icon={CheckCircle}
              variant="success"
              delay={200}
            />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Média NPS"
                value={dashboardData.averageNPS || "0/5.0"}
                icon={Star}
                variant="warning"
                delay={350}
              />
              <MetricCard
                title="Tempo Médio de Execução"
                value={dashboardData.averageTowingExecutionTime || "0min"}
                icon={Truck}
                variant="info"
                delay={400}
              />
              <MetricCard
                title="Ticket Médio"
                value={dashboardData.towingTicket?.averageTicket || "R$ 0,00"}
                icon={DollarSign}
                variant="teal"
                delay={450}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Despesa Total"
                value={dashboardData.towingTicket?.totalExpense || "R$ 0,00"}
                icon={CreditCard}
                variant="success"
                delay={500}
                compact={true}
              />
              <MetricCard
                title="Taxa de Resolução"
                value={dashboardData.quickStats?.resolutionRate || "0%"}
                icon={CheckCircle2}
                variant="primary"
                delay={550}
              />
              <MetricCard
                title="Chamados Atrasados"
                value={dashboardData.attendancesDelayed?.toString() || "0"}
                icon={AlertCircle}
                variant="danger"
                delay={600}
              />
              <MetricCard
                title="Frequência de Acionamento"
                value={dashboardData.callFrequency || "0%"}
                icon={Activity}
                variant="info"
                delay={650}
                compact={true}
              />
            </div>
            <QuickStats
              averageServiceTime={dashboardData.averageServiceTime || "0min"}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
