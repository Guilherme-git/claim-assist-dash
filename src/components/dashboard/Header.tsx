import { Bell, Search, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-8 py-5">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Bem-vindo ao painel de controle • Atualizado há 2 minutos
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Buscar atendimento..."
              className="pl-11 w-72 h-11 bg-muted/50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Actions */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-11 w-11 rounded-xl bg-muted/50 hover:bg-muted transition-all"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-11 w-11 rounded-xl bg-muted/50 hover:bg-muted relative transition-all"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-destructive rounded-full animate-pulse" />
          </Button>

          {/* Status */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-success/10 border border-success/20">
            <Sparkles className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-success">Assistência 24h</span>
          </div>
        </div>
      </div>
    </header>
  );
}
