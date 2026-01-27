import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  ArrowRight,
  User,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for the dashboard
const novosProtocolos = [
  {
    id: "113-2026-43198",
    data: "20/01/2026 14:30",
    descricao: "Construção irregular em área de preservação ambiental...",
    status: "aberto",
    prioridade: "alta",
  },
  {
    id: "113-2026-43197",
    data: "20/01/2026 11:15",
    descricao: "Buraco grande na Av. Principal causando acidentes...",
    status: "aberto",
    prioridade: "media",
  },
  {
    id: "113-2026-43196",
    data: "19/01/2026 16:45",
    descricao: "Iluminação pública queimada em praça central...",
    status: "em_atendimento",
    prioridade: "media",
  },
];

const meusAtendimentos = [
  // Empty for now - showing empty state
];

export default function GestaoDashboard() {
  const { user } = useAuth();
  const usuarioNome = user?.nome || "Usuário";
  const stats = {
    novosProtocolos: 3,
    emAndamento: 0,
    concluidos: 1,
    urgentes: 0,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aberto":
        return "bg-blue-100 text-blue-800";
      case "em_atendimento":
        return "bg-yellow-100 text-yellow-800";
      case "concluido":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return "bg-red-100 text-red-800";
      case "media":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="gov-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
              <User className="w-10 h-10 text-primary" />
              {usuarioNome}
            </h1>
            <p className="text-xl text-muted-foreground">Seu painel de atendimentos</p>
          </div>

          {/* Indicator Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Novos Protocolos */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-600">{stats.novosProtocolos}</p>
                    <p className="text-sm text-muted-foreground">Novos Protocolos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meus em Andamento */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-orange-600">{stats.emAndamento}</p>
                    <p className="text-sm text-muted-foreground">Meus em Andamento</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meus Concluídos */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-600">{stats.concluidos}</p>
                    <p className="text-sm text-muted-foreground">Meus Concluídos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Urgentes */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-red-600">{stats.urgentes}</p>
                    <p className="text-sm text-muted-foreground">Urgentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section - Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Protocolos Novos */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Protocolos Novos</CardTitle>
                <Link to="/meus-protocolos">
                  <Button variant="ghost" className="text-primary hover:text-primary/80">
                    Ver todos →
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {novosProtocolos.map((protocolo) => (
                  <div key={protocolo.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono font-medium text-sm">{protocolo.id}</span>
                      <span className="text-xs text-muted-foreground">{protocolo.data}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{protocolo.descricao}</p>
                    <div className="flex gap-2">
                      <Badge className={`text-xs ${getStatusColor(protocolo.status)}`}>
                        {protocolo.status === "aberto" ? "Aberto" :
                         protocolo.status === "em_atendimento" ? "Em atendimento" : "Finalizado"}
                      </Badge>
                      <Badge className={`text-xs ${getPrioridadeColor(protocolo.prioridade)}`}>
                        {protocolo.prioridade === "alta" ? "Alta" : "Média"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Meus Atendimentos */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Meus Atendimentos</CardTitle>
              </CardHeader>
              <CardContent>
                {meusAtendimentos.length > 0 ? (
                  <div className="space-y-4">
                    {meusAtendimentos.map((protocolo) => (
                      <div key={protocolo.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        {/* Protocol item content */}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-muted-foreground">Nenhum protocolo assumido</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}