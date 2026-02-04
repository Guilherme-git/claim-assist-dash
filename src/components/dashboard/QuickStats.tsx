import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickStatsProps {
  averageServiceTime: string;
}

export function QuickStats({ averageServiceTime }: QuickStatsProps) {
  const stats = [
    { label: "Tempo Médio Atendimento", value: averageServiceTime, icon: Clock },
  ];
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-3 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-foreground">Estatísticas Rápidas</h2>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">Atendimento</span>
      </div>
      <div>
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 hover:shadow-md"
            style={{ animationDelay: `${300 + index * 100}ms` }}
          >
            <div className="p-3 rounded-xl bg-primary/10 text-primary transition-transform duration-300 hover:scale-110">
              <stat.icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">{stat.label}</p>
              <p className="text-xl font-bold mt-0.5 text-foreground">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
