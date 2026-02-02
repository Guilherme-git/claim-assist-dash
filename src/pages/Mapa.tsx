import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MapPin, 
  Navigation,
  Truck,
  Clock,
  Phone,
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
  Maximize2
} from "lucide-react";

const prestadoresNoMapa = [
  { id: 1, nome: "João Santos", tipo: "Guincho", status: "disponivel", distancia: "2.3 km", tempo: "8 min", lat: -23.5505, lng: -46.6333 },
  { id: 2, nome: "Pedro Lima", tipo: "Mecânico", status: "em_rota", distancia: "4.1 km", tempo: "15 min", lat: -23.5489, lng: -46.6388 },
  { id: 3, nome: "Lucas Mendes", tipo: "Chaveiro", status: "disponivel", distancia: "1.8 km", tempo: "6 min", lat: -23.5520, lng: -46.6350 },
  { id: 4, nome: "Carlos Eduardo", tipo: "Bateria", status: "ocupado", distancia: "5.2 km", tempo: "18 min", lat: -23.5470, lng: -46.6420 },
];

const statusColors = {
  disponivel: "bg-success",
  em_rota: "bg-accent",
  ocupado: "bg-destructive",
};

export default function Mapa() {
  return (
    <DashboardLayout title="Mapa ao Vivo" subtitle="Acompanhe a localização dos prestadores em tempo real">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
        {/* Sidebar com Prestadores */}
        <Card className="rounded-2xl border-border/50 shadow-soft overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Prestadores</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar..." className="pl-9 h-9 rounded-xl text-sm" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-380px)]">
              <div className="p-3 space-y-2">
                {prestadoresNoMapa.map((p) => (
                  <div 
                    key={p.id}
                    className="p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-muted/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusColors[p.status as keyof typeof statusColors]}`} />
                        <span className="font-medium text-sm">{p.nome}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="rounded-lg text-xs">
                        {p.tipo}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        {p.distancia}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {p.tempo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Área do Mapa */}
        <div className="lg:col-span-3">
          <Card className="rounded-2xl border-border/50 shadow-soft h-full overflow-hidden">
            <CardContent className="p-0 h-full relative">
              {/* Placeholder do Mapa */}
              <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center relative">
                {/* Grid simulando mapa */}
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Marcadores simulados */}
                <div className="absolute top-1/4 left-1/3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-success" />
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 animate-pulse" style={{ animationDelay: "0.5s" }}>
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <div className="absolute top-2/3 right-1/3 animate-pulse" style={{ animationDelay: "1s" }}>
                  <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-destructive" />
                  </div>
                </div>

                {/* Centro do mapa com indicador */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-ping" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                </div>

                {/* Texto informativo */}
                <div className="z-10 text-center">
                  <MapPin className="h-16 w-16 text-primary/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">Integração com Google Maps</p>
                  <p className="text-sm text-muted-foreground/70">Configure sua API Key para visualizar o mapa</p>
                </div>
              </div>

              {/* Controles do Mapa */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="rounded-xl shadow-lg">
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-xl shadow-lg">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-xl shadow-lg">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* Legenda */}
              <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur rounded-xl p-3 shadow-lg border border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-2">Legenda</p>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span>Disponível</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Em Rota</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                    <span>Ocupado</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
