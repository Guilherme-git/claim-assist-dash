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
  Filter,
  Plus,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  Phone,
  MapPin,
  User,
  Loader2
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
  atendimentosService,
  type AssociateService,
  type Pagination
} from "@/services/atendimentos.service";
import { platform } from "process";
import { set } from "date-fns";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: any }> = {
  waiting_initial_message: { label: "Aguardando Mensagem Inicial", variant: "secondary", icon: Clock },
  waiting_identification: { label: "Aguardando Identificação", variant: "secondary", icon: AlertCircle },
  waiting_request_reason: { label: "Aguardando Motivo do Pedido", variant: "secondary", icon: AlertCircle },
  answering_service_form: { label: "Respondendo Formulário", variant: "default", icon: Clock },
  waiting_understanding_wpp_flow: { label: "Aguardando Compreensão do Fluxo WPP", variant: "secondary", icon: Clock },
  waiting_origin_location: { label: "Aguardando Local de Origem", variant: "secondary", icon: MapPin },
  waiting_destination_location: { label: "Aguardando Local de Destino", variant: "secondary", icon: MapPin },
  transferred: { label: "Transferido", variant: "default", icon: CheckCircle2 },
  finished: { label: "Finalizado", variant: "outline", icon: CheckCircle2 },
  finished_with_pending_issues: { label: "Finalizado com Pendências", variant: "destructive", icon: AlertCircle },
};

const requestReasonLabels: Record<string, string> = {
  collision: "Colisão",
  fire: "Incêndio",
  natural_events: "Eventos Naturais",
  breakdown_by_mechanical_failure_or_electric: "Pane Mecânica ou Elétrica",
  flat_tire: "Pneu Furado",
  battery_failure: "Falha na Bateria",
  locked_vehicle: "Veículo Trancado",
  empty_tank: "Tanque Vazio",
  theft_or_robbery: "Furto ou Roubo",
};

function getRequestReasonLabel(reason: string | null): string {
  if (!reason) return "—";
  return requestReasonLabels[reason] || reason;
}

export default function Atendimentos() {
  const [atendimentos, setAtendimentos] = useState<AssociateService[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Estados dos filtros
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [tipoFilter, setTipoFilter] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    async function fetchAtendimentos() {
      try {
        setLoading(true);
        setError(null);
        const response = await atendimentosService.getAll(currentPage);
        setAtendimentos(response.data);
        setPagination(response.pagination);
      } catch (err) {
        console.error('Erro ao buscar atendimentos:', err);
        setError('Não foi possível carregar os atendimentos. Verifique se a API está rodando em http://localhost:3001');
      } finally {
        setLoading(false);
      }
    }

    fetchAtendimentos();
  }, [currentPage]);

  // Filtra os atendimentos localmente
  const atendimentosFiltrados = atendimentos.filter((atd) => {
    // Filtro de status
    if (statusFilter !== "todos" && atd.status !== statusFilter) {
      return false;
    }

    // Filtro de tipo (request_reason)
    if (tipoFilter !== "todos" && atd.request_reason !== tipoFilter) {
      return false;
    }
    
    // Filtro de busca (ID, telefone ou endereço)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchId = atd.id.toString().includes(search);
      const matchPhone = atd.phone.toLowerCase().includes(search);
      const matchOrigin = atd.origin_address?.toLowerCase().includes(search);
      const matchDestination = atd.destination_address?.toLowerCase().includes(search);

      if (!matchId && !matchPhone && !matchOrigin && !matchDestination) {
        return false;
      }
    }

    return true;
  });

  return (
    <DashboardLayout title="Atendimentos" subtitle="Gerencie todos os atendimentos em tempo real">
      {/* Barra de Busca */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, telefone ou local..."
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
              <SelectItem className="cursor-pointer" value="waiting_initial_message">Aguardando Mensagem Inicial</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_identification">Aguardando Identificação</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_request_reason">Aguardando Motivo do Pedido</SelectItem>
              <SelectItem className="cursor-pointer" value="answering_service_form">Respondendo Formulário</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_understanding_wpp_flow">Aguardando Fluxo WPP</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_origin_location">Aguardando Local de Origem</SelectItem>
              <SelectItem className="cursor-pointer" value="waiting_destination_location">Aguardando Local de Destino</SelectItem>
              <SelectItem className="cursor-pointer" value="transferred">Transferido</SelectItem>
              <SelectItem className="cursor-pointer" value="finished">Finalizado</SelectItem>
              <SelectItem className="cursor-pointer" value="finished_with_pending_issues">Finalizado com Pendências</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtro de Tipo */}
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger className="w-[280px] h-10 rounded-xl">
              <SelectValue placeholder="Filtrar por Tipo" />
            </SelectTrigger>
            <SelectContent className="cursor-pointer">
              <SelectItem className="cursor-pointer" value="todos">Todos os Tipos</SelectItem>
              <SelectItem className="cursor-pointer" value="collision">Colisão</SelectItem>
              <SelectItem className="cursor-pointer" value="fire">Incêndio</SelectItem>
              <SelectItem className="cursor-pointer" value="natural_events">Eventos Naturais</SelectItem>
              <SelectItem className="cursor-pointer" value="breakdown_by_mechanical_failure_or_electric">Pane Mecânica ou Elétrica</SelectItem>
              <SelectItem className="cursor-pointer" value="flat_tire">Pneu Furado</SelectItem>
              <SelectItem className="cursor-pointer" value="battery_failure">Falha na Bateria</SelectItem>
              <SelectItem className="cursor-pointer" value="locked_vehicle">Veículo Trancado</SelectItem>
              <SelectItem className="cursor-pointer" value="empty_tank">Tanque Vazio</SelectItem>
              <SelectItem className="cursor-pointer" value="theft_or_robbery">Furto ou Roubo</SelectItem>
            </SelectContent>
          </Select>

          {/* Botão Limpar Filtros */}
          {(statusFilter !== "todos" || tipoFilter !== "todos" || searchTerm) && (
            <Button
              variant="outline"
              className="h-10 rounded-xl gap-2"
              onClick={() => {
                setStatusFilter("todos");
                setTipoFilter("todos");
                setSearchTerm("");
              }}
            >
              <XCircle className="h-4 w-4" />
              Limpar
            </Button>
          )}

          {/* Ações */}
          <div className="ml-auto flex gap-3">
            {/* <Button variant="outline" className="h-10 rounded-xl gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button> */}
            <Button className="h-10 rounded-xl gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Novo
            </Button>
          </div>
        </div>
      )}

      {/* Tabela Principal */}
      <Card className="rounded-2xl border-border/50 shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Lista de Atendimentos</CardTitle>
          <CardDescription>
            {pagination && (
              <>
                {atendimentosFiltrados.length < atendimentos.length ? (
                  `Mostrando ${atendimentosFiltrados.length} de ${atendimentos.length} atendimentos (filtrados)`
                ) : (
                  `Exibindo ${pagination.from} - ${pagination.to} de ${pagination.total} atendimentos`
                )}
              </>
            )}
            {!pagination && 'Visualize e gerencie os atendimentos'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Carregando atendimentos...</span>
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
          {!loading && !error && atendimentosFiltrados.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum atendimento encontrado</h3>
              <p className="text-sm text-muted-foreground">
                {atendimentos.length === 0
                  ? "Não há atendimentos disponíveis no momento"
                  : "Nenhum atendimento corresponde aos filtros selecionados"}
              </p>
            </div>
          )}

          {/* Table with Data */}
          {!loading && !error && atendimentosFiltrados.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[150px]">Data/Hora</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {atendimentosFiltrados.map((atd) => {
                    const statusInfo = statusConfig[atd.status] || {
                      label: atd.status,
                      variant: "secondary" as const,
                      icon: AlertCircle
                    };
                    const StatusIcon = statusInfo.icon;

                    return (
                      <TableRow key={atd.id} className="group">
                        <TableCell className="font-mono text-sm font-medium text-primary">
                          #AT-{atd.id}
                        </TableCell>
                        <TableCell className="capitalize text-sm">
                          {atd.association}
                        </TableCell>
                        <TableCell className="capitalize text-sm">
                          {atd.plataform}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="font-medium text-sm">{formatPhone(atd.phone)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-lg">
                            {getRequestReasonLabel(atd.request_reason)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusInfo.variant} className="gap-1.5 rounded-lg">
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          —
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDateTime(atd.created_at)}
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
                                <Phone className="h-4 w-4 mr-2" />
                                Ligar: {formatPhone(atd.phone)}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
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
