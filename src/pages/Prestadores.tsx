import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  Plus, 
  Star,
  MapPin,
  Phone,
  Truck,
  Wrench,
  Key,
  Battery,
  MoreVertical,
  TrendingUp,
  User,
  Mail,
  FileText
} from "lucide-react";

const prestadores = [
  { 
    id: 1, 
    nome: "João Santos", 
    especialidade: "Guincho", 
    avaliacao: 4.8, 
    atendimentos: 156, 
    status: "disponivel",
    telefone: "(11) 99999-1234",
    regiao: "Zona Sul",
    iniciais: "JS"
  },
  { 
    id: 2, 
    nome: "Pedro Lima", 
    especialidade: "Mecânico", 
    avaliacao: 4.6, 
    atendimentos: 89, 
    status: "ocupado",
    telefone: "(11) 99999-5678",
    regiao: "Zona Oeste",
    iniciais: "PL"
  },
  { 
    id: 3, 
    nome: "Lucas Mendes", 
    especialidade: "Chaveiro", 
    avaliacao: 4.9, 
    atendimentos: 234, 
    status: "disponivel",
    telefone: "(11) 99999-9012",
    regiao: "Centro",
    iniciais: "LM"
  },
  { 
    id: 4, 
    nome: "Carlos Eduardo", 
    especialidade: "Bateria", 
    avaliacao: 4.5, 
    atendimentos: 67, 
    status: "offline",
    telefone: "(11) 99999-3456",
    regiao: "Zona Norte",
    iniciais: "CE"
  },
];

const especialidadeIcons = {
  "Guincho": Truck,
  "Mecânico": Wrench,
  "Chaveiro": Key,
  "Bateria": Battery,
};

const statusConfig = {
  disponivel: { label: "Disponível", className: "bg-success/15 text-success" },
  ocupado: { label: "Ocupado", className: "bg-warning/15 text-warning" },
  offline: { label: "Offline", className: "bg-muted text-muted-foreground" },
};

export default function Prestadores() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <DashboardLayout title="Prestadores" subtitle="Gerencie sua rede de prestadores de serviço">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Prestadores", value: "48", trend: "+5 este mês" },
          { label: "Disponíveis Agora", value: "32", trend: "67% online" },
          { label: "Avaliação Média", value: "4.7", trend: "★ excelente" },
          { label: "Atendimentos/Mês", value: "1.2k", trend: "+12% vs anterior" },
        ].map((stat, i) => (
          <Card key={i} className="rounded-2xl border-border/50 shadow-soft animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold mt-1 text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-success" />
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Busca e Ações */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar prestador por nome ou especialidade..." 
            className="pl-10 h-11 rounded-xl border-border/50 bg-card"
          />
        </div>
        
        {/* Dialog de Cadastro */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 rounded-xl gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Cadastrar Prestador
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Cadastrar Novo Prestador
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do prestador para adicioná-lo à rede de atendimento.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              {/* Dados Pessoais */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                  Dados Pessoais
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input id="nome" placeholder="Digite o nome completo" className="rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input id="cpf" placeholder="000.000.000-00" className="rounded-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="email@exemplo.com" className="pl-10 rounded-lg" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="telefone" placeholder="(00) 00000-0000" className="pl-10 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados Profissionais */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                  Dados Profissionais
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="especialidade">Especialidade *</Label>
                    <Select>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Selecione a especialidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guincho">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Guincho
                          </div>
                        </SelectItem>
                        <SelectItem value="mecanico">
                          <div className="flex items-center gap-2">
                            <Wrench className="h-4 w-4" />
                            Mecânico
                          </div>
                        </SelectItem>
                        <SelectItem value="chaveiro">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            Chaveiro
                          </div>
                        </SelectItem>
                        <SelectItem value="bateria">
                          <div className="flex items-center gap-2">
                            <Battery className="h-4 w-4" />
                            Bateria
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regiao">Região de Atuação *</Label>
                    <Select>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Selecione a região" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="centro">Centro</SelectItem>
                        <SelectItem value="zona-sul">Zona Sul</SelectItem>
                        <SelectItem value="zona-norte">Zona Norte</SelectItem>
                        <SelectItem value="zona-leste">Zona Leste</SelectItem>
                        <SelectItem value="zona-oeste">Zona Oeste</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experiencia">Experiência</Label>
                  <Textarea 
                    id="experiencia" 
                    placeholder="Descreva a experiência profissional do prestador..." 
                    className="rounded-lg min-h-[80px]"
                  />
                </div>
              </div>

              {/* Veículo */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                  Dados do Veículo
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="placa">Placa</Label>
                    <Input id="placa" placeholder="ABC-1234" className="rounded-lg uppercase" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input id="modelo" placeholder="Ex: Strada" className="rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ano">Ano</Label>
                    <Input id="ano" placeholder="2022" className="rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Documentos */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                  Documentos
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CNH</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Clique para anexar</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Comprovante de Residência</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Clique para anexar</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opções */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                  Opções
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="ativo" defaultChecked />
                    <Label htmlFor="ativo" className="font-normal cursor-pointer">
                      Prestador ativo e disponível para atendimentos
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox id="notificacoes" />
                    <Label htmlFor="notificacoes" className="font-normal cursor-pointer">
                      Receber notificações por SMS
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox id="prioridade" />
                    <Label htmlFor="prioridade" className="font-normal cursor-pointer">
                      Prestador com prioridade alta
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-lg">
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)} className="rounded-lg bg-primary hover:bg-primary/90">
                Cadastrar Prestador
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {prestadores.map((p, i) => {
          const EspecialidadeIcon = especialidadeIcons[p.especialidade as keyof typeof especialidadeIcons] || Truck;
          const status = statusConfig[p.status as keyof typeof statusConfig];
          
          return (
            <Card 
              key={p.id} 
              className="rounded-2xl border-border/50 shadow-soft hover:shadow-large transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-14 w-14 rounded-xl border-2 border-border/50">
                    <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-semibold">
                      {p.iniciais}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <h3 className="font-semibold text-foreground mb-1">{p.nome}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted">
                    <EspecialidadeIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">{p.especialidade}</span>
                  </div>
                  <span className={`status-badge ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-4 w-4 text-accent fill-accent" />
                  <span className="font-semibold text-sm">{p.avaliacao}</span>
                  <span className="text-xs text-muted-foreground">({p.atendimentos} atendimentos)</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{p.regiao}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{p.telefone}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-muted-foreground">Performance</span>
                    <span className="font-medium text-foreground">92%</span>
                  </div>
                  <Progress value={92} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
