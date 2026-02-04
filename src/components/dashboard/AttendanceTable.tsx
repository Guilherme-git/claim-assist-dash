import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Phone,
  ArrowRight,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPhone, formatDateTime } from "@/lib/utils";
import type { RecentAttendance } from "@/services/dashboard.service";
import {
  statusLabels,
  statusVariants,
  requestReasonLabels,
  platformLabels,
} from "@/services/dashboard.service";

interface AttendanceTableProps {
  attendances: RecentAttendance[];
}

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

const requestReasonConfig: Record<string, string> = {
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
  return requestReasonConfig[reason] || reason;
}

export function AttendanceTable({ attendances }: AttendanceTableProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-fade-in-up" style={{ animationDelay: "300ms" }}>
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Atendimentos Recentes</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Acompanhe os chamados em tempo real</p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 gap-2 shadow-lg shadow-primary/20"
            onClick={() => navigate('/atendimentos')}
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground w-[80px]">ID</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Cliente</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Plataforma</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Usuário</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Tipo</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground w-[150px]">Data/Hora</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.map((attendance, index) => {
            const statusInfo = statusConfig[attendance.status] || {
              label: attendance.status,
              variant: "secondary" as const,
              icon: AlertCircle
            };
            const StatusIcon = statusInfo.icon;

            return (
              <TableRow
                key={attendance.id}
                className="group cursor-pointer hover:bg-muted/50 transition-all duration-200 border-b border-border/30"
                style={{ animationDelay: `${400 + index * 50}ms` }}
                onClick={() => navigate(`/atendimentos/${attendance.id}`)}
              >
                <TableCell className="font-mono text-sm font-medium text-primary">
                  #AT-{attendance.id}
                </TableCell>
                <TableCell className="capitalize text-sm">
                  {attendance.association}
                </TableCell>
                <TableCell className="capitalize text-sm">
                  {attendance.plataform}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {attendance.associate_cars?.associates?.name || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {attendance.associate_cars?.associates?.phone
                          ? formatPhone(attendance.associate_cars.associates.phone)
                          : "—"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="rounded-lg">
                    {getRequestReasonLabel(attendance.request_reason)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusInfo.variant} className="gap-1.5 rounded-lg">
                    <StatusIcon className="h-3 w-3" />
                    {statusInfo.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDateTime(attendance.created_at)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Phone className="h-4 w-4 mr-2" />
                        Ligar: {formatPhone(attendance.phone)}
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
    </div>
  );
}
