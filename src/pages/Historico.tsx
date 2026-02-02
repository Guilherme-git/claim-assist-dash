import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Search, 
  CalendarIcon, 
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  MapPin,
  Truck,
  ChevronDown,
  FileText
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const historico = [
  {
    data: "Hoje, 29 Jan 2026",
    atendimentos: [
      { id: "ATD-045", hora: "14:30", cliente: "Maria Silva", tipo: "Guincho", status: "concluido", prestador: "João Santos", duracao: "45 min" },
      { id: "ATD-044", hora: "12:15", cliente: "Carlos Oliveira", tipo: "Pneu", status: "concluido", prestador: "Pedro Lima", duracao: "25 min" },
      { id: "ATD-043", hora: "10:00", cliente: "Ana Costa", tipo: "Bateria", status: "cancelado", prestador: "—", duracao: "—" },
    ]
  },
  {
    data: "Ontem, 28 Jan 2026",
    atendimentos: [
      { id: "ATD-042", hora: "18:45", cliente: "Roberto Alves", tipo: "Chaveiro", status: "concluido", prestador: "Lucas Mendes", duracao: "30 min" },
      { id: "ATD-041", hora: "15:20", cliente: "Fernanda Dias", tipo: "Guincho", status: "concluido", prestador: "João Santos", duracao: "1h 10min" },
      { id: "ATD-040", hora: "11:00", cliente: "Paulo Souza", tipo: "Mecânico", status: "concluido", prestador: "Pedro Lima", duracao: "55 min" },
      { id: "ATD-039", hora: "09:30", cliente: "Juliana Martins", tipo: "Pneu", status: "concluido", prestador: "Carlos Eduardo", duracao: "20 min" },
    ]
  },
  {
    data: "27 Jan 2026",
    atendimentos: [
      { id: "ATD-038", hora: "17:00", cliente: "Ricardo Nunes", tipo: "Bateria", status: "concluido", prestador: "Pedro Lima", duracao: "35 min" },
      { id: "ATD-037", hora: "14:30", cliente: "Amanda Torres", tipo: "Guincho", status: "cancelado", prestador: "—", duracao: "—" },
    ]
  },
];

export default function Historico() {
  const [date, setDate] = useState<Date>();

  return (
    <DashboardLayout title="Histórico" subtitle="Consulte o histórico completo de atendimentos">
      {/* Filtros */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por ID, cliente ou prestador..." 
            className="pl-10 h-11 rounded-xl border-border/50 bg-card"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-11 rounded-xl gap-2 min-w-[200px] justify-start">
              <CalendarIcon className="h-4 w-4" />
              {date ? format(date, "dd 'de' MMMM", { locale: ptBR }) : "Selecionar data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button variant="outline" className="h-11 rounded-xl gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {historico.map((dia, i) => (
          <Card key={i} className="rounded-2xl border-border/50 shadow-soft animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  {dia.data}
                </CardTitle>
                <Badge variant="secondary" className="rounded-lg">
                  {dia.atendimentos.length} atendimentos
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {dia.atendimentos.map((atd, j) => (
                  <AccordionItem 
                    key={atd.id} 
                    value={atd.id}
                    className="border border-border/50 rounded-xl px-4 data-[state=open]:bg-muted/30"
                  >
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center gap-4 flex-1 text-left">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          atd.status === "concluido" ? "bg-success/10" : "bg-destructive/10"
                        }`}>
                          {atd.status === "concluido" ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium text-primary">{atd.id}</span>
                            <Badge variant="secondary" className="rounded-lg text-xs">{atd.tipo}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{atd.cliente}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{atd.hora}</p>
                          <p className="text-xs text-muted-foreground">{atd.duracao}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Cliente</p>
                            <p className="font-medium">{atd.cliente}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Prestador</p>
                            <p className="font-medium">{atd.prestador}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Duração</p>
                            <p className="font-medium">{atd.duracao}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Status</p>
                            <p className="font-medium capitalize">{atd.status}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-lg">
                          Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-lg">
                          <Download className="h-3.5 w-3.5 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
