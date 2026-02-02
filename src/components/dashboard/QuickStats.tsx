import { TrendingUp, TrendingDown, Users, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Tempo Médio de Resposta", value: "4min 32s", change: -12, icon: Clock },
  { label: "Taxa de Resolução", value: "94.5%", change: 3.2, icon: CheckCircle2 },
  { label: "Agentes Ativos", value: "18/24", change: 0, icon: Users },
  { label: "Chamados Críticos", value: "3", change: 50, icon: AlertTriangle, critical: true },
];

export function QuickStats() {
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6 animate-fade-in-up h-full" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Estatísticas Rápidas</h2>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">Tempo real</span>
      </div>
      <div className="space-y-5">
        {stats.map((stat, index) => (
          <div 
            key={stat.label} 
            className={cn(
              "flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:shadow-md",
              stat.critical ? "bg-destructive/5 border border-destructive/20" : "bg-muted/50 hover:bg-muted"
            )}
            style={{ animationDelay: `${300 + index * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl transition-transform duration-300 hover:scale-110",
                stat.critical 
                  ? "bg-destructive/15 text-destructive" 
                  : "bg-primary/10 text-primary"
              )}>
                <stat.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">{stat.label}</p>
                <p className={cn(
                  "text-xl font-bold mt-0.5",
                  stat.critical ? "text-destructive" : "text-foreground"
                )}>
                  {stat.value}
                </p>
              </div>
            </div>
            {stat.change !== 0 && (
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
                stat.critical 
                  ? stat.change > 0 ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"
                  : stat.change > 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
              )}>
                {(stat.critical ? stat.change > 0 : stat.change > 0) 
                  ? stat.critical 
                    ? <TrendingUp className="h-3.5 w-3.5" />
                    : <TrendingUp className="h-3.5 w-3.5" />
                  : <TrendingDown className="h-3.5 w-3.5" />
                }
                <span>{Math.abs(stat.change)}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
