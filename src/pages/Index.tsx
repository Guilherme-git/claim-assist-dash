import { Headphones, PhoneCall, CheckCircle, Clock } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AttendanceTable } from "@/components/dashboard/AttendanceTable";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { useSidebar } from "@/contexts/SidebarContext";

const Index = () => {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className={`${collapsed ? 'ml-20' : 'ml-72'} transition-all duration-500`}>
        <Header />
        
        <div className="p-8 space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Atendimentos Hoje"
              value="248"
              icon={Headphones}
              trend={{ value: 12, isPositive: true }}
              variant="primary"
              delay={0}
            />
            <MetricCard
              title="Em Andamento"
              value="32"
              icon={PhoneCall}
              trend={{ value: 5, isPositive: false }}
              variant="warning"
              delay={100}
            />
            <MetricCard
              title="Finalizados"
              value="216"
              icon={CheckCircle}
              trend={{ value: 18, isPositive: true }}
              variant="success"
              delay={200}
            />
            <MetricCard
              title="Tempo Médio"
              value="23min"
              icon={Clock}
              trend={{ value: 8, isPositive: true }}
              delay={300}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AttendanceChart />
            </div>
            <div>
              <QuickStats />
            </div>
          </div>

          {/* Attendance Table */}
          <AttendanceTable />
        </div>
      </main>
    </div>
  );
};

export default Index;
