import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Mail,
  Phone,
  Shield,
  Settings,
  Bell,
  User,
  Building
} from "lucide-react";

const membros = [
  { nome: "Admin Principal", email: "admin@empresa.com", cargo: "Administrador", status: "ativo", iniciais: "AP" },
  { nome: "Maria Coordenadora", email: "maria@empresa.com", cargo: "Coordenador", status: "ativo", iniciais: "MC" },
  { nome: "João Operador", email: "joao@empresa.com", cargo: "Operador", status: "ativo", iniciais: "JO" },
  { nome: "Ana Supervisora", email: "ana@empresa.com", cargo: "Supervisor", status: "inativo", iniciais: "AS" },
];

export default function Equipe() {
  return (
    <DashboardLayout title="Equipe" subtitle="Gerencie os membros da equipe e permissões">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Cadastro */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Cadastrar Novo Membro
              </CardTitle>
              <CardDescription>Preencha os dados para adicionar um novo membro à equipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dados Pessoais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" placeholder="Digite o nome completo" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="email@empresa.com" className="pl-10 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="telefone" placeholder="(11) 99999-9999" className="pl-10 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="coord">Coordenador</SelectItem>
                      <SelectItem value="super">Supervisor</SelectItem>
                      <SelectItem value="oper">Operador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Permissões */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Permissões de Acesso
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: "dashboard", label: "Visualizar Dashboard" },
                    { id: "atendimentos", label: "Gerenciar Atendimentos" },
                    { id: "prestadores", label: "Gerenciar Prestadores" },
                    { id: "relatorios", label: "Acessar Relatórios" },
                    { id: "configuracoes", label: "Alterar Configurações" },
                    { id: "usuarios", label: "Gerenciar Usuários" },
                  ].map((perm) => (
                    <div key={perm.id} className="flex items-center space-x-3">
                      <Checkbox id={perm.id} className="rounded" />
                      <Label htmlFor={perm.id} className="text-sm font-normal cursor-pointer">
                        {perm.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Notificações */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  Preferências de Notificação
                </h4>
                <div className="space-y-4">
                  {[
                    { id: "email-notif", label: "Notificações por E-mail", desc: "Receber alertas de novos atendimentos" },
                    { id: "push-notif", label: "Notificações Push", desc: "Alertas em tempo real no navegador" },
                    { id: "sms-notif", label: "SMS de Urgência", desc: "Apenas para casos críticos" },
                  ].map((notif) => (
                    <div key={notif.id} className="flex items-center justify-between">
                      <div>
                        <Label htmlFor={notif.id} className="cursor-pointer">{notif.label}</Label>
                        <p className="text-xs text-muted-foreground">{notif.desc}</p>
                      </div>
                      <Switch id={notif.id} />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Turno */}
              <div className="space-y-4">
                <h4 className="font-medium">Turno de Trabalho</h4>
                <RadioGroup defaultValue="integral" className="grid grid-cols-3 gap-4">
                  {[
                    { value: "manha", label: "Manhã", horario: "06h - 14h" },
                    { value: "tarde", label: "Tarde", horario: "14h - 22h" },
                    { value: "noite", label: "Noite", horario: "22h - 06h" },
                  ].map((turno) => (
                    <div key={turno.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={turno.value} id={turno.value} />
                      <Label htmlFor={turno.value} className="cursor-pointer">
                        <span className="font-medium">{turno.label}</span>
                        <span className="text-xs text-muted-foreground block">{turno.horario}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="obs">Observações</Label>
                <Textarea
                  id="obs"
                  placeholder="Adicione observações sobre o membro..."
                  className="rounded-xl min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" className="rounded-xl">Cancelar</Button>
                <Button className="rounded-xl bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Membro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Membros */}
        <div className="space-y-4">
          <Card className="rounded-2xl border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Membros Ativos</CardTitle>
              <CardDescription>4 membros na equipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {membros.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <Avatar className="h-10 w-10 rounded-xl">
                    <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-sm font-medium">
                      {m.iniciais}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{m.nome}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                  </div>
                  <Badge
                    variant={m.status === "ativo" ? "default" : "secondary"}
                    className="rounded-lg text-xs"
                  >
                    {m.cargo}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
