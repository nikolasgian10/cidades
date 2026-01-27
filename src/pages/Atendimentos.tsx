import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  RefreshCw,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  User,
  Eye,
  MessageSquare,
  Paperclip,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const mockProtocolos = [
  {
    id: "1",
    numero: "ITJ-2026-43198",
    tipo: "outros",
    descricao: "Solicitação de informações sobre IPTU",
    cidadao: "João Silva",
    data: "18/01 19:17",
    status: "novo",
    prioridade: "media",
    secretaria: "Fazenda",
    responsavel: null,
  },
  {
    id: "2",
    numero: "ITJ-2025-80803",
    tipo: "denuncia",
    descricao: "Construção irregular em área de preservação ambiental.",
    cidadao: "Maria Santos",
    data: "11/01 18:46",
    status: "novo",
    prioridade: "alta",
    secretaria: "Meio Ambiente",
    responsavel: null,
  },
  {
    id: "3",
    numero: "ITJ-2025-80802",
    tipo: "buracos_vias",
    descricao: "Buraco grande na Av. Principal causando acidentes.",
    cidadao: "Carlos Oliveira",
    data: "11/01 18:46",
    status: "novo",
    prioridade: "alta",
    secretaria: "Obras",
    responsavel: null,
  },
];

const prioridadeConfig: Record<string, { label: string; color: string }> = {
  baixa: { label: "Baixa", color: "bg-gray-100 text-gray-700" },
  media: { label: "Média", color: "bg-blue-100 text-blue-700" },
  alta: { label: "Alta", color: "bg-orange-100 text-orange-700" },
  urgente: { label: "Urgente", color: "bg-red-100 text-red-700" },
};

export default function Atendimentos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [protocolos, setProtocolos] = useState(mockProtocolos);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [origemFilter, setOrigemFilter] = useState("todas");
  const [encaminharDialogOpen, setEncaminharDialogOpen] = useState(false);
  const [selectedProtocolo, setSelectedProtocolo] = useState<string | null>(null);
  const [secretariaDestino, setSecretariaDestino] = useState("");
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [protocoloSelecionado, setProtocoloSelecionado] = useState<any>(null);

  const stats = {
    total: protocolos.length,
    novos: protocolos.filter((p) => p.status === "novo").length,
    andamento: 0,
    concluidos: 0,
  };

  const handleAssumir = (numero: string) => {
    setProtocolos(prev => prev.map(protocolo => 
      protocolo.numero === numero 
        ? { ...protocolo, responsavel: user?.nome || "Usuário Desconhecido" }
        : protocolo
    ));
    toast({
      title: "Protocolo assumido!",
      description: `Você assumiu o protocolo ${numero}.`,
    });
  };

  const handleEncaminhar = (numero: string) => {
    setSelectedProtocolo(numero);
    setEncaminharDialogOpen(true);
  };

  const handleConfirmEncaminhar = () => {
    toast({
      title: "Protocolo encaminhado!",
      description: `O protocolo ${selectedProtocolo} foi encaminhado para ${secretariaDestino}.`,
    });
    setEncaminharDialogOpen(false);
    setSelectedProtocolo(null);
    setSecretariaDestino("");
  };

  const handleVerDetalhes = (protocolo: any) => {
    setProtocoloSelecionado(protocolo);
    setDetalhesDialogOpen(true);
  };

  const handleComunicar = (protocolo: any) => {
    // Navegar para página de comunicação com o cidadão
    navigate(`/comunicacao/${protocolo.id}?tipo=cidadao`);
  };

  return (
    <Layout>
      <div className="gov-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">📋 Atendimentos</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie os protocolos e atendimentos
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.novos}</p>
                  <p className="text-xs text-muted-foreground">Novos</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.andamento}</p>
                  <p className="text-xs text-muted-foreground">Em Andamento</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.concluidos}</p>
                  <p className="text-xs text-muted-foreground">Concluídos</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, cidadão ou descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Todos Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Status</SelectItem>
                <SelectItem value="novo">Novos</SelectItem>
                <SelectItem value="andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluídos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={origemFilter} onValueChange={setOrigemFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Todas Origens" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas Origens</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="novos" className="space-y-6">
            <TabsList>
              <TabsTrigger value="novos">
                Novos ({stats.novos})
              </TabsTrigger>
              <TabsTrigger value="andamento">
                Em Andamento ({stats.andamento})
              </TabsTrigger>
              <TabsTrigger value="finalizados">
                Finalizados ({stats.concluidos})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="novos" className="space-y-4">
              {protocolos.map((protocolo, index) => (
                <motion.div
                  key={protocolo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono font-semibold text-primary">
                              {protocolo.numero}
                            </span>
                            <Badge variant="outline">Aberto</Badge>
                            <Badge className={prioridadeConfig[protocolo.prioridade].color}>
                              {prioridadeConfig[protocolo.prioridade].label}
                            </Badge>
                            {protocolo.responsavel && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                Responsável: {protocolo.responsavel}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            {protocolo.tipo.replace("_", " ")}
                          </p>
                          <p className="text-foreground mb-2 line-clamp-2">
                            {protocolo.descricao}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {protocolo.cidadao}
                            </span>
                            <span>{protocolo.data}</span>
                            <span>🏛️ {protocolo.secretaria}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerDetalhes(protocolo)}
                            className="gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Ver Detalhes
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleComunicar(protocolo)}
                            className="gap-1"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Comunicar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAssumir(protocolo.numero)}
                            className="gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Assumir
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEncaminhar(protocolo.numero)}
                            className="gap-1"
                          >
                            <ArrowRight className="h-4 w-4" />
                            Encaminhar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {mockProtocolos.length === 0 && (
                <div className="text-center py-16">
                  <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Nenhum protocolo novo
                  </h3>
                  <p className="text-muted-foreground">
                    Todos os protocolos foram atendidos
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="andamento">
              <div className="text-center py-16">
                <Clock className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhum protocolo em andamento
                </h3>
                <p className="text-muted-foreground">
                  Assuma um protocolo para começar o atendimento
                </p>
              </div>
            </TabsContent>

            <TabsContent value="finalizados">
              <div className="text-center py-16">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhum protocolo finalizado
                </h3>
                <p className="text-muted-foreground">
                  Os protocolos finalizados aparecerão aqui
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Detalhes Protocolo Dialog */}
      <Dialog open={detalhesDialogOpen} onOpenChange={setDetalhesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalhes do Protocolo {protocoloSelecionado?.numero}
            </DialogTitle>
            <DialogDescription>
              Informações completas do protocolo e anexos
            </DialogDescription>
          </DialogHeader>

          {protocoloSelecionado && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Número do Protocolo</label>
                  <p className="font-mono font-semibold text-lg">{protocoloSelecionado.numero}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">Aberto</Badge>
                    <Badge className={prioridadeConfig[protocoloSelecionado.prioridade].color}>
                      {prioridadeConfig[protocoloSelecionado.prioridade].label}
                    </Badge>
                    {protocoloSelecionado.responsavel && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        Responsável: {protocoloSelecionado.responsavel}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Solicitante</label>
                  <p className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4" />
                    {protocoloSelecionado.cidadao}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Abertura</label>
                  <p className="mt-1">{protocoloSelecionado.data}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo de Solicitação</label>
                  <p className="mt-1 capitalize">{protocoloSelecionado.tipo.replace("_", " ")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Secretaria Responsável</label>
                  <p className="mt-1">🏛️ {protocoloSelecionado.secretaria}</p>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Descrição da Solicitação</label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="text-sm">{protocoloSelecionado.descricao}</p>
                </div>
              </div>

              {/* Anexos */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-3 block">Anexos</label>
                <div className="space-y-2">
                  {/* Mock anexos - em um sistema real, isso viria da API */}
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">documento_iptu.pdf</p>
                        <p className="text-xs text-muted-foreground">PDF • 2.3 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Baixar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">foto_local.jpg</p>
                        <p className="text-xs text-muted-foreground">JPG • 1.8 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Baixar
                    </Button>
                  </div>
                </div>
                {(!protocoloSelecionado.anexos || protocoloSelecionado.anexos.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Paperclip className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum anexo foi enviado com este protocolo</p>
                  </div>
                )}
              </div>

              {/* Histórico de Ações */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-3 block">Histórico de Ações</label>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Protocolo criado</p>
                      <p className="text-xs text-muted-foreground">{protocoloSelecionado.data}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetalhesDialogOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => handleComunicar(protocoloSelecionado)} className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Comunicar com Solicitante
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Encaminhar Dialog */}
      <Dialog open={encaminharDialogOpen} onOpenChange={setEncaminharDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Encaminhar Protocolo</DialogTitle>
            <DialogDescription>
              Encaminhar {selectedProtocolo} para outra secretaria
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={secretariaDestino} onValueChange={setSecretariaDestino}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a secretaria de destino" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Obras">Secretaria de Obras</SelectItem>
                <SelectItem value="Saúde">Secretaria de Saúde</SelectItem>
                <SelectItem value="Educação">Secretaria de Educação</SelectItem>
                <SelectItem value="Meio Ambiente">Secretaria de Meio Ambiente</SelectItem>
                <SelectItem value="Fazenda">Secretaria da Fazenda</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEncaminharDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmEncaminhar} disabled={!secretariaDestino}>
              Encaminhar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
