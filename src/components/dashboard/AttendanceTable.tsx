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
import { Eye, MoreHorizontal, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Attendance {
  id: string;
  protocol: string;
  client: string;
  type: string;
  status: "pending" | "active" | "completed" | "urgent";
  priority: "high" | "medium" | "low";
  location: string;
  time: string;
  agent?: string;
}

const mockAttendances: Attendance[] = [
  {
    id: "1",
    protocol: "SIN-2024-001234",
    client: "Maria Silva",
    type: "Guincho",
    status: "urgent",
    priority: "high",
    location: "São Paulo, SP",
    time: "10 min",
    agent: "João Santos",
  },
  {
    id: "2",
    protocol: "SIN-2024-001235",
    client: "Carlos Oliveira",
    type: "Pane Seca",
    status: "active",
    priority: "medium",
    location: "Rio de Janeiro, RJ",
    time: "25 min",
    agent: "Ana Costa",
  },
  {
    id: "3",
    protocol: "SIN-2024-001236",
    client: "Patricia Santos",
    type: "Troca de Pneu",
    status: "pending",
    priority: "low",
    location: "Belo Horizonte, MG",
    time: "5 min",
  },
  {
    id: "4",
    protocol: "SIN-2024-001237",
    client: "Roberto Lima",
    type: "Chaveiro",
    status: "active",
    priority: "medium",
    location: "Curitiba, PR",
    time: "40 min",
    agent: "Pedro Alves",
  },
  {
    id: "5",
    protocol: "SIN-2024-001238",
    client: "Fernanda Dias",
    type: "Guincho",
    status: "completed",
    priority: "high",
    location: "Porto Alegre, RS",
    time: "1h 20min",
    agent: "Marcos Ferreira",
  },
  {
    id: "6",
    protocol: "SIN-2024-001239",
    client: "Lucas Mendes",
    type: "Bateria",
    status: "pending",
    priority: "low",
    location: "Salvador, BA",
    time: "2 min",
  },
];

const statusConfig = {
  pending: { label: "Aguardando", className: "bg-warning/15 text-warning border border-warning/20" },
  active: { label: "Em Andamento", className: "bg-primary/15 text-primary border border-primary/20" },
  completed: { label: "Concluído", className: "bg-success/15 text-success border border-success/20" },
  urgent: { label: "Urgente", className: "bg-destructive/15 text-destructive border border-destructive/20 animate-pulse-soft" },
};

const priorityIndicator = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-success",
};

export function AttendanceTable() {
  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-fade-in-up" style={{ animationDelay: "300ms" }}>
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Atendimentos Recentes</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Acompanhe os chamados em tempo real</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 gap-2 shadow-lg shadow-primary/20">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Protocolo</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Cliente</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Tipo</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Localização</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Tempo</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Atendente</TableHead>
            <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockAttendances.map((attendance, index) => (
            <TableRow 
              key={attendance.id} 
              className="hover:bg-muted/20 transition-all duration-200 border-b border-border/30 group"
              style={{ animationDelay: `${400 + index * 50}ms` }}
            >
              <TableCell className="font-mono text-sm font-semibold">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-1 h-8 rounded-full transition-all duration-300 group-hover:h-10",
                    priorityIndicator[attendance.priority]
                  )} />
                  {attendance.protocol}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
                    <span className="text-sm font-bold text-primary">
                      {attendance.client.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <span className="font-medium">{attendance.client}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-semibold rounded-lg px-3 py-1">
                  {attendance.type}
                </Badge>
              </TableCell>
              <TableCell>
                <span className={cn(
                  "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold",
                  statusConfig[attendance.status].className
                )}>
                  {statusConfig[attendance.status].label}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary/60" />
                  <span className="text-sm">{attendance.location}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary/60" />
                  <span className="text-sm font-medium">{attendance.time}</span>
                </div>
              </TableCell>
              <TableCell>
                {attendance.agent ? (
                  <span className="text-sm font-medium">{attendance.agent}</span>
                ) : (
                  <span className="text-sm text-muted-foreground/60 italic">Não atribuído</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-success/10 hover:text-success">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
