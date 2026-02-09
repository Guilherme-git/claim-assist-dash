import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  Upload,
  Moon,
  Sun,
  Volume2,
  Truck
} from "lucide-react";
import { TowingSettingsTab } from "@/components/configuracoes/TowingSettingsTab";

export default function Configuracoes() {
  return (
    <DashboardLayout title="Configurações" subtitle="Personalize as configurações do sistema">
      <Tabs defaultValue="guincheiro" className="space-y-6">
        <TabsList className="bg-card border border-border/50 p-1 rounded-xl flex-wrap h-auto gap-1">
          {/* <TabsTrigger value="empresa" className="rounded-lg gap-2">
            <Building className="h-4 w-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="rounded-lg gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="aparencia" className="rounded-lg gap-2">
            <Palette className="h-4 w-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="rounded-lg gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="integracoes" className="rounded-lg gap-2">
            <Globe className="h-4 w-4" />
            Integrações
          </TabsTrigger> */}
          <TabsTrigger value="guincheiro" className="rounded-lg gap-2">
            <Truck className="h-4 w-4" />
            Config. Guincheiro
          </TabsTrigger>
        </TabsList>

        {/* Empresa */}
        {/* <TabsContent value="empresa">
          <Card className="rounded-2xl border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>Informações gerais do seu negócio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center border-2 border-dashed border-border">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <Button variant="outline" className="rounded-xl mb-2">
                    Alterar Logo
                  </Button>
                  <p className="text-xs text-muted-foreground">PNG, JPG até 2MB</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Empresa</Label>
                  <Input defaultValue="Utiliza Assistência" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input defaultValue="12.345.678/0001-90" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input defaultValue="contato@utiliza.com.br" className="pl-10 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input defaultValue="(11) 3000-0000" className="pl-10 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Endereço</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea 
                      defaultValue="Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100" 
                      className="pl-10 rounded-xl min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="rounded-xl bg-primary hover:bg-primary/90 gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* Notificações */}
        {/* <TabsContent value="notificacoes">
          <Card className="rounded-2xl border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>Configure como deseja receber alertas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { id: "novo-atend", title: "Novo Atendimento", desc: "Quando um novo chamado é aberto" },
                { id: "atend-critico", title: "Atendimento Crítico", desc: "Alertas de prioridade urgente" },
                { id: "prestador-off", title: "Prestador Offline", desc: "Quando um prestador fica indisponível" },
                { id: "conclusao", title: "Conclusão de Atendimento", desc: "Quando um atendimento é finalizado" },
                { id: "avaliacao", title: "Nova Avaliação", desc: "Feedback de clientes" },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Switch />
                    </div>
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Som de Notificação</p>
                    <p className="text-sm text-muted-foreground">Ativar sons para alertas</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Volume
                    </Label>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <Slider defaultValue={[75]} max={100} step={5} className="w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* Aparência */}
        {/* <TabsContent value="aparencia">
          <Card className="rounded-2xl border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>Personalize a interface do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Tema</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "light", label: "Claro", icon: Sun },
                    { id: "dark", label: "Escuro", icon: Moon },
                    { id: "auto", label: "Automático", icon: Globe },
                  ].map((tema) => (
                    <button
                      key={tema.id}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        tema.id === "light" 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <tema.icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{tema.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Cor Principal</Label>
                <div className="flex gap-3">
                  {[
                    { color: "bg-[hsl(160,100%,22%)]", name: "Verde" },
                    { color: "bg-[hsl(251,91%,65%)]", name: "Roxo" },
                    { color: "bg-[hsl(217,91%,60%)]", name: "Azul" },
                    { color: "bg-[hsl(0,72%,51%)]", name: "Vermelho" },
                    { color: "bg-[hsl(38,92%,55%)]", name: "Laranja" },
                  ].map((c, i) => (
                    <button 
                      key={i}
                      className={`w-10 h-10 rounded-xl ${c.color} ${
                        i === 0 ? "ring-2 ring-offset-2 ring-primary" : ""
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Idioma</Label>
                <Select defaultValue="pt-BR">
                  <SelectTrigger className="w-[200px] rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Animações</p>
                  <p className="text-sm text-muted-foreground">Ativar efeitos de transição</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* Segurança */}
        {/* <TabsContent value="seguranca">
          <Card className="rounded-2xl border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Configure as opções de segurança da conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Alterar Senha</h4>
                <div className="grid gap-4 max-w-md">
                  <div className="space-y-2">
                    <Label>Senha Atual</Label>
                    <Input type="password" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nova Senha</Label>
                    <Input type="password" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirmar Nova Senha</Label>
                    <Input type="password" className="rounded-xl" />
                  </div>
                  <Button className="rounded-xl w-fit">Atualizar Senha</Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <p className="font-medium">Autenticação em Duas Etapas</p>
                  <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                </div>
                <Button variant="outline" className="rounded-xl">Configurar</Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <p className="font-medium">Sessões Ativas</p>
                  <p className="text-sm text-muted-foreground">2 dispositivos conectados</p>
                </div>
                <Button variant="outline" className="rounded-xl">Gerenciar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* Integrações */}
        {/* <TabsContent value="integracoes">
          <Card className="rounded-2xl border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>Conecte com serviços externos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Google Maps", desc: "Integração de mapas e rotas", status: "conectado" },
                { name: "WhatsApp Business", desc: "Notificações para clientes", status: "desconectado" },
                { name: "ERP", desc: "Sincronização de dados", status: "conectado" },
                { name: "Gateway de Pagamento", desc: "Processamento de pagamentos", status: "desconectado" },
              ].map((int, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div>
                    <p className="font-medium">{int.name}</p>
                    <p className="text-sm text-muted-foreground">{int.desc}</p>
                  </div>
                  <Button
                    variant={int.status === "conectado" ? "outline" : "default"}
                    className="rounded-xl"
                  >
                    {int.status === "conectado" ? "Configurar" : "Conectar"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* Config. Guincheiro */}
        <TabsContent value="guincheiro">
          <TowingSettingsTab />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
