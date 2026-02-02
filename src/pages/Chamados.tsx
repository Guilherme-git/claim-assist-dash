import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  Phone,
  MapPin,
  Truck,
  Wrench,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPhone, formatDateTime } from "@/lib/utils";
import { ChamadoFormModal } from "@/components/chamados/ChamadoFormModal";

// Tipos de status dos chamados
const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: any }> = {
  pending: { label: "Pendente", variant: "secondary", icon: Clock },
  in_progress: { label: "Em Andamento", variant: "default", icon: Truck },
  waiting_provider: { label: "Aguardando Prestador", variant: "secondary", icon: User },
  completed: { label: "Concluído", variant: "outline", icon: CheckCircle2 },
  cancelled: { label: "Cancelado", variant: "destructive", icon: XCircle },
};

// Tipos de serviço
const serviceTypeLabels: Record<string, string> = {
  towing: "Reboque",
  towing_light: "Reboque Leve",
  towing_moto: "Reboque Moto",
  towing_heavy: "Reboque Pesado",
  battery: "Bateria",
  battery_charge_light: "Carga Bateria",
  tire_change: "Troca de Pneu",
  locksmith: "Chaveiro",
  empty_tank: "Tanque Vazio",
  fuel_assistance: "Auxílio Combustível",
  other: "Outro",
};

// Mock de chamados
const mockChamados = [
  {
    id: "CH-001",
    association: "solidy",
    associate_name: "João Silva",
    associate_phone: "11987654321",
    vehicle_plate: "ABC1D23",
    vehicle_model: "Toyota Corolla",
    service_type: "towing_light",
    origin_address: "Rua das Flores, 123 - Centro, Brasília/DF",
    destination_address: "Av. Paulista, 1000 - Bela Vista, São Paulo/SP",
    status: "in_progress",
    provider_name: "Auto Socorro Express",
    created_at: "2026-02-02T10:30:00Z",
  },
  {
    id: "CH-002",
    association: "motoclub",
    associate_name: "Maria Santos",
    associate_phone: "11912345678",
    vehicle_plate: "XYZ9W87",
    vehicle_model: "Honda CB 500",
    service_type: "towing_moto",
    origin_address: "Av. Brasil, 500 - Jardim América, Goiânia/GO",
    destination_address: null,
    status: "pending",
    provider_name: null,
    created_at: "2026-02-02T11:15:00Z",
  },
  {
    id: "CH-003",
    association: "nova",
    associate_name: "Pedro Oliveira",
    associate_phone: "21998765432",
    vehicle_plate: "DEF4G56",
    vehicle_model: "Chevrolet Onix",
    service_type: "battery_charge_light",
    origin_address: "Rua das Acácias, 789 - Centro, Rio de Janeiro/RJ",
    destination_address: null,
    status: "waiting_provider",
    provider_name: null,
    created_at: "2026-02-02T09:45:00Z",
  },
  {
    id: "CH-004",
    association: "aprovel",
    associate_name: "Ana Costa",
    associate_phone: "31987654321",
    vehicle_plate: "GHI7J89",
    vehicle_model: "Hyundai HB20",
    service_type: "tire_change",
    origin_address: "Av. Contorno, 1500 - Funcionários, Belo Horizonte/MG",
    destination_address: null,
    status: "completed",
    provider_name: "Pneus Rápido",
    created_at: "2026-02-01T14:20:00Z",
  },
  {
    id: "CH-005",
    association: "solidy",
    associate_name: "Carlos Lima",
    associate_phone: "41912345678",
    vehicle_plate: "JKL0M12",
    vehicle_model: "Fiat Argo",
    service_type: "locksmith",
    origin_address: "Rua XV de Novembro, 300 - Centro, Curitiba/PR",
    destination_address: null,
    status: "cancelled",
    provider_name: null,
    created_at: "2026-02-01T16:00:00Z",
  },
];

export default function Chamados() {
  const [chamados] = useState(mockChamados);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [serviceFilter, setServiceFilter] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filtra os chamados
  const chamadosFiltrados = chamados.filter((chamado) => {
    if (statusFilter !== "todos" && chamado.status !== statusFilter) {
      return false;
    }
    if (serviceFilter !== "todos" && chamado.service_type !== serviceFilter) {
      return false;
    }
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchId = chamado.id.toLowerCase().includes(search);
      const matchName = chamado.associate_name.toLowerCase().includes(search);
      const matchPlate = chamado.vehicle_plate.toLowerCase().includes(search);
      const matchPhone = chamado.associate_phone.includes(search);
      const matchOrigin = chamado.origin_address?.toLowerCase().includes(search);

      if (!matchId && !matchName && !matchPlate && !matchPhone && !matchOrigin) {
        return false;
      }
    }
    return true;
  });

  const totalByStatus = {
    todos: chamados.length,
    pending: chamados.filter(c => c.status === "pending").length,
    in_progress: chamados.filter(c => c.status === "in_progress").length,
    completed: chamados.filter(c => c.status === "completed").length,
  };

  return (
    <DashboardLayout title="Chamados" subtitle="Gerencie os chamados de assistência">
      {/* Barra de Busca */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, nome, placa ou endereço..."
            className="pl-10 h-11 rounded-xl border-border/50 bg-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Info + Filtros */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        {/* Tabs de Info */}
        <Tabs defaultValue="todos" className="mb-0">
          <TabsList className="bg-card border border-border/50 p-1 rounded-xl">
            <TabsTrigger value="todos" className="rounded-lg">
              Todos ({totalByStatus.todos})
            </TabsTrigger>
            <TabsTrigger value="pendentes" className="rounded-lg">
              Pendentes ({totalByStatus.pending})
            </TabsTrigger>
            <TabsTrigger value="andamento" className="rounded-lg">
              Em Andamento ({totalByStatus.in_progress})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filtro de Status */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px] h-10 rounded-xl">
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="in_progress">Em Andamento</SelectItem>
            <SelectItem value="waiting_provider">Aguardando Prestador</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro de Serviço */}
        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger className="w-[200px] h-10 rounded-xl">
            <SelectValue placeholder="Filtrar por Serviço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Serviços</SelectItem>
            <SelectItem value="towing">Reboque</SelectItem>
            <SelectItem value="towing_light">Reboque Leve</SelectItem>
            <SelectItem value="towing_moto">Reboque Moto</SelectItem>
            <SelectItem value="battery_charge_light">Carga Bateria</SelectItem>
            <SelectItem value="tire_change">Troca de Pneu</SelectItem>
            <SelectItem value="locksmith">Chaveiro</SelectItem>
          </SelectContent>
        </Select>

        {/* Botão Limpar Filtros */}
        {(statusFilter !== "todos" || serviceFilter !== "todos" || searchTerm) && (
          <Button
            variant="outline"
            className="h-10 rounded-xl gap-2"
            onClick={() => {
              setStatusFilter("todos");
              setServiceFilter("todos");
              setSearchTerm("");
            }}
          >
            <XCircle className="h-4 w-4" />
            Limpar
          </Button>
        )}

        {/* Botão Novo Chamado */}
        <div className="ml-auto">
          <Button 
            className="h-10 rounded-xl gap-2 bg-primary hover:bg-primary/90"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Novo Chamado
          </Button>
        </div>
      </div>

      {/* Tabela Principal */}
      <Card className="rounded-2xl border-border/50 shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Lista de Chamados</CardTitle>
          <CardDescription>
            {chamadosFiltrados.length < chamados.length ? (
              `Mostrando ${chamadosFiltrados.length} de ${chamados.length} chamados (filtrados)`
            ) : (
              `Total de ${chamados.length} chamados`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Empty State */}
          {chamadosFiltrados.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum chamado encontrado</h3>
              <p className="text-sm text-muted-foreground">
                {chamados.length === 0
                  ? "Não há chamados cadastrados"
                  : "Nenhum chamado corresponde aos filtros selecionados"}
              </p>
            </div>
          )}

          {/* Table with Data */}
          {chamadosFiltrados.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Associado</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prestador</TableHead>
                  <TableHead className="w-[150px]">Data/Hora</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chamadosFiltrados.map((chamado) => {
                  const statusInfo = statusConfig[chamado.status] || {
                    label: chamado.status,
                    variant: "secondary" as const,
                    icon: AlertCircle
                  };
                  const StatusIcon = statusInfo.icon;

                  return (
                    <TableRow key={chamado.id} className="group">
                      <TableCell className="font-mono text-sm font-medium text-primary">
                        #{chamado.id}
                      </TableCell>
                      <TableCell className="capitalize text-sm">
                        {chamado.association}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{chamado.associate_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatPhone(chamado.associate_phone)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-mono text-sm font-medium">{chamado.vehicle_plate}</p>
                          <p className="text-xs text-muted-foreground">{chamado.vehicle_model}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded-lg">
                          <Wrench className="h-3 w-3 mr-1" />
                          {serviceTypeLabels[chamado.service_type] || chamado.service_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant} className="gap-1.5 rounded-lg">
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {chamado.provider_name || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDateTime(chamado.created_at)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <MapPin className="h-4 w-4 mr-2" />
                              Ver no Mapa
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="h-4 w-4 mr-2" />
                              Ligar: {formatPhone(chamado.associate_phone)}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Truck className="h-4 w-4 mr-2" />
                              Atribuir Prestador
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Novo Chamado */}
      <ChamadoFormModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onSuccess={() => {
          // Recarregar lista de chamados
        }}
      />
    </DashboardLayout>
  );
}
