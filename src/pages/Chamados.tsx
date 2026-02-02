import { useState, useEffect } from "react";
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
import {
  callsService,
  type Call,
  type Pagination,
  callTowingStatusLabels,
  towingServiceTypeLabels,
  associationLabels,
  callTowingStatusVariants,
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
  const [chamados, setChamados] = useState<Call[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Estados dos filtros
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("todos");
  const [associationFilter, setAssociationFilter] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    async function fetchChamados() {
      try {
        setLoading(true);
        setError(null);
        const response = await callsService.getAll(currentPage);
        setChamados(response.data);
        setPagination(response.pagination);
      } catch (err) {
        console.error('Erro ao buscar chamados:', err);
        setError('Não foi possível carregar os chamados. Verifique se a API está rodando em http://localhost:3001');
      } finally {
        setLoading(false);
      }
    }

    fetchChamados();
  }, [currentPage]);

  // Filtra os chamados localmente
  const chamadosFiltrados = chamados.filter((chamado) => {
    // Filtro de status (towing_status)
    if (statusFilter !== "todos" && chamado.towing_status !== statusFilter) {
      return false;
    }

    // Filtro de tipo de serviço
    if (serviceTypeFilter !== "todos" && chamado.towing_service_type !== serviceTypeFilter) {
      return false;
    }

    // Filtro de associação
    if (associationFilter !== "todos" && chamado.association !== associationFilter) {
      return false;
    }

    // Filtro de busca (ID, nome, placa, endereço)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchName = chamado.associate_cars?.associates?.name.toLowerCase().includes(search);
      const matchPlate = chamado.associate_cars?.plate.toLowerCase().includes(search);
      const matchAddress = chamado.address?.toLowerCase().includes(search);

      if (!matchName && !matchPlate && !matchAddress) {
        return false;
      }
    }

    return true;
  });

  return (
    <DashboardLayout title="Chamados" subtitle="Gerencie os chamados de assistência em tempo real">
      {/* Barra de Busca */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por usuário, placa ou endereço"
            className="pl-10 h-11 rounded-xl border-border/50 bg-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

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

          {/* Filtro de Status */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[280px] h-10 rounded-xl">
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent className="cursor-pointer">
              <SelectItem className="cursor-pointer" value="todos">Todos os Status</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_driver_accept">Aguardando aceite do motorista</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_driver_access_app_after_call_accepted">Aguardando motorista acessar app</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_arrival_to_checkin">Aguardando chegada para checkin</SelectItem>
              <SelectItem className="cursor-pointer" value="in_checking">Em checkin</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_arrival_to_checkout">Aguardando chegada para checkout</SelectItem>
              <SelectItem className="cursor-pointer" value="in_checkout">Em checkout</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_in_shed">Aguardando na garagem</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_add_towing_delivery_call_trip">Aguardando adicionar viagem</SelectItem>
              <SelectItem className="cursor-pointer" value="finished">Finalizado</SelectItem>
              <SelectItem className="cursor-pointer" value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtro de Tipo de Serviço */}
          <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
            <SelectTrigger className="w-[220px] h-10 rounded-xl">
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

          {/* Filtro de Associação */}
          <Select value={associationFilter} onValueChange={setAssociationFilter}>
            <SelectTrigger className="w-[180px] h-10 rounded-xl">
              <SelectValue placeholder="Filtrar por Cliente" />
            </SelectTrigger>
            <SelectContent className="cursor-pointer">
              <SelectItem className="cursor-pointer" value="todos">Todos os Clientes</SelectItem>
              <SelectItem className="cursor-pointer" value="solidy">Solidy</SelectItem>
              <SelectItem className="cursor-pointer" value="motoclub">Motoclub</SelectItem>
              <SelectItem className="cursor-pointer" value="aprovel">AAPROVEL</SelectItem>
              <SelectItem className="cursor-pointer" value="nova">Nova</SelectItem>
              <SelectItem className="cursor-pointer" value="agsmb">Agsmb</SelectItem>
            </SelectContent>
          </Select>

          {/* Botão Limpar Filtros */}
          {(statusFilter !== "todos" || serviceTypeFilter !== "todos" || associationFilter !== "todos" || searchTerm) && (
            <Button
              variant="outline"
              className="h-10 rounded-xl gap-2"
              onClick={() => {
                setStatusFilter("todos");
                setServiceTypeFilter("todos");
                setAssociationFilter("todos");
                setSearchTerm("");
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
          </div>
        </div>
      )}

      {/* Tabela Principal */}
      <Card className="rounded-2xl border-border/50 shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Lista de Chamados</CardTitle>
          <CardDescription>
            {pagination && (
              <>
                {chamadosFiltrados.length < chamados.length ? (
                  `Mostrando ${chamadosFiltrados.length} de ${chamados.length} chamados (filtrados)`
                ) : (
                  `Exibindo ${pagination.from} - ${pagination.to} de ${pagination.total} chamados`
                )}
              </>
            )}
            {!pagination && 'Visualize e gerencie os chamados de assistência'}
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
          {!loading && !error && chamadosFiltrados.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum chamado encontrado</h3>
              <p className="text-sm text-muted-foreground">
                {chamados.length === 0
                  ? "Não há chamados disponíveis no momento"
                  : "Nenhum chamado corresponde aos filtros selecionados"}
              </p>
            </div>
          )}

          {/* Table with Data */}
          {!loading && !error && chamadosFiltrados.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead className="w-[150px]">Data/Hora</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chamadosFiltrados.map((chamado) => {
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
                      <TableRow key={chamado.id} className="group">
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
                              <p className="font-medium text-sm">
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
                            <span className="text-sm text-muted-foreground line-clamp-2">
                              {chamado.address || "—"}
                            </span>
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
                              <DropdownMenuItem>
                                <MapPin className="h-4 w-4 mr-2" />
                                Ver no Mapa
                              </DropdownMenuItem>
                              {chamado.associate_cars?.associates?.phone && (
                                <DropdownMenuItem>
                                  <Phone className="h-4 w-4 mr-2" />
                                  Ligar: {formatPhone(chamado.associate_cars.associates.phone)}
                                </DropdownMenuItem>
                              )}
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
