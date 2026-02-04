import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  Car,
  MapPin,
  Phone,
  Mail,
  FileText,
  Clock,
  AlertCircle,
  Loader2,
  Copy,
  Truck,
  Wrench,
  Calendar,
  Building,
  ExternalLink,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import {
  type Call,
  callStatusLabels,
  callStatusVariants,
  callTowingStatusLabels,
  callTowingStatusVariants,
  towingServiceTypeLabels,
  associationLabels,
  callsService,
} from "@/services/calls.service";
import { toast } from "sonner";

// Componentes modulares
import { TowingDriverCard } from "@/components/chamados/TowingDriverCard";
import { BillsCard } from "@/components/chamados/BillsCard";
import { RatingsCard } from "@/components/chamados/RatingsCard";
import { CallTripsCard } from "@/components/chamados/CallTripsCard";
import { InspectionsCard } from "@/components/chamados/InspectionsCard";
import { CreatedByCard } from "@/components/chamados/CreatedByCard";

const categoryLabels: Record<string, string> = {
  car: "Carro",
  van: "Van",
  pickup_truck: "Pickup",
  motorcycle: "Moto",
  truck: "Caminhão",
  trailer: "Reboque",
  bus: "Ônibus",
};

const creationMethodLabels: Record<string, string> = {
  webassist: "WebAssist",
  manually: "Manual",
  associate_service: "Serviço do Associado",
};

export default function ChamadoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [chamado, setChamado] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChamado = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await callsService.getById(id!);
        setChamado(data);
      } catch (err: any) {
        console.error("Erro ao buscar chamado:", err);
        setError(err?.response?.data?.message || "Não foi possível carregar os detalhes do chamado.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchChamado();
    }
  }, [id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
  };

  const getGoogleMapsUrl = (address: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  if (loading) {
    return (
      <DashboardLayout title="Detalhes do Chamado" subtitle="Carregando...">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">Carregando detalhes...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !chamado) {
    return (
      <DashboardLayout title="Detalhes do Chamado" subtitle="Erro">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
          <p className="text-sm text-muted-foreground max-w-md mb-4">
            {error || "Chamado não encontrado"}
          </p>
          <Button onClick={() => navigate("/chamados")} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Chamados
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const associate = chamado.associate_cars?.associates;
  const vehicle = chamado.associate_cars;

  const statusVariant = chamado.status
    ? callStatusVariants[chamado.status] || "secondary"
    : "secondary";
  const statusLabel = chamado.status
    ? callStatusLabels[chamado.status] || chamado.status
    : "—";

  const towingStatusVariant = chamado.towing_status
    ? callTowingStatusVariants[chamado.towing_status] || "secondary"
    : "secondary";
  const towingStatusLabel = chamado.towing_status
    ? callTowingStatusLabels[chamado.towing_status] || chamado.towing_status
    : "—";

  return (
    <DashboardLayout
      title={`Chamado #CH-${chamado.id}`}
      subtitle={`Criado em ${formatDateTime(chamado.created_at)}`}
    >
      {/* Header com botão voltar e status */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/chamados")}
          className="gap-2 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="flex items-center gap-3">
          {chamado.status && (
            <Badge variant={statusVariant} className="gap-1.5 rounded-lg text-sm px-3 py-1">
              <Wrench className="h-4 w-4" />
              {statusLabel}
            </Badge>
          )}
          {chamado.towing_status && (
            <Badge variant={towingStatusVariant} className="gap-1.5 rounded-lg text-sm px-3 py-1">
              <Truck className="h-4 w-4" />
              {towingStatusLabel}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Informações do Chamado */}
          <Card className="rounded-2xl border-border/50 shadow-soft">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Informações do Chamado</CardTitle>
                  <CardDescription>Dados gerais da solicitação</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID do Chamado</p>
                  <p className="font-medium font-mono">#CH-{chamado.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Associação</p>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium capitalize">
                      {associationLabels[chamado.association] || chamado.association}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Serviço</p>
                  <Badge variant="secondary" className="mt-1 gap-1.5">
                    <Wrench className="h-3 w-3" />
                    {towingServiceTypeLabels[chamado.towing_service_type] || chamado.towing_service_type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Método de Criação</p>
                  <p className="font-medium">
                    {chamado.creation_method
                      ? creationMethodLabels[chamado.creation_method] || chamado.creation_method
                      : "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Criado em</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatDateTime(chamado.created_at)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Atualizado em</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatDateTime(chamado.updated_at)}</span>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <Separator />
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Endereço do Chamado</p>
                  {chamado.address ? (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <span className="font-medium">{chamado.address}</span>
                        <a
                          href={getGoogleMapsUrl(chamado.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Ver no mapa
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">Não informado</p>
                  )}
                </div>
              </div>

              {/* Observação */}
              {chamado.observation && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Observação</p>
                    <p className="font-medium bg-muted/50 p-3 rounded-lg">{chamado.observation}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Card: Informações de Execução */}
          <Card className="rounded-2xl border-border/50 shadow-soft">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Execução do Serviço</CardTitle>
                  <CardDescription>Tempos e status de execução</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status do Chamado</p>
                  <Badge variant={statusVariant} className="mt-1">
                    {statusLabel}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status do Guincho</p>
                  <Badge variant={towingStatusVariant} className="mt-1">
                    {towingStatusLabel}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Motorista Aceitou em</p>
                  <p className="font-medium">
                    {chamado.towing_driver_accepted_at
                      ? formatDateTime(chamado.towing_driver_accepted_at)
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tempo Estimado de Chegada</p>
                  <p className="font-medium">
                    {chamado.estimated_time_arrival || "—"}
                  </p>
                </div>
              </div>

              {/* Códigos WebAssist */}
              {(chamado.webassist_call_code ||
                chamado.webassist_protocol_code ||
                chamado.webassist_assistance_code) && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Códigos WebAssist</p>
                    <div className="grid grid-cols-2 gap-4">
                      {chamado.webassist_call_code && (
                        <div>
                          <p className="text-sm text-muted-foreground">Código do Chamado</p>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-medium">{chamado.webassist_call_code}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(chamado.webassist_call_code!)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {chamado.webassist_protocol_code && (
                        <div>
                          <p className="text-sm text-muted-foreground">Código de Protocolo</p>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-medium">{chamado.webassist_protocol_code}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(chamado.webassist_protocol_code!)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {chamado.webassist_assistance_code && (
                        <div>
                          <p className="text-sm text-muted-foreground">Código de Assistência</p>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-medium">{chamado.webassist_assistance_code}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(chamado.webassist_assistance_code!)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Card: Viagens */}
          {chamado.call_trips && chamado.call_trips.length > 0 && (
            <CallTripsCard trips={chamado.call_trips} />
          )}

          {/* Card: Inspeções */}
          {chamado.inspections && chamado.inspections.length > 0 && (
            <InspectionsCard inspections={chamado.inspections} />
          )}
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          {/* Card: Dados do Associado */}
          <Card className="rounded-2xl border-border/50 shadow-soft">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Associado</CardTitle>
                  <CardDescription>Dados do cliente</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {associate ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{associate.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CPF</p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium font-mono">{associate.cpf}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(associate.cpf)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{associate.phone}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(associate.phone.replace(/\D/g, ""))}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {associate.email && (
                    <div>
                      <p className="text-sm text-muted-foreground">E-mail</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm break-all">{associate.email}</span>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente desde</p>
                    <p className="font-medium text-sm">{formatDateTime(associate.created_at)}</p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground italic">Dados do associado não disponíveis</p>
              )}
            </CardContent>
          </Card>

          {/* Card: Dados do Veículo */}
          <Card className="rounded-2xl border-border/50 shadow-soft">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Car className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Veículo</CardTitle>
                  <CardDescription>Informações do veículo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {vehicle ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Placa</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold tracking-wider bg-muted px-3 py-1 rounded-lg">
                        {vehicle.plate}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(vehicle.plate)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Marca / Modelo</p>
                    <p className="font-medium">{vehicle.brand}</p>
                    <p className="text-sm text-muted-foreground">{vehicle.model}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Ano</p>
                      <p className="font-medium">{vehicle.year || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cor</p>
                      <p className="font-medium capitalize">{vehicle.color?.toLowerCase() || "—"}</p>
                    </div>
                  </div>
                  {vehicle.category && (
                    <div>
                      <p className="text-sm text-muted-foreground">Categoria</p>
                      <Badge variant="outline" className="mt-1">
                        {categoryLabels[vehicle.category] || vehicle.category}
                      </Badge>
                    </div>
                  )}
                  {vehicle.chassi && (
                    <div>
                      <p className="text-sm text-muted-foreground">Chassi</p>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{vehicle.chassi}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(vehicle.chassi!)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground italic">Dados do veículo não disponíveis</p>
              )}
            </CardContent>
          </Card>

          {/* Card: Motorista de Guincho */}
          {chamado.towing_drivers && (
            <TowingDriverCard driver={chamado.towing_drivers} />
          )}

          {/* Card: Criado por */}
          {chamado.users && (
            <CreatedByCard user={chamado.users} />
          )}

          {/* Card: Faturas */}
          {chamado.bills && chamado.bills.length > 0 && (
            <BillsCard bills={chamado.bills} />
          )}

          {/* Card: Avaliações */}
          {chamado.ratings && chamado.ratings.length > 0 && (
            <RatingsCard ratings={chamado.ratings} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
