import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import ConsultaProtocolo from "./pages/ConsultaProtocolo";
import PainelSenhas from "./pages/PainelSenhas";
import MeusProtocolos from "./pages/MeusProtocolos";
import NovoProtocolo from "./pages/NovoProtocolo";
import Noticias from "./pages/Noticias";
import ProcessosSeletivos from "./pages/ProcessosSeletivos";
import DashboardGestor from "./pages/DashboardGestor";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import GestaoUsuarios from "./pages/GestaoUsuarios";
import Secretarias from "./pages/Secretarias";
import GestaoNoticias from "./pages/GestaoNoticias";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Atendimentos from "./pages/Atendimentos";
import Recepcao from "./pages/Recepcao";
import GestaoDashboard from "./pages/GestaoDashboard";
import Notificacoes from "./pages/Notificacoes";
import GestaoProcessosSeletivos from "./pages/GestaoProcessosSeletivos";
import NotFound from "./pages/NotFound";
import Comunicacao from "./pages/Comunicacao";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/consulta-protocolo" element={<ConsultaProtocolo />} />
          <Route path="/painel-senhas" element={<PainelSenhas />} />
          <Route path="/meus-protocolos" element={<ProtectedRoute><MeusProtocolos /></ProtectedRoute>} />
          <Route path="/novo-protocolo" element={<ProtectedRoute><NovoProtocolo /></ProtectedRoute>} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/processos-seletivos" element={<ProcessosSeletivos />} />
          <Route path="/dashboard-gestor" element={<ProtectedRoute><DashboardGestor /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/gestao-usuarios" element={<ProtectedRoute><GestaoUsuarios /></ProtectedRoute>} />
          <Route path="/secretarias" element={<ProtectedRoute><Secretarias /></ProtectedRoute>} />
          <Route path="/gestao-noticias" element={<ProtectedRoute><GestaoNoticias /></ProtectedRoute>} />
          <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
          <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
          <Route path="/atendimentos" element={<ProtectedRoute><Atendimentos /></ProtectedRoute>} />
          <Route path="/recepcao" element={<ProtectedRoute><Recepcao /></ProtectedRoute>} />
          <Route path="/gestao-dashboard" element={<ProtectedRoute><GestaoDashboard /></ProtectedRoute>} />
          <Route path="/notificacoes" element={<ProtectedRoute><Notificacoes /></ProtectedRoute>} />
          <Route path="/gestao-processos-seletivos" element={<ProtectedRoute><GestaoProcessosSeletivos /></ProtectedRoute>} />
          <Route path="/comunicacao/:id" element={<ProtectedRoute><Comunicacao /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
