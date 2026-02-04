import { ArrowLeft, User, Car, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSidebar } from "@/contexts/SidebarContext";
import { formatDateTime } from "@/lib/utils";

interface AcompanhamentoItem {
  id: string;
  clientName: string;
  userName: string;
  vehicle: string;
  startDate: string;
  estimatedEndDate: string | null;
}

// Dados mockados para demonstração
const mockAcompanhamentos: AcompanhamentoItem[] = [
  {
    id: "1",
    clientName: "ADELIA LUCAS PEREIRA",
    userName: "Thais Santos",
    vehicle: "Peugeot 206 SOLEIL - PRN8I07",
    startDate: "2026-02-04T08:55:48.000Z",
    estimatedEndDate: "2026-02-04T12:00:00.000Z",
  },
  {
    id: "2",
    clientName: "LUIS FELIPE DIAS PAIM",
    userName: "Carlos Oliveira",
    vehicle: "VW Gol Trendline - QAH8441",
    startDate: "2026-02-04T09:30:00.000Z",
    estimatedEndDate: null,
  },
  {
    id: "3",
    clientName: "MARIANA BURCHIETTI",
    userName: "Ana Paula",
    vehicle: "VW Polo 1.0 - QAR3F15",
    startDate: "2026-02-04T10:15:00.000Z",
    estimatedEndDate: "2026-02-04T14:30:00.000Z",
  },
  {
    id: "4",
    clientName: "ROBERTO SILVA COSTA",
    userName: "Thais Santos",
    vehicle: "Fiat Uno Way - ABC1234",
    startDate: "2026-02-04T07:45:00.000Z",
    estimatedEndDate: "2026-02-04T11:00:00.000Z",
  },
  {
    id: "5",
    clientName: "FERNANDA LIMA SANTOS",
    userName: "Pedro Henrique",
    vehicle: "Honda Civic - XYZ5678",
    startDate: "2026-02-04T11:00:00.000Z",
    estimatedEndDate: null,
  },
];

const Acompanhamento = () => {
  const { collapsed } = useSidebar();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className={`${collapsed ? 'ml-20' : 'ml-72'} transition-all duration-500`}>
        <Header />

        <div className="p-8 space-y-6">
          {/* Header com botão voltar */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Acompanhamento</h1>
              <p className="text-muted-foreground">
                Acompanhe os chamados em andamento
              </p>
            </div>
          </div>

          {/* Grid de Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mockAcompanhamentos.map((item) => (
              <Card 
                key={item.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/chamados/${item.id}`)}
              >
                <CardContent className="p-5 space-y-4">
                  {/* Nome do Cliente */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Cliente</p>
                      <p className="font-semibold text-sm truncate">{item.clientName}</p>
                    </div>
                  </div>

                  {/* Nome do Usuário */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <User className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Atendente</p>
                      <p className="font-medium text-sm">{item.userName}</p>
                    </div>
                  </div>

                  {/* Veículo */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <Car className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Veículo</p>
                      <p className="font-medium text-sm truncate">{item.vehicle}</p>
                    </div>
                  </div>

                  {/* Datas */}
                  <div className="pt-3 border-t border-border space-y-2">
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
            ))}
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
      </main>
    </div>
  );
};

export default Acompanhamento;
