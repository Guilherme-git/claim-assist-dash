import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  Phone,
  MapPin,
  User,
  Loader2,
  Truck,
  Wrench,
  Plus,
  ArrowRightLeft,
} from "lucide-react";
import { ChamadoFormModal } from "@/components/chamados/chamadoFormModal";
import { TransferCallModal } from "@/components/chamados/TransferCallModal";
import { StatusCards } from "@/components/chamados/StatusCards";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPhone, formatDateTime } from "@/lib/utils";
import {
  callsService,
  type Call,
  type Pagination,
  type StatusCount,
  callTowingStatusLabels,
  callTowingStatusVariants,
  towingServiceTypeLabels,
  associationLabels,
} from "@/services/calls.service";

// Ícones por tipo de status de guincho
const statusIcons: Record<string, any> = {
  waiting_driver_accept: Clock,
  waiting_driver_access_app_after_call_accepted: Clock,
  waiting_arrival_to_checkin: Truck,
  in_checking: CheckCircle2,
  waiting_arrival_to_checkout: Truck,
  in_checkout: CheckCircle2,
  waiting_in_shed: Clock,
  waiting_add_towing_delivery_call_trip: AlertCircle,
  finished: CheckCircle2,
  cancelled: XCircle,
};

export default function Chamados() {
  const navigate = useNavigate();
  const [chamados, setChamados] = useState<Call[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [statusCounts, setStatusCounts] = useState<StatusCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const getGoogleMapsUrl = (address: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  // Estados dos filtros (aplicados na API)
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("todos");
  const [associationFilter, setAssociationFilter] = useState<string>("todos");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedCallForTransfer, setSelectedCallForTransfer] = useState<Call | null>(null);

  // Função para buscar chamados (reutilizável)
  const fetchChamados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await callsService.getAll({
        page: currentPage,
        limit: 10,
        status: statusFilter !== "todos" ? statusFilter : undefined,
        towing_service_type: serviceTypeFilter !== "todos" ? serviceTypeFilter : undefined,
        association: associationFilter !== "todos" ? associationFilter : undefined,
        search: searchTerm || undefined,
      });
      setChamados(response.data);
      setPagination(response.pagination);
      setStatusCounts(response.status_counts || []);
    } catch (err) {
      console.error('Erro ao buscar chamados:', err);
      setError('Não foi possível carregar os chamados. Verifique se a API está rodando em http://localhost:3001');
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, serviceTypeFilter, associationFilter, searchTerm]);

  useEffect(() => {
    fetchChamados();
  }, [fetchChamados]);

  // Callback para recarregar após criar chamado
  const handleChamadoCreated = () => {
    fetchChamados();
  };

  const applyFilter = (setter: (v: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout title="Chamados" subtitle="Gerencie os chamados de assistência em tempo real">
      {/* Barra de Busca */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, placa ou endereço..."
            className="pl-10 h-11 rounded-xl border-border/50 bg-card"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Status Cards */}
      <StatusCards
        statusCounts={statusCounts}
        activeStatus={statusFilter}
        onStatusClick={(status) => applyFilter(setStatusFilter, status)}
        loading={loading}
      />

      {/* Info de Paginação + Filtros */}
      {pagination && (
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          {/* Tabs de Info */}
          <Tabs defaultValue="todos" className="mb-0">
            <TabsList className="bg-card border border-border/50 p-1 rounded-xl">
              <TabsTrigger value="todos" className="rounded-lg">
                Todos ({pagination.total})
              </TabsTrigger>
              <TabsTrigger value="pagina" className="rounded-lg">
                Página {pagination.current_page} de {pagination.last_page}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filtro de Associação */}
          <Select value={associationFilter} onValueChange={(v) => applyFilter(setAssociationFilter, v)}>
            <SelectTrigger className="w-[200px] h-10 rounded-xl">
              <SelectValue placeholder="Filtrar por Cliente" />
            </SelectTrigger>
            <SelectContent className="cursor-pointer">
              <SelectItem className="cursor-pointer" value="todos">Todos os Clientes</SelectItem>
              <SelectItem className="cursor-pointer" value="solidy">Solidy</SelectItem>
              <SelectItem className="cursor-pointer" value="nova">Nova</SelectItem>
              <SelectItem className="cursor-pointer" value="motoclub">Motoclub</SelectItem>
              <SelectItem className="cursor-pointer" value="aprovel">AAPROVEL</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtro de Tipo de Serviço */}
          <Select value={serviceTypeFilter} onValueChange={(v) => applyFilter(setServiceTypeFilter, v)}>
            <SelectTrigger className="w-[280px] h-10 rounded-xl">
              <SelectValue placeholder="Filtrar por Serviço" />
            </SelectTrigger>
            <SelectContent className="cursor-pointer max-h-[300px]">
              <SelectItem className="cursor-pointer" value="todos">Todos os Serviços</SelectItem>
              <SelectItem className="cursor-pointer" value="towing">Reboque</SelectItem>
              <SelectItem className="cursor-pointer" value="towing_breakdown">Reboque com Falha</SelectItem>
              <SelectItem className="cursor-pointer" value="battery">Bateria</SelectItem>
              <SelectItem className="cursor-pointer" value="tire_change">Troca de Pneu</SelectItem>
              <SelectItem className="cursor-pointer" value="locksmith">Chaveiro</SelectItem>
              <SelectItem className="cursor-pointer" value="empty_tank">Tanque Vazio</SelectItem>
              <SelectItem className="cursor-pointer" value="battery_charge_light">Carga de Bateria - Leve</SelectItem>
              <SelectItem className="cursor-pointer" value="battery_charge_moto">Carga de Bateria - Moto</SelectItem>
              <SelectItem className="cursor-pointer" value="towing_light">Reboque Leve</SelectItem>
              <SelectItem className="cursor-pointer" value="towing_moto">Reboque Moto</SelectItem>
              <SelectItem className="cursor-pointer" value="towing_heavy">Reboque Pesado</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtro de Status */}
          <Select value={statusFilter} onValueChange={(v) => applyFilter(setStatusFilter, v)}>
            <SelectTrigger className="w-[280px] h-10 rounded-xl">
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent className="cursor-pointer max-h-[300px]">
              <SelectItem className="cursor-pointer" value="todos">Todos os Status</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_driver_accept">Aguardando Aceite</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_driver_access_app_after_call_accepted">Aguardando App</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_arrival_to_checkin">A caminho (Checkin)</SelectItem>
              <SelectItem className="cursor-pointer" value="in_checking">Em Checkin</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_arrival_to_checkout">A caminho (Checkout)</SelectItem>
              <SelectItem className="cursor-pointer" value="in_checkout">Em Checkout</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_in_shed">Na Garagem</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_add_towing_delivery_call_trip">Aguardando Viagem</SelectItem>
              <SelectItem className="cursor-pointer" value="finished">Finalizados</SelectItem>
              <SelectItem className="cursor-pointer" value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>

          {/* Botão Limpar Filtros */}
          {(serviceTypeFilter !== "todos" || associationFilter !== "todos" || statusFilter !== "todos" || searchTerm) && (
            <Button
              variant="outline"
              className="h-10 rounded-xl gap-2"
              onClick={() => {
                setServiceTypeFilter("todos");
                setAssociationFilter("todos");
                setStatusFilter("todos");
                setSearchTerm("");
                setCurrentPage(1);
              }}
            >
              <XCircle className="h-4 w-4" />
              Limpar
            </Button>
          )}

          {/* Ações */}
          <div className="ml-auto flex gap-3">
            <Button variant="outline" className="h-10 rounded-xl gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button className="h-10 rounded-xl gap-2" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Novo Chamado
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Novo Chamado */}
      <ChamadoFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleChamadoCreated}
      />

      {/* Modal de Transferência de Chamado */}
      <TransferCallModal
        open={isTransferModalOpen}
        onOpenChange={setIsTransferModalOpen}
        call={selectedCallForTransfer}
        onSuccess={fetchChamados}
      />

      {/* Tabela Principal */}
      <Card className="rounded-2xl border-border/50 shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Lista de Chamados</CardTitle>
          <CardDescription>
            {pagination
              ? `Exibindo ${pagination.from} a ${pagination.to} de ${pagination.total} chamados`
              : 'Visualize e gerencie os chamados de assistência'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Carregando chamados...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
              <p className="text-sm text-muted-foreground max-w-md mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="gap-2"
              >
                Tentar Novamente
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && chamados.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum chamado encontrado</h3>
              <p className="text-sm text-muted-foreground">
                Nenhum chamado corresponde aos filtros ou à busca.
              </p>
            </div>
          )}

          {/* Table with Data */}
          {!loading && !error && chamados.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Atendente</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead className="w-[150px]">Data/Hora</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chamados.map((chamado) => {
                    const statusVariant = chamado.towing_status
                      ? callTowingStatusVariants[chamado.towing_status] || "secondary"
                      : "secondary";
                    const statusLabel = chamado.towing_status
                      ? callTowingStatusLabels[chamado.towing_status] || chamado.towing_status
                      : "—";
                    const StatusIcon = chamado.towing_status
                      ? statusIcons[chamado.towing_status] || AlertCircle
                      : AlertCircle;

                    return (
                      <TableRow
                        key={chamado.id}
                        className="group cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/chamados/${chamado.id}`)}
                      >
                        <TableCell className="font-mono text-sm font-medium text-primary">
                          #CH-{chamado.id}
                        </TableCell>
                        <TableCell className="capitalize text-sm">
                          {associationLabels[chamado.association as keyof typeof associationLabels] || chamado.association}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-mg">
                                {chamado.associate_cars?.associates?.name || "—"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {chamado.associate_cars?.associates?.phone
                                  ? formatPhone(chamado.associate_cars.associates.phone)
                                  : "—"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {chamado.users ? (
                              <>
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-primary">
                                    {chamado.users.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-sm">
                                    {chamado.users.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {chamado.users.email}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground">Não atribuído</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-mono text-sm font-medium">
                              {chamado.associate_cars?.plate || "—"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {chamado.associate_cars?.model || "—"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-lg gap-1.5">
                            <Wrench className="h-3 w-3" />
                            {towingServiceTypeLabels[chamado.towing_service_type] || chamado.towing_service_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariant} className="gap-1.5 rounded-lg">
                            <StatusIcon className="h-3 w-3" />
                            {statusLabel}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            {chamado.address ? (
                              <a
                                href={getGoogleMapsUrl(chamado.address)}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Abrir no Google Maps"
                                className="text-sm text-muted-foreground hover:text-primary hover:underline line-clamp-2"
                              >
                                {chamado.address}
                              </a>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </div>
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
                              <DropdownMenuItem className="cursor-pointer" disabled={!chamado.address} asChild>
                                <a
                                  href={chamado.address ? getGoogleMapsUrl(chamado.address) : "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <MapPin className="h-4 w-4 mr-2 cursor-pointer" />
                                  Ver no Mapa
                                </a>
                              </DropdownMenuItem>
                              {chamado.associate_cars?.associates?.phone && (
                                <DropdownMenuItem>
                                  <Phone className="h-4 w-4 mr-2" />
                                  Ligar: {formatPhone(chamado.associate_cars.associates.phone)}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCallForTransfer(chamado);
                                  setIsTransferModalOpen(true);
                                }}
                              >
                                <ArrowRightLeft className="h-4 w-4 mr-2" />
                                Transferir Atendente
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Paginação */}
              {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {pagination.from} a {pagination.to} de {pagination.total} resultados
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {(() => {
                        const maxButtons = 5;
                        const totalPages = pagination.last_page;

                        // Se tem 5 páginas ou menos, mostra todas
                        if (totalPages <= maxButtons) {
                          return Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-10"
                            >
                              {page}
                            </Button>
                          ));
                        }

                        // Lógica para mais de 5 páginas
                        let startPage = Math.max(1, currentPage - 2);
                        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

                        // Ajusta se estiver muito perto do final
                        if (endPage - startPage < maxButtons - 1) {
                          startPage = Math.max(1, endPage - maxButtons + 1);
                        }

                        const pages = [];
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(i);
                        }

                        return pages.map(page => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-10"
                          >
                            {page}
                          </Button>
                        ));
                      })()}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(pagination.last_page, p + 1))}
                      disabled={currentPage === pagination.last_page}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
