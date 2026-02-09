import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
  Loader2,
  Truck,
  Phone,
  MapPin,
  Building2,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  towingDriversService,
  type TowingDriver,
} from "@/services/towingDrivers.service";

const statusConfig = {
  available: { label: "Disponível", className: "bg-success/15 text-success border-success/20" },
  in_service: { label: "Em Serviço", className: "bg-warning/15 text-warning border-warning/20" },
  banned: { label: "Banido", className: "bg-destructive/15 text-destructive border-destructive/20" },
};

export default function Prestadores() {
  const [drivers, setDrivers] = useState<TowingDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    per_page: 10,
    last_page: 1,
    from: 0,
    to: 0,
  });

  useEffect(() => {
    loadDrivers();
  }, [currentPage, statusFilter]);

  // Debounce para busca em tempo real
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      loadDrivers();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 10,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await towingDriversService.getAll(params);
      setDrivers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Erro ao carregar prestadores:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os prestadores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAvailable = drivers.filter(d => d.status === "available").length;
  const totalInService = drivers.filter(d => d.status === "in_service").length;

  return (
    <DashboardLayout title="Prestadores" subtitle="Gerencie sua rede de prestadores de serviço">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="rounded-2xl border-border/50 shadow-soft">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Prestadores</p>
            <p className="text-3xl font-bold mt-1 text-foreground">{pagination.total}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Cadastrados no sistema
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-soft">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Disponíveis</p>
            <p className="text-3xl font-bold mt-1 text-success">{totalAvailable}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Prontos para atendimento
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-soft">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Em Serviço</p>
            <p className="text-3xl font-bold mt-1 text-warning">{totalInService}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Atendimentos ativos
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-soft">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total de Chamados</p>
            <p className="text-3xl font-bold mt-1 text-foreground">
              {drivers.reduce((sum, d) => sum + d.total_calls, 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Histórico completo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtros */}
      <Card className="rounded-2xl border-border/50 shadow-soft mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Busque e filtre prestadores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou nome fantasia..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 rounded-xl border-border/50 bg-card"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[280px] h-10 rounded-xl">
                <SelectValue placeholder="Filtrar por Status" />
              </SelectTrigger>
              <SelectContent className="cursor-pointer">
                <SelectItem className="cursor-pointer" value="all">Todos os Status</SelectItem>
                <SelectItem className="cursor-pointer" value="available">Disponível</SelectItem>
                <SelectItem className="cursor-pointer" value="in_service">Em Serviço</SelectItem>
                <SelectItem className="cursor-pointer" value="banned">Banido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card className="rounded-2xl border-border/50 shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Prestadores</CardTitle>
              <CardDescription>
                Mostrando {pagination.from} a {pagination.to} de {pagination.total} prestadores
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : drivers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum prestador encontrado</p>
              <p className="text-sm mt-2">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>UF</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Chamados</TableHead>
                      <TableHead className="text-right">Preço/KM</TableHead>
                      <TableHead className="text-right">Partida</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver) => {
                      const status = statusConfig[driver.status];
                      return (
                        <TableRow key={driver.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Truck className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium">{driver.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">{driver.cpf}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{driver.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{driver.towing_provider.fantasy_name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {driver.uf ? (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <Badge variant="outline" className="rounded-lg">
                                  {driver.uf.code}
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={`rounded-lg ${status.className}`}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-semibold">{driver.total_calls}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            {driver.towing_settings ? (
                              <span className="font-medium">
                                R$ {driver.towing_settings.excess_km_price.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {driver.towing_settings ? (
                              <span className="font-medium">
                                R$ {driver.towing_settings.departure_price.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              {pagination.last_page > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {pagination.from} a {pagination.to} de {pagination.total} resultados
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="rounded-lg"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>

                    {/* Números das páginas */}
                    {(() => {
                      const pages = [];
                      const maxVisible = 5;
                      let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                      let endPage = Math.min(pagination.last_page, startPage + maxVisible - 1);

                      if (endPage - startPage < maxVisible - 1) {
                        startPage = Math.max(1, endPage - maxVisible + 1);
                      }

                      // Primeira página
                      if (startPage > 1) {
                        pages.push(
                          <Button
                            key={1}
                            variant={currentPage === 1 ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            className="rounded-lg w-9 h-9 p-0"
                          >
                            1
                          </Button>
                        );
                        if (startPage > 2) {
                          pages.push(
                            <span key="ellipsis-start" className="px-2 text-muted-foreground">
                              ...
                            </span>
                          );
                        }
                      }

                      // Páginas do meio
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <Button
                            key={i}
                            variant={currentPage === i ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(i)}
                            className="rounded-lg w-9 h-9 p-0"
                          >
                            {i}
                          </Button>
                        );
                      }

                      // Última página
                      if (endPage < pagination.last_page) {
                        if (endPage < pagination.last_page - 1) {
                          pages.push(
                            <span key="ellipsis-end" className="px-2 text-muted-foreground">
                              ...
                            </span>
                          );
                        }
                        pages.push(
                          <Button
                            key={pagination.last_page}
                            variant={currentPage === pagination.last_page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pagination.last_page)}
                            className="rounded-lg w-9 h-9 p-0"
                          >
                            {pagination.last_page}
                          </Button>
                        );
                      }

                      return pages;
                    })()}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.last_page))}
                      disabled={currentPage === pagination.last_page}
                      className="rounded-lg"
                    >
                      Próxima
                      <ChevronRight className="h-4 w-4 ml-1" />
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
