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
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Loader2,
  Copy,
  ExternalLink
} from "lucide-react";
import { formatPhone, formatDateTime } from "@/lib/utils";
import { atendimentosService, type AssociateService } from "@/services/atendimentos.service";
import { toast } from "sonner";

// Mapeamento de labels do service_form
const serviceFormLabels: Record<string, string> = {
  vehicle_is_at_collision_scene: "O veículo está no local da colisão?",
  vehicle_is_moving: "O veículo está circulando (consegue se mover)?",
  is_to_activate_protection: "Deseja acionar a proteção para sinistro?",
  any_wheel_is_locked: "Alguma roda do veículo está travada?",
  vehicle_is_lowered: "Veículo possui alguma dessas características: baixo, rebaixado?",
  vehicle_is_easily_accessible: "Acesso fácil para remoção (o guincho consegue chegar ao local com facilidade)?",
  vehicle_cargo: "Possui carga ou peso? → Se sim, qual tipo e quantidade?",
  number_of_passengers: "Quantos passageiros possui?",
  associate_items: "Existem objetos no veículo? → Se sim, quais itens?",
  documents_and_key_are_in_scene: "Documentos e chaves estão no local?",
  uber_will_be_necessary: "Vai precisar de táxi/Uber?",
  vehicle_symptom: "O que aconteceu com o veículo (descreva o que está ocorrendo)?",
  fuel_request: "Combustível desejado:",
  fuel_price: "Valor de combustível a ser entregue",
  fuel_payment_type: "Forma de pagamento:",
  tire_change_quantity: "Quantos pneus precisam ser trocados?",
  tire_change_associate_has_tools: "Possui ferramenta pra troca?",
  tire_change_associate_has_spare_tire: "Possui estepe?",
  battery_charge_resolution: "Apenas a recarga de bateria já resolveria?",
  locksmith_key_is_inside_vehicle: "A chave está dentro do veículo?",
  locksmith_all_doors_locked: "O veículo está com todas as portas trancadas?",
  accessible_vehicle: "O veículo está de fácil acesso?",
};

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

const categoryLabels: Record<string, string> = {
  car: "Carro",
  van: "Van",
  pickup_truck: "Pickup",
  motorcycle: "Moto",
  truck: "Caminhão",
  trailer: "Reboque",
  bus: "Ônibus",
};

export default function AtendimentoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [atendimento, setAtendimento] = useState<AssociateService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAtendimento() {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await atendimentosService.getById(id);
        setAtendimento(response);
      } catch (err) {
        console.error('Erro ao buscar atendimento:', err);
        setError('Não foi possível carregar os detalhes do atendimento.');
      } finally {
        setLoading(false);
      }
    }

    fetchAtendimento();
  }, [id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
  };

  const getStatusInfo = (status: string) => {
    return statusConfig[status] || { label: status, variant: "secondary" as const, icon: AlertCircle };
  };

  if (loading) {
    return (
      <DashboardLayout title="Detalhes do Atendimento" subtitle="Carregando...">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">Carregando detalhes...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !atendimento) {
    return (
      <DashboardLayout title="Detalhes do Atendimento" subtitle="Erro">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
          <p className="text-sm text-muted-foreground max-w-md mb-4">{error || "Atendimento não encontrado"}</p>
          <Button onClick={() => navigate("/atendimentos")} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Atendimentos
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const statusInfo = getStatusInfo(atendimento.status);
  const StatusIcon = statusInfo.icon;
  const associate = atendimento.associate_cars?.associates;
  const vehicle = atendimento.associate_cars;
  const serviceForm = atendimento.service_form?.payload;

  return (
    <DashboardLayout 
      title={`Atendimento #AT-${atendimento.id}`} 
      subtitle={`Criado em ${formatDateTime(atendimento.created_at)}`}
    >
      {/* Header com botão voltar e status */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/atendimentos")}
          className="gap-2 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div className="flex items-center gap-3">
          <Badge variant={statusInfo.variant} className="gap-1.5 rounded-lg text-sm px-3 py-1">
            <StatusIcon className="h-4 w-4" />
            {statusInfo.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Informações do Atendimento */}
          <Card className="rounded-2xl border-border/50 shadow-soft">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Informações do Atendimento</CardTitle>
                  <CardDescription>Dados gerais da solicitação</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID do Atendimento</p>
                  <p className="font-medium font-mono">#AT-{atendimento.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Associação</p>
                  <p className="font-medium capitalize">{atendimento.association}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plataforma</p>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium capitalize">{atendimento.plataform}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Motivo da Solicitação</p>
                  <Badge variant="secondary" className="mt-1">
                    {atendimento.request_reason 
                      ? requestReasonLabels[atendimento.request_reason] || atendimento.request_reason
                      : "Não informado"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone de Contato</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatPhone(atendimento.phone)}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(atendimento.phone)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Atualizado em</p>
                  <p className="font-medium">{formatDateTime(atendimento.updated_at)}</p>
                </div>
              </div>

              {/* Endereços */}
              <Separator />
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Endereço de Origem</p>
                  {atendimento.origin_address ? (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="font-medium">{atendimento.origin_address}</span>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">Não informado</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Endereço de Destino</p>
                  {atendimento.destination_address ? (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="font-medium">{atendimento.destination_address}</span>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">Não informado</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Formulário de Serviço */}
          {serviceForm && Object.keys(serviceForm).length > 0 && (
            <Card className="rounded-2xl border-border/50 shadow-soft">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Formulário de Serviço</CardTitle>
                    <CardDescription>Respostas do questionário de atendimento</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(serviceForm).map(([key, value]) => {
                    const label = serviceFormLabels[key] || key;
                    return (
                      <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2 border-b border-border/50 last:border-0">
                        <p className="text-sm text-muted-foreground sm:w-1/2">{label}</p>
                        <p className="font-medium sm:w-1/2">{String(value) || "—"}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
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
                    <p className="font-medium font-mono">{associate.cpf}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{associate.phone}</span>
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
                    <p className="text-sm text-muted-foreground">ID Ileva</p>
                    <p className="font-medium font-mono text-sm">{associate.ileva_associate_id || "—"}</p>
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
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Car className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Veículo</CardTitle>
                  <CardDescription>Dados do veículo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {vehicle ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Placa</p>
                    <p className="font-medium font-mono text-lg">{vehicle.plate}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Marca</p>
                      <p className="font-medium text-sm">{vehicle.brand || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Modelo</p>
                      <p className="font-medium text-sm">{vehicle.model || "—"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Cor</p>
                      <p className="font-medium">{vehicle.color || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ano</p>
                      <p className="font-medium">{vehicle.year || "—"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Categoria</p>
                    <Badge variant="outline" className="mt-1">
                      {categoryLabels[vehicle.category] || vehicle.category}
                    </Badge>
                  </div>
                  {vehicle.chassi && (
                    <div>
                      <p className="text-sm text-muted-foreground">Chassi</p>
                      <p className="font-medium font-mono text-xs">{vehicle.chassi}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground italic">Dados do veículo não disponíveis</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
