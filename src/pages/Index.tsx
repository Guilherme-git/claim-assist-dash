import { useState, useEffect } from "react";
import { Headphones, PhoneCall, CheckCircle, Clock, Loader2, Truck, DollarSign, Receipt, CreditCard, CheckCircle2 } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AttendanceTable } from "@/components/dashboard/AttendanceTable";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { useSidebar } from "@/contexts/SidebarContext";
import { dashboardService, type DashboardData } from "@/services/dashboard.service";

const Index = () => {
  const { collapsed } = useSidebar();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardService.getData();
        setDashboardData(data);
      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err);
        setError('Não foi possível carregar os dados do dashboard');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();

    // Atualizar dados a cada 30 segundos
    const interval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(interval);
  }, []);

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
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Chamados Hoje - Chamados"
              value={dashboardData.attendancesToday.toString()}
              icon={Headphones}
              variant="primary"
              delay={0}
            />
            <MetricCard
              title="Em Andamento - Chamados"
              value={dashboardData.attendancesInProgress.toString()}
              icon={PhoneCall}
              variant="warning"
              delay={100}
            />
            <MetricCard
              title="Finalizados - Chamados"
              value={dashboardData.attendancesFinished.toString()}
              icon={CheckCircle}
              variant="success"
              delay={200}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MetricCard
                  title="Tempo Médio de Execução de Guincho - Chamados"
                  value={dashboardData.averageTowingExecutionTime || "0min"}
                  icon={Truck}
                  variant="info"
                  delay={400}
                />
                <MetricCard
                  title="Ticket Médio - Chamados"
                  value={dashboardData.towingTicket?.averageTicket || "R$ 0,00"}
                  icon={DollarSign}
                  variant="teal"
                  delay={300}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MetricCard
                  title="Receita Total - Chamados"
                  value={dashboardData.towingTicket?.totalRevenue || "R$ 0,00"}
                  icon={CreditCard}
                  variant="success"
                  delay={400}
                />
                <MetricCard
                  title="Boletos Pagos - Chamados"
                  value={dashboardData.towingTicket.paidBillsCount.toString()}
                  icon={Receipt}
                  variant="danger"
                  delay={500}
                />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <QuickStats
                averageServiceTime={dashboardData.averageServiceTime}
              />
              <MetricCard
                title="Taxa de Resolução - Chamados"
                value={dashboardData.quickStats.resolutionRate}
                icon={CheckCircle2}
                variant="primary"
                delay={600}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
