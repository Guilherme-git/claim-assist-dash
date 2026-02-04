import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Atendimentos from "./pages/Atendimentos";
import AtendimentoDetalhes from "./pages/AtendimentoDetalhes";
import Chamados from "./pages/Chamados";
import ChamadoDetalhes from "./pages/ChamadoDetalhes";
import Prestadores from "./pages/Prestadores";
import Equipe from "./pages/Equipe";
import Mapa from "./pages/Mapa";
import Historico from "./pages/Historico";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Index />} />
              <Route path="/chamados" element={<Chamados />} />
              <Route path="/chamados/:id" element={<ChamadoDetalhes />} />
              <Route path="/atendimentos" element={<Atendimentos />} />
              <Route path="/atendimentos/:id" element={<AtendimentoDetalhes />} />
              <Route path="/prestadores" element={<Prestadores />} />
              <Route path="/equipe" element={<Equipe />} />
              <Route path="/mapa" element={<Mapa />} />
              <Route path="/historico" element={<Historico />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/config" element={<Configuracoes />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
