import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { 
  Download, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  FileText,
  BarChart3,
  PieChartIcon
} from "lucide-react";

const volumeData = [
  { mes: "Jul", atendimentos: 320, meta: 300 },
  { mes: "Ago", atendimentos: 380, meta: 350 },
  { mes: "Set", atendimentos: 420, meta: 400 },
  { mes: "Out", atendimentos: 390, meta: 400 },
  { mes: "Nov", atendimentos: 480, meta: 450 },
  { mes: "Dez", atendimentos: 520, meta: 500 },
  { mes: "Jan", atendimentos: 450, meta: 480 },
];

const tiposData = [
  { name: "Guincho", value: 45, color: "hsl(var(--primary))" },
  { name: "Pneu", value: 25, color: "hsl(var(--accent))" },
  { name: "Chaveiro", value: 18, color: "hsl(var(--success))" },
  { name: "Bateria", value: 12, color: "hsl(var(--warning))" },
];

const tempoMedioData = [
  { dia: "Seg", tempo: 28 },
  { dia: "Ter", tempo: 32 },
  { dia: "Qua", tempo: 25 },
  { dia: "Qui", tempo: 30 },
  { dia: "Sex", tempo: 35 },
  { dia: "Sab", tempo: 22 },
  { dia: "Dom", tempo: 20 },
];

const regiaoData = [
  { regiao: "Zona Sul", atendimentos: 145 },
  { regiao: "Zona Oeste", atendimentos: 120 },
  { regiao: "Centro", atendimentos: 98 },
  { regiao: "Zona Norte", atendimentos: 87 },
  { regiao: "Zona Leste", atendimentos: 65 },
];

export default function Relatorios() {
  return (
    <DashboardLayout title="Relatórios" subtitle="Análise detalhada de performance e métricas">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Taxa de Conclusão", value: "94.2%", trend: 2.3, positive: true },
          { label: "Tempo Médio", value: "28 min", trend: -5.1, positive: true },
          { label: "Satisfação", value: "4.8/5", trend: 0.2, positive: true },
          { label: "Custo/Atend.", value: "R$ 85", trend: 3.5, positive: false },
        ].map((kpi, i) => (
          <Card key={i} className="rounded-2xl border-border/50 shadow-soft">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  kpi.positive ? "text-success" : "text-destructive"
                }`}>
                  {kpi.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(kpi.trend)}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-card border border-border/50 p-1 rounded-xl">
            <TabsTrigger value="geral" className="rounded-lg gap-2">
              <BarChart3 className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="tipos" className="rounded-lg gap-2">
              <PieChartIcon className="h-4 w-4" />
              Por Tipo
            </TabsTrigger>
            <TabsTrigger value="tempo" className="rounded-lg gap-2">
              <Calendar className="h-4 w-4" />
              Temporal
            </TabsTrigger>
          </TabsList>
          <Button variant="outline" className="rounded-xl gap-2">
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>

        <TabsContent value="geral" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Volume */}
            <Card className="rounded-2xl border-border/50 shadow-soft">
              <CardHeader>
                <CardTitle>Volume de Atendimentos</CardTitle>
                <CardDescription>Comparativo mensal vs meta</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={volumeData}>
                    <defs>
                      <linearGradient id="colorAtend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px"
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="atendimentos" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorAtend)" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="meta" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Por Região */}
            <Card className="rounded-2xl border-border/50 shadow-soft">
              <CardHeader>
                <CardTitle>Atendimentos por Região</CardTitle>
                <CardDescription>Distribuição geográfica</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regiaoData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis dataKey="regiao" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px"
                      }}
                    />
                    <Bar dataKey="atendimentos" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tipos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Pizza */}
            <Card className="rounded-2xl border-border/50 shadow-soft">
              <CardHeader>
                <CardTitle>Distribuição por Tipo</CardTitle>
                <CardDescription>Porcentagem de cada serviço</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tiposData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {tiposData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px"
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Detalhes por Tipo */}
            <Card className="rounded-2xl border-border/50 shadow-soft">
              <CardHeader>
                <CardTitle>Detalhes por Tipo</CardTitle>
                <CardDescription>Performance de cada serviço</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {tiposData.map((tipo, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{tipo.name}</span>
                      <span className="text-sm text-muted-foreground">{tipo.value}%</span>
                    </div>
                    <Progress value={tipo.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tempo" className="space-y-6">
          <Card className="rounded-2xl border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle>Tempo Médio de Atendimento</CardTitle>
              <CardDescription>Em minutos, por dia da semana</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={tempoMedioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="dia" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tempo" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
